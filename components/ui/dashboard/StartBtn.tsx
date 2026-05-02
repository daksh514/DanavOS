"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";

export default function StartBtn() {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="fixed left-4 bottom-4 z-50  text-white  " ref={menuRef}>
      {/* Tray */}
      {open && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="mb-3 w-40 rounded-xl bg-white/10 backdrop-blur-xl 
                        border border-white/20 shadow-lg p-2 flex flex-col gap-2 "
        >
          <button className="text-left px-3 py-2 rounded-lg cursor-pointer hover:bg-white/20 transition">
            ⚙️ Settings
          </button>

          <button className="text-left px-3 py-2 rounded-lg cursor-pointer hover:bg-white/20 transition">
            🔄 Log Out
          </button>

          <button className="text-left px-3 py-2 rounded-lg cursor-pointer   hover:bg-red-500/30 transition text-red-300">
            ⏻ Shutdown
          </button>
        </motion.div>
      )}

      {/* Start Button */}
      <button
        onClick={() => setOpen(!open)}
        className="w-12 h-12 rounded-full 
                   bg-white/20 backdrop-blur-xl 
                   border border-white/30 shadow-lg
                   flex items-center justify-center
                   hover:scale-110 transition cursor-pointer
"
      >
        🪟
      </button>
    </div>
  );
}
