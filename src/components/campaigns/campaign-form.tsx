"use client";

import { useActionState } from "react";
import type { ActionResult, Campaign } from "@/lib/types";
import { Field, TextInput, SubmitButton, FormMessage } from "@/components/ui/form-elements";

type FormAction = (
  prevState: ActionResult | undefined,
  formData: FormData
) => Promise<ActionResult>;

export function CampaignForm({
  action,
  campaign,
}: {
  action: FormAction;
  campaign?: Campaign;
}) {
  const [state, formAction, pending] = useActionState(action, undefined);

  return (
    <form action={formAction} className="flex max-w-md flex-col gap-4">
      <Field label="Campaign name" htmlFor="name">
        <TextInput id="name" name="name" type="text" defaultValue={campaign?.name} required />
      </Field>
      <Field label="Start date" htmlFor="start_date">
        <TextInput
          id="start_date"
          name="start_date"
          type="date"
          defaultValue={campaign?.start_date ?? ""}
        />
      </Field>
      <Field label="End date" htmlFor="end_date">
        <TextInput
          id="end_date"
          name="end_date"
          type="date"
          defaultValue={campaign?.end_date ?? ""}
        />
      </Field>
      <FormMessage success={state?.success ?? false} message={state?.message} />
      <SubmitButton pending={pending}>{campaign ? "Save changes" : "Create campaign"}</SubmitButton>
    </form>
  );
}
