"use client";

import { motion } from "framer-motion";
import { LoaderCircle } from "lucide-react";

export default function Loading() {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-emerald-950">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(16,185,129,0.24),transparent_58%)]" />
      <div className="absolute inset-0 bg-gradient-to-b from-emerald-900/20 via-transparent to-black/40" />

      <motion.div
        initial={{ opacity: 0, y: 8, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.35 }}
        className="relative z-10 flex w-[min(92vw,380px)] flex-col items-center gap-5 rounded-3xl border border-emerald-200/20 bg-emerald-900/25 px-8 py-10 text-emerald-50 shadow-2xl backdrop-blur-xl"
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1.1, repeat: Infinity, ease: "linear" }}
          className="rounded-full border border-emerald-200/30 bg-emerald-500/15 p-3"
        >
          <LoaderCircle className="size-8 text-emerald-300" />
        </motion.div>

        <div className="space-y-1 text-center">
          <p className="text-xl font-semibold tracking-wide">Loading DanavOS</p>
          <p className="text-sm text-emerald-200/80">
            Preparing your workspace...
          </p>
        </div>

        <div className="flex items-center gap-2">
          {[0, 1, 2].map((dot) => (
            <motion.span
              key={dot}
              className="size-2 rounded-full bg-emerald-300"
              animate={{ opacity: [0.25, 1, 0.25], y: [0, -3, 0] }}
              transition={{
                duration: 0.8,
                repeat: Infinity,
                delay: dot * 0.12,
              }}
            />
          ))}
        </div>
      </motion.div>
    </div>
  );
}
