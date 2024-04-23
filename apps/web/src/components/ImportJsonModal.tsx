import { useEffect, useId, useState } from "react";
import Modal from "./UI/Modal";
import { useDragDropJsonFile } from "../hooks/useDragDropJsonFile";
import { useFetch } from "../hooks/useFetch";
import {
  convertJsonTree,
  isArray,
  isObject,
  jsonToContent,
  useFile,
} from "@jsonlens/json-parts";
import { MdCloudUpload } from "react-icons/md";
import { useReactFlow } from "reactflow";

type Props = {
  isModalOpen: boolean;
  closeModal: () => void;
};

const ImportJsonModal = ({ isModalOpen, closeModal }: Props) => {
  const format = useFile((state) => state.format);
  const setIsValidJson = useFile((state) => state.setIsValidJson);
  const setContents = useFile((state) => state.setContents);
  const setJsonTree = useFile((state) => state.setJsonTree);

  const fileInputId: string = useId();

  const [url, setURL] = useState("");
  const { loading, data, error, fetchUrl, reset } = useFetch();
  const { dropzoneRef, isDragging, handleFileInputChange, setIsDragging } =
    useDragDropJsonFile(handleDialogClose);

  const { fitView } = useReactFlow();

  function handleDialogClose() {
    closeModal();
    setTimeout(() => {
      fitView();
    }, 0);
  }

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && url) {
      fetchUrl(url);
    }

    if (error) {
      reset();
    }
  };

  useEffect(() => {
    if (!isModalOpen) {
      reset();
      setURL("");
      setIsDragging(false);
    }
  }, [isModalOpen, reset]);

  useEffect(() => {
    async function handleData() {
      if (isObject(data) || isArray(data)) {
        setIsValidJson(true);
        setJsonTree(convertJsonTree(data));
        const contents = await jsonToContent(data, format);
        setContents(contents);
        closeModal();
      }
    }

    handleData();
  }, [closeModal, data, setContents]);

  const isInvalid = !(error === null);
  const isImportDisabled = !url || loading || isInvalid;

  return (
    <Modal isOpen={isModalOpen} onClose={closeModal}>
      <h2 className="font-bold text-xl mb-3 text-center landscape:max-md:text-left">
        Import JSON via URL or File
      </h2>
      <div className="w-full overflow-y-auto p-2 overflow-x-hidden">
        <div className="w-full flex flex-col landscape:max-md:flex-row items-center md:flex-row justify-between gap-2   ">
          <input
            value={url}
            onChange={(e) => setURL(e.target.value)}
            className="flex-1 w-full p-1 px-2 border-2 rounded-md dark:bg-dark_shade_1 dark:border-gray-700"
            type="text"
            placeholder="Enter a JSON URL to fetch"
            onKeyDown={onKeyDown}
          />
          <button
            className={`flex items-center gap-1 font-semibold px-2 py-1 rounded-md cursor-not-allowed dark:border-2 bg-lightBackground text-white dark:bg-darkBackground dark:text-lightText dark:border-gray-700  ${!!url && " !bg-blue-500   dark:text-white cursor-pointer "} `}
            disabled={isImportDisabled}
            onClick={() => fetchUrl(url)}
          >
            {loading && (
              <div role="status">
                <svg
                  aria-hidden="true"
                  className="w-6 h-6 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                  viewBox="0 0 100 101"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                    fill="currentColor"
                  />
                  <path
                    d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                    fill="currentFill"
                  />
                </svg>
                <span className="sr-only">Loading...</span>
              </div>
            )}
            IMPORT
          </button>
        </div>
        {isInvalid && <p className="text-red-600">Fetching JSON Failed!</p>}
        <div className="text-center my-2">OR</div>
        <div className="h-[200px]  landscape:max-md:h-[80px] flex flex-col items-center justify-center  dark:border-gray-700 rounded-md border-dashed border-2  ">
          <input
            className="hidden"
            type="file"
            accept="application/JSON"
            id={fileInputId}
            onChange={handleFileInputChange}
          />

          <label ref={dropzoneRef} htmlFor={fileInputId}>
            {isDragging ? (
              "Drop it to import"
            ) : (
              <div className="flex flex-col items-center gap-2 px-2">
                <MdCloudUpload className="text-4xl" />
                <div className="text-center">
                  Drop here or Click to upload file
                </div>
              </div>
            )}
          </label>
        </div>
      </div>
    </Modal>
  );
};

export default ImportJsonModal;
