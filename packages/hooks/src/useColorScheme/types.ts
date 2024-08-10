export type ColorScheme = "light" | "dark";

export interface PersistColorScheme {
  getColorScheme: () => ColorScheme | undefined;
  setColorScheme: (colorScheme: ColorScheme | undefined) => void | Promise<void>;
}

export interface UseColorSchemeOptions {
  force?: ColorScheme;
  persist?: PersistColorScheme;
}
