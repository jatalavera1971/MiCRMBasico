import { Columns3, Home, Users } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type NavItem = {
  key: "inicio" | "clientes" | "pipeline";
  href: string;
  label: string;
  icon: LucideIcon;
  // "Clientes" también se marca activo en /inactivos y /clientes/[id], igual que
  // en renderTabBar()/renderSidebar() del prototipo de referencia — sin que
  // /inactivos sea un destino clicable de la barra (JOS-28).
  isActive: (pathname: string) => boolean;
};

export const navItems: NavItem[] = [
  {
    key: "inicio",
    href: "/inicio",
    label: "Inicio",
    icon: Home,
    isActive: (pathname) => pathname === "/inicio",
  },
  {
    key: "clientes",
    href: "/clientes",
    label: "Clientes",
    icon: Users,
    isActive: (pathname) =>
      pathname.startsWith("/clientes") || pathname.startsWith("/inactivos"),
  },
  {
    key: "pipeline",
    href: "/pipeline",
    label: "Pipeline",
    icon: Columns3,
    isActive: (pathname) => pathname.startsWith("/pipeline"),
  },
];
