"use client";

import { useActionState } from "react";
import { scheduleContent } from "@/lib/actions/content";
import { Field, TextInput, SubmitButton, FormMessage } from "@/components/ui/form-elements";

export function ScheduleForm({ campaignId, contentId }: { campaignId: string; contentId: string }) {
  const [state, formAction, pending] = useActionState(
    scheduleContent.bind(null, campaignId, contentId),
    undefined
  );

  return (
    <form action={formAction} className="flex flex-wrap items-end gap-2">
      <Field label="Go-live date" htmlFor={`scheduled_date-${contentId}`}>
        <TextInput
          id={`scheduled_date-${contentId}`}
          name="scheduled_date"
          type="date"
          required
        />
      </Field>
      <Field label="Time (optional, defaults to 00:00)" htmlFor={`scheduled_time-${contentId}`}>
        <TextInput id={`scheduled_time-${contentId}`} name="scheduled_time" type="time" />
      </Field>
      <SubmitButton pending={pending} className="text-xs">
        Schedule
      </SubmitButton>
      <FormMessage success={state?.success ?? false} message={state?.message} />
    </form>
  );
}
