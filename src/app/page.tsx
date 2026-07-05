"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Cloud } from "lucide-react";
import { useApp } from "@/context/AppContext";

function MicrosoftLogo() {
  return (
    <svg width="18" height="18" viewBox="0 0 21 21" aria-hidden>
      <rect x="1" y="1" width="9" height="9" fill="#f25022" />
      <rect x="11" y="1" width="9" height="9" fill="#7fba00" />
      <rect x="1" y="11" width="9" height="9" fill="#00a4ef" />
      <rect x="11" y="11" width="9" height="9" fill="#ffb900" />
    </svg>
  );
}

export default function LandingPage() {
  const { loggedIn, login } = useApp();
  const router = useRouter();

  useEffect(() => {
    if (loggedIn) router.replace("/dashboard");
  }, [loggedIn, router]);

  const handleLogin = () => {
    login();
    router.replace("/dashboard");
  };

  return (
    <div className="relative flex min-h-[70vh] flex-col items-center justify-end pb-16">
      <Cloud size={40} className="absolute left-6 top-1/3 text-muted/30" />

      <div className="w-full max-w-sm">
        <div className="mb-4 flex items-center gap-3">
          <div className="h-px flex-1 bg-border" />
          <span className="text-xs tracking-wide text-muted">Login With</span>
          <div className="h-px flex-1 bg-border" />
        </div>
        <button
          onClick={handleLogin}
          className="flex w-full items-center justify-center gap-3 rounded-card border border-border bg-white px-5 py-3 text-sm font-semibold text-text shadow-sm transition-colors hover:bg-surface"
        >
          <MicrosoftLogo />
          Continue with Microsoft
        </button>
      </div>
    </div>
  );
}
