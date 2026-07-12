import { Sidebar } from "@/components/nav/Sidebar";
import { TabBar } from "@/components/nav/TabBar";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-bg-app">
      <Sidebar />
      <main className="flex-1 pb-14 md:pb-0">{children}</main>
      <TabBar />
    </div>
  );
}
