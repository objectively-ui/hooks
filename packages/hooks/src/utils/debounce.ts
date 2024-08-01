import type { UnknownFunction } from "../types";
import { window } from "./globals";

export const debounce = <TFunc extends UnknownFunction>(func: TFunc, delay: number) => {
  let timeout: number;

  return ((...args) => {
    clearTimeout(timeout);
    timeout = window.setTimeout(() => {
      return func(...args);
    }, delay);
  }) as TFunc;
};
