import { isSSR } from "@objectively/utils/ssr";
import { useCallback, useState } from "react";
import { useCallbackRef } from "./useCallbackRef";
import { useEventListener } from "./useEventListener";

export type ColorScheme = "light" | "dark";

interface PersistColorScheme {
  getColorScheme: () => ColorScheme | undefined;
  setColorScheme: (colorScheme: ColorScheme) => void | Promise<void>;
}

interface UseColorSchemeOptions {
  force?: ColorScheme;
  persist?: PersistColorScheme;
}

const prefersDarkMatcher = isSSR ? undefined : window.matchMedia("(prefers-color-scheme: dark)");

const getPreferredScheme = () => (prefersDarkMatcher?.matches ? "dark" : "light");

const localStoragePersist: PersistColorScheme = {
  getColorScheme: () => {
    if (isSSR) {
      return undefined;
    }
    const saved = localStorage.getItem("color-scheme");

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
    isSSR ? undefined : localStorage.setItem("color-scheme", JSON.stringify(colorScheme)),
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
      } else {
        setUserScheme(colorScheme);
        persistColorScheme.current(colorScheme);
      }
    },
    [systemScheme],
  );

  return [force || userScheme || systemScheme, setScheme];
};
