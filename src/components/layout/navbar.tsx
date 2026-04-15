"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Heart, Menu, X, Sparkles } from "lucide-react";

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

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

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
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-accent-coral to-accent-coral-light shadow-glow/30 transition-transform duration-300 group-hover:scale-110">
            <Heart className="h-4 w-4 text-white" />
          </div>
          <span className="font-heading text-lg font-bold tracking-tight">
            MediReach
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden lg:flex items-center gap-0.5 rounded-2xl bg-surface/60 backdrop-blur-sm border border-border/50 px-1.5 py-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-xl px-4 py-2 text-sm font-medium text-muted transition-all duration-200 hover:text-foreground hover:bg-white/80"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Desktop Auth */}
        <div className="hidden lg:flex items-center gap-3">
          <Link href="/login" className="btn-ghost text-sm">
            Sign In
          </Link>
          <Link href="/register" className="btn-primary text-sm">
            <Sparkles className="h-3.5 w-3.5" />
            Get Started
          </Link>
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
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="rounded-xl px-4 py-3.5 text-base font-medium text-muted transition-colors hover:text-foreground hover:bg-surface"
              >
                {link.label}
              </Link>
            ))}
            <hr className="my-3 border-border/50" />
            <Link href="/login" onClick={() => setOpen(false)} className="rounded-xl px-4 py-3.5 text-base font-medium text-muted hover:text-foreground hover:bg-surface">
              Sign In
            </Link>
            <Link href="/register" onClick={() => setOpen(false)} className="btn-primary text-base py-3.5 mt-2">
              <Sparkles className="h-4 w-4" />
              Get Started
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
