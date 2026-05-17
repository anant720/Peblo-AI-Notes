"use client";

import { useSidebar } from "./SidebarContext";

export function DashboardMain({ children }: { children: React.ReactNode }) {
  const { isCollapsed } = useSidebar();

  return (
    <main
      className={`flex-1 h-full overflow-y-auto custom-scrollbar bg-background transition-all duration-300 ${
        isCollapsed ? "md:ml-[68px]" : "md:ml-sidebar_width"
      }`}
    >
      {children}
    </main>
  );
}
