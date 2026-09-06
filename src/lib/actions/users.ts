"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { ActionResult, UserRole } from "@/lib/types";

const VALID_ROLES: UserRole[] = ["contributor", "approver", "publisher"];

async function requireAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { supabase, admin: null, error: "You must be logged in." } as const;

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, account_type")
    .eq("id", user.id)
    .single();

  if (!profile || profile.account_type !== "admin") {
    return { supabase, admin: null, error: "Administrator privileges required." } as const;
  }

  return { supabase, admin: profile, error: null } as const;
}

/** SRS 0380/0390: an admin may deactivate any account except the System Administrator. */
export async function deactivateUser(userId: string): Promise<ActionResult> {
  const { supabase, admin, error } = await requireAdmin();
  if (error || !admin) return { success: false, message: error ?? "Not authorized." };

  const { data: target } = await supabase
    .from("profiles")
    .select("id, account_type")
    .eq("id", userId)
    .single();

  if (!target) return { success: false, message: "User not found." };
  if (target.account_type === "admin") {
    return { success: false, message: "The System Administrator account cannot be disabled." };
  }

  const { error: updateError } = await supabase
    .from("profiles")
    .update({ status: "deactivated" })
    .eq("id", userId);

  if (updateError) return { success: false, message: updateError.message };

  revalidatePath("/admin/users");
  return { success: true, message: "Account deactivated." };
}

/** SRS 0420: a disabled account can be re-enabled ("undisabled"). */
export async function reactivateUser(userId: string): Promise<ActionResult> {
  const { supabase, admin, error } = await requireAdmin();
  if (error || !admin) return { success: false, message: error ?? "Not authorized." };

  const { error: updateError } = await supabase
    .from("profiles")
    .update({ status: "active" })
    .eq("id", userId);

  if (updateError) return { success: false, message: updateError.message };

  revalidatePath("/admin/users");
  return { success: true, message: "Account reactivated." };
}

/**
 * SRS 0400/0410: an account with history (owns a campaign or authored content) may only be
 * deactivated, not deleted; an account with no history may be deleted outright.
 */
export async function deleteUser(userId: string): Promise<ActionResult> {
  const { supabase, admin, error } = await requireAdmin();
  if (error || !admin) return { success: false, message: error ?? "Not authorized." };

  const { data: target } = await supabase
    .from("profiles")
    .select("id, account_type")
    .eq("id", userId)
    .single();

  if (!target) return { success: false, message: "User not found." };
  if (target.account_type === "admin") {
    return { success: false, message: "The System Administrator account cannot be deleted." };
  }

  const { count: campaignCount } = await supabase
    .from("campaigns")
    .select("id", { count: "exact", head: true })
    .eq("owner_id", userId);
  const { count: contentCount } = await supabase
    .from("campaign_content")
    .select("id", { count: "exact", head: true })
    .eq("created_by", userId);

  if ((campaignCount ?? 0) > 0 || (contentCount ?? 0) > 0) {
    return {
      success: false,
      message:
        "This account has campaign or content history and can only be deactivated, not deleted (SRS 0400).",
    };
  }

  // Deletes the profile row only; removing the underlying auth.users row requires the
  // service-role key (see docs/assumptions.md) and is out of scope for this MVP.
  const { error: deleteError } = await supabase.from("profiles").delete().eq("id", userId);
  if (deleteError) return { success: false, message: deleteError.message };

  revalidatePath("/admin/users");
  return { success: true, message: "Account deleted." };
}

/** SRS 0150-0200: an admin assigns product roles to a user account; a user may hold more than one. */
export async function updateUserRoles(userId: string, roles: UserRole[]): Promise<ActionResult> {
  const { supabase, admin, error } = await requireAdmin();
  if (error || !admin) return { success: false, message: error ?? "Not authorized." };

  const sanitized = roles.filter((role) => VALID_ROLES.includes(role));

  const { error: updateError } = await supabase
    .from("profiles")
    .update({ roles: sanitized })
    .eq("id", userId);

  if (updateError) return { success: false, message: updateError.message };

  revalidatePath("/admin/users");
  return { success: true, message: "Roles updated." };
}
