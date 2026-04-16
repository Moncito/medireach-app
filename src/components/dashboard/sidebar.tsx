"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { TransitionLink } from "@/components/ui/transition-provider";
import { useAuth } from "@/features/auth/auth-provider";
import { getInitials } from "@/lib/firebase/auth";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Stethoscope,
  Cross,
  Pill,
  Clock,
  Settings,
  ChevronLeft,
  ChevronRight,
  Lock,
} from "lucide-react";

const navItems = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
    active: true,
  },
  {
    label: "Symptom Checker",
    href: "/symptom-checker",
    icon: Stethoscope,
    active: true,
  },
  {
    label: "First Aid Guide",
    href: "/first-aid",
    icon: Cross,
    active: true,
  },
  {
    label: "Medicine Info",
    href: "#",
    icon: Pill,
    active: false,
    badge: "Soon",
  },
  {
    label: "History",
    href: "/history",
    icon: Clock,
    active: true,
  },
  {
    label: "Settings",
    href: "#",
    icon: Settings,
    active: false,
    badge: "Soon",
  },
];

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();
  const { user } = useAuth();

  return (
    <aside
      className={cn(
        "hidden lg:flex flex-col h-screen sticky top-0 bg-dark text-white transition-all duration-300 ease-out z-40",
        collapsed ? "w-[72px]" : "w-[260px]"
      )}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 h-16 border-b border-white/[0.06]">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent-coral to-accent-coral-light flex items-center justify-center flex-shrink-0">
          <Cross className="w-4 h-4 text-white" strokeWidth={3} />
        </div>
        {!collapsed && (
          <span className="font-heading font-bold text-lg tracking-tight">
            MediReach
          </span>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = item.active && (pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href + '/')));
          const Icon = item.icon;

          if (!item.active) {
            return (
              <div
                key={item.label}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-white/30 cursor-not-allowed",
                  collapsed && "justify-center px-0"
                )}
                title={collapsed ? item.label : undefined}
              >
                <Lock className="w-[18px] h-[18px] flex-shrink-0" />
                {!collapsed && (
                  <>
                    <span className="flex-1">{item.label}</span>
                    {item.badge && (
                      <span className="text-[10px] font-medium tracking-wider uppercase bg-white/[0.06] text-white/30 px-2 py-0.5 rounded-full">
                        {item.badge}
                      </span>
                    )}
                  </>
                )}
              </div>
            );
          }

          return (
            <TransitionLink
              key={item.label}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-accent-coral/10 text-accent-coral"
                  : "text-white/60 hover:text-white hover:bg-white/[0.04]",
                collapsed && "justify-center px-0"
              )}
              title={collapsed ? item.label : undefined}
            >
              <Icon className="w-[18px] h-[18px] flex-shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </TransitionLink>
          );
        })}
      </nav>

      {/* User section */}
      <div className="border-t border-white/[0.06] p-3">
        <div
          className={cn(
            "flex items-center gap-3 rounded-xl px-3 py-2.5",
            collapsed && "justify-center px-0"
          )}
        >
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent-lavender to-accent-lavender-light flex items-center justify-center flex-shrink-0">
            <span className="text-xs font-bold text-white">
              {getInitials(user)}
            </span>
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white/90 truncate">
                {user?.displayName || "Guest User"}
              </p>
              <p className="text-xs text-white/40 truncate">
                {user?.email || "Anonymous"}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Collapse button */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-20 w-6 h-6 rounded-full bg-dark-surface border border-white/10 flex items-center justify-center text-white/50 hover:text-white hover:border-white/20 transition-colors"
        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        aria-expanded={!collapsed}
      >
        {collapsed ? (
          <ChevronRight className="w-3 h-3" />
        ) : (
          <ChevronLeft className="w-3 h-3" />
        )}
      </button>
    </aside>
  );
}
