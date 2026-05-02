"use client";

import ReusableWindow from "@/components/ui/dashboard/ReusableWindow";
import { useOSStore } from "./store/useAppOpen";
import CalculatorApp from "@/components/ui/dashboard/appButtons/Calculator";
import Settings from "@/components/ui/dashboard/Settings";

// Define your app contents here to keep page.tsx clean
const APPS = {
  explorer: {
    title: "File Explorer",
    content: (
      <div className="grid grid-cols-4 gap-4 text-center">
        {["Documents", "Photos", "System"].map((f) => (
          <div key={f} className="p-2 hover:bg-blue-100 rounded cursor-pointer">
            📁 <p className="text-xs">{f}</p>
          </div>
        ))}
      </div>
    ),
    customSize: undefined,
  },
  calculator: {
    title: "Calculator",
    content: <CalculatorApp />,
    customSize: { width: 500, height: 500 }, // Optional custom size for this app
  },
  settings: {
    title: "Settings",
    content: <Settings />,
    customSize: undefined,
  },
};

export default function WindowManager() {
  const { apps, toggleApp } = useOSStore();

  return (
    <>
      {Object.entries(APPS).map(([id, config]) => {
        if (!apps[id]) return null;
        return (
          <ReusableWindow
            key={id}
            title={config.title}
            onClose={() => toggleApp(id, false)}
            customSize={config.customSize}
          >
            {config.content}
          </ReusableWindow>
        );
      })}
    </>
  );
}
