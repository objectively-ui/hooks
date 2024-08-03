export interface UseSelectionOptions {
  debounce?: number;
}

export interface UseSelectionReturn {
  selection: Selection | null;
  selectedText: string;
}
