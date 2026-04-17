"use client";

import { useState, useEffect } from "react";
import { WifiOff, X } from "lucide-react";

export function OfflineBanner() {
  const [offline, setOffline] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    function handleOnline() {
      setOffline(false);
      setDismissed(false);
    }
    function handleOffline() {
      setOffline(true);
      setDismissed(false);
    }

    // Check initial state
    if (!navigator.onLine) setOffline(true);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  if (!offline || dismissed) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 mx-auto max-w-md animate-in slide-in-from-bottom-4 duration-300">
      <div className="flex items-center gap-3 rounded-2xl bg-dark text-white px-4 py-3 shadow-elevated">
        <WifiOff className="w-5 h-5 text-amber-400 flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium">You&apos;re offline</p>
          <p className="text-xs text-white/60">
            First aid guides are still available. AI features need internet.
          </p>
        </div>
        <button
          onClick={() => setDismissed(true)}
          className="p-1 rounded-lg hover:bg-white/10 transition-colors flex-shrink-0"
          aria-label="Dismiss offline notice"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
