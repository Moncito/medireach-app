"use client";

import { useAuth } from "@/features/auth/auth-provider";
import { TransitionLink } from "@/components/ui/transition-provider";
import {
  Stethoscope,
  Cross,
  Pill,
  Sparkles,
  ArrowRight,
  Heart,
  Shield,
  Activity,
  Sun,
  Moon,
  Sunrise,
} from "lucide-react";

function getGreeting(): { text: string; icon: typeof Sun } {
  const hour = new Date().getHours();
  if (hour < 12) return { text: "Good Morning", icon: Sunrise };
  if (hour < 18) return { text: "Good Afternoon", icon: Sun };
  return { text: "Good Evening", icon: Moon };
}

const quickActions = [
  {
    title: "Symptom Checker",
    description: "Describe your symptoms and get AI-powered health guidance",
    icon: Stethoscope,
    href: "/symptom-checker",
    gradient: "from-accent-coral/10 to-accent-coral/5",
    iconBg: "bg-accent-coral/10",
    iconColor: "text-accent-coral",
    active: true,
  },
  {
    title: "First Aid Guide",
    description: "Quick access to emergency first aid instructions",
    icon: Cross,
    href: "/first-aid",
    gradient: "from-accent-mint/10 to-accent-mint/5",
    iconBg: "bg-accent-mint/10",
    iconColor: "text-accent-mint",
    active: true,
  },
  {
    title: "Medicine Info",
    description: "Look up medications, dosages, and interactions",
    icon: Pill,
    href: "#",
    gradient: "from-accent-lavender/10 to-accent-lavender/5",
    iconBg: "bg-accent-lavender/10",
    iconColor: "text-accent-lavender",
    active: false,
  },
];

const healthTips = [
  {
    icon: Heart,
    title: "Stay Hydrated",
    text: "Drink at least 8 glasses of water daily to maintain optimal body function.",
    color: "text-accent-coral",
    bg: "bg-accent-coral/10",
  },
  {
    icon: Activity,
    title: "Move More",
    text: "Even 30 minutes of daily walking can significantly reduce health risks.",
    color: "text-accent-mint",
    bg: "bg-accent-mint/10",
  },
  {
    icon: Shield,
    title: "Sleep Well",
    text: "Aim for 7-9 hours of quality sleep to support your immune system.",
    color: "text-accent-lavender",
    bg: "bg-accent-lavender/10",
  },
];

export default function DashboardPage() {
  const { user, isGuest } = useAuth();
  const greeting = getGreeting();
  const GreetingIcon = greeting.icon;
  const firstName = user?.displayName?.split(" ")[0];

  return (
    <div className="p-4 lg:p-8 max-w-6xl mx-auto space-y-8">
      {/* Welcome Section */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-dark via-dark-surface to-dark p-6 lg:p-8">
        {/* Decorative gradient orbs */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-accent-coral/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-accent-lavender/15 rounded-full blur-3xl translate-y-1/3 -translate-x-1/4" />

        <div className="relative z-10">
          <div className="flex items-center gap-2 text-white/50 text-sm mb-2">
            <GreetingIcon className="w-4 h-4" />
            <span>{greeting.text}</span>
          </div>
          <h1 className="font-heading text-heading-lg lg:text-display text-white mb-2">
            {firstName ? `Welcome back, ${firstName}` : "Welcome to MediReach"}
          </h1>
          <p className="text-white/60 text-base max-w-lg">
            {isGuest
              ? "You're browsing as a guest. Sign up to save your symptom history and get personalized insights."
              : "Your AI-powered health companion is ready to help. How are you feeling today?"}
          </p>

          {isGuest && (
            <TransitionLink
              href="/register"
              className="inline-flex items-center gap-2 mt-4 px-5 py-2.5 rounded-xl bg-accent-coral text-white text-sm font-semibold hover:bg-accent-coral/90 transition-colors"
            >
              Create an Account
              <ArrowRight className="w-4 h-4" />
            </TransitionLink>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-heading text-heading text-foreground">
            Quick Actions
          </h2>
          <div className="flex items-center gap-1.5 text-xs text-muted">
            <Sparkles className="w-3.5 h-3.5 text-accent-coral" />
            AI Powered
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {quickActions.map((action) => {
            const Icon = action.icon;

            if (!action.active) {
              return (
                <div
                  key={action.title}
                  className="group relative rounded-2xl border border-border/60 bg-white/60 p-5 opacity-60 cursor-not-allowed"
                >
                  <div className={`w-11 h-11 rounded-xl ${action.iconBg} flex items-center justify-center mb-4`}>
                    <Icon className={`w-5 h-5 ${action.iconColor}`} />
                  </div>
                  <h3 className="font-heading font-semibold text-foreground mb-1">
                    {action.title}
                  </h3>
                  <p className="text-sm text-muted leading-relaxed">
                    {action.description}
                  </p>
                  <span className="absolute top-4 right-4 text-[10px] font-medium uppercase tracking-wider bg-surface text-muted px-2.5 py-1 rounded-full">
                    Coming Soon
                  </span>
                </div>
              );
            }

            return (
              <TransitionLink
                key={action.title}
                href={action.href}
                className={`group relative rounded-2xl border border-border/60 bg-gradient-to-br ${action.gradient} p-5 hover:shadow-card hover:border-border transition-all duration-300`}
              >
                <div className={`w-11 h-11 rounded-xl ${action.iconBg} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className={`w-5 h-5 ${action.iconColor}`} />
                </div>
                <h3 className="font-heading font-semibold text-foreground mb-1">
                  {action.title}
                </h3>
                <p className="text-sm text-muted leading-relaxed mb-4">
                  {action.description}
                </p>
                <div className="flex items-center gap-1.5 text-sm font-medium text-accent-coral">
                  Get Started
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </TransitionLink>
            );
          })}
        </div>
      </section>

      {/* Health Tips */}
      <section>
        <h2 className="font-heading text-heading text-foreground mb-4">
          Daily Health Tips
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {healthTips.map((tip) => {
            const Icon = tip.icon;
            return (
              <div
                key={tip.title}
                className="rounded-2xl border border-border/60 bg-white/80 p-5 hover:shadow-soft transition-shadow duration-300"
              >
                <div className={`w-9 h-9 rounded-lg ${tip.bg} flex items-center justify-center mb-3`}>
                  <Icon className={`w-[18px] h-[18px] ${tip.color}`} />
                </div>
                <h3 className="font-heading font-semibold text-foreground text-sm mb-1">
                  {tip.title}
                </h3>
                <p className="text-sm text-muted leading-relaxed">{tip.text}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Disclaimer */}
      <div className="rounded-2xl bg-surface/80 border border-border/40 p-4 flex items-start gap-3">
        <Shield className="w-5 h-5 text-muted flex-shrink-0 mt-0.5" />
        <p className="text-xs text-muted leading-relaxed">
          <span className="font-semibold">Medical Disclaimer:</span> MediReach
          provides general health information and AI-powered guidance for
          educational purposes only. It is not a substitute for professional
          medical advice, diagnosis, or treatment. Always consult a qualified
          healthcare provider for medical concerns.
        </p>
      </div>
    </div>
  );
}
