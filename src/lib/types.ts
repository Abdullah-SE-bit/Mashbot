export type UserRole = "contributor" | "approver" | "publisher";
export type AccountType = "user" | "admin";
export type AccountStatus = "active" | "deactivated";

export interface Profile {
  id: string;
  username: string;
  name: string;
  email: string;
  roles: UserRole[];
  account_type: AccountType;
  status: AccountStatus;
  created_at: string;
  updated_at: string;
}

export interface Campaign {
  id: string;
  name: string;
  start_date: string | null;
  end_date: string | null;
  owner_id: string;
  created_at: string;
  updated_at: string;
}

export type ContentType = "text" | "image";
export type ContentStatus =
  | "draft"
  | "pending_approval"
  | "rejected"
  | "approved"
  | "scheduled"
  | "published";

export interface CampaignContent {
  id: string;
  campaign_id: string;
  content_type: ContentType;
  body: string | null;
  image_url: string | null;
  status: ContentStatus;
  scheduled_at: string | null;
  created_by: string;
  approved_by: string | null;
  created_at: string;
  updated_at: string;
}

export type ExternalProvider =
  | "facebook"
  | "twitter"
  | "wordpress"
  | "youtube"
  | "flickr";

export interface ExternalServiceAccount {
  id: string;
  user_id: string;
  provider: ExternalProvider;
  external_username: string;
  status: "connected" | "disconnected";
  created_at: string;
}

export interface ActionResult<T = undefined> {
  success: boolean;
  message: string;
  data?: T;
}
