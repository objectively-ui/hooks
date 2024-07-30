import { useEffect, useState } from "react";
import { window } from "./utils/globals";

type DeviceMotion = Pick<
  DeviceMotionEvent,
  "acceleration" | "accelerationIncludingGravity" | "rotationRate" | "interval"
>;

interface UseDeviceMotionOpts {
  onMove: (event: DeviceMotion) => void;
}

const zeroMotion = {
  acceleration: { x: 0, y: 0, z: 0 },
  accelerationIncludingGravity: { x: 0, y: 0, z: 0 },
  rotationRate: { alpha: 0, beta: 0, gamma: 0 },
  interval: 0,
} satisfies DeviceMotion;

export const useDeviceMotion = (opts: UseDeviceMotionOpts): DeviceMotion => {
  const { onMove } = opts;
  const [motion, setMotion] = useState<DeviceMotion>(zeroMotion);

  useEffect(() => {
    const handleChange = (e: DeviceMotionEvent) => {
      setMotion({
        acceleration: e.acceleration,
        accelerationIncludingGravity: e.accelerationIncludingGravity,
        rotationRate: e.rotationRate,
        interval: e.interval,
      });
      onMove(e);
    };

    window.addEventListener("devicemotion", handleChange, { passive: true });

    return () => {
      window.removeEventListener("devicemotion", handleChange);
    };
  }, [onMove]);

  return motion;
};
