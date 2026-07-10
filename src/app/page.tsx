import { redirect } from "next/navigation";

// PRD sección 8: "Tras iniciar sesión, la app dirige directamente a Inicio (P1)".
// Si no hay sesión, el middleware ya redirige a /login antes de llegar aquí.
export default function RootPage() {
  redirect("/inicio");
}
