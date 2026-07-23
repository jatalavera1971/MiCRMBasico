"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { LogOut } from "lucide-react";
import { logoutAction } from "@/components/auth/actions";
import { navItems } from "./nav-items";

export function Sidebar() {
  const pathname = usePathname();

  return (
    <nav className="hidden h-screen w-60 shrink-0 flex-col border-r border-border bg-bg-app md:flex">
      <div className="px-5 py-5">
        <span className="text-lg font-semibold text-primary-600">CRM</span>
      </div>
      <div className="flex flex-1 flex-col gap-1 px-3">
        {navItems.map((item) => {
          const active = item.isActive(pathname);
          const Icon = item.icon;
          return (
            <Link
              key={item.key}
              href={item.href}
              className={clsx(
                "flex h-12 items-center gap-3 rounded-md border-l-[3px] px-3 text-sm",
                active
                  ? "border-primary-600 bg-primary-50 font-semibold text-primary-700"
                  : "border-transparent font-normal text-text-secondary",
              )}
            >
              <Icon className="h-5 w-5" strokeWidth={1.5} />
              {item.label}
            </Link>
          );
        })}
      </div>
      {/* TODO(JOS-63): botón mínimo y temporal — P10 lo sustituye por la
          pantalla de perfil (con "Cerrar sesión" junto a los datos del usuario). */}
      <div className="px-3 pb-5">
        <button
          type="button"
          onClick={async () => {
            await logoutAction();
            window.location.href = "/";
          }}
          className="flex h-12 w-full items-center gap-3 rounded-md border-l-[3px] border-transparent px-3 text-sm font-normal text-text-secondary"
        >
          <LogOut className="h-5 w-5" strokeWidth={1.5} />
          Cerrar sesión
        </button>
      </div>
    </nav>
  );
}
