"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { ActionResult } from "@/lib/types";

/** SRS 0330/0350/0360/0370: a logged-in user may modify their own name/email. */
export async function updateProfile(
  _prevState: ActionResult | undefined,
  formData: FormData
): Promise<ActionResult> {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();

  if (!name || !email) {
    return { success: false, message: "Name and email are required." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, message: "You must be logged in." };
  }

  const { error } = await supabase
    .from("profiles")
    .update({ name, email })
    .eq("id", user.id);

  if (error) {
    return { success: false, message: error.message };
  }

  if (email !== user.email) {
    await supabase.auth.updateUser({ email });
  }

  revalidatePath("/profile");
  return { success: true, message: "Profile updated." };
}
