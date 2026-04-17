"use client";

import { notFound } from "next/navigation";
import { TransitionLink } from "@/components/ui/transition-provider";
import {
  getMedicineBySlug,
  MEDICINE_CATEGORIES,
  MEDICINE_DISCLAIMER,
} from "@/data/medicines";
import { cn } from "@/lib/utils";
import {
  ArrowLeft,
  AlertTriangle,
  Shield,
  Info,
  CheckCircle2,
  XCircle,
  Pill,
  Zap,
  BookOpen,
} from "lucide-react";

const typeBadge = {
  otc: { label: "Over-the-Counter", className: "bg-accent-mint/10 text-accent-mint" },
  "common-rx": { label: "Prescription Info", className: "bg-accent-lavender/10 text-accent-lavender" },
};

export default function MedicineDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const med = getMedicineBySlug(params.slug);

  if (!med) {
    return notFound();
  }

  const Icon = med.icon;
  const cat = MEDICINE_CATEGORIES[med.category];
  const badge = typeBadge[med.type];

  return (
    <div className="flex flex-col h-full">
      {/* Sticky header */}
      <div className="border-b border-border/60 bg-gradient-to-r from-accent-lavender/5 to-accent-lavender/[0.02] px-4 lg:px-8 py-4">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-3 mb-3">
            <TransitionLink
              href="/medicine-info"
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
                med.iconBg
              )}
            >
              <Icon className={cn("w-6 h-6", med.iconColor)} />
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="font-heading text-heading-lg text-foreground">
                {med.name}
              </h1>
              <p className="text-sm text-muted mt-0.5">{med.genericName}</p>
              <div className="mt-2 flex items-center gap-2">
                <span
                  className={cn(
                    "inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full",
                    badge.className
                  )}
                >
                  <Pill className="w-3.5 h-3.5" />
                  {badge.label}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-4 lg:px-8 py-6">
        <div className="max-w-3xl mx-auto space-y-8">
          {/* Uses */}
          <section>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-accent-mint/10 flex items-center justify-center">
                <CheckCircle2 className="w-4 h-4 text-accent-mint" />
              </div>
              <h2 className="font-heading font-semibold text-foreground">
                Common Uses
              </h2>
            </div>
            <div className="rounded-xl bg-surface border border-border/60 p-4 space-y-2">
              {med.uses.map((use, i) => (
                <div key={i} className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-accent-mint flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-foreground">{use}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Dosage */}
          <section>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-accent-lavender/10 flex items-center justify-center">
                <BookOpen className="w-4 h-4 text-accent-lavender" />
              </div>
              <h2 className="font-heading font-semibold text-foreground">
                Dosage Guidelines
              </h2>
            </div>
            <div className="rounded-xl bg-surface border border-border/60 p-4 space-y-3">
              <div>
                <p className="text-xs font-semibold text-muted uppercase tracking-wide mb-1">
                  Adults
                </p>
                <p className="text-sm text-foreground">{med.dosage.adults}</p>
              </div>
              {med.dosage.children && (
                <div>
                  <p className="text-xs font-semibold text-muted uppercase tracking-wide mb-1">
                    Children
                  </p>
                  <p className="text-sm text-foreground">{med.dosage.children}</p>
                </div>
              )}
              {med.dosage.notes && (
                <div className="flex items-start gap-2 rounded-lg bg-blue-50 border border-blue-100 px-3 py-2 mt-2">
                  <Info className="w-3.5 h-3.5 text-blue-500 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-blue-800">{med.dosage.notes}</p>
                </div>
              )}
            </div>
          </section>

          {/* Side Effects */}
          <section>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center">
                <AlertTriangle className="w-4 h-4 text-amber-500" />
              </div>
              <h2 className="font-heading font-semibold text-foreground">
                Side Effects
              </h2>
            </div>
            <div className="space-y-3">
              <div className="rounded-xl bg-surface border border-border/60 p-4">
                <p className="text-xs font-semibold text-muted uppercase tracking-wide mb-2">
                  Common
                </p>
                <div className="space-y-1.5">
                  {med.sideEffects.common.map((effect, i) => (
                    <div key={i} className="flex items-start gap-2.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-amber-400 flex-shrink-0 mt-1.5" />
                      <p className="text-sm text-foreground">{effect}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="rounded-xl bg-red-50/50 border border-red-100 p-4">
                <p className="text-xs font-semibold text-red-700 uppercase tracking-wide mb-2">
                  Serious — Seek Medical Attention
                </p>
                <div className="space-y-1.5">
                  {med.sideEffects.serious.map((effect, i) => (
                    <div key={i} className="flex items-start gap-2.5">
                      <AlertTriangle className="w-3.5 h-3.5 text-red-400 flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-red-800">{effect}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Warnings */}
          <section>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center">
                <Shield className="w-4 h-4 text-orange-500" />
              </div>
              <h2 className="font-heading font-semibold text-foreground">
                Warnings
              </h2>
            </div>
            <div className="rounded-xl bg-orange-50/50 border border-orange-100 p-4 space-y-2">
              {med.warnings.map((warning, i) => (
                <div key={i} className="flex items-start gap-2.5">
                  <AlertTriangle className="w-4 h-4 text-orange-500 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-orange-900">{warning}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Drug Interactions */}
          <section>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-accent-coral/10 flex items-center justify-center">
                <Zap className="w-4 h-4 text-accent-coral" />
              </div>
              <h2 className="font-heading font-semibold text-foreground">
                Drug Interactions
              </h2>
            </div>
            <div className="rounded-xl bg-surface border border-border/60 p-4 space-y-2">
              {med.interactions.map((interaction, i) => (
                <div key={i} className="flex items-start gap-2.5">
                  <Zap className="w-3.5 h-3.5 text-accent-coral flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-foreground">{interaction}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Do Not Use If */}
          <section>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center">
                <XCircle className="w-4 h-4 text-red-500" />
              </div>
              <h2 className="font-heading font-semibold text-foreground">
                Do NOT Use If
              </h2>
            </div>
            <div className="rounded-xl bg-red-50/50 border border-red-100 p-4 space-y-2.5">
              {med.doNotUseIf.map((item, i) => (
                <div key={i} className="flex items-start gap-2.5">
                  <XCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-800">{item}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Footer nav */}
          <div className="flex items-center justify-between pt-4 border-t border-border/60">
            <TransitionLink
              href="/medicine-info"
              className="inline-flex items-center gap-2 text-sm text-accent-lavender hover:underline"
            >
              <ArrowLeft className="w-4 h-4" />
              All Medicines
            </TransitionLink>
            <TransitionLink
              href="/symptom-checker"
              className="text-sm font-medium text-accent-coral hover:text-accent-coral/80 transition-colors"
            >
              Need help? Try Symptom Checker →
            </TransitionLink>
          </div>

          {/* Disclaimer */}
          <div className="rounded-2xl bg-surface/80 border border-border/40 p-4 flex items-start gap-3">
            <Shield className="w-5 h-5 text-muted flex-shrink-0 mt-0.5" />
            <p className="text-xs text-muted leading-relaxed">
              <span className="font-semibold">Disclaimer:</span>{" "}
              {MEDICINE_DISCLAIMER}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
