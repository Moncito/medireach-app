"use client";

export function GradientBlobs() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {/* Primary coral blob */}
      <div
        className="absolute -top-32 -right-32 h-[500px] w-[500px] rounded-full animate-float-slow"
        style={{
          background: "radial-gradient(circle, rgba(255,107,53,0.12) 0%, transparent 70%)",
        }}
      />
      {/* Lavender blob */}
      <div
        className="absolute top-1/3 -left-48 h-[600px] w-[600px] rounded-full animate-float-slower"
        style={{
          background: "radial-gradient(circle, rgba(139,92,246,0.08) 0%, transparent 70%)",
        }}
      />
      {/* Mint blob */}
      <div
        className="absolute -bottom-32 right-1/4 h-[400px] w-[400px] rounded-full animate-float"
        style={{
          background: "radial-gradient(circle, rgba(16,185,129,0.08) 0%, transparent 70%)",
        }}
      />
      {/* Tiny accent orbs */}
      <div
        className="absolute top-20 left-1/4 h-3 w-3 rounded-full bg-accent-coral/30 animate-pulse-soft"
      />
      <div
        className="absolute top-1/2 right-1/3 h-2 w-2 rounded-full bg-accent-lavender/30 animate-pulse-soft"
        style={{ animationDelay: "2s" }}
      />
      <div
        className="absolute bottom-1/4 left-1/3 h-2.5 w-2.5 rounded-full bg-accent-mint/30 animate-pulse-soft"
        style={{ animationDelay: "4s" }}
      />
    </div>
  );
}
