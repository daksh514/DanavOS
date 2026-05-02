"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type Lap = {
  id: number;
  totalMs: number;
  splitMs: number;
};

const stopwatchStepMs = 10;

function formatClockTime(date: Date) {
  return {
    time: date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    }),
    date: date.toLocaleDateString([], {
      weekday: "long",
      month: "short",
      day: "numeric",
      year: "numeric",
    }),
  };
}

function formatDuration(totalMs: number) {
  const minutes = Math.floor(totalMs / 60000);
  const seconds = Math.floor((totalMs % 60000) / 1000);
  const centiseconds = Math.floor((totalMs % 1000) / 10);

  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}.${String(centiseconds).padStart(2, "0")}`;
}

function lapButtonLabel(isRunning: boolean, hasStarted: boolean) {
  if (isRunning) return "Lap";
  if (hasStarted) return "Reset";
  return "Lap";
}

export default function Clock() {
  const [now, setNow] = useState(() => new Date());
  const [elapsedMs, setElapsedMs] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [laps, setLaps] = useState<Lap[]>([]);
  const lapIdRef = useRef(1);

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!isRunning) return;
    const timer = setInterval(
      () => setElapsedMs((prev) => prev + stopwatchStepMs),
      stopwatchStepMs,
    );
    return () => clearInterval(timer);
  }, [isRunning]);

  const { time, date } = useMemo(() => formatClockTime(now), [now]);
  const hasStarted = elapsedMs > 0;

  const fastestLap = useMemo(() => {
    if (laps.length === 0) return null;
    return laps.reduce((best, lap) => (lap.splitMs < best.splitMs ? lap : best));
  }, [laps]);

  const slowestLap = useMemo(() => {
    if (laps.length === 0) return null;
    return laps.reduce((worst, lap) => (lap.splitMs > worst.splitMs ? lap : worst));
  }, [laps]);

  const handleStartPause = () => {
    setIsRunning((prev) => !prev);
  };

  const handleLapOrReset = () => {
    if (isRunning) {
      const previousTotal = laps[0]?.totalMs ?? 0;
      const nextLap: Lap = {
        id: lapIdRef.current++,
        totalMs: elapsedMs,
        splitMs: elapsedMs - previousTotal,
      };
      setLaps((prev) => [nextLap, ...prev]);
      return;
    }

    if (hasStarted) {
      setElapsedMs(0);
      setLaps([]);
      lapIdRef.current = 1;
    }
  };

  return (
    <section className="mx-auto w-full max-w-xl rounded-3xl border border-emerald-200/30 bg-emerald-950/85 p-6 text-emerald-50 shadow-2xl backdrop-blur-md sm:p-8">
      <div className="space-y-1 text-center">
        <p className="text-xs tracking-[0.2em] text-emerald-300 uppercase">Clock</p>
        <p className="text-5xl font-semibold tabular-nums sm:text-6xl">{time}</p>
        <p className="text-sm text-emerald-200/85">{date}</p>
      </div>

      <div className="mt-8 rounded-2xl border border-emerald-300/20 bg-emerald-900/30 p-4 sm:p-5">
        <p className="text-xs tracking-[0.2em] text-emerald-300 uppercase">Stopwatch</p>
        <p className="mt-3 text-center text-4xl font-semibold tabular-nums sm:text-5xl">
          {formatDuration(elapsedMs)}
        </p>

        <div className="mt-5 grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={handleLapOrReset}
            disabled={!isRunning && !hasStarted}
            className="rounded-xl border border-emerald-200/35 bg-transparent px-4 py-2 text-sm font-medium text-emerald-100 transition hover:bg-emerald-800/40 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {lapButtonLabel(isRunning, hasStarted)}
          </button>
          <button
            type="button"
            onClick={handleStartPause}
            className="rounded-xl border border-emerald-400/40 bg-emerald-400/15 px-4 py-2 text-sm font-semibold text-emerald-100 transition hover:bg-emerald-400/25"
          >
            {isRunning ? "Pause" : hasStarted ? "Resume" : "Start"}
          </button>
        </div>

        {(fastestLap || slowestLap) && (
          <div className="mt-5 grid grid-cols-2 gap-3 text-xs text-emerald-200/90">
            <div className="rounded-lg border border-emerald-300/20 bg-emerald-900/40 p-2">
              <p className="text-emerald-300/85">Fastest</p>
              <p className="mt-1 font-medium tabular-nums">
                {fastestLap ? formatDuration(fastestLap.splitMs) : "--"}
              </p>
            </div>
            <div className="rounded-lg border border-emerald-300/20 bg-emerald-900/40 p-2">
              <p className="text-emerald-300/85">Slowest</p>
              <p className="mt-1 font-medium tabular-nums">
                {slowestLap ? formatDuration(slowestLap.splitMs) : "--"}
              </p>
            </div>
          </div>
        )}

        <div className="mt-5 max-h-52 overflow-auto rounded-xl border border-emerald-300/15 bg-emerald-950/50">
          {laps.length === 0 ? (
            <p className="px-4 py-6 text-center text-sm text-emerald-200/65">
              Start and record laps to see splits.
            </p>
          ) : (
            <ul className="divide-y divide-emerald-300/15">
              {laps.map((lap, idx) => (
                <li
                  key={lap.id}
                  className="grid grid-cols-[auto_1fr_auto] items-center gap-3 px-4 py-2 text-sm"
                >
                  <span className="text-emerald-300/85 tabular-nums">
                    Lap {laps.length - idx}
                  </span>
                  <span className="text-right text-emerald-200/70 tabular-nums">
                    +{formatDuration(lap.splitMs)}
                  </span>
                  <span className="font-medium tabular-nums">
                    {formatDuration(lap.totalMs)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
}
