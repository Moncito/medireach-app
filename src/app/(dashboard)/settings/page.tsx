"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/features/auth/auth-provider";
import { usePageTransition } from "@/components/ui/transition-provider";
import { updateProfile, deleteUser, type User } from "firebase/auth";
import { doc, deleteDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import { signOut } from "@/lib/firebase/auth";
import { cn } from "@/lib/utils";
import {
  User as UserIcon,
  Shield,
  Trash2,
  LogOut,
  Save,
  Loader2,
  CheckCircle,
  AlertTriangle,
  Mail,
  Calendar,
  KeyRound,
} from "lucide-react";

export default function SettingsPage() {
  const { user, isGuest } = useAuth();
  const { navigateTo } = usePageTransition();

  const [displayName, setDisplayName] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (user?.displayName) setDisplayName(user.displayName);
  }, [user?.displayName]);

  async function handleSaveProfile(e: React.FormEvent) {
    e.preventDefault();
    if (!user || isGuest) return;

    const trimmed = displayName.trim();
    if (!trimmed) {
      setError("Name cannot be empty.");
      return;
    }
    if (trimmed === user.displayName) return;

    setSaving(true);
    setError(null);
    try {
      await updateProfile(user, { displayName: trimmed });
      // Sync Firestore
      const ref = doc(db, "users", user.uid);
      const { updateDoc } = await import("firebase/firestore");
      await updateDoc(ref, { displayName: trimmed });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch {
      setError("Failed to update profile. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDeleteAccount() {
    if (!user || isGuest || deleteConfirmText !== "DELETE") return;

    setDeleting(true);
    try {
      // Delete Firestore user doc
      await deleteDoc(doc(db, "users", user.uid));
      // Delete Firebase Auth account
      await deleteUser(user);
      navigateTo("/");
    } catch {
      setError(
        "Failed to delete account. You may need to sign in again before deleting."
      );
      setDeleting(false);
    }
  }

  async function handleSignOut() {
    try {
      await signOut();
      navigateTo("/");
    } catch {
      // Auth state listener handles UI
    }
  }

  if (isGuest) {
    return (
      <div className="p-4 lg:p-8 max-w-2xl mx-auto">
        <h1 className="font-heading text-heading-lg text-foreground mb-2">
          Settings
        </h1>
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-14 h-14 rounded-2xl bg-accent-lavender/10 flex items-center justify-center mb-4">
            <Shield className="w-7 h-7 text-accent-lavender" />
          </div>
          <h3 className="font-heading text-lg text-foreground mb-1">
            Sign in to access settings
          </h3>
          <p className="text-sm text-muted max-w-sm">
            Guest accounts have limited access. Create an account to manage your
            profile and preferences.
          </p>
        </div>
      </div>
    );
  }

  const provider = user?.providerData[0]?.providerId ?? "unknown";
  const createdAt = user?.metadata?.creationTime
    ? new Date(user.metadata.creationTime).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "Unknown";

  return (
    <div className="p-4 lg:p-8 max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="font-heading text-heading-lg text-foreground">
          Settings
        </h1>
        <p className="text-sm text-muted mt-1">
          Manage your account and preferences
        </p>
      </div>

      {/* Profile Section */}
      <section className="rounded-2xl border border-border/60 bg-white overflow-hidden">
        <div className="flex items-center gap-3 px-5 py-4 border-b border-border/60 bg-surface/30">
          <UserIcon className="w-5 h-5 text-accent-coral" />
          <h2 className="font-heading font-semibold text-foreground">
            Profile
          </h2>
        </div>

        <form onSubmit={handleSaveProfile} className="p-5 space-y-4">
          <div>
            <label
              htmlFor="displayName"
              className="block text-sm font-medium text-foreground mb-1.5"
            >
              Display Name
            </label>
            <input
              id="displayName"
              type="text"
              value={displayName}
              onChange={(e) => {
                setDisplayName(e.target.value);
                setError(null);
                setSaved(false);
              }}
              maxLength={50}
              className="w-full px-4 py-2.5 rounded-xl border border-border/60 bg-white text-sm text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent-coral/20 focus:border-accent-coral transition-colors"
              placeholder="Your name"
            />
          </div>

          {error && (
            <p className="text-sm text-red-600 flex items-center gap-1.5" role="alert">
              <AlertTriangle className="w-3.5 h-3.5" />
              {error}
            </p>
          )}

          <div className="flex items-center gap-3">
            <button
              type="submit"
              disabled={saving || !displayName.trim() || displayName.trim() === user?.displayName}
              className={cn(
                "flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors",
                saving || !displayName.trim() || displayName.trim() === user?.displayName
                  ? "bg-surface text-muted cursor-not-allowed"
                  : "bg-accent-coral text-white hover:bg-accent-coral/90"
              )}
            >
              {saving ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              {saving ? "Saving..." : "Save Changes"}
            </button>

            {saved && (
              <span className="flex items-center gap-1.5 text-sm text-accent-mint font-medium">
                <CheckCircle className="w-4 h-4" />
                Saved!
              </span>
            )}
          </div>
        </form>
      </section>

      {/* Account Info Section */}
      <section className="rounded-2xl border border-border/60 bg-white overflow-hidden">
        <div className="flex items-center gap-3 px-5 py-4 border-b border-border/60 bg-surface/30">
          <Shield className="w-5 h-5 text-accent-lavender" />
          <h2 className="font-heading font-semibold text-foreground">
            Account
          </h2>
        </div>

        <div className="p-5 space-y-4">
          <div className="flex items-center gap-3 text-sm">
            <Mail className="w-4 h-4 text-muted flex-shrink-0" />
            <span className="text-muted">Email:</span>
            <span className="text-foreground font-medium">
              {user?.email || "Not set"}
            </span>
          </div>

          <div className="flex items-center gap-3 text-sm">
            <KeyRound className="w-4 h-4 text-muted flex-shrink-0" />
            <span className="text-muted">Sign-in method:</span>
            <span className="text-foreground font-medium capitalize">
              {provider === "google.com"
                ? "Google"
                : provider === "password"
                ? "Email & Password"
                : provider}
            </span>
          </div>

          <div className="flex items-center gap-3 text-sm">
            <Calendar className="w-4 h-4 text-muted flex-shrink-0" />
            <span className="text-muted">Member since:</span>
            <span className="text-foreground font-medium">{createdAt}</span>
          </div>
        </div>
      </section>

      {/* Sign Out */}
      <section className="rounded-2xl border border-border/60 bg-white overflow-hidden">
        <div className="p-5">
          <button
            onClick={handleSignOut}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </section>

      {/* Danger Zone */}
      <section className="rounded-2xl border border-red-200 bg-white overflow-hidden">
        <div className="flex items-center gap-3 px-5 py-4 border-b border-red-200 bg-red-50/30">
          <Trash2 className="w-5 h-5 text-red-500" />
          <h2 className="font-heading font-semibold text-red-600">
            Danger Zone
          </h2>
        </div>

        <div className="p-5 space-y-4">
          <p className="text-sm text-muted">
            Permanently delete your account and all associated data. This action
            cannot be undone.
          </p>

          {!showDeleteConfirm ? (
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium border border-red-200 text-red-600 hover:bg-red-50 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              Delete Account
            </button>
          ) : (
            <div className="space-y-3 p-4 rounded-xl bg-red-50/50 border border-red-200">
              <p className="text-sm font-medium text-red-600">
                Type <strong>DELETE</strong> to confirm:
              </p>
              <input
                type="text"
                value={deleteConfirmText}
                onChange={(e) => setDeleteConfirmText(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-red-200 bg-white text-sm text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-red-200 focus:border-red-400 transition-colors"
                placeholder='Type "DELETE"'
              />
              <div className="flex items-center gap-2">
                <button
                  onClick={handleDeleteAccount}
                  disabled={deleteConfirmText !== "DELETE" || deleting}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors",
                    deleteConfirmText === "DELETE" && !deleting
                      ? "bg-red-600 text-white hover:bg-red-700"
                      : "bg-surface text-muted cursor-not-allowed"
                  )}
                >
                  {deleting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Trash2 className="w-4 h-4" />
                  )}
                  {deleting ? "Deleting..." : "Permanently Delete"}
                </button>
                <button
                  onClick={() => {
                    setShowDeleteConfirm(false);
                    setDeleteConfirmText("");
                  }}
                  className="px-4 py-2.5 rounded-xl text-sm font-medium text-muted hover:text-foreground hover:bg-surface transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
