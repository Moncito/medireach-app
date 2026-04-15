"use client";

import { useState, type FormEvent } from "react";
import { AuthLayout } from "@/features/auth/auth-layout";
import { FormInput } from "@/features/auth/form-input";
import { resetPassword } from "@/lib/firebase/auth";
import { FirebaseError } from "firebase/app";
import { Loader2, ArrowLeft, Mail } from "lucide-react";
import { TransitionLink } from "@/components/ui/transition-provider";

const firebaseErrorMap: Record<string, string> = {
  "auth/user-not-found": "No account found with this email.",
  "auth/invalid-email": "Please enter a valid email address.",
  "auth/too-many-requests": "Too many attempts. Please try again later.",
};

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await resetPassword(email);
      setSent(true);
    } catch (err) {
      if (err instanceof FirebaseError) {
        setError(firebaseErrorMap[err.code] || "Something went wrong. Please try again.");
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout
      title={sent ? "Check your inbox" : "Reset your password"}
      subtitle={
        sent
          ? `We sent a reset link to ${email}`
          : "Enter your email and we'll send you a reset link"
      }
    >
      {sent ? (
        <div className="space-y-6">
          <div className="flex items-center justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-accent-mint/10">
              <Mail className="h-7 w-7 text-accent-mint" />
            </div>
          </div>

          <p className="text-sm text-muted text-center leading-relaxed">
            Didn&apos;t receive it? Check your spam folder or{" "}
            <button
              onClick={() => setSent(false)}
              className="font-semibold text-accent-coral hover:text-accent-coral-light transition-colors"
            >
              try again
            </button>
          </p>

          <TransitionLink
            href="/login"
            className="btn-primary w-full py-3 text-sm font-semibold flex items-center justify-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Sign In
          </TransitionLink>
        </div>
      ) : (
        <>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600">
                {error}
              </div>
            )}

            <FormInput
              label="Email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              disabled={loading}
            />

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3 text-sm font-semibold mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Send Reset Link"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-muted">
            Remember your password?{" "}
            <TransitionLink
              href="/login"
              className="font-semibold text-accent-coral hover:text-accent-coral-light transition-colors"
            >
              Sign in
            </TransitionLink>
          </p>
        </>
      )}
    </AuthLayout>
  );
}
