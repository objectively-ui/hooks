import { useEffect, useLayoutEffect } from "react";
import { isSSR } from "./utils/ssr";

export const useIsomorphicLayoutEffect = isSSR ? useEffect : useLayoutEffect;
