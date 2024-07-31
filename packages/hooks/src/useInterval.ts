import { useEffect } from "react";
import { useCallbackRef } from "./useCallbackRef";
import { window } from "./utils/globals";

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
