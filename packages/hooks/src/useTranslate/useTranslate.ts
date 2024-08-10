import { type UnknownRecord, interpolate } from "@objectively/utils";
import { useCallback } from "react";
import { usePreferredLanguage } from "../usePreferredLanguage";
import type { TranslationsLangDict, UseTranslateOptions, UseTranslateReturn } from "./types";

const getLocale = (lang: string) => {
  const locale = new Intl.Locale(lang).maximize();

  return `${locale.language}-${locale.region}`;
};

export const useTranslate = <
  const TLocale extends string,
  const TTranslations extends TranslationsLangDict<TLocale>,
>(
  dict: TTranslations,
  opts: UseTranslateOptions<TLocale> = {},
): UseTranslateReturn<TLocale, TTranslations> => {
  const { locale } = opts;
  const { preferredLanguage } = usePreferredLanguage();
  const lang = getLocale(locale || preferredLanguage);

  const T = useCallback<UseTranslateReturn<TLocale, TTranslations>["T"]>(
    (key, opts = {}) => {
      const { data } = opts;
      let value: string | UnknownRecord = dict;

      for (const part of key.split(".")) {
        // @ts-ignore
        value = value[part];
      }

      if (typeof value !== "object") {
        throw new Error(
          `Expected the value at ${key} to be a Record<string, string>, but it was a ${typeof value}`,
        );
      }

      value = value[lang] as string;

      if (typeof value !== "string") {
        throw new Error(
          `Expected the value at ${key}[${lang}] to be a string, but it was a ${typeof value}.`,
        );
      }

      return interpolate(value, data);
    },
    [dict, lang],
  );

  return { T };
};
