"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { AuthLayout } from "@/features/auth/auth-layout";
import { FormInput } from "@/features/auth/form-input";
import { SocialButton, GoogleIcon, Divider } from "@/features/auth/social-button";
import { signUpWithEmail, signInWithGoogle } from "@/lib/firebase/auth";
import { FirebaseError } from "firebase/app";
import { Loader2 } from "lucide-react";
import { TransitionLink, usePageTransition } from "@/components/ui/transition-provider";

const firebaseErrorMap: Record<string, string> = {
  "auth/email-already-in-use": "An account with this email already exists.",
  "auth/invalid-email": "Please enter a valid email address.",
  "auth/weak-password": "Password should be at least 6 characters.",
  "auth/too-many-requests": "Too many attempts. Please try again later.",
};

export default function RegisterPage() {
  const router = useRouter();
  const { navigateTo } = usePageTransition();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  function validate(): boolean {
    const errors: Record<string, string> = {};
    if (name.trim().length < 2) errors.name = "Name must be at least 2 characters.";
    if (password.length < 6) errors.password = "Password must be at least 6 characters.";
    if (password !== confirm) errors.confirm = "Passwords do not match.";
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (loading || googleLoading) return;
    setError("");
    if (!validate()) return;

    setLoading(true);
    try {
      await signUpWithEmail(email, password, name.trim());
      navigateTo("/dashboard");
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
    if (loading || googleLoading) return;
    setError("");
    setGoogleLoading(true);
    try {
      await signInWithGoogle();
      navigateTo("/dashboard");
    } catch (err) {
      if (err instanceof FirebaseError && err.code !== "auth/popup-closed-by-user") {
        setError("Google sign-in failed. Please try again.");
      }
    } finally {
      setGoogleLoading(false);
    }
  }

  const anyLoading = loading || googleLoading;

  return (
    <AuthLayout title="Create your account" subtitle="Join MediReach — it only takes a minute">
      {/* Social sign-up */}
      <SocialButton
        onClick={handleGoogle}
        loading={googleLoading}
        icon={<GoogleIcon />}
        label="Continue with Google"
      />

      <Divider text="or register with email" />

      {/* Email form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        <FormInput
          label="Full Name"
          type="text"
          placeholder="John Doe"
          value={name}
          onChange={(e) => setName(e.target.value)}
          error={fieldErrors.name}
          required
          autoComplete="name"
          disabled={anyLoading}
        />

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
          error={fieldErrors.password}
          required
          minLength={6}
          autoComplete="new-password"
          disabled={anyLoading}
        />

        <FormInput
          label="Confirm Password"
          type="password"
          placeholder="••••••••"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          error={fieldErrors.confirm}
          required
          autoComplete="new-password"
          disabled={anyLoading}
        />

        <button
          type="submit"
          disabled={anyLoading}
          className="btn-primary w-full py-3 text-sm font-semibold mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Create Account"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-muted">
        Already have an account?{" "}
        <TransitionLink
          href="/login"
          className="font-semibold text-accent-coral hover:text-accent-coral-light transition-colors"
        >
          Sign in
        </TransitionLink>
      </p>
    </AuthLayout>
  );
}
