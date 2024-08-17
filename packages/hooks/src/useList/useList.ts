import type { UseListOptions, UseListReturn } from "./types";

export const useList = <TItem, TIndex extends string | number>(
  items: TItem[],
  opts: UseListOptions<TItem, TIndex> = {},
): UseListReturn<TItem, TIndex> => {};
