import { Sidebar } from "@/components/layout/Sidebar";
import { TopNav } from "@/components/layout/TopNav";
import { BottomNav } from "@/components/layout/BottomNav";

/**
 * Shell de las pantallas autenticadas (P1-P3, P6, P7, P9, P10). El
 * middleware (src/middleware.ts) ya garantiza que solo se llega aquí con
 * sesión. P4/P5/F9 no son rutas propias — son overlays (bottom sheet en
 * móvil, modal en escritorio) sobre estas pantallas, ver PRD sección 8.
 */
export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen w-full">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <TopNav />
        <main className="flex-1 pb-[76px] md:pb-0">{children}</main>
      </div>
      <BottomNav />
    </div>
  );
}
