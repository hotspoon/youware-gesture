import { useEffect, useRef, useState } from "react";
import { FilesetResolver, HandLandmarker } from "@mediapipe/tasks-vision";
import { useAppStore } from "../store/useAppStore";

export const HandTracker = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const setHandOpenness = useAppStore((state) => state.setHandOpenness);
  const requestRef = useRef<number>();

  useEffect(() => {
    let handLandmarker: HandLandmarker | null = null;

    const setupHandLandmarker = async () => {
      try {
        const vision = await FilesetResolver.forVisionTasks(
          "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.0/wasm",
        );
        handLandmarker = await HandLandmarker.createFromOptions(vision, {
          baseOptions: {
            modelAssetPath: `https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task`,
            delegate: "GPU",
          },
          runningMode: "VIDEO",
          numHands: 1,
        });
        setIsLoaded(true);
        startWebcam(handLandmarker);
      } catch (error) {
        console.error("Error initializing hand landmarker:", error);
      }
    };

    setupHandLandmarker();

    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
      if (handLandmarker) handLandmarker.close();
    };
  }, []);

  const startWebcam = async (landmarker: HandLandmarker) => {
    if (!videoRef.current) return;

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480 },
      });
      videoRef.current.srcObject = stream;
      videoRef.current.addEventListener("loadeddata", () => {
        predictWebcam(landmarker);
      });
    } catch (err) {
      console.error("Error accessing webcam:", err);
    }
  };

  const predictWebcam = (landmarker: HandLandmarker) => {
    if (!videoRef.current) return;

    const startTimeMs = performance.now();
    if (videoRef.current.videoWidth > 0) {
      const results = landmarker.detectForVideo(videoRef.current, startTimeMs);

      if (results.landmarks && results.landmarks.length > 0) {
        const landmarks = results.landmarks[0];

        // Calculate openness
        // Wrist: 0
        // Tips: 4 (Thumb), 8 (Index), 12 (Middle), 16 (Ring), 20 (Pinky)
        // MCPs (Knuckles): 1, 5, 9, 13, 17

        // We'll use the distance from the wrist (0) to the tips.
        // To normalize, we divide by the size of the palm (distance from 0 to 9).

        const wrist = landmarks[0];
        const palmSize = Math.sqrt(
          Math.pow(landmarks[9].x - wrist.x, 2) +
            Math.pow(landmarks[9].y - wrist.y, 2) +
            Math.pow(landmarks[9].z - wrist.z, 2),
        );

        const tips = [4, 8, 12, 16, 20];
        let totalTipDistance = 0;

        tips.forEach((tipIndex) => {
          const tip = landmarks[tipIndex];
          const dist = Math.sqrt(
            Math.pow(tip.x - wrist.x, 2) +
              Math.pow(tip.y - wrist.y, 2) +
              Math.pow(tip.z - wrist.z, 2),
          );
          totalTipDistance += dist;
        });

        const avgTipDistance = totalTipDistance / 5;

        // Heuristic:
        // Closed fist: avgTipDistance is roughly equal to palmSize (or less for thumb)
        // Open hand: avgTipDistance is roughly 2x palmSize or more

        const ratio = avgTipDistance / palmSize;

        // Map ratio to 0-1 range
        // Observed range: ~0.8 (closed) to ~2.2 (open)
        const minRatio = 0.9;
        const maxRatio = 2.0;

        let openness = (ratio - minRatio) / (maxRatio - minRatio);
        openness = Math.max(0, Math.min(1, openness));

        setHandOpenness(openness);
      }
    }

    requestRef.current = requestAnimationFrame(() => predictWebcam(landmarker));
  };

  return (
    <div className="fixed bottom-4 right-4 w-32 h-24 bg-black/50 rounded-lg overflow-hidden border border-white/20 z-50">
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center text-xs text-white">
          Loading AI...
        </div>
      )}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="w-full h-full object-cover opacity-80"
      />
    </div>
  );
};
