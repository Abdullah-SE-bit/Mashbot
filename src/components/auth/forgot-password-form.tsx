"use client";

import { useActionState } from "react";
import { requestPasswordReset } from "@/lib/actions/auth";
import { Field, TextInput, SubmitButton, FormMessage } from "@/components/ui/form-elements";

export function ForgotPasswordForm() {
  const [state, formAction, pending] = useActionState(requestPasswordReset, undefined);

  return (
    <form action={formAction} className="flex w-full max-w-sm flex-col gap-4">
      <Field label="Email" htmlFor="email">
        <TextInput id="email" name="email" type="email" autoComplete="email" required />
      </Field>
      <FormMessage success={state?.success ?? false} message={state?.message} />
      <SubmitButton pending={pending}>Send reset link</SubmitButton>
    </form>
  );
}
