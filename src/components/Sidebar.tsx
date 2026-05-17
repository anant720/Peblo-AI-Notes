"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { useState } from "react";
import { useSidebar } from "./SidebarContext";
import toast from "react-hot-toast";

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = useSession();
  const { isCollapsed, toggle } = useSidebar();
  const [isCreating, setIsCreating] = useState(false);

  const handleCreateNote = async () => {
    setIsCreating(true);
    try {
      const res = await fetch("/api/notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: "Untitled Note", content: "" }),
      });
      if (res.ok) {
        const data = await res.json();
        router.push(`/dashboard/notes/${data.note.id}`);
        toast.success("Note created");
        router.refresh();
      } else {
        toast.error("Failed to create note");
      }
    } catch (e) { 
      console.error(e); 
      toast.error("Failed to create note");
    }
    finally { setIsCreating(false); }
  };

  const mainLinks = [
    { label: "Dashboard",  href: "/dashboard",          icon: "dashboard",   exact: true },
    { label: "All Notes",  href: "/dashboard/notes",    icon: "description", exact: false },
    { label: "Search",     href: "/dashboard/search",   icon: "search",      exact: false },
    { label: "Archived",   href: "/dashboard/archived", icon: "inventory_2", exact: false },
  ];

  const bottomLinks = [
    { label: "Explore",   href: "/explore",            icon: "public",   exact: false },
    { label: "Settings",  href: "/dashboard/settings", icon: "settings", exact: false },
  ];

  const isActive = (href: string, exact: boolean) =>
    exact ? pathname === href : pathname === href || pathname.startsWith(href + "/") || pathname.startsWith(href);

  const NavLink = ({ label, href, icon, exact }: { label: string; href: string; icon: string; exact: boolean }) => {
    const active = isActive(href, exact);
    return (
      <li>
        <Link
          href={href}
          title={isCollapsed ? label : undefined}
          className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-label-md font-medium transition-all duration-200 border-l-2 ${
            isCollapsed ? "justify-center px-2" : ""
          } ${
            active
              ? "bg-primary/10 text-primary border-primary"
              : "text-on-surface-variant hover:bg-surface-container-high border-transparent"
          }`}
        >
          <span
            className="material-symbols-outlined text-[20px] shrink-0"
            style={{ fontVariationSettings: active ? "'FILL' 1" : "'FILL' 0" }}
          >
            {icon}
          </span>
          {!isCollapsed && <span className="truncate">{label}</span>}
        </Link>
      </li>
    );
  };

  const initials = session?.user?.name?.charAt(0).toUpperCase() || "U";

  return (
    <nav
      className={`hidden md:flex bg-surface-container-low border-r border-outline-variant/20 fixed left-0 top-0 h-full flex-col py-5 z-40 transition-all duration-300 ${
        isCollapsed ? "w-[68px] px-2" : "w-sidebar_width px-4"
      }`}
    >
      <div className="flex flex-col flex-1">
        {/* Header row: logo + toggle */}
        <div className={`flex items-center mb-8 ${isCollapsed ? "justify-center" : "justify-between px-2"}`}>
          {!isCollapsed && (
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-on-primary font-bold text-sm shrink-0">P</div>
              <div>
                <h1 className="text-h3 font-bold text-primary leading-none">Peblo Notes</h1>
                <p className="text-body-sm text-on-surface-variant">AI Workspace</p>
              </div>
            </div>
          )}
          <button
            onClick={toggle}
            title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-all"
          >
            <span className="material-symbols-outlined text-[20px]">
              {isCollapsed ? "menu_open" : "menu"}
            </span>
          </button>
        </div>

        {/* New Note Button */}
        <button
          onClick={handleCreateNote}
          disabled={isCreating}
          title={isCollapsed ? "New Note" : undefined}
          className={`mb-6 w-full bg-gradient-to-r from-primary to-inverse-primary text-on-primary font-semibold rounded-xl flex items-center justify-center gap-2 hover:opacity-90 active:scale-95 transition-all duration-200 disabled:opacity-60 ${
            isCollapsed ? "py-2.5 px-0" : "py-2.5 px-4 text-label-md"
          }`}
        >
          <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>add</span>
          {!isCollapsed && (isCreating ? "Creating..." : "New Note")}
        </button>

        {/* Main nav */}
        <ul className="flex flex-col gap-1 flex-1">
          {mainLinks.map((link) => <NavLink key={link.href} {...link} />)}
        </ul>

        {/* Footer nav + user */}
        <div className="border-t border-outline-variant/20 pt-4 flex flex-col gap-1">
          {bottomLinks.map((link) => <NavLink key={link.href} {...link} />)}

          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            title={isCollapsed ? "Sign Out" : undefined}
            className={`flex items-center gap-3 py-2.5 rounded-lg text-label-md text-on-surface-variant hover:text-error hover:bg-error-container/20 transition-all duration-200 border-l-2 border-transparent w-full mt-1 ${
              isCollapsed ? "justify-center px-2" : "px-3"
            }`}
          >
            <span className="material-symbols-outlined text-[20px]">logout</span>
            {!isCollapsed && "Sign Out"}
          </button>

          {/* User profile */}
          {!isCollapsed ? (
            <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-surface-container-highest/30 mt-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary to-secondary flex items-center justify-center text-on-primary font-bold text-sm shrink-0">
                {initials}
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-label-md text-on-surface truncate">{session?.user?.name}</span>
                <span className="text-body-sm text-on-surface-variant truncate">{session?.user?.email}</span>
              </div>
            </div>
          ) : (
            <div
              title={session?.user?.name || "Profile"}
              className="w-8 h-8 mx-auto mt-2 rounded-full bg-gradient-to-tr from-primary to-secondary flex items-center justify-center text-on-primary font-bold text-sm cursor-default"
            >
              {initials}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
