"use client";

import { useParams, notFound } from "next/navigation";
import { TransitionLink } from "@/components/ui/transition-provider";
import { getGuideBySlug, CATEGORIES } from "@/data/first-aid-guides";
import { cn } from "@/lib/utils";
import {
  ArrowLeft,
  AlertTriangle,
  Shield,
  Info,
  Phone,
  CheckCircle2,
  XCircle,
  Package,
} from "lucide-react";

const severityConfig = {
  info: {
    label: "General Information",
    icon: Info,
    headerBg: "from-blue-50 to-blue-50/30",
    iconBg: "bg-blue-100",
    iconColor: "text-blue-600",
  },
  warning: {
    label: "Use Caution",
    icon: Shield,
    headerBg: "from-amber-50 to-amber-50/30",
    iconBg: "bg-amber-100",
    iconColor: "text-amber-600",
  },
  critical: {
    label: "Life-Threatening — Act Fast",
    icon: AlertTriangle,
    headerBg: "from-red-50 to-red-50/30",
    iconBg: "bg-red-100",
    iconColor: "text-red-600",
  },
};

export default function FirstAidGuidePage() {
  const { slug } = useParams<{ slug: string }>();
  const guide = slug ? getGuideBySlug(slug) : null;

  if (!guide) {
    return notFound();
  }

  const Icon = guide.icon;
  const sev = severityConfig[guide.severity];
  const SevIcon = sev.icon;
  const cat = CATEGORIES[guide.category];

  return (
    <div className="flex flex-col h-full">
      {/* Sticky header */}
      <div
        className={cn(
          "border-b border-border/60 bg-gradient-to-r px-4 lg:px-8 py-4",
          sev.headerBg
        )}
      >
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-3 mb-3">
            <TransitionLink
              href="/first-aid"
              className="p-2 -ml-2 rounded-xl text-muted hover:text-foreground hover:bg-white/60 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
            </TransitionLink>
            <span
              className={cn(
                "text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full",
                cat.color
              )}
            >
              {cat.label}
            </span>
          </div>
          <div className="flex items-start gap-4">
            <div
              className={cn(
                "w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0",
                guide.iconBg
              )}
            >
              <Icon className={cn("w-6 h-6", guide.iconColor)} />
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="font-heading text-heading-lg text-foreground">
                {guide.title}
              </h1>
              <p className="text-sm text-muted mt-0.5">
                {guide.shortDescription}
              </p>
              <div className="mt-2">
                <span
                  className={cn(
                    "inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full",
                    sev.iconBg,
                    sev.iconColor
                  )}
                >
                  <SevIcon className="w-3.5 h-3.5" />
                  {sev.label}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-4 lg:px-8 py-6">
        <div className="max-w-3xl mx-auto space-y-8">
          {/* When to Call 911 */}
          <section>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center">
                <Phone className="w-4 h-4 text-red-500" />
              </div>
              <h2 className="font-heading font-semibold text-foreground">
                When to Call Emergency Services
              </h2>
            </div>
            <div className="rounded-xl bg-red-50/50 border border-red-100 p-4 space-y-2">
              {guide.whenToCall911.map((item, i) => (
                <div key={i} className="flex items-start gap-2.5">
                  <AlertTriangle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-800">{item}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Step-by-Step Instructions */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-accent-mint/10 flex items-center justify-center">
                <CheckCircle2 className="w-4 h-4 text-accent-mint" />
              </div>
              <h2 className="font-heading font-semibold text-foreground">
                Step-by-Step Instructions
              </h2>
            </div>
            <div className="space-y-4">
              {guide.steps.map((step, i) => (
                <div key={i} className="flex gap-4">
                  {/* Step number */}
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 rounded-full bg-accent-coral/10 flex items-center justify-center">
                      <span className="text-sm font-bold text-accent-coral">
                        {i + 1}
                      </span>
                    </div>
                    {i < guide.steps.length - 1 && (
                      <div className="w-px h-full bg-border/60 mx-auto mt-1" />
                    )}
                  </div>

                  {/* Step content */}
                  <div className="flex-1 pb-4">
                    <p className="text-sm text-foreground leading-relaxed">
                      {step.instruction}
                    </p>
                    {step.warning && (
                      <div className="mt-2 flex items-start gap-2 rounded-lg bg-amber-50 border border-amber-100 px-3 py-2">
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-500 flex-shrink-0 mt-0.5" />
                        <p className="text-xs text-amber-800">
                          {step.warning}
                        </p>
                      </div>
                    )}
                    {step.tip && (
                      <div className="mt-2 flex items-start gap-2 rounded-lg bg-blue-50 border border-blue-100 px-3 py-2">
                        <Info className="w-3.5 h-3.5 text-blue-500 flex-shrink-0 mt-0.5" />
                        <p className="text-xs text-blue-800">{step.tip}</p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Do NOT Section */}
          <section>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center">
                <XCircle className="w-4 h-4 text-red-500" />
              </div>
              <h2 className="font-heading font-semibold text-foreground">
                What NOT to Do
              </h2>
            </div>
            <div className="rounded-xl bg-surface border border-border/60 p-4 space-y-2.5">
              {guide.doNot.map((item, i) => (
                <div key={i} className="flex items-start gap-2.5">
                  <XCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-foreground">{item}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Supplies needed */}
          {guide.supplies && guide.supplies.length > 0 && (
            <section>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-lg bg-accent-lavender/10 flex items-center justify-center">
                  <Package className="w-4 h-4 text-accent-lavender" />
                </div>
                <h2 className="font-heading font-semibold text-foreground">
                  Supplies You May Need
                </h2>
              </div>
              <div className="flex flex-wrap gap-2">
                {guide.supplies.map((item, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-accent-lavender/5 border border-accent-lavender/20 text-sm text-foreground"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-accent-lavender" />
                    {item}
                  </span>
                ))}
              </div>
            </section>
          )}

          {/* Footer nav */}
          <div className="flex items-center justify-between pt-4 border-t border-border/60">
            <TransitionLink
              href="/first-aid"
              className="inline-flex items-center gap-2 text-sm text-accent-coral hover:underline"
            >
              <ArrowLeft className="w-4 h-4" />
              All Guides
            </TransitionLink>
            <TransitionLink
              href="/symptom-checker"
              className="text-sm font-medium text-accent-coral hover:text-accent-coral/80 transition-colors"
            >
              Need more help? Try Symptom Checker →
            </TransitionLink>
          </div>

          {/* Disclaimer */}
          <div className="rounded-2xl bg-surface/80 border border-border/40 p-4 flex items-start gap-3">
            <Shield className="w-5 h-5 text-muted flex-shrink-0 mt-0.5" />
            <p className="text-xs text-muted leading-relaxed">
              <span className="font-semibold">Disclaimer:</span> This guide
              provides general first aid information only. It is not a substitute
              for professional medical training. In a serious emergency, always
              call your local emergency number first.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
