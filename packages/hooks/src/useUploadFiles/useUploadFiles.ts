import { randomUUID } from "@objectively/utils";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type {
  UploadStatus,
  UploadableFile,
  UploadingFile,
  UseUploadFilesOptions,
  UseUploadFilesReturn,
} from "./types";

const DEFAULT_CHUNK_SIZE = 1024 * 1024;
const DEFAULT_RETRY_DELAY = (attempt: number) => 2000 * 2 ** attempt;
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const useUploadFiles = <TChunked extends boolean>(
  opts: UseUploadFilesOptions<TChunked>,
): UseUploadFilesReturn => {
  const {
    files = [],
    uploader,
    chunkSize = DEFAULT_CHUNK_SIZE,
    chunked = false as TChunked,
    parallel = 1,
    retries = 3,
    retryDelay = DEFAULT_RETRY_DELAY,
    autoStart = true,
  } = opts;
  const abortControllers = useRef(new Map<string, AbortController>());
  const [uploadState, setUploadState] = useState(new Map<string, UploadingFile>());

  const setFileStatus = useCallback((fileId: string, updates: Partial<UploadingFile>) => {
    setUploadState((currentMap) => {
      if (!currentMap.has(fileId)) {
        return currentMap;
      }
      const copyMap = new Map(currentMap);
      const currentData = currentMap.get(fileId) as UploadingFile;
      copyMap.set(fileId, {
        ...currentData,
        ...updates,
      });
      return copyMap;
    });
  }, []);

  const startUpload = useCallback(
    (file: UploadingFile) => {
      const upload = async (attempt: number) => {
        const abortController = new AbortController();

        try {
          setFileStatus(file.id, { status: "uploading" });
          const progressSetter = (progress: number) => {
            setFileStatus(file.id, { progress: Math.max(Math.min(progress, 1), 0) });
          };

          abortControllers.current.set(file.id, abortController);

          if (chunked) {
            // a
            console.log(chunkSize);
          } else {
            await (uploader as (file: UploadableFile) => Promise<void>)({
              file: file.file,
              progress: progressSetter,
              signal: abortController.signal,
            });
          }

          setFileStatus(file.id, { status: "done" });
          abortControllers.current.delete(file.id);
        } catch (e) {
          const error = e instanceof Error ? e : new Error(e?.toString());

          if (attempt > retries || abortController.signal.aborted) {
            setFileStatus(file.id, {
              status: "error",
              error,
            });
          } else {
            setFileStatus(file.id, { status: "retrying" });
            if (typeof retryDelay === "number") {
              await delay(retryDelay);
            } else {
              await delay(retryDelay(attempt));
            }
            upload(attempt + 1);
          }
        }
      };

      upload(1);
    },
    [retries, retryDelay, chunked, chunkSize, uploader, setFileStatus],
  );

  useEffect(() => {
    const fileFiles = files.map((f) => f.file);
    const fileSet = new WeakSet(fileFiles);
    const uploadStateFiles = Array.from(uploadState.values());
    const uploadStateFileSet = new WeakSet(uploadStateFiles.map((f) => f.file));

    if (uploadStateFiles.length > 0) {
      for (const file of uploadStateFiles) {
        if (!fileSet.has(file.file)) {
          // no longer in the input file list, remove
          cancelUpload(file.id);
          setUploadState((currentMap) => {
            const copyMap = new Map(currentMap);
            copyMap.delete(file.id);
            return copyMap;
          });
        }
      }
    }

    if (files.length > 0) {
      const newFiles: UploadingFile[] = [];

      for (const file of fileFiles) {
        if (!uploadStateFileSet.has(file)) {
          newFiles.push({
            id: randomUUID(),
            file: file,
            progress: 0,
            status: "pending",
          });
        }
      }

      if (newFiles.length > 0) {
        setUploadState((currentMap) => {
          const copyMap = new Map(currentMap);
          for (const file of newFiles) {
            copyMap.set(file.id, file);
          }
          return copyMap;
        });
      }
    }
  }, [files, uploadState]);

  const startUploads = useCallback(() => {
    const uploadStates = Array.from(uploadState.values());
    const pendingFiles = uploadStates.filter((file) => file.status === "pending");
    const uploadingFiles = uploadStates.filter(
      (file) => file.status === "uploading" || file.status === "retrying",
    );

    if (uploadingFiles.length < parallel && pendingFiles.length > 0) {
      for (let i = 0; i < parallel - uploadingFiles.length && i < pendingFiles.length; ++i) {
        const file = pendingFiles[i];
        file && startUpload(file);
      }
    }
  }, [uploadState, parallel, startUpload]);

  useEffect(() => {
    if (autoStart) {
      startUploads();
    }
  }, [startUploads, autoStart]);

  const retryUpload = useCallback(
    (fileId: string) => {
      if (!uploadState.has(fileId)) {
        return;
      }

      const file = uploadState.get(fileId) as UploadingFile;
      if (file.status !== "error") {
        return;
      }

      setFileStatus(fileId, { status: "pending" });
    },
    [uploadState, setFileStatus],
  );

  const cancelUpload = useCallback((fileId?: string) => {
    if (fileId) {
      const controller = abortControllers.current.get(fileId);
      controller?.abort();
    } else {
      for (const controller of Array.from(abortControllers.current.values())) {
        controller.abort();
      }
    }
  }, []);

  const worstStatus = useMemo(() => {
    const statuses = Array.from(uploadState.values()).map((f) => f.status);
    const statusesBySeverity: UploadStatus[] = [
      "error",
      "retrying",
      "uploading",
      "pending",
      "done",
    ];

    for (const status of statusesBySeverity) {
      if (statuses.includes(status)) {
        return status;
      }
    }

    return "done";
  }, [uploadState]);

  return {
    statuses: Object.fromEntries(uploadState.entries()),
    startUpload: startUploads,
    status: worstStatus,
    retryUpload,
    cancelUpload,
  };
};
