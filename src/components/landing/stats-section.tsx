"use client";

import { Reveal } from "@/components/ui/reveal";
import { AnimatedCounter } from "@/components/ui/animated-counter";
import { Shield, Pill, Wifi, Clock } from "lucide-react";

const stats = [
  { icon: Shield, value: 15, suffix: "+", label: "First Aid Guides", color: "#FF6B35" },
  { icon: Pill, value: 15, suffix: "+", label: "Medicine Guides", color: "#10B981" },
  { icon: Wifi, value: 100, suffix: "%", label: "Offline Ready", color: "#8B5CF6" },
  { icon: Clock, value: 24, suffix: "/7", label: "Always Available", color: "#FF6B35" },
];

export function StatsSection() {
  return (
    <section className="relative py-20">
      <div className="container-app">
        <Reveal>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="relative group flex flex-col items-center text-center p-6 rounded-3xl bg-white/50 backdrop-blur-sm border border-white/60 transition-all duration-300 hover:bg-white/80 hover:shadow-card"
              >
                <div
                  className="flex h-12 w-12 items-center justify-center rounded-2xl mb-4 transition-transform duration-300 group-hover:scale-110"
                  style={{ backgroundColor: `${stat.color}10` }}
                >
                  <stat.icon className="h-5 w-5" style={{ color: stat.color }} />
                </div>
                <span className="font-heading text-heading-lg font-extrabold text-foreground">
                  <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                </span>
                <span className="mt-1 text-sm text-muted font-medium">{stat.label}</span>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
