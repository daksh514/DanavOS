"use client";

import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

export default function ShutdownPage() {
  const [isShuttingDown, setIsShuttingDown] = useState(true);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setIsShuttingDown(false);
    }, 3000);

    return () => window.clearTimeout(timer);
  }, []);

  return (
    <main className="flex min-h-screen items-center justify-center bg-black text-white">
      {isShuttingDown ? (
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="size-10 animate-spin text-red-300" />
          <p className="text-lg tracking-wide text-red-100">Shutting down...</p>
        </div>
      ) : (
        <p className="text-2xl font-semibold text-red-200">its a website, BAKA</p>
      )}
    </main>
  );
}
