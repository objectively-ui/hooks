import { useCallback, useEffect, useState } from "react";
import { isSSR } from "./utils/ssr";

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
  const restoreColorScheme = opts.persist?.getColorScheme || localStoragePersist.getColorScheme;
  const persistColorScheme = opts.persist?.setColorScheme || localStoragePersist.setColorScheme;

  const [userScheme, setUserScheme] = useState<ColorScheme | undefined>(
    force || restoreColorScheme(),
  );
  const [systemScheme, setSystemScheme] = useState<ColorScheme>(getPreferredScheme());

  useEffect(() => {
    const handleChange = () => {
      if (force) {
        return;
      }

      setSystemScheme(getPreferredScheme());
    };

    prefersDarkMatcher?.addEventListener("change", handleChange, {
      passive: true,
    });

    return () => {
      prefersDarkMatcher?.removeEventListener("change", handleChange);
    };
  }, [force]);

  const setScheme = useCallback(
    (colorScheme: ColorScheme) => {
      if (colorScheme === systemScheme) {
        setUserScheme(undefined);
      } else {
        setUserScheme(colorScheme);
        persistColorScheme(colorScheme);
      }
    },
    [systemScheme, persistColorScheme],
  );

  return [force || userScheme || systemScheme, setScheme];
};
