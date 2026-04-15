"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/features/auth/auth-provider";
import { Loader2 } from "lucide-react";

interface ProtectedRouteProps {
  children: React.ReactNode;
  /** If true, only fully authenticated users (not guests) can access */
  requireAuth?: boolean;
}

export function ProtectedRoute({ children, requireAuth = false }: ProtectedRouteProps) {
  const { user, loading, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    if (!user) {
      router.replace("/login");
      return;
    }

    if (requireAuth && !isAuthenticated) {
      router.replace("/register");
    }
  }, [user, loading, isAuthenticated, requireAuth, router]);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-accent-coral" />
      </div>
    );
  }

  if (!user) return null;
  if (requireAuth && !isAuthenticated) return null;

  return <>{children}</>;
}
