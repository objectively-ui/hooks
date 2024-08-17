export interface UseListOptions<TItem, TIndex extends string | number> {
  indexBy?: (item: TItem) => TIndex;
}

export interface UseListReturn<TItem, TIndex extends string | number> {
  items: TItem[];
  addItem: (item: TItem) => void;
  removeItem: (index: TIndex) => void;
  containsItem: (index: TIndex) => void;
}
