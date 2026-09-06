import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { CampaignForm } from "@/components/campaigns/campaign-form";
import { updateCampaign } from "@/lib/actions/campaigns";
import type { Campaign } from "@/lib/types";

export default async function EditCampaignPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: campaign } = await supabase
    .from("campaigns")
    .select("*")
    .eq("id", id)
    .single<Campaign>();

  if (!campaign) notFound();

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold">Edit campaign</h1>
      <CampaignForm action={updateCampaign.bind(null, campaign.id)} campaign={campaign} />
    </div>
  );
}
