import { graphlib, layout } from "@dagrejs/dagre";
import { Edge, XYPosition } from "reactflow";
import { SIZES } from "../constants/graph.constants";
import {
  ArrayCustomNode,
  CustomNode,
  NodeType,
  ObjectCustomNode,
  PrimitiveCustomNode,
} from "../types/node.types";

export const isObjectCustomNode = (
  node: CustomNode
): node is ObjectCustomNode => {
  return node.type === NodeType.Object;
};

export const isArrayCustomNode = (
  node: CustomNode
): node is ArrayCustomNode => {
  return node.type === NodeType.Array;
};

export const isPrimitiveCustomNode = (
  node: CustomNode
): node is PrimitiveCustomNode => {
  return node.type === NodeType.Primitive;
};

export const getXYPosition = (depth: number): XYPosition => {
  const x: number = depth * SIZES.nodeMaxWidth + depth * SIZES.nodeGap;
  const y: number = 0; // y will be calculated in `getLayoutednodes` function with `dagre` library later.

  return { x, y } as XYPosition;
};

const calculateCustomNodeHeight = (node: CustomNode): number => {
  if (isArrayCustomNode(node)) {
    return SIZES.arrayNodeSize;
  }

  const NODE_VERTICAL_PADDING: number = SIZES.nodePadding * 2;

  if (isObjectCustomNode(node)) {
    return (
      NODE_VERTICAL_PADDING +
      SIZES.nodeContentHeight * Object.keys(node.data.obj).length
    );
  }

  if (isPrimitiveCustomNode(node)) {
    return NODE_VERTICAL_PADDING + SIZES.nodeContentHeight;
  }

  return 0;
};

/**
 * @reference https://reactflow.dev/docs/examples/layout/dagre/
 */
export const getLayoutedNodes = (
  nodes: CustomNode[],
  edges: Edge[]
): CustomNode[] => {
  const dagreGraph = new graphlib.Graph();

  dagreGraph.setDefaultEdgeLabel(() => ({}));
  dagreGraph.setGraph({ rankdir: "LR" }); // 'LR' is Left to Right direction.

  nodes.forEach((node: CustomNode) => {
    dagreGraph.setNode(node.id, {
      width: SIZES.nodeMaxWidth,
      height: calculateCustomNodeHeight(node),
    });
  });

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  layout(dagreGraph);

  return nodes.map((node: CustomNode) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    const nodeHeight: number = calculateCustomNodeHeight(node);

    return {
      ...node,
      // 'x' is already set at this moment because of `getXYPosition` function.
      position: {
        ...node.position,
        y: nodeWithPosition.y - nodeHeight / 2,
      },
    };
  });
};
