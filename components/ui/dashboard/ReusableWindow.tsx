"use client";
import { motion } from "framer-motion";

export default function ReusableWindow({
  title,
  children,
  onClose,
  customSize,
}: {
  title: string;
  children: React.ReactNode;
  onClose: () => void;
  customSize?: { width: number; height: number };
}) {
  return (
    <motion.div
      drag
      dragMomentum={false}
      initial={{ x: 100, y: 100, opacity: 0 }}
      animate={{ opacity: 1 }}
      className="absolute z-50 flex h-[600px] w-[600px] flex-col overflow-hidden rounded-lg border border-gray-300 bg-white shadow-xl"
      style={
        customSize ? { width: customSize.width, height: customSize.height } : undefined
      }
    >
      <div className="bg-gray-200 p-2 flex justify-between items-center cursor-move select-none">
        <span className="text-sm font-bold ml-2">{title}</span>
        <button
          className="bg-red-500 text-white px-2 rounded hover:bg-red-600"
          onClick={onClose}
        >
          ✕
        </button>
      </div>
      <div className="p-4 flex-1 overflow-auto text-black bg-white">
        {children}
      </div>
    </motion.div>
  );
}
