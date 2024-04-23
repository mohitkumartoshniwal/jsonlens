import { Edge } from "reactflow";
import { CustomNode } from "./node.types";

export type JsonTree = {
  nodes: CustomNode[];
  edges: Edge[];
};

/**
 * @see http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types
 */
export enum JsonDataType {
  // For `Object` node type
  Object = "object",

  // For `Array` node type
  Array = "array",

  // For `Primitive` node type
  String = "string",
  Number = "number",
  Boolean = "boolean",
  Null = "null",
}
