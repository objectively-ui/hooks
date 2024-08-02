import { window } from "./globals";

export const isSSR = typeof window === "undefined";
