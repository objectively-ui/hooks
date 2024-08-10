import { isSSR, navigator, window } from "@objectively/utils";
import { useState } from "react";
import { useEventListener } from "../useEventListener";
import { useFrozen } from "../useFrozen";
import type { UsePreferredLanguageOptions, UsePreferredLanguageReturn } from "./types";

const getPreferredLanguages = (defaultLanguage = "en-US") => {
  if (isSSR) {
    return [defaultLanguage];
  }

  return navigator.languages;
};

export const usePreferredLanguage = (
  opts: UsePreferredLanguageOptions = {},
): UsePreferredLanguageReturn => {
  const [languages, setLanguages] = useState<string[]>([]);

  useEventListener(
    "languagechange",
    () => {
      setLanguages(getPreferredLanguages(opts.defaultLanguage) as string[]);
    },
    {
      eventTarget: window,
      passive: true,
      immediate: true,
    },
  );

  const preferredLanguage = languages[0] || opts.defaultLanguage || "en-US";

  return useFrozen({
    preferredLanguage,
    fallbackLanguages: languages,
  });
};
