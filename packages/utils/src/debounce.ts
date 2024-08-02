import { window } from "./globals";
import type { UnknownFunction } from "./types";

export const debounce = <TFunc extends UnknownFunction>(func: TFunc, delay: number) => {
  let timeout: number;

  return ((...args) => {
    clearTimeout(timeout);
    timeout = window.setTimeout(() => {
      return func(...args);
    }, delay);
  }) as TFunc;
};
