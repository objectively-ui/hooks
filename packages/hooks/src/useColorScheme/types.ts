export type ColorScheme = "light" | "dark";

export interface PersistColorScheme {
  getColorScheme: () => ColorScheme | undefined;
  setColorScheme: (colorScheme: ColorScheme) => void | Promise<void>;
}

export interface UseColorSchemeOptions {
  force?: ColorScheme;
  persist?: PersistColorScheme;
}
