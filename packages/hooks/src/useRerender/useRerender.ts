import { useCallback, useState } from "react";

export const useRerender = (): (() => void) => {
  const [_, setState] = useState(false);

  return useCallback(() => setState((c) => !c), []);
};
