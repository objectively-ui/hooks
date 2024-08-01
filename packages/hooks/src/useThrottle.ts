import { useEffect, useRef } from "react";
import type { UnknownFunction } from "./types";
import { useCallbackRef } from "./useCallbackRef";
import { throttle } from "./utils/throttle";

export const useThrottle = <TFunc extends UnknownFunction>(func: TFunc, delay: number): TFunc => {
  const funcRef = useCallbackRef(func);
  const ref = useRef(throttle(((...args) => funcRef.current(...args)) as TFunc, delay));

  useEffect(() => {
    ref.current = throttle(((...args) => funcRef.current(...args)) as TFunc, delay);
  }, [delay]);

  return ref.current;
};
