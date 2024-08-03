import { document } from "@objectively/utils";
import { useState } from "react";
import { useEventListener } from "./useEventListener";

interface UseSelectionOptions {
  element?: Element;
  allowPartialContainment?: boolean;
}

export const useSelection = (opts: UseSelectionOptions = {}): Selection | null => {
  const { element, allowPartialContainment = true } = opts;

  const [selection, setSelection] = useState<Selection | null>(null);

  useEventListener(
    "selectionchange",
    () => {
      if (element instanceof HTMLInputElement) {
        return;
      }

      const selection = document.getSelection();

      if (!element || (element && selection?.containsNode(element, allowPartialContainment))) {
        setSelection(selection);
      } else {
        setSelection(null);
      }
    },
    {
      eventTarget: document,
      passive: true,
      immediate: true,
    },
  );

  return selection;
};
