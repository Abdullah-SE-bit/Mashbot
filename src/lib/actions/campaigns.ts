"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { ActionResult } from "@/lib/types";

/** SRS 0480/0490/0510: a campaign has a name and a schedule (start/end). */
export async function createCampaign(
  _prevState: ActionResult | undefined,
  formData: FormData
): Promise<ActionResult> {
  const name = String(formData.get("name") ?? "").trim();
  const startDate = String(formData.get("start_date") ?? "").trim() || null;
  const endDate = String(formData.get("end_date") ?? "").trim() || null;

  if (!name) {
    return { success: false, message: "Campaign name is required." };
  }
  if (startDate && endDate && endDate < startDate) {
    return { success: false, message: "End date cannot be before the start date." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { success: false, message: "You must be logged in." };

  const { data, error } = await supabase
    .from("campaigns")
    .insert({ name, start_date: startDate, end_date: endDate, owner_id: user.id })
    .select("id")
    .single();

  if (error) return { success: false, message: error.message };

  redirect(`/campaigns/${data.id}`);
}

export async function updateCampaign(
  campaignId: string,
  _prevState: ActionResult | undefined,
  formData: FormData
): Promise<ActionResult> {
  const name = String(formData.get("name") ?? "").trim();
  const startDate = String(formData.get("start_date") ?? "").trim() || null;
  const endDate = String(formData.get("end_date") ?? "").trim() || null;

  if (!name) {
    return { success: false, message: "Campaign name is required." };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("campaigns")
    .update({ name, start_date: startDate, end_date: endDate })
    .eq("id", campaignId);

  if (error) return { success: false, message: error.message };

  revalidatePath(`/campaigns/${campaignId}`);
  redirect(`/campaigns/${campaignId}`);
}

export async function deleteCampaign(campaignId: string): Promise<ActionResult> {
  const supabase = await createClient();
  const { error } = await supabase.from("campaigns").delete().eq("id", campaignId);

  if (error) return { success: false, message: error.message };

  revalidatePath("/campaigns");
  redirect("/campaigns");
}
