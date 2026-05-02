"use client";

import { useEffect, useState } from "react";

function formatNow() {
  const now = new Date();
  return {
    time: now.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    }),
    date: now.toLocaleDateString([], {
      weekday: "short",
      month: "short",
      day: "numeric",
    }),
  };
}

export default function HomeClock() {
  const [clock, setClock] = useState(() => formatNow());

  useEffect(() => {
    const timer = setInterval(() => {
      setClock(formatNow());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="fixed right-4 bottom-4 font-inter rounded-xl border border-white/20 bg-black/45 px-4 py-2 text-right text-white shadow-lg backdrop-blur-md">
      <p
        className="text-base font-semibold tabular-nums"
        suppressHydrationWarning
      >
        {clock.time}
      </p>
      <p className="text-xs text-white/80" suppressHydrationWarning>
        {clock.date}
      </p>
    </div>
  );
}
