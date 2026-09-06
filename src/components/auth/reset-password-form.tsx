"use client";

import { useActionState } from "react";
import { updatePassword } from "@/lib/actions/auth";
import { Field, TextInput, SubmitButton, FormMessage } from "@/components/ui/form-elements";

export function ResetPasswordForm() {
  const [state, formAction, pending] = useActionState(updatePassword, undefined);

  return (
    <form action={formAction} className="flex w-full max-w-sm flex-col gap-4">
      <Field label="New password" htmlFor="password">
        <TextInput
          id="password"
          name="password"
          type="password"
          autoComplete="new-password"
          minLength={8}
          required
        />
      </Field>
      <FormMessage success={state?.success ?? false} message={state?.message} />
      <SubmitButton pending={pending}>Update password</SubmitButton>
    </form>
  );
}
