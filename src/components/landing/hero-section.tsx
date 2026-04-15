"use client";

import { useRef, useEffect } from "react";
import { ArrowRight, Sparkles } from "lucide-react";
import gsap from "gsap";
import { TransitionLink } from "@/components/ui/transition-provider";

export function HeroSection() {
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.fromTo(".hero-badge", { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6 })
        .fromTo(".hero-title-line", { y: 60, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, stagger: 0.15 }, "-=0.3")
        .fromTo(".hero-subtitle", { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6 }, "-=0.3")
        .fromTo(".hero-cta", { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, stagger: 0.1 }, "-=0.2")
        .fromTo(".hero-pill", { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.5, stagger: 0.08, ease: "back.out(1.7)" }, "-=0.4");
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={heroRef} className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      {/* Dot pattern overlay */}
      <div className="absolute inset-0 dot-pattern opacity-40" />

      <div className="container-app relative z-10 py-20 sm:py-28">
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
          {/* Badge */}
          <div className="hero-badge inline-flex items-center gap-2 rounded-full glass px-5 py-2 text-sm font-medium text-muted mb-10" style={{ opacity: 0 }}>
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-accent-mint/15">
              <Sparkles className="h-3 w-3 text-accent-mint" />
            </span>
            <span>AI-Powered Healthcare Companion</span>
            <span className="h-1.5 w-1.5 rounded-full bg-accent-mint animate-pulse" />
          </div>

          {/* Title */}
          <h1 className="font-heading tracking-tight">
            <span className="hero-title-line block text-display-lg sm:text-display-xl font-extrabold" style={{ opacity: 0 }}>
              Healthcare guidance
            </span>
            <span className="hero-title-line block text-display-lg sm:text-display-xl font-extrabold mt-1" style={{ opacity: 0 }}>
              <span className="gradient-text from-accent-coral via-accent-coral-light to-accent-coral">anytime </span>
              <span className="gradient-text from-accent-lavender via-accent-lavender-light to-accent-lavender">anywhere</span>
            </span>
          </h1>

          {/* Subtitle */}
          <p className="hero-subtitle mt-8 text-lg sm:text-xl text-muted max-w-2xl leading-relaxed text-balance" style={{ opacity: 0 }}>
            Get AI symptom triage, first aid guides, medicine safety checks,
            and manage your family&apos;s health — all in one app that works offline.
          </p>

          {/* CTAs */}
          <div className="mt-12 flex flex-col sm:flex-row gap-4">
            <TransitionLink href="/symptom-checker" className="hero-cta btn-primary text-base px-8 py-3.5 shadow-glow" style={{ opacity: 0 }}>
              Check Symptoms
              <ArrowRight className="h-4 w-4" />
            </TransitionLink>
            <TransitionLink href="/first-aid" className="hero-cta btn-secondary text-base px-8 py-3.5" style={{ opacity: 0 }}>
              First Aid Guides
            </TransitionLink>
          </div>

          {/* Floating pills */}
          <div className="mt-16 flex flex-wrap items-center justify-center gap-3">
            {pillItems.map((pill) => (
              <div
                key={pill.label}
                className="hero-pill glass rounded-full px-4 py-2 flex items-center gap-2 text-sm font-medium text-muted"
                style={{ opacity: 0 }}
              >
                <span className="h-2 w-2 rounded-full" style={{ backgroundColor: pill.color }} />
                {pill.label}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
}

const pillItems = [
  { label: "Symptom Analysis", color: "#FF6B35" },
  { label: "Offline Ready", color: "#10B981" },
  { label: "Drug Interactions", color: "#8B5CF6" },
  { label: "Family Profiles", color: "#FF6B35" },
  { label: "Emergency Guides", color: "#10B981" },
  { label: "Facility Maps", color: "#8B5CF6" },
];
