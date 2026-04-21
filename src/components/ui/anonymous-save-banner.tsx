"use client";

import Link from "next/link";
import { LogIn } from "lucide-react";

/**
 * Shown when an anonymous (guest) user is in a chat that would normally
 * save conversations. Centralises the copy and styling so all three chat
 * UIs stay in sync.
 */
export function AnonymousSaveBanner() {
  return (
    <div className="flex items-center justify-center gap-1.5 mt-2 text-[11px] text-amber-600 bg-amber-50 border border-amber-200 rounded-xl px-3 py-1.5">
      <LogIn className="w-3 h-3 flex-shrink-0" />
      <span>
        <Link
          href="/login"
          className="font-semibold underline underline-offset-2 hover:text-amber-700"
        >
          Sign in
        </Link>
        {" "}to save your conversations to history.
      </span>
    </div>
  );
}
