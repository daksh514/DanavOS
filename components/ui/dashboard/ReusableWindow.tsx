"use client";
import { motion } from "framer-motion";

export default function ReusableWindow({
  title,
  children,
  onClose, // Add this prop
}: {
  title: string;
  children: React.ReactNode;
  onClose: () => void;
}) {
  return (
    <motion.div
      drag
      dragMomentum={false}
      initial={{ x: 100, y: 100, opacity: 0 }}
      animate={{ opacity: 1 }}
      className="absolute w-[400px] h-[300px] bg-white border border-gray-300 shadow-xl rounded-lg overflow-hidden flex flex-col z-50"
    >
      <div className="bg-gray-200 p-2 flex justify-between items-center cursor-move select-none">
        <span className="text-sm font-bold ml-2">{title}</span>
        <button
          className="bg-red-500 text-white px-2 rounded hover:bg-red-600"
          onClick={onClose} // Call the store action
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
