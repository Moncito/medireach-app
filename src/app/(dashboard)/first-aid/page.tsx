"use client";

import { useState, useMemo } from "react";
import { TransitionLink } from "@/components/ui/transition-provider";
import {
  FIRST_AID_GUIDES,
  CATEGORIES,
  EMERGENCY_NUMBERS,
  type Category,
} from "@/data/first-aid-guides";
import { FirstAidChat } from "@/features/first-aid/first-aid-chat";
import { cn } from "@/lib/utils";
import {
  Search,
  Phone,
  ChevronRight,
  Shield,
  AlertTriangle,
  Info,
  Filter,
  Sparkles,
  BookOpen,
} from "lucide-react";

const severityBadge = {
  info: { label: "General", className: "bg-blue-50 text-blue-600" },
  warning: { label: "Caution", className: "bg-amber-50 text-amber-600" },
  critical: { label: "Critical", className: "bg-red-50 text-red-600" },
};

export default function FirstAidPage() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<Category | "all">("all");
  const [activeTab, setActiveTab] = useState<"guides" | "ask-ai">("guides");

  const filtered = useMemo(() => {
    let guides = FIRST_AID_GUIDES;

    if (activeCategory !== "all") {
      guides = guides.filter((g) => g.category === activeCategory);
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      guides = guides.filter(
        (g) =>
          g.title.toLowerCase().includes(q) ||
          g.shortDescription.toLowerCase().includes(q) ||
          g.category.toLowerCase().includes(q)
      );
    }

    return guides;
  }, [search, activeCategory]);

  return (
    <div className="p-4 lg:p-8 max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-heading text-heading-lg lg:text-display text-foreground">
          First Aid Guide
        </h1>
        <p className="text-muted text-sm mt-1 max-w-xl">
          Step-by-step emergency instructions for common injuries and medical
          situations. Fully available offline.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setActiveTab("guides")}
          className={cn(
            "flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors",
            activeTab === "guides"
              ? "bg-dark text-white"
              : "bg-surface text-muted hover:text-foreground"
          )}
        >
          <BookOpen className="w-4 h-4" />
          Browse Guides
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

      {activeTab === "ask-ai" ? (
        <>
          <FirstAidChat />
          <div className="rounded-2xl bg-surface/80 border border-border/40 p-4 flex items-start gap-3">
            <Shield className="w-5 h-5 text-muted flex-shrink-0 mt-0.5" />
            <p className="text-xs text-muted leading-relaxed">
              <span className="font-semibold">Disclaimer:</span> AI-generated
              first aid guidance is for informational purposes only. In a serious
              emergency, always call your local emergency number first.
            </p>
          </div>
        </>
      ) : (
        <>

      {/* Emergency Numbers Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-red-50 to-orange-50 border border-red-200/50 p-4">
        <div className="flex items-center gap-2 mb-3">
          <Phone className="w-4 h-4 text-red-500" />
          <h2 className="text-sm font-semibold text-red-700">
            Emergency Numbers
          </h2>
        </div>
        <div className="flex flex-wrap gap-3">
          {EMERGENCY_NUMBERS.map((e) => (
            <a
              key={`${e.country}-${e.number}`}
              href={`tel:${e.number.replace(/[^0-9+]/g, "")}`}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/80 border border-red-100 text-sm hover:bg-white transition-colors"
            >
              <span className="font-semibold text-red-600">{e.number}</span>
              <span className="text-muted text-xs">
                {e.country} · {e.label}
              </span>
            </a>
          ))}
        </div>
      </div>

      {/* Search + Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search guides (burns, CPR, choking...)"
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border/60 bg-white text-sm text-foreground placeholder:text-muted-light outline-none focus:border-accent-mint/50 focus:ring-2 focus:ring-accent-mint/10 transition-all"
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
          {(Object.entries(CATEGORIES) as [Category, { label: string; color: string }][]).map(
            ([key, cat]) => (
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
            )
          )}
        </div>
      </div>

      {/* Guide Grid */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <Search className="w-10 h-10 text-muted/30 mb-3" />
          <p className="text-sm text-muted">
            No guides found for &ldquo;{search}&rdquo;
            {activeCategory !== "all" &&
              ` in ${CATEGORIES[activeCategory].label}`}
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
          {filtered.map((guide) => {
            const Icon = guide.icon;
            const badge = severityBadge[guide.severity];
            const cat = CATEGORIES[guide.category];

            return (
              <TransitionLink
                key={guide.slug}
                href={`/first-aid/${guide.slug}`}
                className="group rounded-2xl border border-border/60 bg-white hover:border-border hover:shadow-card p-5 transition-all duration-200"
              >
                <div className="flex items-start justify-between mb-3">
                  <div
                    className={cn(
                      "w-11 h-11 rounded-xl flex items-center justify-center",
                      guide.iconBg
                    )}
                  >
                    <Icon className={cn("w-5 h-5", guide.iconColor)} />
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

                <h3 className="font-heading font-semibold text-foreground mb-1 group-hover:text-accent-coral transition-colors">
                  {guide.title}
                </h3>
                <p className="text-sm text-muted leading-relaxed mb-3 line-clamp-2">
                  {guide.shortDescription}
                </p>

                <div className="flex items-center justify-between">
                  <span
                    className={cn(
                      "inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full",
                      badge.className
                    )}
                  >
                    {guide.severity === "critical" ? (
                      <AlertTriangle className="w-3 h-3" />
                    ) : guide.severity === "warning" ? (
                      <Shield className="w-3 h-3" />
                    ) : (
                      <Info className="w-3 h-3" />
                    )}
                    {badge.label}
                  </span>
                  <span className="flex items-center gap-1 text-xs text-muted group-hover:text-accent-coral transition-colors">
                    View Guide
                    <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </span>
                </div>
              </TransitionLink>
            );
          })}
        </div>
      )}

      {/* Disclaimer */}
      <div className="rounded-2xl bg-surface/80 border border-border/40 p-4 flex items-start gap-3">
        <Shield className="w-5 h-5 text-muted flex-shrink-0 mt-0.5" />
        <p className="text-xs text-muted leading-relaxed">
          <span className="font-semibold">Disclaimer:</span> These guides
          provide general first aid information for educational purposes. They
          are not a substitute for professional medical training or emergency
          medical services. In a serious emergency, always call your local
          emergency number first.
        </p>
      </div>
        </>
      )}
    </div>
  );
}
