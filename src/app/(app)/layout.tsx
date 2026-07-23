import { redirect } from "next/navigation";
import { getSesionActual } from "@/lib/session";
import { Sidebar } from "@/components/nav/Sidebar";
import { TabBar } from "@/components/nav/TabBar";

export const dynamic = "force-dynamic";

// JOS-60/61: gate de autenticación para toda la app — sin middleware.ts, el
// mismo patrón Server-Component-que-ya-usa-fetchQuery que el resto del repo.
export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const sesion = await getSesionActual();
  if (!sesion) {
    redirect("/");
  }

  return (
    <div className="flex min-h-screen bg-bg-app">
      <Sidebar />
      <main className="flex-1 pb-14 md:pb-0">{children}</main>
      <TabBar />
    </div>
  );
}
