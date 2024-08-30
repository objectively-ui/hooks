import { useCallback, useEffect, useRef, useState } from "react";
import { useEventListener } from "../useEventListener";
import { useUnmount } from "../useUnmount";
import { DropzoneFile } from "./DropzoneFile";
import type { UseDropzoneOptions, UseDropzoneReturn } from "./types";

const getFilesFromEvent = (event: DragEvent): File[] => {
  if (event.dataTransfer?.items) {
    return Array.from(event.dataTransfer.items)
      .filter((item) => item.kind === "file")
      .map((item) => item.getAsFile() as File);
  }

  return Array.from(event.dataTransfer?.files ?? []);
};

export const useDropzone = (opts: UseDropzoneOptions = {}): UseDropzoneReturn => {
  const { limit, onDrop } = opts;
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [dropzoneEl, setDropzoneEl] = useState<HTMLButtonElement | null>(null);
  const [draggingOver, setDraggingOver] = useState(false);
  const [files, setFiles] = useState<DropzoneFile[]>([]);

  const handleDragEnter = useCallback((event: DragEvent) => {
    if (getFilesFromEvent(event).length === 0) {
      return;
    }
    setDraggingOver(true);
  }, []);

  const handleFilesAdded = useCallback(
    (newFiles: File[], event: Event) => {
      let filesToAdd = newFiles;

      if (limit) {
        filesToAdd = filesToAdd.slice(0, Math.max(0, limit - files.length));
      }

      const droppedFiles = filesToAdd.map((file) => new DropzoneFile(file));

      if (onDrop === undefined || onDrop(droppedFiles, event) !== false) {
        setFiles((current) => {
          return current.concat(droppedFiles);
        });
      }
    },
    [onDrop, files, limit],
  );

  const handleDrop = useCallback(
    (event: DragEvent) => {
      event.preventDefault();
      const files = getFilesFromEvent(event);
      if (files.length === 0) {
        return;
      }

      setDraggingOver(false);
      handleFilesAdded(files, event);
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

  const handleDragLeave = useCallback(
    (e: Event) => {
      if (e.target instanceof Node) {
        console.log(e.target);
        if (!dropzoneEl?.contains(e.target) || dropzoneEl === e.target) {
          setDraggingOver(false);
        }
      }
    },
    [dropzoneEl],
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
    input.addEventListener("change", handleInputChange);
    inputRef.current = input;

    return () => {
      input.remove();
    };
  }, [handleInputChange]);

  useEventListener("dragenter", handleDragEnter, {
    eventTarget: dropzoneEl,
  });

  useEventListener("dragover", (e) => e.preventDefault(), {
    eventTarget: dropzoneEl,
  });

  useEventListener("dragleave", handleDragLeave, {
    eventTarget: dropzoneEl,
  });

  useEventListener("drop", handleDrop, {
    eventTarget: dropzoneEl,
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

  return {
    dropzoneRef: setDropzoneEl,
    dragging: draggingOver,
    files,
    removeFile,
    modifyFile: () => null,
    openFilePicker,
    reset,
  };
};
