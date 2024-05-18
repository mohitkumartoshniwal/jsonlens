import { BiDownload } from "react-icons/bi";
import Modal from "./UI/Modal";
import { downloadInitialState, useDownload } from "../stores/useDownload";
import { IMAGE_TYPES } from "../types";
import { useReactFlow } from "reactflow";
import { FormEvent, useRef, useState } from "react";

type Props = {
  isModalOpen: boolean;
  closeModal: () => void;
};

const DownloadModal = ({ isModalOpen, closeModal }: Props) => {
  const [
    fileName,
    fileType,
    backgroundColor,
    imageWidth,
    imageHeight,
    setFileName,
    setFileType,
    setBackgroundColor,
    setImageWidth,
    setImageHeight,
    triggerDownload,
  ] = useDownload((state) => [
    state.fileName,
    state.fileType,
    state.backgroundColor,
    state.imageWidth,
    state.imageHeight,
    state.setFileName,
    state.setFileType,
    state.setBackgroundColor,
    state.setImageWidth,
    state.setImageHeight,
    state.triggerDownload,
  ]);

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const colorPicker = useRef<HTMLInputElement | null>(null);
  const [showColorPicker, setShowColorPicker] = useState(false);

  const { getNodes } = useReactFlow();

  function downloadFile(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const newErrors: { [key: string]: string } = {};

    if (fileName.length === 0) {
      newErrors.fileName = "File name cannot be empty.";
    }

    if (imageWidth <= 500) {
      newErrors.imageWidth = "Image width must be greater than 500";
    }

    if (imageHeight <= 500) {
      newErrors.imageHeight = "Image height must be greater than 500";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      return;
    }

    closeModal();
    triggerDownload(getNodes());
  }

  return (
    <Modal
      isOpen={isModalOpen}
      onClose={() => {
        closeModal();
        setFileName(downloadInitialState.fileName);
        setFileType(downloadInitialState.fileType);
        setBackgroundColor(downloadInitialState.backgroundColor);
      }}
    >
      <h2 className="font-bold text-xl mb-3 text-center landscape:max-md:text-left">
        Download Image
      </h2>

      <form
        noValidate
        onSubmit={downloadFile}
        className="w-full p-2 overflow-x-hidden max-h-60 md:max-h-[400px] flex flex-col gap-4 overflow-y-auto"
      >
        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="file-name">
            File Name
          </label>
          <input
            value={fileName}
            onChange={(e) => setFileName(e.target.value)}
            className="w-full border py-1 px-2 rounded-sm dark:border-gray-700 dark:bg-dark_shade_1 "
            id="file-name"
          />
          {errors.fileName && <p className="text-red-600">{errors.fileName}</p>}
        </div>
        <div className="flex w-full gap-1">
          <button
            type="button"
            className={`flex-1 border rounded-sm  dark:bg-dark_shade_1 dark:border-gray-700 ${fileType === IMAGE_TYPES.SVG ? "bg-gray-300 text-white dark:bg-gray-700" : " bg-lightBackground dark:bg-darkBackground"}`}
            onClick={() => setFileType(IMAGE_TYPES.SVG)}
          >
            SVG
          </button>
          <button
            type="button"
            className={`flex-1 border rounded-sm  dark:bg-dark_shade_1 dark:border-gray-700 ${fileType === IMAGE_TYPES.PNG ? "bg-gray-300 text-white dark:bg-gray-700" : " bg-lightBackground  dark:bg-darkBackground"}`}
            onClick={() => setFileType(IMAGE_TYPES.PNG)}
          >
            PNG
          </button>
          <button
            type="button"
            className={`flex-1 border rounded-sm  dark:bg-dark_shade_1 dark:border-gray-700 ${fileType === IMAGE_TYPES.JPEG ? "bg-gray-300 text-white dark:bg-gray-700" : " bg-lightBackground dark:bg-darkBackground"}`}
            onClick={() => setFileType(IMAGE_TYPES.JPEG)}
          >
            JPEG
          </button>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="width">
            Image Width
          </label>
          <input
            value={imageWidth}
            type="number"
            min={500}
            onChange={(e) => setImageWidth(Number(e.target.value))}
            className="w-full border py-1 px-2 rounded-sm dark:border-gray-700 dark:bg-dark_shade_1 "
            id="width"
          />
          {errors.imageWidth && (
            <p className="text-red-600">{errors.imageWidth}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="height">
            Image Height
          </label>
          <input
            value={imageHeight}
            type="number"
            min={500}
            onChange={(e) => setImageHeight(Number(e.target.value))}
            className="w-full border py-1 px-2 rounded-sm dark:border-gray-700 dark:bg-dark_shade_1 "
            id="height"
          />
          {errors.imageHeight && (
            <p className="text-red-600">{errors.imageHeight}</p>
          )}
        </div>

        {[IMAGE_TYPES.JPEG, IMAGE_TYPES.PNG].includes(fileType) && (
          <>
            <div>
              <label
                className="block text-sm font-medium mb-1"
                htmlFor="background-color"
              >
                Background Color
              </label>
              <div
                className="w-full flex items-center gap-2 border p-1 rounded-sm dark:border-gray-700 "
                id="background-color"
              >
                <input
                  disabled={fileType === IMAGE_TYPES.SVG}
                  type="color"
                  value={backgroundColor}
                  className="w-5 h-5 bg-white dark:bg-darkBackground"
                  onChange={(e) => setBackgroundColor(e.target.value)}
                />
                <span className="flex-1">{backgroundColor}</span>
              </div>
            </div>

            <div className="grid grid-cols-6 gap-x-2 gap-y-2 mb-4 ">
              <button
                type="button"
                onClick={() => setBackgroundColor("#FF5630")}
                className="w-8 h-8 sm:w-12 sm:h-12 border rounded-md bg-[#FF5630]"
              />
              <button
                type="button"
                onClick={() => setBackgroundColor("#FFAB00")}
                className="w-8 h-8 sm:w-12 sm:h-12 border rounded-md bg-[#FFAB00]"
              />
              <button
                type="button"
                onClick={() => setBackgroundColor("#36B37E")}
                className="w-8 h-8 sm:w-12 sm:h-12 border rounded-md bg-[#36B37E]"
              />
              <button
                type="button"
                onClick={() => setBackgroundColor("#00B8D9")}
                className="w-8 h-8 sm:w-12 sm:h-12 border rounded-md bg-[#00B8D9]"
              />
              <button
                type="button"
                onClick={() => setBackgroundColor("#6554C0")}
                className="w-8 h-8 sm:w-12 sm:h-12 border rounded-md bg-[#6554C0]"
              />
              <button
                type="button"
                onClick={() => setBackgroundColor("#FF8B8B")}
                className="w-8 h-8 sm:w-12 sm:h-12 border rounded-md bg-[#FF8B8B]"
              />
              <button
                type="button"
                onClick={() => setBackgroundColor("#FFECB5")}
                className="w-8 h-8 sm:w-12 sm:h-12 border rounded-md bg-[#FFECB5]"
              />
              <button
                type="button"
                onClick={() => setBackgroundColor("#ABF5D1")}
                className="w-8 h-8 sm:w-12 sm:h-12 border rounded-md bg-[#ABF5D1]"
              />
              <button
                type="button"
                onClick={() => setBackgroundColor("#79E2F2")}
                className="w-8 h-8 sm:w-12 sm:h-12 border rounded-md bg-[#79E2F2]"
              />
              <button
                type="button"
                onClick={() => setBackgroundColor("#FAFBFC")}
                className="w-8 h-8 sm:w-12 sm:h-12 border rounded-md bg-[#FAFBFC]"
              />
              <button
                type="button"
                onClick={() => setBackgroundColor("transparent")}
                className="w-8 h-8 sm:w-12 sm:h-12 rounded-md bg-transparent border-2 border-dashed border-gray-300"
              />
            </div>
          </>
        )}
        <div className="flex justify-center">
          <button
            type="submit"
            className="flex items-center justify-center space-x-2"
          >
            <BiDownload className="h-4 w-4" />
            <span>Download</span>
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default DownloadModal;
