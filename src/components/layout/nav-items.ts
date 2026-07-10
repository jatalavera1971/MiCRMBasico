import type { LucideIcon } from "lucide-react";
import { Home, Users, GitBranch, User } from "lucide-react";

/**
 * Estructura de navegación principal — PRD sección 8. Solo tres secciones
 * en la barra fija (Inicio/Clientes/Pipeline); Perfil (P10) se enlaza aparte
 * porque no forma parte de la barra principal, solo es "accesible" desde ella.
 */
export const MAIN_NAV: { href: string; label: string; icon: LucideIcon }[] = [
  { href: "/inicio", label: "Inicio", icon: Home },
  { href: "/clientes", label: "Clientes", icon: Users },
  { href: "/pipeline", label: "Pipeline", icon: GitBranch },
];

export const PROFILE_NAV = { href: "/perfil", label: "Perfil", icon: User };
