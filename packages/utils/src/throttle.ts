import type { UnknownFunction } from "./types";

export const throttle = <TFunc extends UnknownFunction>(func: TFunc, delay: number) => {
  let lastTime = 0;

  return ((...args) => {
    if (Date.now() - lastTime < delay) {
      return;
    }
    lastTime = Date.now();

    return func(...args);
  }) as TFunc;
};
