"use client";

import { useState } from "react";
import { useAuth } from "@/features/auth/auth-provider";
import { signOut, getInitials } from "@/lib/firebase/auth";
import { usePageTransition, TransitionLink } from "@/components/ui/transition-provider";
import { cn } from "@/lib/utils";
import {
  Menu,
  X,
  Bell,
  LogOut,
  LayoutDashboard,
  Stethoscope,
  Clock,
  Cross,
  ChevronDown,
} from "lucide-react";

export function DashboardHeader() {
  const { user } = useAuth();
  const { navigateTo } = usePageTransition();
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  async function handleSignOut() {
    try {
      await signOut();
      navigateTo("/");
    } catch {
      // Silently fail — auth state listener will handle UI
    }
  }

  return (
    <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-xl border-b border-border/60">
      <div className="flex items-center justify-between h-16 px-4 lg:px-8">
        {/* Mobile logo + hamburger */}
        <div className="flex items-center gap-3 lg:hidden">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-2 -ml-2 rounded-xl text-muted hover:text-foreground hover:bg-surface transition-colors"
            aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={menuOpen}
          >
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-accent-coral to-accent-coral-light flex items-center justify-center">
              <Cross className="w-3.5 h-3.5 text-white" strokeWidth={3} />
            </div>
            <span className="font-heading font-bold text-base">MediReach</span>
          </div>
        </div>

        {/* Desktop: breadcrumb area */}
        <div className="hidden lg:block" />

        {/* Right section */}
        <div className="flex items-center gap-2">
          {/* Notifications */}
          <button className="relative p-2 rounded-xl text-muted hover:text-foreground hover:bg-surface transition-colors" aria-label="Notifications">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-accent-coral rounded-full" />
          </button>

          {/* Profile dropdown */}
          <div className="relative">
            <button
              onClick={() => setProfileOpen(!profileOpen)}
              className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl hover:bg-surface transition-colors"
              aria-label="Profile menu"
              aria-expanded={profileOpen}
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent-lavender to-accent-lavender-light flex items-center justify-center">
                <span className="text-xs font-bold text-white">
                  {getInitials(user)}
                </span>
              </div>
              <span className="hidden sm:block text-sm font-medium text-foreground max-w-[120px] truncate">
                {user?.displayName || "Guest"}
              </span>
              <ChevronDown
                className={cn(
                  "hidden sm:block w-4 h-4 text-muted transition-transform",
                  profileOpen && "rotate-180"
                )}
              />
            </button>

            {profileOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setProfileOpen(false)}
                />
                <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl shadow-elevated border border-border/60 py-2 z-50">
                  <div className="px-4 py-2 border-b border-border/60">
                    <p className="text-sm font-medium text-foreground truncate">
                      {user?.displayName || "Guest User"}
                    </p>
                    <p className="text-xs text-muted truncate">
                      {user?.email || "Anonymous session"}
                    </p>
                  </div>
                  <div className="py-1">
                    <button
                      onClick={() => {
                        setProfileOpen(false);
                        handleSignOut();
                      }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Mobile nav drawer */}
      {menuOpen && (
        <div className="lg:hidden border-t border-border/60 bg-white/95 backdrop-blur-xl pb-4">
          <nav className="px-4 pt-2 space-y-1">
            <TransitionLink
              href="/dashboard"
              onClick={() => setMenuOpen(false)}
              className="flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium text-foreground hover:bg-surface transition-colors"
            >
              <LayoutDashboard className="w-[18px] h-[18px]" />
              Dashboard
            </TransitionLink>
            <TransitionLink
              href="/symptom-checker"
              onClick={() => setMenuOpen(false)}
              className="flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium text-foreground hover:bg-surface transition-colors"
            >
              <Stethoscope className="w-[18px] h-[18px]" />
              Symptom Checker
            </TransitionLink>
            <TransitionLink
              href="/history"
              onClick={() => setMenuOpen(false)}
              className="flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium text-foreground hover:bg-surface transition-colors"
            >
              <Clock className="w-[18px] h-[18px]" />
              History
            </TransitionLink>
          </nav>
        </div>
      )}
    </header>
  );
}
