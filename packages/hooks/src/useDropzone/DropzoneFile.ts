import { randomUUID, window } from "@objectively/utils";
import type { IDropzoneFile } from "./types";

export class DropzoneFile implements IDropzoneFile {
  private _file: File | undefined = undefined;
  private _url: string | null = null;

  id: string;
  lastModified = -2;
  name = "";
  path = "";
  size = -1;
  type = "";
  buffer = () => Promise.resolve(new ArrayBuffer(0));
  text = () => Promise.resolve("");

  constructor(file: File) {
    this.id = randomUUID();
    this.setFile(file);
  }

  get url() {
    if (!this._file) {
      throw new Error("Missing file");
    }

    if (!this._url) {
      this._url = window.URL.createObjectURL(this._file);
    }

    return this._url;
  }

  private setFile(file: File) {
    this._file = file;
    this.path = file.webkitRelativePath;
    this.size = file.size;
    this.name = file.name;
    this.type = file.type;
    this.lastModified = file.lastModified;
    this.buffer = file.arrayBuffer;
    this.text = file.text;
  }

  setData(name: string, newData: string | ArrayBuffer) {
    if (!this._file) {
      throw new Error("Missing file");
    }

    this.dispose();
    const newFile = new File([newData || this._file], name || this.name, {
      lastModified: Date.now(),
      type: this.type,
    });
    this.setFile(newFile);
  }

  dispose() {
    if (this._url) {
      window.URL.revokeObjectURL(this._url);
      this._url = null;
    }
  }
}
