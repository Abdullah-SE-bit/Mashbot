import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ProfileForm } from "@/components/profile/profile-form";
import type { Profile } from "@/lib/types";

export default async function ProfilePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) notFound();

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single<Profile>();

  if (!profile) notFound();

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold">Your profile</h1>
        <p className="text-sm text-zinc-600">
          SRS 0330/0350/0360/0370 — you may modify your own name and email once logged in.
        </p>
      </div>
      <ProfileForm profile={profile} />
      <div className="text-sm">
        Roles: <span className="font-medium">{profile.roles.join(", ") || "none"}</span>
      </div>
    </div>
  );
}
