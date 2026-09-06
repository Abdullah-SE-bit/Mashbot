"use client";

import { useActionState } from "react";
import Link from "next/link";
import { signUp } from "@/lib/actions/auth";
import { Field, TextInput, SubmitButton, FormMessage } from "@/components/ui/form-elements";

export function RegisterForm() {
  const [state, formAction, pending] = useActionState(signUp, undefined);

  return (
    <form action={formAction} className="flex w-full max-w-sm flex-col gap-4">
      <Field label="Username" htmlFor="username">
        <TextInput id="username" name="username" type="text" autoComplete="username" required />
      </Field>
      <Field label="Full name" htmlFor="name">
        <TextInput id="name" name="name" type="text" autoComplete="name" required />
      </Field>
      <Field label="Email" htmlFor="email">
        <TextInput id="email" name="email" type="email" autoComplete="email" required />
      </Field>
      <Field label="Password" htmlFor="password">
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
      <SubmitButton pending={pending}>Create account</SubmitButton>
      <p className="text-sm text-zinc-600">
        Already have an account?{" "}
        <Link href="/login" className="underline">
          Log in
        </Link>
      </p>
    </form>
  );
}
