import { CampaignForm } from "@/components/campaigns/campaign-form";
import { createCampaign } from "@/lib/actions/campaigns";

export default function NewCampaignPage() {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold">Create a campaign</h1>
      <CampaignForm action={createCampaign} />
    </div>
  );
}
