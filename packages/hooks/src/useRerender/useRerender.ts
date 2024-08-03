import { useCallback, useState } from "react";

export const useRerender = (): (() => void) => {
  const [_, setState] = useState(0);

  return useCallback(() => setState((c) => c + 1), []);
};
