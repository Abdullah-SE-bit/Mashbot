"use client";

import { useState, useTransition } from "react";
import { updateUserRoles } from "@/lib/actions/users";
import type { UserRole } from "@/lib/types";

const ALL_ROLES: UserRole[] = ["contributor", "approver", "publisher"];

export function RolesEditor({ userId, roles }: { userId: string; roles: UserRole[] }) {
  const [selected, setSelected] = useState<UserRole[]>(roles);
  const [isPending, startTransition] = useTransition();

  function toggle(role: UserRole) {
    const next = selected.includes(role)
      ? selected.filter((r) => r !== role)
      : [...selected, role];
    setSelected(next);
    startTransition(() => {
      updateUserRoles(userId, next);
    });
  }

  return (
    <div className="flex flex-wrap gap-2">
      {ALL_ROLES.map((role) => (
        <label key={role} className="flex items-center gap-1 text-xs capitalize">
          <input
            type="checkbox"
            checked={selected.includes(role)}
            disabled={isPending}
            onChange={() => toggle(role)}
          />
          {role}
        </label>
      ))}
    </div>
  );
}
