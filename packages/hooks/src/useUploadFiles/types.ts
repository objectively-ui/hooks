interface Uploadable {
  signal: AbortSignal;
  progress: (progress: number) => void;
}

export interface UploadableFile extends Uploadable {
  file: File;
}

export interface UploadableChunk extends Uploadable {
  chunk: Blob;
}

export interface UseUploadFilesOptions<TChunkedUpload extends boolean> {
  files: UploadableFile[];
  uploader: TChunkedUpload extends true
    ? (chunk: UploadableChunk) => Promise<void>
    : (file: UploadableFile) => Promise<void>;
  parallel?: number;
  retries?: number;
  retryDelay?: number | ((attempt: number) => number);
  chunked?: TChunkedUpload;
  chunkSize?: TChunkedUpload extends true ? number : never;
  autoStart?: boolean;
}

export type UploadStatus = "pending" | "uploading" | "error" | "retrying" | "done";

export interface UploadingFile {
  id: string;
  file: File;
  status: UploadStatus;
  error?: Error;
  progress: number;
}

export interface UseUploadFilesReturn {
  status: UploadStatus;
  statuses: Record<string, UploadingFile>;
  startUpload: () => void;
  retryUpload: (fileId: string) => void;
  cancelUpload: (fileId?: string) => void;
}
