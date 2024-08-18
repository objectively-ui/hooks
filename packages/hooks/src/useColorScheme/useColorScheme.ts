import { useCallback } from "react";
import { useAtom, useAtomState } from "../useAtom";
import { useLocalStorageState } from "../useBrowserStorageState";
import { useCallbackRef } from "../useCallbackRef";
import { useMediaQuery } from "../useMediaQuery";
import type { ColorScheme, UseColorSchemeOptions } from "./types";

const storageKey = "objectively.colorscheme";

export const useColorScheme = (
  opts: UseColorSchemeOptions = {},
): [ColorScheme, (colorScheme: ColorScheme) => void] => {
  const { force } = opts;
  const preferredScheme = useMediaQuery("(prefers-color-scheme: dark)") ? "dark" : "light";
  const [localStorageValue, setLocalStorageValue] = useLocalStorageState<ColorScheme | undefined>(
    storageKey,
  );
  const restoreColorScheme = useCallbackRef(
    opts.persist?.getColorScheme || (() => localStorageValue),
  );
  const persistColorScheme = useCallbackRef(opts.persist?.setColorScheme || setLocalStorageValue);

  const colorSchemeAtom = useAtom<ColorScheme | undefined>(
    "objectively.colorscheme",
    force ?? restoreColorScheme.current(),
  );

  const [userScheme, setUserScheme] = useAtomState(colorSchemeAtom);

  const setScheme = useCallback(
    (colorScheme: ColorScheme) => {
      if (colorScheme === preferredScheme) {
        setUserScheme(undefined);
        persistColorScheme.current(undefined);
      } else {
        setUserScheme(colorScheme);
        persistColorScheme.current(colorScheme);
      }
    },
    [preferredScheme],
  );

  return [force || userScheme || preferredScheme, setScheme];
};
