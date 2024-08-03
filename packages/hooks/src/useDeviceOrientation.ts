import { deepFreeze, window } from "@objectively/utils";
import { useState } from "react";
import { useEventListener } from "./useEventListener";

interface DeviceOrientation {
  x: number | null;
  y: number | null;
  z: number | null;
  absolute: boolean;
}

const defaultOrientation = deepFreeze({
  absolute: false,
  x: 0,
  y: 0,
  z: 0,
});

export const useDeviceOrientation = (): DeviceOrientation => {
  const [orientation, setOrientation] = useState<DeviceOrientation>(defaultOrientation);

  useEventListener(
    "deviceorientation",
    (e) => {
      setOrientation(
        deepFreeze({
          x: e.beta,
          y: e.gamma,
          z: e.alpha,
          absolute: e.absolute,
        }),
      );
    },
    {
      eventTarget: window,
      passive: true,
    },
  );

  return orientation;
};
