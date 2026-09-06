"use client";

import { useActionState, useState } from "react";
import { createContent } from "@/lib/actions/content";
import { Field, TextInput, SubmitButton, FormMessage } from "@/components/ui/form-elements";

export function AddContentForm({ campaignId }: { campaignId: string }) {
  const [state, formAction, pending] = useActionState(
    createContent.bind(null, campaignId),
    undefined
  );
  const [contentType, setContentType] = useState<"text" | "image">("text");

  return (
    <form action={formAction} className="flex flex-col gap-3 rounded-lg border border-zinc-200 bg-white p-4">
      <p className="text-sm font-medium">Add content</p>
      <Field label="Content type" htmlFor="content_type">
        <select
          id="content_type"
          name="content_type"
          value={contentType}
          onChange={(event) => setContentType(event.target.value as "text" | "image")}
          className="rounded-md border border-zinc-300 px-3 py-2 text-sm"
        >
          <option value="text">Text</option>
          <option value="image">Image</option>
        </select>
      </Field>
      {contentType === "text" ? (
        <Field label="Text" htmlFor="body">
          <textarea
            id="body"
            name="body"
            rows={3}
            className="rounded-md border border-zinc-300 px-3 py-2 text-sm"
          />
        </Field>
      ) : (
        <Field label="Image URL" htmlFor="image_url">
          <TextInput id="image_url" name="image_url" type="url" placeholder="https://…" />
        </Field>
      )}
      <FormMessage success={state?.success ?? false} message={state?.message} />
      <SubmitButton pending={pending} className="w-fit">
        Add content
      </SubmitButton>
    </form>
  );
}
