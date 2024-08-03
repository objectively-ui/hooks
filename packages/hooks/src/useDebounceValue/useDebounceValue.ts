import { useEffect, useState } from "react";
import { useDebounce } from "../useDebounce";

export const useDebounceValue = <TValue>(value: TValue, delay: number): TValue => {
  const [debounced, setDebounced] = useState(value);
  const update = useDebounce(setDebounced, delay);

  useEffect(() => {
    update(value);
  }, [update, value]);

  return debounced;
};
