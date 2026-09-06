"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { ActionResult } from "@/lib/types";

function readString(formData: FormData, key: string): string {
  return String(formData.get(key) ?? "").trim();
}

/** SRS 0240: user account creation. Required fields per SRS 0270-0320. */
export async function signUp(
  _prevState: ActionResult | undefined,
  formData: FormData
): Promise<ActionResult> {
  const username = readString(formData, "username");
  const name = readString(formData, "name");
  const email = readString(formData, "email");
  const password = readString(formData, "password");

  if (!username || !name || !email || !password) {
    return { success: false, message: "Username, name, email, and password are all required." };
  }
  if (password.length < 8) {
    return { success: false, message: "Password must be at least 8 characters." };
  }
  if (!/^[a-zA-Z0-9_.-]{3,32}$/.test(username)) {
    return {
      success: false,
      message: "Username must be 3-32 characters: letters, numbers, '.', '_' or '-'.",
    };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { username, name } },
  });

  if (error) {
    return { success: false, message: error.message };
  }

  redirect("/dashboard");
}

/** SRS 0650/0660: only a valid (non-deactivated) user with correct credentials may log in. */
export async function signIn(
  _prevState: ActionResult | undefined,
  formData: FormData
): Promise<ActionResult> {
  const email = readString(formData, "email");
  const password = readString(formData, "password");

  if (!email || !password) {
    return { success: false, message: "Email and password are required." };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return { success: false, message: "Invalid email or password." };
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("status")
    .eq("id", data.user.id)
    .single();

  if (profile?.status === "deactivated") {
    await supabase.auth.signOut();
    return {
      success: false,
      message: "This account has been deactivated. Contact an administrator.",
    };
  }

  redirect("/dashboard");
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}

/** SRS 0450/0460: system-initiated password reset via email. */
export async function requestPasswordReset(
  _prevState: ActionResult | undefined,
  formData: FormData
): Promise<ActionResult> {
  const email = readString(formData, "email");
  if (!email) {
    return { success: false, message: "Email is required." };
  }

  const supabase = await createClient();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${siteUrl}/reset-password`,
  });

  if (error) {
    return { success: false, message: error.message };
  }

  return {
    success: true,
    message: "If an account exists for that email, a reset link has been sent.",
  };
}

/** SRS 0470: a user may only change their own password (enforced by the active session). */
export async function updatePassword(
  _prevState: ActionResult | undefined,
  formData: FormData
): Promise<ActionResult> {
  const password = readString(formData, "password");
  if (password.length < 8) {
    return { success: false, message: "Password must be at least 8 characters." };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({ password });

  if (error) {
    return { success: false, message: error.message };
  }

  redirect("/dashboard");
}
