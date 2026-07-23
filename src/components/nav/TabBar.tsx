"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { LogOut } from "lucide-react";
import { logoutAction } from "@/components/auth/actions";
import { navItems } from "./nav-items";

export function TabBar() {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-10 flex h-14 border-t border-border bg-surface md:hidden">
      {navItems.map((item) => {
        const active = item.isActive(pathname);
        const Icon = item.icon;
        return (
          <Link
            key={item.key}
            href={item.href}
            className="flex flex-1 flex-col items-center justify-center gap-0.5"
          >
            <Icon
              className={clsx(
                "h-[22px] w-[22px]",
                active ? "text-primary-600" : "text-text-tertiary",
              )}
              strokeWidth={1.5}
            />
            <span
              className={clsx(
                "text-[10px]",
                active
                  ? "font-semibold text-primary-600"
                  : "font-normal text-text-tertiary",
              )}
            >
              {item.label}
            </span>
          </Link>
        );
      })}
      {/* TODO(JOS-63): botón mínimo y temporal — P10 lo sustituye. */}
      <button
        type="button"
        onClick={async () => {
          await logoutAction();
          window.location.href = "/";
        }}
        className="flex flex-1 flex-col items-center justify-center gap-0.5"
      >
        <LogOut className="h-[22px] w-[22px] text-text-tertiary" strokeWidth={1.5} />
        <span className="text-[10px] font-normal text-text-tertiary">Salir</span>
      </button>
    </nav>
  );
}
