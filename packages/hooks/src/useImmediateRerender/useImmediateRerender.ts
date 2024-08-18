import { useEffect } from "react";
import { useRerender } from "../useRerender";

export const useImmediateRerender = () => {
  const rerender = useRerender();
  useEffect(rerender, []);
};
