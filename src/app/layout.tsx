import type { Metadata, Viewport } from "next";
import { Outfit, DM_Sans, Space_Mono } from "next/font/google";
import { AuthProvider } from "@/features/auth/auth-provider";
import { TransitionProvider } from "@/components/ui/transition-provider";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
});

const spaceMono = Space_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-space-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "MediReach — Your AI Healthcare Companion",
  description:
    "AI-powered symptom triage, first aid guides, medicine safety checker, and family health journal — accessible anywhere, even offline.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "MediReach",
  },
};

export const viewport: Viewport = {
  themeColor: "#FAF9F6",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${outfit.variable} ${dmSans.variable} ${spaceMono.variable}`}
    >
      <body className="min-h-screen flex flex-col">
        <AuthProvider>
          <TransitionProvider>{children}</TransitionProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
