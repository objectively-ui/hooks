import { document } from "@objectively/utils";
import { useState } from "react";
import { useDebounce } from "../useDebounce";
import { useEventListener } from "../useEventListener";
import { useRerender } from "../useRerender";
import type { UseSelectionOptions, UseSelectionReturn } from "./types";

export const useSelection = (opts: UseSelectionOptions = {}): UseSelectionReturn => {
  const { debounce = 400 } = opts;
  const [selection, setSelection] = useState<Selection | null>(null);
  const rerender = useRerender();

  const debounced = useDebounce(() => {
    const selection = document.getSelection();
    setSelection(selection);
    rerender();
  }, debounce);

  useEventListener("selectionchange", debounced, {
    eventTarget: document,
    passive: true,
    immediate: true,
  });

  return {
    selection,
    selectedText: selection?.toString() || "",
  };
};
