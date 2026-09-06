import type { ContentStatus } from "@/lib/types";

const STYLES: Record<ContentStatus, string> = {
  draft: "bg-zinc-100 text-zinc-700",
  pending_approval: "bg-amber-100 text-amber-800",
  rejected: "bg-red-100 text-red-800",
  approved: "bg-blue-100 text-blue-800",
  scheduled: "bg-purple-100 text-purple-800",
  published: "bg-emerald-100 text-emerald-800",
};

const LABELS: Record<ContentStatus, string> = {
  draft: "Draft",
  pending_approval: "Pending approval",
  rejected: "Rejected",
  approved: "Approved",
  scheduled: "Scheduled",
  published: "Published",
};

export function StatusBadge({ status }: { status: ContentStatus }) {
  return (
    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${STYLES[status]}`}>
      {LABELS[status]}
    </span>
  );
}
