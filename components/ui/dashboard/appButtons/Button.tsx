"use client";
import { useOSStore } from "@/lib/store/useAppOpen";
import { cn } from "@/lib/utils";

export default function Button({
  name,
  icon,
  className,
}: {
  name: string;
  icon: string;
  className?: string;
}) {
  const toggleApp = useOSStore((state) => state.toggleApp);
  return (
    <div
      onClick={() => toggleApp(name, true)}
      className={cn(
        "w-14 h-14 rounded-2xl text-2xl bg-white/20 flex items-center justify-center transition-all duration-200 hover:scale-105 cursor-pointer backdrop-blur-md border border-white/10",
        className,
      )}
    >
      {icon}
    </div>
  );
}
