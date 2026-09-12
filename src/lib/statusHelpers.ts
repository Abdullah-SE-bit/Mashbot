import type { ContentStatus, UserRole } from "@/lib/types";

/** Builds a human-readable hint for the content status badge tooltip. */
export function describeContentStatus(
  status: ContentStatus,
  roles: UserRole[],
  isOwner: boolean
): string {
  if (status === "draft") {
    if (isOwner) {
      if (roles.includes("contributor")) {
        return "You can edit or submit this draft for approval.";
      } else {
        return "You own this draft but no longer have the Contributor role.";
      }
    } else {
      return "This is someone else's draft.";
    }
  } else if (status === "pending_approval") {
    if (roles.includes("approver")) {
      if (isOwner) {
        return "You submitted this and can also approve it.";
      } else {
        return "Waiting for your review.";
      }
    } else {
      if (isOwner) {
        return "Waiting for an approver.";
      } else {
        return "Waiting for approval.";
      }
    }
  } else if (status === "approved") {
    if (roles.includes("publisher")) {
      return "Ready for you to schedule or publish.";
    } else {
      return "Approved, waiting to be scheduled.";
    }
  } else if (status === "rejected") {
    if (isOwner) {
      return "Rejected — you can revise and resubmit.";
    } else {
      return "Rejected by an approver.";
    }
  } else if (status === "scheduled") {
    return "Scheduled to go live.";
  } else if (status === "published") {
    return "Already live.";
  } else {
    return "";
  }
}
