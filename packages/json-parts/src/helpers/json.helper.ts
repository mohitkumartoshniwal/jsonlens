import { JsonDataType, JsonTree } from "../types/json.types";
import { CustomNode } from "../types/node.types";
import {
  isArray,
  isBoolean,
  isNull,
  isNumber,
  isObject,
  isString,
} from "../utils/utils";
import { getLayoutedNodes } from "./graph.helper";
import { jsonParser } from "./json-parser.helper";

export function convertJsonTree(json: object | unknown[]): JsonTree {
  const { nodes, edges } = jsonParser(json);
  const layoutedSeaNodes: CustomNode[] = getLayoutedNodes(nodes, edges);

  return {
    nodes: layoutedSeaNodes,
    edges,
  };
}

export function validateJsonDataType(v: unknown): {
  [P in keyof typeof JsonDataType as `is${P}Data`]: boolean;
} & {
  isPrimitiveData: boolean;
} {
  const isStringData: boolean = isString(v);
  const isNumberData: boolean = isNumber(v);
  const isBooleanData: boolean = isBoolean(v);
  const isNullData: boolean = isNull(v);
  const isObjectData: boolean = isObject(v);
  const isArrayData: boolean = isArray(v);

  const isPrimitiveData =
    isStringData || isNumberData || isBooleanData || isNullData;

  return {
    isObjectData,
    isArrayData,
    isStringData,
    isNumberData,
    isBooleanData,
    isNullData,
    isPrimitiveData,
  };
}

export function getJsonDataType(v: unknown): JsonDataType {
  const {
    isObjectData,
    isArrayData,
    isStringData,
    isNumberData,
    isBooleanData,
  } = validateJsonDataType(v);

  if (isObjectData) {
    return JsonDataType.Object;
  }
  if (isArrayData) {
    return JsonDataType.Array;
  }
  if (isStringData) {
    return JsonDataType.String;
  }
  if (isNumberData) {
    return JsonDataType.Number;
  }
  if (isBooleanData) {
    return JsonDataType.Boolean;
  }
  return JsonDataType.Null;
}
