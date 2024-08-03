import { window } from "@objectively/utils";
import { useEffect } from "react";
import { useCallbackRef } from "./useCallbackRef";

export const useInterval = (callback: () => void, delay: number) => {
  const cb = useCallbackRef(callback);

  useEffect(() => {
    const interval = window.setInterval(() => {
      cb.current();
    }, delay);

    return () => {
      window.clearInterval(interval);
    };
  }, [delay]);
};
