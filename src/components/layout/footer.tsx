import { Heart } from "lucide-react";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-border bg-surface/50 mt-auto">
      <div className="container-app py-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 font-heading text-sm font-semibold text-muted">
            <Heart className="h-4 w-4 text-accent-coral" />
            MediReach
          </div>

          <p className="text-xs text-muted text-center">
            Not a substitute for professional medical advice.{" "}
            <Link href="/disclaimer" className="underline underline-offset-2 hover:text-foreground">
              Disclaimer
            </Link>
          </p>

          <p className="text-xs text-muted">
            © {new Date().getFullYear()} MediReach
          </p>
        </div>
      </div>
    </footer>
  );
}
