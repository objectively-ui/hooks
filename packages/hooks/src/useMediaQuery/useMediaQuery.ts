import { window } from "@objectively/utils";
import { useEffect, useState } from "react";

export const useMediaQuery = (query: string) => {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const queryList = window.matchMedia(query);
    const handleChange = () => setMatches(queryList.matches);
    queryList.addEventListener("change", handleChange, { passive: true });

    return () => queryList.removeEventListener("change", handleChange);
  }, [query]);

  return matches;
};
