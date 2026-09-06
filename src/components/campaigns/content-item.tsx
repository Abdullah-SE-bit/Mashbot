"use client";

import { ActionButton } from "@/components/ui/action-button";
import { StatusBadge } from "@/components/campaigns/status-badge";
import { ScheduleForm } from "@/components/campaigns/schedule-form";
import {
  deleteContent,
  publishNow,
  reviewContent,
  submitForApproval,
} from "@/lib/actions/content";
import type { CampaignContent, Profile } from "@/lib/types";

export function ContentItem({
  content,
  campaignId,
  profile,
}: {
  content: CampaignContent;
  campaignId: string;
  profile: Profile;
}) {
  const isAuthor = content.created_by === profile.id;
  const isAdmin = profile.account_type === "admin";
  const canDelete = isAuthor || isAdmin;

  return (
    <li className="flex flex-col gap-3 rounded-lg border border-zinc-200 bg-white p-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <StatusBadge status={content.status} />
          <p className="mt-2 text-sm">
            {content.content_type === "text" ? content.body : content.image_url}
          </p>
          {content.scheduled_at && (
            <p className="mt-1 text-xs text-zinc-500">
              Go-live: {new Date(content.scheduled_at).toLocaleString()}
            </p>
          )}
        </div>
        <span className="shrink-0 text-xs uppercase text-zinc-400">{content.content_type}</span>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {isAuthor && ["draft", "rejected"].includes(content.status) && (
          <ActionButton action={() => submitForApproval(campaignId, content.id)}>
            Submit for approval
          </ActionButton>
        )}

        {profile.roles.includes("approver") && content.status === "pending_approval" && (
          <>
            <ActionButton action={() => reviewContent(campaignId, content.id, "approved")}>
              Approve
            </ActionButton>
            <ActionButton
              variant="danger"
              action={() => reviewContent(campaignId, content.id, "rejected")}
            >
              Reject
            </ActionButton>
          </>
        )}

        {profile.roles.includes("publisher") && content.status === "approved" && (
          <>
            <ScheduleForm campaignId={campaignId} contentId={content.id} />
            <ActionButton action={() => publishNow(campaignId, content.id)}>
              Publish now
            </ActionButton>
          </>
        )}

        {profile.roles.includes("publisher") && content.status === "scheduled" && (
          <ActionButton action={() => publishNow(campaignId, content.id)}>
            Publish now
          </ActionButton>
        )}

        {canDelete && (
          <ActionButton
            variant="danger"
            confirmMessage="Delete this content?"
            action={() => deleteContent(campaignId, content.id)}
          >
            Delete
          </ActionButton>
        )}
      </div>
    </li>
  );
}
