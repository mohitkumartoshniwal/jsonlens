"use client";
import { lazy } from "react";
import { Allotment } from "allotment";
import "allotment/dist/style.css";

// import { Graph } from "@jsonlens/json-parts";

import MonacoEditor from "../MonacoEditor";

import { useApp } from "../../stores/useApp";
import { Graph } from "../Graph";
import { VIEW_TYPES } from "../../types";
import { useCustomTheme, useFile } from "@jsonlens/json-parts";
const LazyReactJson = lazy(() => import("@microlink/react-json-view"));

const Main = () => {
  const isEditorVisible = useApp((state) => state.isEditorVisible);
  const viewType = useApp((state) => state.viewType);
  const contents = useFile((state) => state.contents);

  const { isDarkMode } = useCustomTheme();

  return (
    <Allotment className="flex !h-[calc(100vh-3.375rem)] justify-between">
      {isEditorVisible && (
        <Allotment.Pane preferredSize={450} maxSize={800} minSize={300}>
          <MonacoEditor />
        </Allotment.Pane>
      )}
      <Allotment.Pane>
        {viewType === VIEW_TYPES.GRAPH ? (
          <Graph />
        ) : (
          // TODO need to set parsed contents in store to handle large json files
          <LazyReactJson
            src={JSON.parse(contents)}
            theme={isDarkMode ? "summerfruit" : "shapeshifter:inverted"}
          />
        )}
      </Allotment.Pane>
    </Allotment>
  );
};

export default Main;
