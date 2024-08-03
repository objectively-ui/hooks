export type DeviceMotion = Pick<
  DeviceMotionEvent,
  "acceleration" | "accelerationIncludingGravity" | "rotationRate" | "interval"
>;

export interface UseDeviceMotionOpts {
  onMove: (event: DeviceMotion) => void;
}
