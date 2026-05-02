import { create } from "zustand";

interface OSState {
  apps: Record<string, boolean>;
  toggleApp: (appId: string, isOpen: boolean) => void;
}

export const useOSStore = create<OSState>((set) => ({
  apps: {},
  toggleApp: (appId, isOpen) =>
    set((state) => ({
      apps: { ...state.apps, [appId]: isOpen },
    })),
}));
