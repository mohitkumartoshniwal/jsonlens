"use client";

import { useEffect } from "react";

import ReactFlow, {
  Background,
  BackgroundVariant,
  Controls,
  EdgeTypes,
  NodeTypes,
  useEdgesState,
  useNodesState,
  useReactFlow,
} from "reactflow";
import "reactflow/dist/style.css";

import {
  ObjectNode,
  ArrayNode,
  PrimitiveNode,
  DefaultEdge,
  NodeType,
  EdgeType,
  useFile,
  THEMES,
} from "@jsonlens/json-parts";
import { CustomMiniMap } from "./CustomMiniMap";

const nodeTypes: NodeTypes = {
  [NodeType.Object]: ObjectNode,
  [NodeType.Array]: ArrayNode,
  [NodeType.Primitive]: PrimitiveNode,
};

const edgeTypes: EdgeTypes = {
  [EdgeType.Default]: DefaultEdge,
};

type Props = {
  theme: THEMES;
};

export const Graph = ({ theme }: Props) => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const { fitView } = useReactFlow();

  const jsonTree = useFile((state) => state.jsonTree);

  useEffect(() => {
    const { nodes, edges } = jsonTree;

    setNodes(nodes);
    setEdges(edges);

    window.requestAnimationFrame(() => {
      // After editing content in editor in UI only then fitView gets invoked
      fitView();
    });
  }, [jsonTree]);

  return (
    <div className="w-full h-screen">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        fitView
        nodesDraggable={false}
        zoomOnPinch
        zoomOnDoubleClick
        minZoom={0.01}
        className="dark:bg-darkBackground bg-lightBackground text-lightText dark:text-darkText"
      >
        <CustomMiniMap theme={theme} />
        <Controls showInteractive={false} position="bottom-right" />
        <Background variant={BackgroundVariant.Dots} gap={30} size={3} />
      </ReactFlow>
    </div>
  );
};
