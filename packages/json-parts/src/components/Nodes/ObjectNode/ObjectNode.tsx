import { useCallback } from "react";
import { NodeProps, useEdges } from "reactflow";
import { NodeShell } from "../NodeShell";

import { ObjectNodeProperty } from "./ObjectNodeProperty";
import { DefaultHandle } from "../../Handle/DefaultHandle";
import { NodeType, ObjectNodeData } from "../../../types/node.types";

/**
 * ObjectNode `<Handle>` Details
 *
 * source: impossible to have.
 * target: always have except for RootNode.
 */
export const ObjectNode = ({ id, data }: NodeProps<ObjectNodeData>) => {
  const edges = useEdges();

  const { obj } = data;

  const renderProperties = useCallback(() => {
    return Object.entries(obj).map(([propertyK, propertyV]) => {
      const hasChildNode: boolean = edges.some(
        ({ source, sourceHandle }) =>
          source === id && sourceHandle === propertyK
      );

      return (
        <ObjectNodeProperty
          key={propertyK}
          nodeId={id}
          propertyK={propertyK}
          propertyV={propertyV}
          hasChildNode={hasChildNode}
        />
      );
    });
  }, [obj, edges, id]);

  return (
    <NodeShell nodeId={id} nodeType={NodeType.Object}>
      <DefaultHandle id={id} type="target" />
      {renderProperties()}
    </NodeShell>
  );
};
