"use client";

import { StaggerReveal, Reveal } from "@/components/ui/reveal";
import {
  Stethoscope,
  BookOpen,
  Pill,
  MapPin,
  Users,
  Wifi,
  ArrowUpRight,
} from "lucide-react";
import Link from "next/link";

const features = [
  {
    title: "AI Symptom Triage",
    description:
      "Describe your symptoms naturally — our AI analyzes urgency levels and recommends next steps instantly.",
    icon: Stethoscope,
    color: "#FF6B35",
    gradient: "from-orange-50 to-red-50",
    href: "/symptom-checker",
    span: "lg:col-span-2 lg:row-span-2",
    size: "large",
  },
  {
    title: "First Aid Guides",
    description: "Step-by-step emergency instructions, available offline.",
    icon: BookOpen,
    color: "#10B981",
    gradient: "from-emerald-50 to-teal-50",
    href: "/first-aid",
    span: "lg:col-span-1",
    size: "small",
  },
  {
    title: "Medicine Safety",
    description: "Check drug interactions and child dosages.",
    icon: Pill,
    color: "#8B5CF6",
    gradient: "from-violet-50 to-purple-50",
    href: "/medicine-info",
    span: "lg:col-span-1",
    size: "small",
  },
  {
    title: "Facility Finder",
    description: "Locate hospitals, clinics, and pharmacies near you on an interactive map.",
    icon: MapPin,
    color: "#FF6B35",
    gradient: "from-orange-50 to-amber-50",
    href: "/facilities",
    span: "lg:col-span-1",
    size: "medium",
  },
  {
    title: "Family Journal",
    description: "Track health records, growth milestones, and medical history for everyone.",
    icon: Users,
    color: "#10B981",
    gradient: "from-emerald-50 to-cyan-50",
    href: "/journal",
    span: "lg:col-span-1",
    size: "medium",
  },
  {
    title: "Works Offline",
    description: "Critical features available without internet — built for areas with limited connectivity.",
    icon: Wifi,
    color: "#8B5CF6",
    gradient: "from-violet-50 to-indigo-50",
    href: "#",
    span: "lg:col-span-1",
    size: "medium",
  },
];

export function FeaturesSection() {
  return (
    <section className="relative py-24 sm:py-32">
      <div className="container-app">
        {/* Section header */}
        <Reveal className="text-center mb-16 sm:mb-20">
          <div className="section-label mx-auto mb-6 w-fit">Features</div>
          <h2 className="text-display sm:text-display-lg font-extrabold text-balance">
            Everything you need,{" "}
            <span className="gradient-text from-accent-coral to-accent-lavender">
              one pocket away
            </span>
          </h2>
          <p className="mt-5 text-lg text-muted max-w-2xl mx-auto leading-relaxed">
            From AI-powered diagnostics to offline emergency guides — MediReach puts healthcare
            guidance in your hands no matter where you are.
          </p>
        </Reveal>

        {/* Bento grid */}
        <StaggerReveal
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
          stagger={0.08}
        >
          {features.map((feature) => (
            <Link
              key={feature.title}
              href={feature.href}
              className={`group relative overflow-hidden rounded-3xl border border-white/60 bg-gradient-to-br ${feature.gradient} p-7 sm:p-8 transition-all duration-500 hover:shadow-elevated hover:-translate-y-1 ${feature.span}`}
            >
              {/* Hover glow */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl"
                style={{
                  background: `radial-gradient(circle at 50% 50%, ${feature.color}08, transparent 70%)`,
                }}
              />

              <div className="relative z-10 flex flex-col h-full">
                {/* Icon + arrow */}
                <div className="flex items-start justify-between mb-auto">
                  <div
                    className="flex h-12 w-12 items-center justify-center rounded-2xl transition-transform duration-300 group-hover:scale-110"
                    style={{ backgroundColor: `${feature.color}15` }}
                  >
                    <feature.icon className="h-5 w-5" style={{ color: feature.color }} />
                  </div>
                  <ArrowUpRight
                    className="h-5 w-5 text-muted-light opacity-0 -translate-y-1 translate-x-1 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0"
                  />
                </div>

                <div className={feature.size === "large" ? "mt-auto pt-16 sm:pt-24" : "mt-6"}>
                  <h3 className="font-heading text-xl font-bold text-foreground">
                    {feature.title}
                  </h3>
                  <p className={`mt-2.5 leading-relaxed text-muted ${feature.size === "large" ? "text-base max-w-md" : "text-sm"}`}>
                    {feature.description}
                  </p>
                </div>
              </div>

              {/* Large card decoration */}
              {feature.size === "large" && (
                <div className="absolute top-8 right-8 opacity-[0.04]">
                  <feature.icon className="h-48 w-48" />
                </div>
              )}
            </Link>
          ))}
        </StaggerReveal>
      </div>
    </section>
  );
}
