"use client";

import { useState } from "react";
import Link from "next/link";
import { Heart, Menu, X } from "lucide-react";

const navLinks = [
  { href: "/symptom-checker", label: "Symptom Checker" },
  { href: "/first-aid", label: "First Aid" },
  { href: "/medicine", label: "Medicine" },
  { href: "/map", label: "Facilities" },
  { href: "/journal", label: "Journal" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
      <nav className="container-app flex h-16 items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 font-heading text-xl font-bold">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent-coral">
            <Heart className="h-4 w-4 text-white" />
          </div>
          MediReach
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className="btn-ghost text-sm">
              {link.label}
            </Link>
          ))}
        </div>

        {/* Desktop Auth */}
        <div className="hidden md:flex items-center gap-3">
          <Link href="/login" className="btn-ghost text-sm">
            Sign In
          </Link>
          <Link href="/register" className="btn-primary text-sm">
            Get Started
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden btn-ghost p-2"
          aria-label={open ? "Close menu" : "Open menu"}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden border-t border-border bg-background px-4 pb-4 pt-2">
          <div className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="btn-ghost justify-start text-base py-3"
              >
                {link.label}
              </Link>
            ))}
            <hr className="my-2 border-border" />
            <Link href="/login" onClick={() => setOpen(false)} className="btn-ghost justify-start text-base py-3">
              Sign In
            </Link>
            <Link href="/register" onClick={() => setOpen(false)} className="btn-primary text-base py-3 mt-1">
              Get Started
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
