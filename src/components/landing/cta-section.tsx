"use client";

import { Reveal } from "@/components/ui/reveal";
import { ArrowRight, Heart } from "lucide-react";
import { TransitionLink } from "@/components/ui/transition-provider";

export function CTASection() {
  return (
    <section className="relative py-24 sm:py-32 overflow-hidden">
      <div className="container-app relative z-10">
        <Reveal>
          <div className="relative rounded-[2.5rem] overflow-hidden bg-gradient-to-br from-dark to-dark-surface p-10 sm:p-16 lg:p-20">
            {/* Gradient orbs inside */}
            <div className="absolute top-0 right-0 h-80 w-80 rounded-full opacity-20" style={{ background: "radial-gradient(circle, #FF6B35, transparent 70%)" }} />
            <div className="absolute bottom-0 left-0 h-60 w-60 rounded-full opacity-15" style={{ background: "radial-gradient(circle, #8B5CF6, transparent 70%)" }} />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-96 w-96 rounded-full opacity-10" style={{ background: "radial-gradient(circle, #10B981, transparent 70%)" }} />

            <div className="relative z-10 flex flex-col items-center text-center max-w-2xl mx-auto">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-sm mb-8">
                <Heart className="h-6 w-6 text-accent-coral" />
              </div>

              <h2 className="text-display sm:text-display-lg font-extrabold text-white text-balance">
                Your health companion,{" "}
                <span className="gradient-text from-accent-coral-light to-accent-coral">
                  always ready
                </span>
              </h2>

              <p className="mt-6 text-lg text-dark-muted leading-relaxed max-w-xl">
                Join thousands of families who trust MediReach for everyday health guidance.
                Free, private, and works offline.
              </p>

              <div className="mt-10 flex flex-col sm:flex-row gap-4">
                <TransitionLink
                  href="/register"
                  className="inline-flex items-center justify-center gap-2.5 rounded-2xl bg-white px-8 py-3.5 text-base font-semibold text-dark transition-all duration-300 hover:shadow-elevated hover:scale-[1.02] active:scale-[0.98]"
                >
                  Start For Free
                  <ArrowRight className="h-4 w-4" />
                </TransitionLink>
                <TransitionLink
                  href="/symptom-checker"
                  className="inline-flex items-center justify-center gap-2.5 rounded-2xl border border-white/20 px-8 py-3.5 text-base font-semibold text-white/90 transition-all duration-300 hover:bg-white/10 active:scale-[0.98]"
                >
                  Try Symptom Checker
                </TransitionLink>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
