import { create } from "zustand";

export type ParticlePattern = "sphere" | "cube" | "torus" | "galaxy";

interface AppState {
  handOpenness: number; // 0 (closed) to 1 (open)
  particleColor: string;
  particlePattern: ParticlePattern;
  isFullscreen: boolean;

  setHandOpenness: (value: number) => void;
  setParticleColor: (color: string) => void;
  setParticlePattern: (pattern: ParticlePattern) => void;
  toggleFullscreen: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  handOpenness: 1, // Default to open
  particleColor: "#00ffff", // Cyan default
  particlePattern: "sphere",
  isFullscreen: false,

  setHandOpenness: (value) => set({ handOpenness: value }),
  setParticleColor: (color) => set({ particleColor: color }),
  setParticlePattern: (pattern) => set({ particlePattern: pattern }),
  toggleFullscreen: () =>
    set((state) => ({ isFullscreen: !state.isFullscreen })),
}));
