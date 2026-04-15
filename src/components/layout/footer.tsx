import { Heart } from "lucide-react";
import Link from "next/link";

const footerLinks = [
  { href: "/symptom-checker", label: "Symptom Checker" },
  { href: "/first-aid", label: "First Aid" },
  { href: "/medicine", label: "Medicine" },
  { href: "/map", label: "Facilities" },
  { href: "/journal", label: "Journal" },
];

export function Footer() {
  return (
    <footer className="border-t border-border/50 bg-surface/30">
      <div className="container-app py-12 sm:py-16">
        <div className="flex flex-col gap-8">
          {/* Top row */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-accent-coral to-accent-coral-light">
                <Heart className="h-3.5 w-3.5 text-white" />
              </div>
              <span className="font-heading text-base font-bold">MediReach</span>
            </div>

            <div className="flex flex-wrap gap-x-6 gap-y-2">
              {footerLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm text-muted transition-colors hover:text-foreground"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Divider */}
          <div className="h-px bg-border/50" />

          {/* Bottom row */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-muted-light">
              © {new Date().getFullYear()} MediReach — Not a substitute for professional medical advice.{" "}
              <Link href="/disclaimer" className="underline underline-offset-2 hover:text-muted">
                Disclaimer
              </Link>
            </p>
            <p className="text-xs text-muted-light">
              Built with care for SDG 3: Good Health and Well-being
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
