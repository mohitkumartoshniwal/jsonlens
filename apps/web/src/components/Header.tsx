"use client";

import {
  MdOutlineLightMode,
  MdOutlineNightlight,
  MdFullscreen,
  MdOutlineFullscreenExit,
  MdKeyboardArrowLeft,
  MdKeyboardArrowRight,
} from "react-icons/md";
import { useState } from "react";
import Dropdown from "./UI/Dropdown";
import ImportJsonModal from "./ImportJsonModal";
import { THEMES, useCustomTheme, useFile } from "@jsonlens/json-parts";
import { FILE_NAME } from "../constants/constants";
import { useApp } from "../stores/useApp";
import { GrGithub } from "react-icons/gr";
import { TbBrandVscode } from "react-icons/tb";
import Image from "next/image";
import { useReactFlow } from "reactflow";
import DownloadModal from "./DownloadModal";
import { VIEW_TYPES } from "../types";

const Header = () => {
  const isEditorVisible = useApp((state) => state.isEditorVisible);
  const toggleEditorVisibilty = useApp((state) => state.toggleEditorVisibilty);
  const viewType = useApp((state) => state.viewType);
  const setViewType = useApp((state) => state.setViewType);
  const contents = useFile((state) => state.contents);
  const { isDarkMode, setTheme } = useCustomTheme();

  const { fitView } = useReactFlow();

  const [isFullScreen, setFullScreen] = useState(false);
  const [isJsonModalOpen, setIsJsonModalOpen] = useState(false);
  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false);

  function toggleFullScreen() {
    if (!document.fullscreenElement) {
      document.documentElement
        .requestFullscreen()
        .then(() => setFullScreen(true))
        .catch((err) => {
          console.error(
            `Error attempting to enable full-screen mode: ${err.message}`
          );
        });
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setFullScreen(false);
      }
    }
  }

  function exportFile() {
    const blob = new Blob([contents], { type: "application/octet-stream" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${FILE_NAME}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  function handleEditorVisiblity() {
    toggleEditorVisibilty();
    setTimeout(() => {
      fitView();
    }, 0);
  }

  return (
    <>
      <nav className="h-[3.375rem] w-full flex justify-between items-center py-2 border-b-2 bg-lightBackground dark:bg-darkBackground text-lightText dark:text-darkText border-gray-300 dark:border-gray-400">
        <div className="flex gap-1 md:gap-3  items-center">
          <button className="text-2xl" onClick={handleEditorVisiblity}>
            {isEditorVisible ? (
              <MdKeyboardArrowLeft />
            ) : (
              <MdKeyboardArrowRight />
            )}
          </button>
          <button className="hidden md:block font-bold flex-1 dark:text-white">
            JSON LENS
          </button>
          <Image
            src="/JL.png"
            alt="JSON Lens"
            width={32}
            height={32}
            className="md:hidden"
          />
          <div className="flex gap-1 md:gap-4">
            <Dropdown label="File">
              <a>
                <button onClick={() => setIsJsonModalOpen(true)}>Import</button>
              </a>
              <a>{contents && <button onClick={exportFile}>Export</button>}</a>
              <a>
                {contents && (
                  <button onClick={() => setIsDownloadModalOpen(true)}>
                    Download
                  </button>
                )}
              </a>
            </Dropdown>
            <Dropdown label="View">
              <a>
                <button
                  className={`${viewType === VIEW_TYPES.GRAPH && "bg-lightBackground px-2 rounded-md text-lightText"}`}
                  onClick={() => setViewType(VIEW_TYPES.GRAPH)}
                >
                  Graph
                </button>
              </a>
              <a>
                {
                  <button
                    className={`${viewType === VIEW_TYPES.TREE && "bg-lightBackground px-2 rounded-md text-lightText"}`}
                    onClick={() => setViewType(VIEW_TYPES.TREE)}
                  >
                    Tree
                  </button>
                }
              </a>
            </Dropdown>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <a
            href="https://github.com/mohitkumartoshniwal/jsonlens"
            target="_blank"
            rel="noopener noreferrer"
            className="text-2xl mr-1"
          >
            <GrGithub />
          </a>
          <a
            href="https://marketplace.visualstudio.com/items?itemName=mohitkumartoshniwal.jsonlens"
            target="_blank"
            rel="noopener noreferrer"
            className="text-2xl mr-1"
          >
            <TbBrandVscode />
          </a>
          <button
            className="text-2xl"
            onClick={() => setTheme(isDarkMode ? THEMES.LIGHT : THEMES.DARK)}
          >
            {isDarkMode ? <MdOutlineLightMode /> : <MdOutlineNightlight />}
          </button>
          <button className="text-3xl" onClick={() => toggleFullScreen()}>
            {isFullScreen ? <MdOutlineFullscreenExit /> : <MdFullscreen />}
          </button>
        </div>
      </nav>
      <ImportJsonModal
        isModalOpen={isJsonModalOpen}
        closeModal={() => setIsJsonModalOpen(false)}
      />

      <DownloadModal
        isModalOpen={isDownloadModalOpen}
        closeModal={() => setIsDownloadModalOpen(false)}
      />
    </>
  );
};

export default Header;
