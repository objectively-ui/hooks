import type { RefCallback } from "react";

export interface IDropzoneFile {
  id: string;
  path: string;
  size: number;
  name: string;
  type: string;
  lastModified: number;
  url: string;
  buffer: () => Promise<ArrayBuffer>;
  text: () => Promise<string>;
}

export interface UseDropzoneOptions {
  onDrop?: (files: IDropzoneFile[], event: Event) => boolean;
  limit?: number;
}

export interface UseDropzoneReturn {
  dropzoneRef: RefCallback<HTMLButtonElement>;
  dragging: boolean;
  files: IDropzoneFile[];
  removeFile: (id: string) => void;
  modifyFile: (
    id: string,
    opts: {
      name?: string;
      content?: ArrayBuffer | string;
    },
  ) => void;
  openFilePicker: () => void;
  reset: () => void;
}
