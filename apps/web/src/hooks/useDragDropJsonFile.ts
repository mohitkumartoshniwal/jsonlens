import { useCallback, useEffect, useRef, useState } from "react";
import { useFile } from "@jsonlens/json-parts";

export const useDragDropJsonFile = (afterFileReadSuccess: () => void) => {
  const setContents = useFile((state) => state.setContents);

  const [isDragging, setIsDragging] = useState(false);
  const dropzoneRef = useRef<HTMLLabelElement | null>(null);

  const processJsonFileText = useCallback(
    async (jsonFileText: string) => {
      await setContents(jsonFileText);
      afterFileReadSuccess();
    },
    [setContents, afterFileReadSuccess]
  );

  const handleDragIn = useCallback((e: DragEvent): void => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragOut = useCallback((e: DragEvent): void => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e: DragEvent): void => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback(
    (e: DragEvent): void => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);
      if (e.dataTransfer?.files && e.dataTransfer?.files[0]) {
        const file: File = e.dataTransfer.files[0];
        if (file.type === "application/json") {
          file.text().then((jsonText: string) => {
            processJsonFileText(jsonText);
          });
        }
      }
    },
    [processJsonFileText]
  );

  const handleFileInputChange: React.ChangeEventHandler<HTMLInputElement> =
    useCallback(
      (e) => {
        e.preventDefault();
        if (e.target.files && e.target.files[0]) {
          const jsonFile: File = e.target.files[0];
          jsonFile.text().then((jsonText: string) => {
            processJsonFileText(jsonText);
          });
        }
      },
      [processJsonFileText]
    );

  useEffect(() => {
    const dropzoneElement: HTMLLabelElement | null = dropzoneRef?.current;
    dropzoneElement?.addEventListener("dragenter", handleDragIn);
    dropzoneElement?.addEventListener("dragleave", handleDragOut);
    dropzoneElement?.addEventListener("dragover", handleDragOver);
    dropzoneElement?.addEventListener("drop", handleDrop);

    return () => {
      dropzoneElement?.removeEventListener("dragenter", handleDragIn);
      dropzoneElement?.removeEventListener("dragleave", handleDragOut);
      dropzoneElement?.removeEventListener("dragover", handleDragOver);
      dropzoneElement?.removeEventListener("drop", handleDrop);
    };
  }, [handleDragIn, handleDragOut, handleDragOver, handleDrop]);

  return {
    dropzoneRef,
    isDragging,
    setIsDragging,
    handleFileInputChange,
  };
};
