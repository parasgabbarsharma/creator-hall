"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  DashboardIcon,
  GlobeIcon,
  LogoutIcon,
  PlayIcon,
} from "@/components/ui/icons";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: DashboardIcon },
  { href: "/", label: "Public Site", icon: GlobeIcon },
];

export function SideNavBar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await fetch("/api/admin/logout", { method: "POST" });
    } catch {
      // Best-effort logout
    }
    router.push("/admin");
    router.refresh();
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <nav className="hidden md:flex bg-white border-r border-border h-screen w-64 fixed left-0 top-0 flex-col p-4 z-40">
        <div className="flex items-center gap-3 mb-8 px-2 mt-4">
          <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center text-white shrink-0 shadow-sm">
            <PlayIcon size={16} className="ml-0.5" />
          </div>
          <div>
            <h1 className="text-[19px] font-heading font-bold text-foreground tracking-tight">
              CreatorHall
            </h1>
            <p className="text-[11px] text-muted font-medium tracking-wide uppercase">Studio</p>
          </div>
        </div>

        <div className="flex flex-col gap-1 flex-grow">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-[15px] transition-colors",
                  isActive
                    ? "bg-accent/10 text-accent"
                    : "text-muted hover:bg-surface hover:text-foreground"
                )}
              >
                <Icon size={18} className={isActive ? "text-accent" : ""} />
                {item.label}
              </Link>
            );
          })}
        </div>

        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-[15px] text-muted hover:bg-destructive/10 hover:text-destructive transition-colors mt-auto"
        >
          <LogoutIcon size={20} />
          Logout
        </button>
      </nav>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-border z-50 px-6 py-3 flex justify-between items-center">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center gap-1 p-2 rounded-lg transition-colors",
                isActive
                  ? "text-accent"
                  : "text-muted hover:text-foreground"
              )}
            >
              <Icon size={22} />
              <span className="text-[10px] font-semibold">{item.label}</span>
            </Link>
          );
        })}
        <button
          onClick={handleLogout}
          className="flex flex-col items-center gap-1 p-2 rounded-lg text-muted hover:text-accent transition-colors"
        >
          <LogoutIcon size={22} />
          <span className="text-[10px] font-semibold">Logout</span>
        </button>
      </nav>
    </>
  );
}
