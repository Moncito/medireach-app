"use client";

import { useState, useMemo } from "react";
import { TransitionLink } from "@/components/ui/transition-provider";
import {
  MEDICINES,
  MEDICINE_CATEGORIES,
  MEDICINE_DISCLAIMER,
  type MedicineCategory,
} from "@/data/medicines";
import { MedicineChat } from "@/features/medicine/medicine-chat";
import { cn } from "@/lib/utils";
import {
  Search,
  ChevronRight,
  Shield,
  Filter,
  Sparkles,
  BookOpen,
  Pill,
  AlertTriangle,
} from "lucide-react";

const typeBadge = {
  otc: { label: "OTC", className: "bg-accent-mint/10 text-accent-mint" },
  "common-rx": { label: "Rx Info", className: "bg-accent-lavender/10 text-accent-lavender" },
};

export default function MedicineInfoPage() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<MedicineCategory | "all">("all");
  const [activeTab, setActiveTab] = useState<"browse" | "ask-ai">("browse");

  const filtered = useMemo(() => {
    let meds = MEDICINES;

    if (activeCategory !== "all") {
      meds = meds.filter((m) => m.category === activeCategory);
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      meds = meds.filter(
        (m) =>
          m.name.toLowerCase().includes(q) ||
          m.genericName.toLowerCase().includes(q) ||
          m.shortDescription.toLowerCase().includes(q) ||
          m.category.toLowerCase().includes(q)
      );
    }

    return meds;
  }, [search, activeCategory]);

  return (
    <div className="p-4 lg:p-8 max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-heading text-heading-lg lg:text-display text-foreground">
          Medicine Info
        </h1>
        <p className="text-muted text-sm mt-1 max-w-xl">
          Look up common medications — dosages, side effects, warnings, and
          interactions. Available offline.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setActiveTab("browse")}
          className={cn(
            "flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors",
            activeTab === "browse"
              ? "bg-dark text-white"
              : "bg-surface text-muted hover:text-foreground"
          )}
        >
          <BookOpen className="w-4 h-4" />
          Browse Medicines
        </button>
        <button
          onClick={() => setActiveTab("ask-ai")}
          className={cn(
            "flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors",
            activeTab === "ask-ai"
              ? "bg-dark text-white"
              : "bg-surface text-muted hover:text-foreground"
          )}
        >
          <Sparkles className="w-4 h-4" />
          Ask AI
        </button>
      </div>

      {/* AI Tab */}
      <div className={activeTab === "ask-ai" ? "" : "hidden"}>
        <MedicineChat />
        <div className="rounded-2xl bg-surface/80 border border-border/40 p-4 flex items-start gap-3">
          <Shield className="w-5 h-5 text-muted flex-shrink-0 mt-0.5" />
          <p className="text-xs text-muted leading-relaxed">
            <span className="font-semibold">Disclaimer:</span> AI-generated
            medicine information is for educational purposes only. Always
            consult a pharmacist or healthcare provider before starting,
            stopping, or changing any medication.
          </p>
        </div>
      </div>

      {/* Browse Tab */}
      <div className={activeTab === "browse" ? "" : "hidden"}>
        {/* Safety Banner */}
        <div className="rounded-2xl bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200/50 p-4 mb-6">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-4 h-4 text-amber-500" />
            <h2 className="text-sm font-semibold text-amber-700">
              Important Safety Notice
            </h2>
          </div>
          <p className="text-xs text-amber-800 leading-relaxed">
            Never start, stop, or change a medication without consulting your
            healthcare provider. Dosages listed are general guidelines — your
            doctor may prescribe differently based on your individual needs.
          </p>
        </div>

        {/* Search + Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search medicines (ibuprofen, vitamin D, allergy...)"
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border/60 bg-white text-sm text-foreground placeholder:text-muted-light outline-none focus:border-accent-lavender/50 focus:ring-2 focus:ring-accent-lavender/10 transition-all"
            />
          </div>
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
            <Filter className="w-4 h-4 text-muted flex-shrink-0 hidden sm:block" />
            <button
              onClick={() => setActiveCategory("all")}
              className={cn(
                "px-3.5 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-colors",
                activeCategory === "all"
                  ? "bg-dark text-white"
                  : "bg-surface text-muted hover:text-foreground"
              )}
            >
              All
            </button>
            {(
              Object.entries(MEDICINE_CATEGORIES) as [
                MedicineCategory,
                { label: string; color: string },
              ][]
            ).map(([key, cat]) => (
              <button
                key={key}
                onClick={() => setActiveCategory(key)}
                className={cn(
                  "px-3.5 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-colors",
                  activeCategory === key
                    ? "bg-dark text-white"
                    : "bg-surface text-muted hover:text-foreground"
                )}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Medicine Grid */}
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <Search className="w-10 h-10 text-muted/30 mb-3" />
            <p className="text-sm text-muted">
              No medicines found
              {search.trim() ? (
                <>
                  {" "}
                  for &ldquo;{search}&rdquo;
                </>
              ) : (
                ""
              )}
              {activeCategory !== "all" &&
                ` in ${MEDICINE_CATEGORIES[activeCategory].label}`}
            </p>
            <button
              onClick={() => {
                setSearch("");
                setActiveCategory("all");
              }}
              className="mt-3 text-sm text-accent-coral hover:underline"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((med) => {
              const Icon = med.icon;
              const badge = typeBadge[med.type];
              const cat = MEDICINE_CATEGORIES[med.category];

              return (
                <TransitionLink
                  key={med.slug}
                  href={`/medicine-info/${med.slug}`}
                  className="group rounded-2xl border border-border/60 bg-white hover:border-border hover:shadow-card p-5 transition-all duration-200"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div
                      className={cn(
                        "w-11 h-11 rounded-xl flex items-center justify-center",
                        med.iconBg
                      )}
                    >
                      <Icon className={cn("w-5 h-5", med.iconColor)} />
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span
                        className={cn(
                          "text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full",
                          cat.color
                        )}
                      >
                        {cat.label}
                      </span>
                    </div>
                  </div>

                  <h3 className="font-heading font-semibold text-foreground mb-0.5 group-hover:text-accent-lavender transition-colors">
                    {med.name}
                  </h3>
                  <p className="text-xs text-muted/70 mb-1.5">{med.genericName}</p>
                  <p className="text-sm text-muted leading-relaxed mb-3 line-clamp-2">
                    {med.shortDescription}
                  </p>

                  <div className="flex items-center justify-between">
                    <span
                      className={cn(
                        "inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full",
                        badge.className
                      )}
                    >
                      <Pill className="w-3 h-3" />
                      {badge.label}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-muted group-hover:text-accent-lavender transition-colors">
                      View Details
                      <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                    </span>
                  </div>
                </TransitionLink>
              );
            })}
          </div>
        )}

        {/* Disclaimer */}
        <div className="rounded-2xl bg-surface/80 border border-border/40 p-4 flex items-start gap-3 mt-6">
          <Shield className="w-5 h-5 text-muted flex-shrink-0 mt-0.5" />
          <p className="text-xs text-muted leading-relaxed">
            <span className="font-semibold">Disclaimer:</span>{" "}
            {MEDICINE_DISCLAIMER}
          </p>
        </div>
      </div>
    </div>
  );
}
