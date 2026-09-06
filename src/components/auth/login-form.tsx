"use client";

import { useActionState } from "react";
import Link from "next/link";
import { signIn } from "@/lib/actions/auth";
import { Field, TextInput, SubmitButton, FormMessage } from "@/components/ui/form-elements";

export function LoginForm() {
  const [state, formAction, pending] = useActionState(signIn, undefined);

  return (
    <form action={formAction} className="flex w-full max-w-sm flex-col gap-4">
      <Field label="Email" htmlFor="email">
        <TextInput id="email" name="email" type="email" autoComplete="email" required />
      </Field>
      <Field label="Password" htmlFor="password">
        <TextInput
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
        />
      </Field>
      <FormMessage success={state?.success ?? false} message={state?.message} />
      <SubmitButton pending={pending}>Log in</SubmitButton>
      <div className="flex justify-between text-sm text-zinc-600">
        <Link href="/register" className="underline">
          Create an account
        </Link>
        <Link href="/forgot-password" className="underline">
          Forgot password?
        </Link>
      </div>
    </form>
  );
}
