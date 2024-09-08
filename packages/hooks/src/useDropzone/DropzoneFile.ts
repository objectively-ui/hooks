import { randomUUID, window } from "@objectively/utils";
import type { IDropzoneFile } from "./types";

export class DropzoneFile implements IDropzoneFile {
  private file: File | undefined = undefined;
  private _url: string | null = null;

  id: string;

  constructor(file: File) {
    this.id = randomUUID();
    this.file = file;
  }

  get url() {
    if (!this.file) {
      throw new Error("Missing file");
    }

    if (!this._url) {
      this._url = window.URL.createObjectURL(this.file);
    }

    return this._url;
  }

  get name() {
    return this.file?.name ?? "";
  }

  get type() {
    return this.file?.type ?? "";
  }

  get path() {
    return this.file?.webkitRelativePath ?? "";
  }

  get size() {
    return this.file?.size ?? -1;
  }

  get lastModified() {
    return this.file?.lastModified ?? 0;
  }

  get buffer() {
    return (
      this.file?.arrayBuffer ??
      (() => {
        throw new Error("Missing file");
      })
    );
  }

  get text() {
    return (
      this.file?.text ??
      (() => {
        throw new Error("Missing file");
      })
    );
  }

  setData(name: string, newData: string | ArrayBuffer) {
    if (!this.file) {
      throw new Error("Missing file");
    }

    this.dispose();
    this.file = new File([newData || this.file], name || this.name, {
      lastModified: Date.now(),
      type: this.type,
    });
  }

  dispose() {
    if (this._url) {
      window.URL.revokeObjectURL(this._url);
      this._url = null;
    }
  }
}
