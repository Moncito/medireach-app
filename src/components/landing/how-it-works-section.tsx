"use client";

import { Reveal, StaggerReveal } from "@/components/ui/reveal";
import { MessageSquare, Brain, ClipboardCheck } from "lucide-react";

const steps = [
  {
    step: "01",
    icon: MessageSquare,
    title: "Describe Symptoms",
    description: "Tell our AI assistant how you're feeling in your own words — just like talking to a doctor.",
    color: "#FF6B35",
  },
  {
    step: "02",
    icon: Brain,
    title: "AI Analyzes",
    description: "Our Gemini-powered AI evaluates your symptoms, considers risk factors, and assesses urgency.",
    color: "#8B5CF6",
  },
  {
    step: "03",
    icon: ClipboardCheck,
    title: "Get Guidance",
    description: "Receive a clear triage result with recommended next steps — from home care tips to emergency action.",
    color: "#10B981",
  },
];

export function HowItWorksSection() {
  return (
    <section className="relative py-24 sm:py-32">
      {/* Subtle background */}
      <div className="absolute inset-0 dot-pattern opacity-30" />

      <div className="container-app relative z-10">
        <Reveal className="text-center mb-16 sm:mb-20">
          <div className="section-label mx-auto mb-6 w-fit">How It Works</div>
          <h2 className="text-display sm:text-display-lg font-extrabold text-balance">
            Three steps to{" "}
            <span className="gradient-text from-accent-mint to-accent-lavender">
              peace of mind
            </span>
          </h2>
        </Reveal>

        <StaggerReveal
          className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12 max-w-5xl mx-auto"
          stagger={0.15}
        >
          {steps.map((item, i) => (
            <div key={item.step} className="relative flex flex-col items-center text-center group">
              {/* Connecting line (desktop) */}
              {i < steps.length - 1 && (
                <div className="hidden md:block absolute top-10 left-[60%] w-[80%] h-px bg-gradient-to-r from-border to-transparent" />
              )}

              {/* Step number */}
              <div className="relative mb-6">
                <div
                  className="flex h-20 w-20 items-center justify-center rounded-3xl transition-all duration-300 group-hover:scale-110"
                  style={{ backgroundColor: `${item.color}10` }}
                >
                  <item.icon className="h-8 w-8" style={{ color: item.color }} />
                </div>
                <span
                  className="absolute -top-2 -right-2 flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold text-white"
                  style={{ backgroundColor: item.color }}
                >
                  {i + 1}
                </span>
              </div>

              <h3 className="font-heading text-xl font-bold">{item.title}</h3>
              <p className="mt-3 text-sm text-muted leading-relaxed max-w-xs">
                {item.description}
              </p>
            </div>
          ))}
        </StaggerReveal>
      </div>
    </section>
  );
}
