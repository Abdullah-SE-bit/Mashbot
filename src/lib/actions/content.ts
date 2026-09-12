"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { ActionResult, Profile } from "@/lib/types";

async function currentProfile(): Promise<{
  supabase: Awaited<ReturnType<typeof createClient>>;
  profile: Profile | null;
}> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { supabase, profile: null };

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  return { supabase, profile: profile as Profile | null };
}

/** SRS 0210: Contributors may create new content. SRS 0540/0550/0560: text or image content. */
export async function createContent(
  campaignId: string,
  _prevState: ActionResult | undefined,
  formData: FormData
): Promise<ActionResult> {
  const { supabase, profile } = await currentProfile();
  if (!profile) return { success: false, message: "You must be logged in." };
  if (!profile.roles.includes("contributor")) {
    return { success: false, message: "Only Contributors may add content (SRS 0210)." };
  }

  const contentType = String(formData.get("content_type") ?? "text");
  const body = String(formData.get("body") ?? "").trim();
  const imageUrl = String(formData.get("image_url") ?? "").trim();

  if (contentType === "text" && !body) {
    return { success: false, message: "Text content cannot be empty." };
  }
  if (contentType === "image" && !imageUrl) {
    return { success: false, message: "An image URL is required for image content." };
  }

  const { error } = await supabase.from("campaign_content").insert({
    campaign_id: campaignId,
    content_type: contentType,
    body: contentType === "text" ? body : null,
    image_url: contentType === "image" ? imageUrl : null,
    created_by: profile.id,
    status: "draft",
  });

  if (error) return { success: false, message: error.message };

  revalidatePath(`/campaigns/${campaignId}`);
  return { success: true, message: "Content added as a draft." };
}

/** SRS 0210: Contributors submit their content for approval. */
export async function submitForApproval(
  campaignId: string,
  contentId: string
): Promise<ActionResult> {
  const { supabase, profile } = await currentProfile();
  if (!profile) return { success: false, message: "You must be logged in." };

  const { data: content } = await supabase
    .from("campaign_content")
    .select("id, created_by, status")
    .eq("id", contentId)
    .single();

  if (!content) return { success: false, message: "Content not found." };
  if (content.created_by !== profile.id) {
    return { success: false, message: "Only the author may submit this content for approval." };
  }
  if (!["draft", "rejected"].includes(content.status)) {
    return { success: false, message: `Cannot submit content in status "${content.status}".` };
  }

  const { error } = await supabase
    .from("campaign_content")
    .update({ status: "pending_approval" })
    .eq("id", contentId);

  if (error) return { success: false, message: error.message };

  revalidatePath(`/campaigns/${campaignId}`);
  return { success: true, message: "Submitted for approval." };
}

/** SRS 0220: Approvers can approve (or reject) actions performed by contributors. */
export async function reviewContent(
  campaignId: string,
  contentId: string,
  decision: "approved" | "rejected"
): Promise<ActionResult> {
  const { supabase, profile } = await currentProfile();
  if (!profile) return { success: false, message: "You must be logged in." };
  if (!profile.roles.includes("approver")) {
    return { success: false, message: "Only Approvers may review content (SRS 0220)." };
  }

  const { data: content } = await supabase
    .from("campaign_content")
    .select("id, status")
    .eq("id", contentId)
    .single();

  if (!content) return { success: false, message: "Content not found." };
  if (content.status !== "pending_approval") {
    return {
      success: false,
      message: `Only content pending approval can be reviewed (current status: "${content.status}").`,
    };
  }

  const { error } = await supabase
    .from("campaign_content")
    .update({ status: decision, approved_by: profile.id })
    .eq("id", contentId);

  if (error) return { success: false, message: error.message };

  revalidatePath(`/campaigns/${campaignId}`);
  return { success: true, message: decision === "approved" ? "Content approved." : "Content rejected." };
}

/**
 * SRS 0230/0530: Publishers schedule approved content. A schedule maps a time to a publishing
 * action; if the user leaves the time blank, it defaults to 00:00 on the chosen day.
 */
export async function scheduleContent(
  campaignId: string,
  contentId: string,
  _prevState: ActionResult | undefined,
  formData: FormData
): Promise<ActionResult> {
  const { supabase, profile } = await currentProfile();
  if (!profile) return { success: false, message: "You must be logged in." };
  if (!profile.roles.includes("publisher")) {
    return { success: false, message: "Only Publishers may schedule content (SRS 0230)." };
  }

  const date = String(formData.get("scheduled_date") ?? "").trim();
  const now = new Date();
  const time =
    String(formData.get("scheduled_time") ?? "").trim() ||
    `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;

  if (!date) {
    return { success: false, message: "A go-live date is required." };
  }

  const { data: content } = await supabase
    .from("campaign_content")
    .select("id, status")
    .eq("id", contentId)
    .single();

  if (!content) return { success: false, message: "Content not found." };
  if (content.status !== "approved") {
    return {
      success: false,
      message: `Only approved content can be scheduled (current status: "${content.status}").`,
    };
  }

  const scheduledAt = new Date(`${date}T${time}:00`);
  if (Number.isNaN(scheduledAt.getTime())) {
    return { success: false, message: "Invalid date/time." };
  }

  const { error } = await supabase
    .from("campaign_content")
    .update({ status: "scheduled", scheduled_at: scheduledAt.toISOString() })
    .eq("id", contentId);

  if (error) return { success: false, message: error.message };

  revalidatePath(`/campaigns/${campaignId}`);
  return { success: true, message: `Scheduled for ${scheduledAt.toLocaleString()}.` };
}

/** SRS 0230: Publishers may also initiate an action immediately. */
export async function publishNow(campaignId: string, contentId: string): Promise<ActionResult> {
  const { supabase, profile } = await currentProfile();
  if (!profile) return { success: false, message: "You must be logged in." };
  if (!profile.roles.includes("publisher")) {
    return { success: false, message: "Only Publishers may publish content (SRS 0230)." };
  }

  const { data: content } = await supabase
    .from("campaign_content")
    .select("id, status")
    .eq("id", contentId)
    .single();

  if (!content) return { success: false, message: "Content not found." };
  if (!["approved", "scheduled"].includes(content.status)) {
    return {
      success: false,
      message: `Only approved or scheduled content can be published (current status: "${content.status}").`,
    };
  }

  const { error } = await supabase
    .from("campaign_content")
    .update({ status: "published", scheduled_at: new Date().toISOString() })
    .eq("id", contentId);

  if (error) return { success: false, message: error.message };

  revalidatePath(`/campaigns/${campaignId}`);
  return { success: true, message: "Published." };
}

export async function deleteContent(campaignId: string, contentId: string): Promise<ActionResult> {
  const { supabase, profile } = await currentProfile();
  if (!profile) return { success: false, message: "You must be logged in." };

  const { error } = await supabase.from("campaign_content").delete().eq("id", contentId);
  if (error) return { success: false, message: error.message };

  revalidatePath(`/campaigns/${campaignId}`);
  return { success: true, message: "Content deleted." };
}
