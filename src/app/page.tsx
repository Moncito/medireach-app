import { Heart, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="container-app py-16 sm:py-24">
      {/* Hero Section */}
      <section className="flex flex-col items-center text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 rounded-full bg-accent-mint/10 px-4 py-1.5 text-sm font-medium text-accent-mint mb-8">
          <Heart className="h-4 w-4" />
          <span>AI-Powered Healthcare Companion</span>
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-balance leading-[1.1]">
          Healthcare guidance,{" "}
          <span className="text-accent-coral">anytime</span>{" "}
          <span className="text-accent-lavender">anywhere</span>
        </h1>

        <p className="mt-6 text-lg text-muted max-w-xl leading-relaxed">
          Get AI symptom triage, first aid guides, medicine safety checks, and
          manage your family&apos;s health — all in one app that works offline.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row gap-4">
          <Link href="/symptom-checker" className="btn-primary text-base px-8 py-3">
            Check Symptoms
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link href="/first-aid" className="btn-secondary text-base px-8 py-3">
            First Aid Guides
          </Link>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="mt-24 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature) => (
          <div key={feature.title} className="card group hover:shadow-card transition-shadow">
            <div
              className="inline-flex items-center justify-center h-10 w-10 rounded-xl mb-4"
              style={{ backgroundColor: `${feature.color}15` }}
            >
              <feature.icon className="h-5 w-5" style={{ color: feature.color }} />
            </div>
            <h3 className="font-heading text-lg font-semibold">{feature.title}</h3>
            <p className="mt-2 text-sm text-muted leading-relaxed">
              {feature.description}
            </p>
          </div>
        ))}
      </section>
    </div>
  );
}

import {
  Stethoscope,
  BookOpen,
  Pill,
  MapPin,
  Users,
  Wifi,
} from "lucide-react";

const features = [
  {
    title: "AI Symptom Triage",
    description:
      "Describe your symptoms and get AI-powered guidance on urgency level and next steps.",
    icon: Stethoscope,
    color: "#FF8A5C",
  },
  {
    title: "First Aid Guides",
    description:
      "Step-by-step first aid instructions available offline when you need them most.",
    icon: BookOpen,
    color: "#5CEAA0",
  },
  {
    title: "Medicine Safety",
    description:
      "Check drug interactions, verify dosages, and get child dose calculations.",
    icon: Pill,
    color: "#B8A9FA",
  },
  {
    title: "Facility Finder",
    description:
      "Find nearby hospitals, clinics, and pharmacies on an interactive map.",
    icon: MapPin,
    color: "#FF8A5C",
  },
  {
    title: "Family Journal",
    description:
      "Track health records, growth milestones, and medical history for your family.",
    icon: Users,
    color: "#5CEAA0",
  },
  {
    title: "Works Offline",
    description:
      "Essential features available without internet — designed for areas with limited connectivity.",
    icon: Wifi,
    color: "#B8A9FA",
  },
];
