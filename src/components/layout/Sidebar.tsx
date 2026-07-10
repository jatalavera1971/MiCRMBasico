"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { MAIN_NAV, PROFILE_NAV } from "./nav-items";

/** design.md → sidebar / nav-item-*: 240px, fondo emerald-900, visible desde tablet (≥768px). */
export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex md:w-[240px] md:shrink-0 md:flex-col md:gap-1 bg-surface-sidebar p-3 py-4">
      <div className="mb-6 px-3 text-heading-sm text-ink-on-dark">Vibe CRM</div>

      <nav className="flex flex-col gap-1">
        {MAIN_NAV.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(`${href}/`);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "text-nav-item flex items-center gap-3 rounded-md px-3 py-[9px] text-ink-on-dark-soft transition-colors hover:bg-surface-sidebar-hover hover:text-ink-on-dark",
                active && "bg-surface-sidebar-active border-l-[3px] border-primary-300 pl-[9px] text-ink-on-dark",
              )}
            >
              <Icon size={18} strokeWidth={1.75} />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto">
        <Link
          href={PROFILE_NAV.href}
          className={cn(
            "text-nav-item flex items-center gap-3 rounded-md px-3 py-[9px] text-ink-on-dark-soft transition-colors hover:bg-surface-sidebar-hover hover:text-ink-on-dark",
            pathname.startsWith(PROFILE_NAV.href) && "bg-surface-sidebar-active text-ink-on-dark",
          )}
        >
          <PROFILE_NAV.icon size={18} strokeWidth={1.75} />
          {PROFILE_NAV.label}
        </Link>
      </div>
    </aside>
  );
}
