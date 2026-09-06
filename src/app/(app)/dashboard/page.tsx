import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const [{ count: campaignCount }, { count: pendingCount }, { count: scheduledCount }] =
    await Promise.all([
      supabase.from("campaigns").select("id", { count: "exact", head: true }),
      supabase
        .from("campaign_content")
        .select("id", { count: "exact", head: true })
        .eq("status", "pending_approval"),
      supabase
        .from("campaign_content")
        .select("id", { count: "exact", head: true })
        .eq("status", "scheduled"),
    ]);

  const stats = [
    { label: "Campaigns", value: campaignCount ?? 0, href: "/campaigns" },
    { label: "Pending approval", value: pendingCount ?? 0, href: "/campaigns" },
    { label: "Scheduled content", value: scheduledCount ?? 0, href: "/campaigns" },
  ];

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <p className="text-sm text-zinc-600">Signed in as {user?.email}</p>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm transition hover:border-zinc-400"
          >
            <p className="text-3xl font-semibold">{stat.value}</p>
            <p className="text-sm text-zinc-600">{stat.label}</p>
          </Link>
        ))}
      </div>
      <Link
        href="/campaigns/new"
        className="w-fit rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700"
      >
        Create a campaign
      </Link>
    </div>
  );
}
