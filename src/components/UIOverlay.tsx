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
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
    toggleFullscreen();
  };

  return (
    <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-6">
      {/* Header */}
      <div className="flex justify-between items-start pointer-events-auto">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-wider">
            PARTICLE<span className="text-cyan-400">FLOW</span>
          </h1>
          <p className="text-white/60 text-sm">Gesture-Controlled 3D System</p>
        </div>

        <button
          onClick={handleFullscreen}
          className="p-2 bg-white/10 hover:bg-white/20 rounded-lg text-white transition-colors backdrop-blur-sm"
        >
          {isFullscreen ? <Minimize size={20} /> : <Maximize size={20} />}
        </button>
      </div>

      {/* Controls */}
      <div className="flex flex-col gap-4 pointer-events-auto max-w-xs">
        {/* Hand Status */}
        <div className="bg-black/40 backdrop-blur-md p-4 rounded-xl border border-white/10">
          <div className="flex justify-between items-center mb-2">
            <span className="text-white/80 text-sm font-medium">
              Gesture Control
            </span>
            <span className="text-xs text-cyan-400 font-mono">
              {Math.round(handOpenness * 100)}%
            </span>
          </div>
          <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-100 ease-out"
              style={{ width: `${handOpenness * 100}%` }}
            />
          </div>
          <p className="text-xs text-white/40 mt-2">
            Open/Close hand to expand/contract
          </p>
        </div>

        {/* Pattern Selector */}
        <div className="bg-black/40 backdrop-blur-md p-4 rounded-xl border border-white/10">
          <span className="text-white/80 text-sm font-medium block mb-3">
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
        <div className="bg-black/40 backdrop-blur-md p-4 rounded-xl border border-white/10">
          <span className="text-white/80 text-sm font-medium block mb-3">
            Color Tone
          </span>
          <div className="flex items-center gap-3">
            <div className="relative w-full h-10 rounded-lg overflow-hidden border border-white/20">
              <input
                type="color"
                value={particleColor}
                onChange={(e) => setParticleColor(e.target.value)}
                className="absolute -top-2 -left-2 w-[120%] h-[150%] cursor-pointer p-0 border-0"
              />
            </div>
            <span className="text-white/60 font-mono text-xs uppercase">
              {particleColor}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
