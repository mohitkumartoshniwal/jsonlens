import { Node } from "reactflow";
import { JsonDataType } from "./json.types";

/**
 * Primitive data type is different between Javascript and JSON areas.
 * @see https://www.w3schools.com/js/js_json_datatypes.asp
 */
export enum NodeType {
  Object = "object",
  Array = "array",

  /**
   * Primitive node exists to express Array node items only.
   * It can be `string`, `number`, `boolean` or `null`. (`undefined` can't exist in JSON)
   */
  Primitive = "primitive",
}

type NodeData = {
  depth: number; // The depth starts from 0. (depth of root node is 0)
  contents: string;
  parentNodePathIds: string[]; // e.g. [], ['n0'], ['n0', 'n3', 'n5'], ...
};

export type ObjectNodeData = NodeData & {
  dataType: JsonDataType.Object;
  /**
   * Will be set if parent of `ObjectNode` is an array, so nullable.
   */
  arrayIndexForObject: number | null;
  obj: object;
  isRootNode: boolean;
};

export type ArrayNodeData = NodeData & {
  dataType: JsonDataType.Array;
  arrayIndex: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  items: any[];
  isRootNode: boolean;
};

/**
 * `PrimitiveNode` is always an item of specific array.
 * It means that the parent is always an `ArrayNode`.
 */
export type PrimitiveNodeData = NodeData & {
  dataType:
    | JsonDataType.String
    | JsonDataType.Number
    | JsonDataType.Boolean
    | JsonDataType.Null;

  arrayIndex: number;
  value: string | number | boolean | null;
};

export type ObjectCustomNode = Node<ObjectNodeData, NodeType.Object>;
export type ArrayCustomNode = Node<ArrayNodeData, NodeType.Array>;
export type PrimitiveCustomNode = Node<PrimitiveNodeData, NodeType.Primitive>;

export type CustomNode =
  | ObjectCustomNode
  | ArrayCustomNode
  | PrimitiveCustomNode;
