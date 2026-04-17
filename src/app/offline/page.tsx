import { Cross, WifiOff, BookOpen, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function OfflinePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center bg-background">
      <div className="w-16 h-16 rounded-2xl bg-amber-50 flex items-center justify-center mb-6">
        <WifiOff className="w-8 h-8 text-amber-500" />
      </div>

      <h1 className="font-heading text-heading-lg text-foreground mb-2">
        You&apos;re Offline
      </h1>
      <p className="text-muted text-base max-w-md mb-8">
        Some features need an internet connection. But don&apos;t worry — you
        can still browse first aid guides while offline.
      </p>

      <div className="flex flex-col sm:flex-row items-center gap-3">
        <Link
          href="/first-aid"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-accent-coral text-white text-sm font-medium hover:bg-accent-coral/90 transition-colors"
        >
          <BookOpen className="w-4 h-4" />
          Browse First Aid Guides
        </Link>
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-border/60 text-sm font-medium text-foreground hover:bg-surface transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Link>
      </div>

      <div className="mt-12 flex items-center gap-2 text-muted">
        <Cross className="w-4 h-4 text-accent-coral" strokeWidth={3} />
        <span className="text-sm font-heading font-semibold">MediReach</span>
      </div>
    </div>
  );
}
