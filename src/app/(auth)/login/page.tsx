"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { AuthLayout } from "@/features/auth/auth-layout";
import { FormInput } from "@/features/auth/form-input";
import { SocialButton, GoogleIcon, Divider } from "@/features/auth/social-button";
import { signInWithEmail, signInWithGoogle, signInAsGuest } from "@/lib/firebase/auth";
import { FirebaseError } from "firebase/app";
import { Loader2, User } from "lucide-react";
import { TransitionLink, usePageTransition } from "@/components/ui/transition-provider";

const firebaseErrorMap: Record<string, string> = {
  "auth/user-not-found": "No account found with this email.",
  "auth/wrong-password": "Incorrect password.",
  "auth/invalid-credential": "Invalid email or password.",
  "auth/too-many-requests": "Too many attempts. Please try again later.",
  "auth/user-disabled": "This account has been disabled.",
  "auth/invalid-email": "Please enter a valid email address.",
};

export default function LoginPage() {
  const router = useRouter();
  const { navigateTo } = usePageTransition();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [guestLoading, setGuestLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await signInWithEmail(email, password);
      navigateTo("/");
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

  async function handleGoogle() {
    setError("");
    setGoogleLoading(true);
    try {
      await signInWithGoogle();
      navigateTo("/");
    } catch (err) {
      if (err instanceof FirebaseError && err.code !== "auth/popup-closed-by-user") {
        setError("Google sign-in failed. Please try again.");
      }
    } finally {
      setGoogleLoading(false);
    }
  }

  async function handleGuest() {
    setError("");
    setGuestLoading(true);
    try {
      await signInAsGuest();
      navigateTo("/");
    } catch {
      setError("Guest sign-in failed. Please try again.");
    } finally {
      setGuestLoading(false);
    }
  }

  const anyLoading = loading || googleLoading || guestLoading;

  return (
    <AuthLayout title="Welcome back" subtitle="Sign in to your MediReach account">
      {/* Social sign-in */}
      <SocialButton
        onClick={handleGoogle}
        loading={googleLoading}
        icon={<GoogleIcon />}
        label="Continue with Google"
      />

      <div className="mt-3">
        <SocialButton
          onClick={handleGuest}
          loading={guestLoading}
          icon={<User className="h-4 w-4 text-muted" />}
          label="Continue as Guest"
        />
      </div>

      <Divider text="or sign in with email" />

      {/* Email form */}
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
          disabled={anyLoading}
        />

        <FormInput
          label="Password"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={6}
          autoComplete="current-password"
          disabled={anyLoading}
        />

        <div className="flex justify-end">
          <TransitionLink
            href="/forgot-password"
            className="text-xs font-medium text-accent-coral hover:text-accent-coral-light transition-colors"
          >
            Forgot password?
          </TransitionLink>
        </div>

        <button
          type="submit"
          disabled={anyLoading}
          className="btn-primary w-full py-3 text-sm font-semibold mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Sign In"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-muted">
        Don&apos;t have an account?{" "}
        <TransitionLink
          href="/register"
          className="font-semibold text-accent-coral hover:text-accent-coral-light transition-colors"
        >
          Create one
        </TransitionLink>
      </p>
    </AuthLayout>
  );
}
