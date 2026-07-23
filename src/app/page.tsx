import { redirect } from "next/navigation";
import { getSesionActual } from "@/lib/session";
import { LoginForm } from "@/components/auth/LoginForm";

export const dynamic = "force-dynamic";

// JOS-61 (P8): ruta reservada para esto desde el TODO original. Si ya hay
// sesión válida, redirige directo a Inicio; si no, es la pantalla de login.
export default async function Home() {
  const sesion = await getSesionActual();
  if (sesion) {
    redirect("/inicio");
  }
  return <LoginForm />;
}
