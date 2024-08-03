import { window } from "@objectively/utils";
import { useEffect, useRef } from "react";
import { useCallbackRef } from "../useCallbackRef";

export const useInterval = (callback: () => void, delay: number | null) => {
  const cb = useCallbackRef(callback);
  const intervalRef = useRef<number | undefined>();

  useEffect(() => {
    if (delay === null) {
      window.clearInterval(intervalRef.current);
    } else {
      intervalRef.current = window.setInterval(() => {
        cb.current();
      }, delay);
    }

    return () => {
      window.clearInterval(intervalRef.current);
    };
  }, [delay]);
};
