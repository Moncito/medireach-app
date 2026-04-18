import { Shield, AlertTriangle, Heart, Scale } from "lucide-react";
import { TransitionLink } from "@/components/ui/transition-provider";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Disclaimer — MediReach",
  description:
    "Important medical disclaimer and terms of use for MediReach.",
};

const sections = [
  {
    icon: AlertTriangle,
    color: "#FF6B35",
    title: "Not Medical Advice",
    content:
      "MediReach is an informational tool only. The content provided — including AI-generated symptom assessments, first aid guides, and medicine information — is for general educational purposes and does not constitute professional medical advice, diagnosis, or treatment. Always seek the advice of a qualified healthcare provider with any questions you may have regarding a medical condition.",
  },
  {
    icon: Shield,
    color: "#8B5CF6",
    title: "AI Limitations",
    content:
      "Our AI features are powered by large language models and may produce inaccurate, incomplete, or outdated information. AI-generated triage results are not a substitute for clinical evaluation. Never delay seeking emergency care based on information from this app. If you are experiencing a medical emergency, call your local emergency number immediately.",
  },
  {
    icon: Heart,
    color: "#10B981",
    title: "User Responsibility",
    content:
      "By using MediReach, you acknowledge that you are responsible for your own health decisions. The app is designed to supplement — not replace — the relationship between you and your healthcare provider. Medicine dosage information, drug interaction checks, and first aid instructions should always be verified with a medical professional before acting on them.",
  },
  {
    icon: Scale,
    color: "#FF6B35",
    title: "Data & Privacy",
    content:
      "MediReach stores your conversation history and health journal entries in your personal Firebase account. Your data is not shared with third parties. Symptom descriptions and medicine queries are sent to Google's Gemini API for processing but are not stored by Google beyond the request lifecycle. You can delete your account and all associated data at any time from Settings.",
  },
];

export default function DisclaimerPage() {
  return (
    <section className="py-20 sm:py-28">
      <div className="container-narrow">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="section-label mx-auto mb-6 w-fit">Legal</div>
          <h1 className="text-display sm:text-display-lg font-extrabold text-balance">
            Medical{" "}
            <span className="gradient-text from-accent-coral to-accent-lavender">
              Disclaimer
            </span>
          </h1>
          <p className="mt-5 text-lg text-muted max-w-2xl mx-auto leading-relaxed">
            Please read this information carefully before using MediReach.
          </p>
        </div>

        {/* Sections */}
        <div className="space-y-6">
          {sections.map((section) => (
            <div
              key={section.title}
              className="rounded-3xl bg-white/70 backdrop-blur-sm border border-white/60 shadow-soft p-8 sm:p-10"
            >
              <div className="flex items-start gap-4">
                <div
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl"
                  style={{ backgroundColor: `${section.color}10` }}
                >
                  <section.icon
                    className="h-5 w-5"
                    style={{ color: section.color }}
                  />
                </div>
                <div>
                  <h2 className="font-heading text-xl font-bold text-foreground mb-3">
                    {section.title}
                  </h2>
                  <p className="text-muted leading-relaxed">{section.content}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Emergency note */}
        <div className="mt-12 rounded-3xl bg-gradient-to-br from-red-50 to-orange-50 border border-red-100/60 p-8 sm:p-10 text-center">
          <AlertTriangle className="h-8 w-8 text-red-500 mx-auto mb-4" />
          <h3 className="font-heading text-lg font-bold text-foreground mb-2">
            In an Emergency
          </h3>
          <p className="text-muted max-w-lg mx-auto">
            If you or someone else is experiencing a medical emergency, call your
            local emergency services immediately. Do not rely on this app for
            emergency medical decisions.
          </p>
        </div>

        {/* Back link */}
        <div className="mt-12 text-center">
          <TransitionLink
            href="/"
            className="text-sm text-muted hover:text-foreground transition-colors underline underline-offset-2"
          >
            ← Back to Home
          </TransitionLink>
        </div>
      </div>
    </section>
  );
}
