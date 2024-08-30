import { useCallback, useEffect, useRef, useState } from "react";
import { useEventListener } from "../useEventListener";
import { useFrozen } from "../useFrozen";
import { useThrottle } from "../useThrottle";
import { useUnmount } from "../useUnmount";
import { DropzoneFile } from "./DropzoneFile";
import type { UseDropzoneOptions, UseDropzoneReturn } from "./types";

export const useDropzone = (opts: UseDropzoneOptions): UseDropzoneReturn => {
  const { limit, onDrop } = opts;
  const inputRef = useRef<HTMLInputElement>();
  const dropzoneRef = useRef<HTMLDivElement>();
  const [draggingOver, setDraggingOver] = useState(false);
  const [files, setFiles] = useState<DropzoneFile[]>([]);

  const _handleDragOver = useCallback((event: DragEvent) => {
    if (!event.dataTransfer?.files || event.dataTransfer.files.length === 0) {
      return;
    }
    setDraggingOver(true);
  }, []);

  const handleDragOver = useThrottle(_handleDragOver, 500);

  const handleFilesAdded = useCallback(
    (files: File[], event: Event) => {
      const droppedFiles = files.map((file) => new DropzoneFile(file));

      if (onDrop === undefined || onDrop(droppedFiles, event)) {
        setFiles((current) => current.concat(droppedFiles));
      } else {
        for (const file of droppedFiles) {
          file.dispose();
        }
      }
    },
    [onDrop],
  );

  const handleDrop = useCallback(
    (event: DragEvent) => {
      if (!event.dataTransfer?.files || event.dataTransfer.files.length === 0) {
        return;
      }

      setDraggingOver(false);
      handleFilesAdded(Array.from(event.dataTransfer.files), event);
    },
    [handleFilesAdded],
  );

  const handleInputChange = useCallback(
    (event: Event) => {
      if (!inputRef.current?.files || inputRef.current.files.length === 0) {
        return;
      }

      handleFilesAdded(Array.from(inputRef.current?.files ?? []), event);
      inputRef.current.value = "";
    },
    [handleFilesAdded],
  );

  useEffect(() => {
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("multiple", "");
    input.setAttribute("tabindex", "-1");
    input.setAttribute(
      "style",
      "visibility:hidden;position:absolute;top:0px;left:0px;height:0px;width:0px;",
    );
    document.body.appendChild(input);
    inputRef.current = input;

    return () => {
      input.remove();
    };
  }, []);

  useEventListener("dragover", handleDragOver, {
    eventTarget: dropzoneRef.current,
    passive: true,
  });

  useEventListener("dragleave", () => setDraggingOver(false), {
    eventTarget: dropzoneRef.current,
    passive: true,
  });

  useEventListener("drop", handleDrop, {
    eventTarget: dropzoneRef.current,
    passive: true,
  });

  useEventListener("change", handleInputChange, {
    eventTarget: inputRef.current,
    passive: true,
  });

  const removeFile = useCallback((id: string) => {
    setFiles((current) => {
      const index = current.findIndex((file) => file.id === id);
      if (index > -1) {
        const copy = [...current];
        const [removed] = copy.splice(index, 1);
        removed?.dispose();

        return copy;
      }

      return current;
    });
  }, []);

  const openFilePicker = useCallback(() => {
    inputRef.current?.click();
  }, []);

  const reset = useCallback(() => {
    setFiles((files) => {
      for (const file of files) {
        file.dispose();
      }
      return [];
    });
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  }, []);

  useUnmount(reset);

  return useFrozen({
    inputRef,
    dropzoneRef,
    dragging: draggingOver,
    files,
    removeFile,
    modifyFile: () => null,
    openFilePicker,
    reset,
  });
};
