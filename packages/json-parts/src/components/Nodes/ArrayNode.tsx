import { NodeProps } from "reactflow";
import { NodeShell } from "./NodeShell";
import { DefaultHandle } from "../Handle/DefaultHandle";
import { ArrayNodeData, NodeType } from "../../types/node.types";
import { isEmptyArray } from "../../utils/utils";
import { ROOT_NODE_NAME } from "../../constants/graph.constants";

/**
 * ArrayNode `<Handle>` Details
 *
 * source: can have if array includes at least one item.
 * target: always have except for RootNode.
 */
export const ArrayNode = ({ id, data }: NodeProps<ArrayNodeData>) => {
  const { arrayIndex, items, isRootNode } = data;

  return (
    <NodeShell nodeId={id} nodeType={NodeType.Array}>
      {!isRootNode && <DefaultHandle id={id} type="target" />}
      <div>{isRootNode ? ROOT_NODE_NAME : `[${arrayIndex}]`}</div>

      {!isEmptyArray(items) && <DefaultHandle id={id} type="source" />}
    </NodeShell>
  );
};
