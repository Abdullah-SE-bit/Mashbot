import Link from "next/link";
import { signOut } from "@/lib/actions/auth";
import type { Profile } from "@/lib/types";

const links = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/campaigns", label: "Campaigns" },
  { href: "/accounts", label: "External Accounts" },
  { href: "/profile", label: "Profile" },
];

export function Nav({ profile }: { profile: Profile }) {
  return (
    <header className="border-b border-zinc-200 bg-white">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-4 px-4 py-3">
        <div className="flex items-center gap-6">
          <span className="text-lg font-semibold">Mashbot</span>
          <nav className="flex flex-wrap gap-4 text-sm">
            {links.map((link) => (
              <Link key={link.href} href={link.href} className="text-zinc-700 hover:underline">
                {link.label}
              </Link>
            ))}
            {profile.account_type === "admin" && (
              <Link href="/admin/users" className="text-zinc-700 hover:underline">
                Admin
              </Link>
            )}
          </nav>
        </div>
        <div className="flex items-center gap-3 text-sm text-zinc-600">
          {/* Notification bell — parked until SRS use case 35 (activity notifications) is built.
          <button type="button" className="relative">
            <BellIcon />
            {unreadCount > 0 && <span className="badge">{unreadCount}</span>}
          </button>
          */}
          <span>
            {profile.name} · {profile.roles.join(", ") || "no roles"}
          </span>
          <form action={signOut}>
            <button type="submit" className="underline">
              Sign out
            </button>
          </form>
        </div>
      </div>
    </header>
  );
}
