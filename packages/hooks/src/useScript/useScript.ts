import { document } from "@objectively/utils";
import { useEffect, useState } from "react";
import type { UseScriptOptions, UseScriptReturn } from "./types";

export const useScript = (src: string, opts: UseScriptOptions = {}): UseScriptReturn => {
  const { crossOrigin, integrity } = opts;
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<Error>();

  useEffect(() => {
    const el = document.createElement("script");
    el.setAttribute("async", "true");

    if (crossOrigin) {
      el.setAttribute("crossorigin", "true");
    }

    if (integrity) {
      el.setAttribute("integrity", integrity);
    }

    el.addEventListener("load", () => setReady(true));
    el.addEventListener("error", (e) => setError(e.error));

    el.src = src;
    document.head.appendChild(el);

    return () => {
      setReady(false);
      setError(undefined);
      el?.remove();
    };
  }, [src, crossOrigin, integrity]);

  return { ready, error };
};
