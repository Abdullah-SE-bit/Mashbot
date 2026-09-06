"use client";

import { useActionState } from "react";
import { updateProfile } from "@/lib/actions/profile";
import { Field, TextInput, SubmitButton, FormMessage } from "@/components/ui/form-elements";
import type { Profile } from "@/lib/types";

export function ProfileForm({ profile }: { profile: Profile }) {
  const [state, formAction, pending] = useActionState(updateProfile, undefined);

  return (
    <form action={formAction} className="flex max-w-md flex-col gap-4">
      <Field label="Username" htmlFor="username">
        <TextInput id="username" name="username" type="text" defaultValue={profile.username} disabled />
      </Field>
      <Field label="Full name" htmlFor="name">
        <TextInput id="name" name="name" type="text" defaultValue={profile.name} required />
      </Field>
      <Field label="Email" htmlFor="email">
        <TextInput id="email" name="email" type="email" defaultValue={profile.email} required />
      </Field>
      <FormMessage success={state?.success ?? false} message={state?.message} />
      <SubmitButton pending={pending}>Save changes</SubmitButton>
    </form>
  );
}
