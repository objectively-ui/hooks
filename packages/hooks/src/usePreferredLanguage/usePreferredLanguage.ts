import { navigator, window } from "@objectively/utils";
import { useMemo, useState } from "react";
import { useEventListener } from "../useEventListener";
import { useFrozen } from "../useFrozen";
import type { UsePreferredLanguageOptions, UsePreferredLanguageReturn } from "./types";

export const usePreferredLanguage = (
  opts: UsePreferredLanguageOptions = {},
): UsePreferredLanguageReturn => {
  const [languages, setLanguages] = useState<string[]>([]);

  useEventListener(
    "languagechange",
    () => {
      setLanguages(navigator.languages as string[]);
    },
    {
      eventTarget: window,
      passive: true,
      immediate: true,
    },
  );

  const preferredLanguage = languages[0] || opts.defaultLanguage || "en-US";
  const locale = useMemo(() => new Intl.Locale(preferredLanguage).maximize(), [preferredLanguage]);

  return useFrozen({
    preferredLanguage: `${locale.language}-${locale.region}`,
    fallbackLanguages: languages,
  });
};
