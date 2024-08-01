import { useState } from "react";
import { useCallbackRef } from "./useCallbackRef";
import { useEventListener } from "./useEventListener";
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
  const onMoveRef = useCallbackRef(opts.onMove);
  const [motion, setMotion] = useState<DeviceMotion>(zeroMotion);

  useEventListener(
    "devicemotion",
    (e) => {
      setMotion({
        acceleration: e.acceleration,
        accelerationIncludingGravity: e.accelerationIncludingGravity,
        rotationRate: e.rotationRate,
        interval: e.interval,
      });
      onMoveRef.current(e);
    },
    {
      eventTarget: window,
      passive: true,
    },
  );

  return motion;
};
