"use client";

import { useActionState } from "react";
import { connectExternalAccount } from "@/lib/actions/externalAccounts";
import { Field, TextInput, SubmitButton, FormMessage } from "@/components/ui/form-elements";

const PROVIDERS = ["facebook", "twitter", "wordpress", "youtube", "flickr"] as const;

export function ConnectAccountForm() {
  const [state, formAction, pending] = useActionState(connectExternalAccount, undefined);

  return (
    <form
      action={formAction}
      className="flex flex-col gap-3 rounded-lg border border-zinc-200 bg-white p-4 sm:flex-row sm:items-end"
    >
      <Field label="Service" htmlFor="provider">
        <select
          id="provider"
          name="provider"
          className="rounded-md border border-zinc-300 px-3 py-2 text-sm capitalize"
        >
          {PROVIDERS.map((provider) => (
            <option key={provider} value={provider}>
              {provider}
            </option>
          ))}
        </select>
      </Field>
      <Field label="Username / handle" htmlFor="external_username">
        <TextInput id="external_username" name="external_username" type="text" required />
      </Field>
      <SubmitButton pending={pending}>Connect (simulated)</SubmitButton>
      <FormMessage success={state?.success ?? false} message={state?.message} />
    </form>
  );
}
