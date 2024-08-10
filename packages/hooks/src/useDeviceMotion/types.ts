export type DeviceMotion = Pick<
  DeviceMotionEvent,
  "acceleration" | "accelerationIncludingGravity" | "rotationRate" | "interval"
>;
