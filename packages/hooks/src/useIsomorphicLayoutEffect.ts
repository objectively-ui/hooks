import { isSSR } from "@objectively/utils";
import { useEffect, useLayoutEffect } from "react";

export const useIsomorphicLayoutEffect = isSSR ? useEffect : useLayoutEffect;
