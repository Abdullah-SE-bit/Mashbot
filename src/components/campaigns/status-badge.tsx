import type { ContentStatus } from "@/lib/types";

export function StatusBadge({ status }: { status: ContentStatus }) {
  let style = "";
  let label = "";

  if (status === "draft") {
    style = "bg-zinc-100 text-zinc-700";
    label = "Draft";
  } else if (status === "pending_approval") {
    style = "bg-amber-100 text-amber-800";
    label = "Pending approval";
  } else if (status === "rejected") {
    style = "bg-red-100 text-red-800";
    label = "Rejected";
  } else if (status === "approved") {
    style = "bg-blue-100 text-blue-800";
    label = "Approved";
  } else if (status === "scheduled") {
    style = "bg-purple-100 text-purple-800";
    label = "Scheduled";
  } else if (status === "published") {
    style = "bg-emerald-100 text-emerald-800";
    label = "Published";
  } else {
    style = "bg-zinc-100 text-zinc-700";
    label = "Draft";
  }

  return (
    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${style}`}>{label}</span>
  );
}
