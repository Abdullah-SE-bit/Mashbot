import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import type { Campaign } from "@/lib/types";

export default async function CampaignsPage() {
  const supabase = await createClient();
  const { data: campaigns, error } = await supabase
    .from("campaigns")
    .select("*")
    .order("created_at", { ascending: false })
    .returns<Campaign[]>();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Campaigns</h1>
        <Link
          href="/campaigns/new"
          className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700"
        >
          New campaign
        </Link>
      </div>

      {error && <p className="text-sm text-red-700">{error.message}</p>}

      {!error && (campaigns?.length ?? 0) === 0 && (
        <p className="text-sm text-zinc-600">No campaigns yet. Create your first one above.</p>
      )}

      <ul className="flex flex-col gap-3">
        {campaigns?.map((campaign) => (
          <li key={campaign.id}>
            <Link
              href={`/campaigns/${campaign.id}`}
              className="block rounded-lg border border-zinc-200 bg-white p-4 shadow-sm transition hover:border-zinc-400"
            >
              <p className="font-medium">{campaign.name}</p>
              <p className="text-sm text-zinc-600">
                {campaign.start_date ?? "no start date"} – {campaign.end_date ?? "no end date"}
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
