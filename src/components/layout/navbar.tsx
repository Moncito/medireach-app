"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Heart, Menu, X, Sparkles, LogOut, User } from "lucide-react";
import { useAuth } from "@/features/auth/auth-provider";
import { signOut, getInitials } from "@/lib/firebase/auth";
import { TransitionLink, usePageTransition } from "@/components/ui/transition-provider";

const navLinks = [
  { href: "/symptom-checker", label: "Symptom Checker" },
  { href: "/first-aid", label: "First Aid" },
  { href: "/medicine", label: "Medicine" },
  { href: "/map", label: "Facilities" },
  { href: "/journal", label: "Journal" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { user, loading, isAuthenticated, isGuest } = useAuth();
  const router = useRouter();
  const { navigateTo } = usePageTransition();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  async function handleSignOut() {
    await signOut();
    setShowUserMenu(false);
    navigateTo("/");
  }

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-white/70 backdrop-blur-2xl border-b border-border/50 shadow-soft"
          : "bg-transparent"
      }`}
    >
      <nav className="container-app flex h-16 sm:h-18 items-center justify-between">
        {/* Logo */}
        <TransitionLink href="/" className="flex items-center gap-2.5 group">
          <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-accent-coral to-accent-coral-light shadow-glow/30 transition-transform duration-300 group-hover:scale-110">
            <Heart className="h-4 w-4 text-white" />
          </div>
          <span className="font-heading text-lg font-bold tracking-tight">
            MediReach
          </span>
        </TransitionLink>

        {/* Desktop Nav */}
        <div className="hidden lg:flex items-center gap-0.5 rounded-2xl bg-surface/60 backdrop-blur-sm border border-border/50 px-1.5 py-1">
          {navLinks.map((link) => (
            <TransitionLink
              key={link.href}
              href={link.href}
              className="rounded-xl px-4 py-2 text-sm font-medium text-muted transition-all duration-200 hover:text-foreground hover:bg-white/80"
            >
              {link.label}
            </TransitionLink>
          ))}
        </div>

        {/* Desktop Auth */}
        <div className="hidden lg:flex items-center gap-3">
          {loading ? (
            <div className="h-9 w-20 rounded-xl bg-surface animate-pulse" />
          ) : user ? (
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2.5 rounded-xl px-3 py-2 transition-colors hover:bg-surface"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-accent-coral to-accent-coral-light text-xs font-bold text-white">
                  {isGuest ? <User className="h-3.5 w-3.5" /> : getInitials(user)}
                </div>
                <span className="text-sm font-medium max-w-[120px] truncate">
                  {isGuest ? "Guest" : user.displayName || user.email}
                </span>
              </button>
              {showUserMenu && (
                <div className="absolute right-0 top-full mt-2 w-48 rounded-xl bg-white border border-border/50 shadow-elevated p-1.5 animate-slide-up z-50">
                  {isGuest && (
                    <TransitionLink
                      href="/register"
                      onClick={() => setShowUserMenu(false)}
                      className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm text-foreground hover:bg-surface transition-colors"
                    >
                      <Sparkles className="h-3.5 w-3.5 text-accent-coral" />
                      Create Account
                    </TransitionLink>
                  )}
                  <button
                    onClick={handleSignOut}
                    className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <LogOut className="h-3.5 w-3.5" />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <TransitionLink href="/login" className="btn-ghost text-sm">
                Sign In
              </TransitionLink>
              <TransitionLink href="/register" className="btn-primary text-sm">
                <Sparkles className="h-3.5 w-3.5" />
                Get Started
              </TransitionLink>
            </>
          )}
        </div>

        {/* Mobile Toggle */}
        <button
          onClick={() => setOpen(!open)}
          className="lg:hidden flex items-center justify-center h-10 w-10 rounded-xl transition-colors hover:bg-surface"
          aria-label={open ? "Close menu" : "Open menu"}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      {/* Mobile Menu */}
      {open && (
        <div className="lg:hidden absolute top-full left-0 right-0 bg-white/90 backdrop-blur-2xl border-b border-border/50 shadow-elevated px-5 pb-6 pt-2 animate-slide-up">
          <div className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <TransitionLink
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="rounded-xl px-4 py-3.5 text-base font-medium text-muted transition-colors hover:text-foreground hover:bg-surface"
              >
                {link.label}
              </TransitionLink>
            ))}
            <hr className="my-3 border-border/50" />
            {user ? (
              <>
                <div className="flex items-center gap-3 px-4 py-2 mb-1">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-accent-coral to-accent-coral-light text-xs font-bold text-white">
                    {isGuest ? <User className="h-3.5 w-3.5" /> : getInitials(user)}
                  </div>
                  <span className="text-sm font-medium truncate">
                    {isGuest ? "Guest User" : user.displayName || user.email}
                  </span>
                </div>
                {isGuest && (
                  <TransitionLink href="/register" onClick={() => setOpen(false)} className="btn-primary text-base py-3.5 mt-2">
                    <Sparkles className="h-4 w-4" />
                    Create Account
                  </TransitionLink>
                )}
                <button
                  onClick={() => { handleSignOut(); setOpen(false); }}
                  className="w-full rounded-xl px-4 py-3.5 text-base font-medium text-red-600 hover:bg-red-50 transition-colors text-left mt-1"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <TransitionLink href="/login" onClick={() => setOpen(false)} className="rounded-xl px-4 py-3.5 text-base font-medium text-muted hover:text-foreground hover:bg-surface">
                  Sign In
                </TransitionLink>
                <TransitionLink href="/register" onClick={() => setOpen(false)} className="btn-primary text-base py-3.5 mt-2">
                  <Sparkles className="h-4 w-4" />
                  Get Started
                </TransitionLink>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
