import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { Sidebar } from "@/components/Sidebar";
import { SidebarProvider } from "@/components/SidebarContext";
import { DashboardMain } from "@/components/DashboardMain";

export default async function ExploreLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);
  const isLoggedIn = !!session?.user;

  if (!isLoggedIn) {
    return <>{children}</>;
  }

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full bg-background overflow-hidden">
        <Sidebar />
        <DashboardMain>{children}</DashboardMain>
      </div>
    </SidebarProvider>
  );
}
