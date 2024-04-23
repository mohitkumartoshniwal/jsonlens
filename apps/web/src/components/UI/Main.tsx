"use client";

import { Allotment } from "allotment";
import "allotment/dist/style.css";

// import { Graph } from "@jsonlens/json-parts";

import MonacoEditor from "../MonacoEditor";

import { useApp } from "../../stores/useApp";
import { Graph } from "../Graph";

const Main = () => {
  const isEditorVisible = useApp((state) => state.isEditorVisible);

  return (
    <Allotment className="flex !h-[calc(100vh-3.375rem)] justify-between">
      {isEditorVisible && (
        <Allotment.Pane preferredSize={450} maxSize={800} minSize={300}>
          <MonacoEditor />
        </Allotment.Pane>
      )}
      <Allotment.Pane>
        <Graph />
      </Allotment.Pane>
    </Allotment>
  );
};

export default Main;
