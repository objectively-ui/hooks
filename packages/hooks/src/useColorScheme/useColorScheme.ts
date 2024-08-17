import { isSSR } from "@objectively/utils";
import { useCallback, useState } from "react";
import { useAtom, useAtomState } from "../useAtom";
import { useLocalStorageState } from "../useBrowserStorageState";
import { useCallbackRef } from "../useCallbackRef";
import { useEventListener } from "../useEventListener";
import type { ColorScheme, UseColorSchemeOptions } from "./types";

const storageKey = "objectively.colorscheme";

const prefersDarkMatcher = isSSR ? undefined : window.matchMedia("(prefers-color-scheme: dark)");

const getPreferredScheme = () => (prefersDarkMatcher?.matches ? "dark" : "light");

export const useColorScheme = (
  opts: UseColorSchemeOptions = {},
): [ColorScheme, (colorScheme: ColorScheme) => void] => {
  const { force } = opts;

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
