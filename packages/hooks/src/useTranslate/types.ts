import type { UnknownRecord } from "@objectively/utils";

type LocaleDict<TLocale extends string> = Record<TLocale, string>;
type StringDict<TLocale extends string> = {
  [key: string]: string | StringDict<TLocale> | LocaleDict<TLocale>;
};

export type TranslationsLangDict<TLocale extends string> = StringDict<TLocale>;

export type UseTranslateOptions<TLocale extends string> = {
  locale?: TLocale;
};

export type UseTranslateReturn<
  TLocale extends string,
  TDict extends TranslationsLangDict<TLocale>,
> = {
  T: (
    key: FlattenedTranslationsKeys<TLocale, TDict>,
    opts?: {
      data?: Record<string, string | number | boolean>;
    },
  ) => string;
};

type FlattenedTranslationsKeys<
  TLocale extends string,
  T extends UnknownRecord,
  K = keyof T,
> = K extends string
  ? T[K] extends LocaleDict<TLocale>
    ? `${K}`
    : T[K] extends UnknownRecord
      ? `${K}.${FlattenedTranslationsKeys<TLocale, T[K]>}`
      : `${K}`
  : never;
