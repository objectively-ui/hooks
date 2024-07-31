import { useState } from "react";
import { useEventListener } from "./useEventListener";
import { window } from "./utils/globals";

interface DeviceOrientation {
  x: number | null;
  y: number | null;
  z: number | null;
  absolute: boolean;
}

export const useDeviceOrientation = (): DeviceOrientation => {
  const [orientation, setOrientation] = useState<DeviceOrientation>({
    absolute: false,
    x: 0,
    y: 0,
    z: 0,
  });

  useEventListener(
    "deviceorientation",
    (e) => {
      setOrientation({
        x: e.beta,
        y: e.gamma,
        z: e.alpha,
        absolute: e.absolute,
      });
    },
    {
      element: window,
      passive: true,
    },
  );

  return orientation;
};
