import { useAppStore, type ParticlePattern } from "../store/useAppStore";
import { Maximize, Minimize, Box, Circle, Disc, Sparkles } from "lucide-react";

export const UIOverlay = () => {
  const {
    particlePattern,
    setParticlePattern,
    particleColor,
    setParticleColor,
    handOpenness,
    isFullscreen,
    toggleFullscreen,
    isVSign,
    isFingerHeart,
  } = useAppStore();

  const patterns: { id: ParticlePattern; icon: any; label: string }[] = [
    { id: "sphere", icon: Circle, label: "Sphere" },
    { id: "cube", icon: Box, label: "Cube" },
    { id: "torus", icon: Disc, label: "Torus" },
    { id: "galaxy", icon: Sparkles, label: "Galaxy" },
  ];

  const handleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      if (document.exitFullscreen) document.exitFullscreen();
    }
    toggleFullscreen();
  };

  return (
    <div className="absolute inset-0 flex flex-col justify-between p-6 pointer-events-none">
      {/* Center message for V sign */}
      {isVSign && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="px-6 py-3 border rounded-2xl bg-black/40 border-white/10 backdrop-blur-md">
            <span className="text-white font-semibold tracking-[0.25em]">
              I LOVE U
            </span>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-start justify-between pointer-events-auto">
        <div>
          <h1 className="text-2xl font-bold tracking-wider text-white">
            PARTICLE<span className="text-cyan-400">FLOW</span>
          </h1>
          <p className="text-sm text-white/60">Gesture-Controlled 3D System</p>

          <p className="mt-1 text-xs text-white/40">
            Finger heart:{" "}
            <span className={isFingerHeart ? "text-pink-400" : "text-white/20"}>
              {isFingerHeart ? "ON" : "OFF"}
            </span>
            {" · "}
            V sign:{" "}
            <span className={isVSign ? "text-cyan-300" : "text-white/20"}>
              {isVSign ? "ON" : "OFF"}
            </span>
          </p>
        </div>

        <button
          onClick={handleFullscreen}
          className="p-2 text-white transition-colors rounded-lg bg-white/10 hover:bg-white/20 backdrop-blur-sm"
        >
          {isFullscreen ? <Minimize size={20} /> : <Maximize size={20} />}
        </button>
      </div>

      {/* Controls */}
      <div className="flex flex-col max-w-xs gap-4 pointer-events-auto">
        {/* Hand Status */}
        <div className="p-4 border bg-black/40 backdrop-blur-md rounded-xl border-white/10">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-white/80">
              Gesture Control
            </span>
            <span className="font-mono text-xs text-cyan-400">
              {Math.round(handOpenness * 100)}%
            </span>
          </div>
          <div className="w-full h-2 overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full transition-all duration-100 ease-out bg-gradient-to-r from-cyan-500 to-blue-500"
              style={{ width: `${handOpenness * 100}%` }}
            />
          </div>
          <p className="mt-2 text-xs text-white/40">
            Open/Close hand to expand/contract
          </p>
        </div>

        {/* Pattern Selector */}
        <div className="p-4 border bg-black/40 backdrop-blur-md rounded-xl border-white/10">
          <span className="block mb-3 text-sm font-medium text-white/80">
            Pattern
          </span>
          <div className="grid grid-cols-2 gap-2">
            {patterns.map((p) => (
              <button
                key={p.id}
                onClick={() => setParticlePattern(p.id)}
                className={`flex items-center gap-2 p-2 rounded-lg text-sm transition-all ${
                  particlePattern === p.id
                    ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/50"
                    : "bg-white/5 text-white/60 hover:bg-white/10 border border-transparent"
                }`}
              >
                <p.icon size={16} />
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Color Picker */}
        <div className="p-4 border bg-black/40 backdrop-blur-md rounded-xl border-white/10">
          <span className="block mb-3 text-sm font-medium text-white/80">
            Color Tone
          </span>
          <div className="flex items-center gap-3">
            <div className="relative w-full h-10 overflow-hidden border rounded-lg border-white/20">
              <input
                type="color"
                value={particleColor}
                onChange={(e) => setParticleColor(e.target.value)}
                className="absolute -top-2 -left-2 w-[120%] h-[150%] cursor-pointer p-0 border-0"
              />
            </div>
            <span className="font-mono text-xs uppercase text-white/60">
              {particleColor}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
