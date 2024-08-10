import { isSSR } from "@objectively/utils";
import { useCallback, useState } from "react";
import { useCallbackRef } from "../useCallbackRef";
import { useEventListener } from "../useEventListener";
import type { ColorScheme, PersistColorScheme, UseColorSchemeOptions } from "./types";

const storageKey = "objectively.colorscheme";

const prefersDarkMatcher = isSSR ? undefined : window.matchMedia("(prefers-color-scheme: dark)");

const getPreferredScheme = () => (prefersDarkMatcher?.matches ? "dark" : "light");

const localStoragePersist: PersistColorScheme = {
  getColorScheme: () => {
    if (isSSR) {
      return undefined;
    }
    const saved = localStorage.getItem(storageKey);

    if (!saved) {
      return undefined;
    }

    try {
      return JSON.parse(saved) as ColorScheme;
    } catch (e) {
      return undefined;
    }
  },
  setColorScheme: (colorScheme) =>
    isSSR
      ? undefined
      : colorScheme
        ? localStorage.setItem(storageKey, JSON.stringify(colorScheme))
        : localStorage.removeItem(storageKey),
};

export const useColorScheme = (
  opts: UseColorSchemeOptions = {},
): [ColorScheme, (colorScheme: ColorScheme) => void] => {
  const { force } = opts;
  const restoreColorScheme = useCallbackRef(
    opts.persist?.getColorScheme || localStoragePersist.getColorScheme,
  );
  const persistColorScheme = useCallbackRef(
    opts.persist?.setColorScheme || localStoragePersist.setColorScheme,
  );

  const [userScheme, setUserScheme] = useState<ColorScheme | undefined>(
    force || restoreColorScheme.current(),
  );
  const [systemScheme, setSystemScheme] = useState<ColorScheme>(getPreferredScheme());

  useEventListener(
    "change",
    () => {
      if (force) {
        return;
      }

      setSystemScheme(getPreferredScheme());
    },
    {
      eventTarget: prefersDarkMatcher,
      passive: true,
    },
  );

  const setScheme = useCallback(
    (colorScheme: ColorScheme) => {
      if (colorScheme === systemScheme) {
        setUserScheme(undefined);
        persistColorScheme.current(undefined);
      } else {
        setUserScheme(colorScheme);
        persistColorScheme.current(colorScheme);
      }
    },
    [systemScheme],
  );

  return [force || userScheme || systemScheme, setScheme];
};
