"use client";

import Link from "next/link";
import { useQuery } from "convex/react";
import { Search } from "lucide-react";
import { api } from "../../../convex/_generated/api";
import { Avatar } from "@/components/ui/Avatar";

/** design.md → top-nav: 64px, buscador + avatar. Solo desktop (la búsqueda real de F2 vive en P2). */
export function TopNav() {
  const user = useQuery(api.users.current);

  return (
    <header className="hidden h-16 items-center justify-between border-b border-border bg-surface px-6 md:flex">
      <div className="relative w-full max-w-xs">
        <Search
          size={16}
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted"
        />
        <input
          type="search"
          placeholder="Buscar…"
          className="h-9 w-full rounded-pill border border-border bg-surface-subtle pl-9 pr-4 text-body-sm outline-none focus:border-border-brand"
        />
      </div>
      <Link href="/perfil" className="flex items-center gap-2">
        <Avatar nombre={user?.name ?? "?"} size="sm" />
      </Link>
    </header>
  );
}
