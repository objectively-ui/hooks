import { useEffect, useState } from "react";
import { useThrottle } from "../useThrottle/useThrottle";

export const useThrottleValue = <TValue>(value: TValue, delay: number): TValue => {
  const [throttled, setThrottled] = useState(value);
  const update = useThrottle(setThrottled, delay);

  useEffect(() => {
    update(value);
  }, [update, value]);

  return throttled;
};
