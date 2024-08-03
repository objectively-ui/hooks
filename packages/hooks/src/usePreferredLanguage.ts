import { isSSR, navigator, window } from "@objectively/utils";
import { useState } from "react";
import { useEventListener } from "./useEventListener";

const getPreferredLanguages = (defaultLanguage = "en-US") => {
  if (isSSR) {
    return [defaultLanguage];
  }

  return navigator.languages;
};

interface UsePreferredLanguageOptions {
  defaultLanguage?: string;
}

interface UsePreferredLanguageReturn {
  preferredLanguage: string;
  fallbackLanguages: string[];
}

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

  return {
    preferredLanguage: languages[0] || opts.defaultLanguage || "en-US",
    fallbackLanguages: languages,
  };
};
