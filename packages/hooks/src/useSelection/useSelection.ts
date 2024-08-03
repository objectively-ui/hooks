import { document } from "@objectively/utils";
import { useState } from "react";
import { useDebounce } from "../useDebounce";
import { useEventListener } from "../useEventListener";
import type { UseSelectionOptions, UseSelectionReturn } from "./types";

export const useSelection = (opts: UseSelectionOptions = {}): UseSelectionReturn => {
  const { debounce = 400 } = opts;
  const [selection, setSelection] = useState<Selection | null>(null);
  const [, setState] = useState("");

  const debounced = useDebounce(() => {
    const selection = document.getSelection();
    setSelection(selection);
    // Selection is a singleton or something so React doesn't re-render when it changes
    setState(`${selection?.focusOffset}-${selection?.anchorOffset}-${selection?.toString()}`);
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
