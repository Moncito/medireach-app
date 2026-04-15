"use client";

import { type ReactNode } from "react";
import { Heart } from "lucide-react";
import { TransitionLink } from "@/components/ui/transition-provider";

interface AuthLayoutProps {
  children: ReactNode;
  title: string;
  subtitle: string;
}

export function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex mesh-gradient">
      {/* Left decorative panel (desktop) */}
      <div className="hidden lg:flex lg:w-1/2 xl:w-[45%] relative overflow-hidden bg-gradient-to-br from-dark to-dark-surface items-center justify-center p-12">
        {/* Gradient orbs */}
        <div
          className="absolute top-0 right-0 h-96 w-96 rounded-full opacity-20"
          style={{ background: "radial-gradient(circle, #FF6B35, transparent 70%)" }}
        />
        <div
          className="absolute bottom-0 left-0 h-72 w-72 rounded-full opacity-15"
          style={{ background: "radial-gradient(circle, #8B5CF6, transparent 70%)" }}
        />
        <div
          className="absolute top-1/2 left-1/3 h-64 w-64 rounded-full opacity-10"
          style={{ background: "radial-gradient(circle, #10B981, transparent 70%)" }}
        />

        <div className="relative z-10 max-w-md">
          <div className="flex items-center gap-3 mb-8">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent-coral">
              <Heart className="h-5 w-5 text-white" />
            </div>
            <span className="font-heading text-xl font-bold text-white">MediReach</span>
          </div>
          <h2 className="text-display font-extrabold text-white leading-tight">
            Healthcare guidance,{" "}
            <span className="gradient-text from-accent-coral-light to-accent-coral">
              always within reach
            </span>
          </h2>
          <p className="mt-4 text-base text-dark-muted leading-relaxed">
            AI symptom triage, first aid guides, medicine safety — all in one app that works offline.
          </p>
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-10">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <TransitionLink href="/" className="lg:hidden flex items-center gap-2.5 mb-10">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-accent-coral to-accent-coral-light">
              <Heart className="h-4 w-4 text-white" />
            </div>
            <span className="font-heading text-lg font-bold">MediReach</span>
          </TransitionLink>

          <h1 className="font-heading text-heading-lg font-extrabold">{title}</h1>
          <p className="mt-2 text-muted">{subtitle}</p>

          <div className="mt-8">{children}</div>
        </div>
      </div>
    </div>
  );
}
