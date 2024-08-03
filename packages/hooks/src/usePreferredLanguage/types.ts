export interface UsePreferredLanguageOptions {
  defaultLanguage?: string;
}

export interface UsePreferredLanguageReturn {
  preferredLanguage: string;
  fallbackLanguages: string[];
}
