import { deepFreeze, window } from "@objectively/utils";
import { useState } from "react";
import { useEventListener } from "../useEventListener";
import type { DeviceMotion } from "./types";

const zeroMotion = deepFreeze<DeviceMotion>({
  acceleration: { x: 0, y: 0, z: 0 },
  accelerationIncludingGravity: { x: 0, y: 0, z: 0 },
  rotationRate: { alpha: 0, beta: 0, gamma: 0 },
  interval: 0,
});

export const useDeviceMotion = (): DeviceMotion => {
  const [motion, setMotion] = useState<DeviceMotion>(zeroMotion);

  useEventListener(
    "devicemotion",
    (e) => {
      setMotion(
        deepFreeze({
          acceleration: e.acceleration,
          accelerationIncludingGravity: e.accelerationIncludingGravity,
          rotationRate: e.rotationRate,
          interval: e.interval,
        }),
      );
    },
    {
      eventTarget: window,
      passive: true,
    },
  );

  return motion;
};
