export interface UseScriptOptions {
  crossOrigin?: boolean;
  integrity?: string;
}

export interface UseScriptReturn {
  ready: boolean;
  error?: Error;
}
