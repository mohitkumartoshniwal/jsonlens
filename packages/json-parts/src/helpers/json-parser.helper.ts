/* eslint-disable @typescript-eslint/no-explicit-any */
import { nanoid } from "nanoid";
import { Edge, MarkerType } from "reactflow";

import {
  ARRAY_ROOT_NODE_INDEX,
  ROOT_NODE_DEPTH,
  ROOT_PARENT_NODE_PATH_IDS,
} from "../constants/graph.constants";

import {
  ArrayCustomNode,
  ObjectCustomNode,
  PrimitiveCustomNode,
  CustomNode,
  NodeType,
} from "../types/node.types";
import { JsonDataType } from "../types/json.types";
import { getJsonDataType, validateJsonDataType } from "./json.helper";
import { getXYPosition } from "./graph.helper";
import { isArray, isObject } from "../utils";

const formatNodeId = (nodeSequence: number): string => `n-${nodeSequence}`;

type BeforeObjectCustomNode = {
  nodeId: string;
  depth: number;
  obj: object;
  parentNodePathIds: string[];
  arrayIndexForObject: number | null;
  isRootNode: boolean;
};

const convertObjectToNode = ({
  nodeId,
  depth,
  obj,
  parentNodePathIds,
  arrayIndexForObject,
  isRootNode,
}: BeforeObjectCustomNode): ObjectCustomNode => {
  return {
    id: nodeId,
    type: NodeType.Object,
    position: getXYPosition(depth),
    data: {
      depth,
      dataType: JsonDataType.Object,
      contents: JSON.stringify(obj),
      parentNodePathIds,
      obj,
      arrayIndexForObject,
      isRootNode,
    },
  };
};

type BeforeArrayCustomNode = {
  nodeId: string;
  depth: number;
  arrayIndex: number;
  items: any[];
  parentNodePathIds: string[];
  isRootNode: boolean;
};

const convertArrayToNode = ({
  nodeId,
  depth,
  arrayIndex,
  items,
  parentNodePathIds,
  isRootNode,
}: BeforeArrayCustomNode): ArrayCustomNode => {
  return {
    id: nodeId,
    type: NodeType.Array,
    position: getXYPosition(depth),
    data: {
      depth,
      dataType: JsonDataType.Array,
      contents: JSON.stringify(arrayIndex),
      parentNodePathIds,
      arrayIndex,
      items,
      isRootNode,
    },
  };
};

type BeforePrimitiveCustomNode = {
  nodeId: string;
  depth: number;
  arrayIndex: number;
  value: string | number | boolean | null;
  parentNodePathIds: string[];
};

const convertPrimitiveToNode = ({
  nodeId,
  depth,
  arrayIndex,
  value,
  parentNodePathIds,
}: BeforePrimitiveCustomNode): PrimitiveCustomNode => {
  return {
    id: nodeId,
    type: NodeType.Primitive,
    position: getXYPosition(depth),
    data: {
      depth,
      dataType: getJsonDataType(value) as
        | JsonDataType.String
        | JsonDataType.Number
        | JsonDataType.Boolean
        | JsonDataType.Null,
      contents: JSON.stringify(value),
      parentNodePathIds,
      arrayIndex,
      value,
    },
  };
};

type SourceTarget = Pick<Edge, "source" | "target">;
type DefaultEdgeParams = SourceTarget & Pick<Edge, "sourceHandle">;

const createDefaultEdge = ({
  source,
  target,
  sourceHandle,
}: DefaultEdgeParams): Edge => {
  return {
    /**
     * @bugfix If the same edge id remains in `JsonDiagram` after update, the following bug occurs.
     *         https://stackoverflow.com/questions/70114700/react-flow-renderer-edges-remain-in-ui-without-any-parents
     * @solution id needs to be unique
     */
    id: nanoid(),
    type: "default",
    source,
    target,
    sourceHandle,
    animated: false,
    markerEnd: {
      type: MarkerType.ArrowClosed,
      color: "rgb(107 114 128)",
    },
    style: {
      color: "rgb(107 114 128)",
    },
  };
};

type TraverseParams = {
  traverseTarget: object | any[];
  depth: number;
  arrayIndexForObject: number | null;
  sourceSet: { source?: string; sourceHandle?: string };
  parentNodePathIds: string[];
};

type TraverseObjectParams = {
  _obj: object;
  _nextDepth: number;
  _parentNodePathIds: string[];
  _source: string;
  _sourceHandle: string;
};
type TraverseArrayParams = {
  _array: any[];
  _nextDepth: number;
  _parentNodePathIds: string[];
  _source: string;
  _sourceHandle?: string;
};

export const jsonParser = (
  json: object | any[]
): {
  nodes: CustomNode[];
  edges: Edge[];
} => {
  /**
   * `nodeSequence` will be transformed to `nodeId`.
   */
  let nodeSequence: number = 0;
  let edges: Edge[] = [];

  const addDefaultEdge = ({
    source,
    target,
    sourceHandle,
  }: DefaultEdgeParams): void => {
    edges = edges.concat(
      createDefaultEdge({
        source,
        target,
        sourceHandle,
      })
    );
  };

  /**
   *  
   * `traverse` function follows `preorder traversal`
   
   *  @implements
   * - if object
   *   - add node(object)
   *   - loop object
   *     - if object field -> traverse
   *     - if array field
   *       - loop array field
   *         - if object item -> traverse
   *         - if array item -> add node(array) & traverse(if not empty)
   *         - if primitive item -> add node(primitive)
   * - if array
   *   - loop array
   *     - if object item -> traverse
   *     - if array item -> add node(array) & traverse(if not empty)
   *     - if primitive item -> add node(primitive)
   *
   * @param sourceSet
   * - [source, sourceHandle]
   * - [undefined, undefined] -> No parent, {traverseTarget} is root node.
   * - [string, undefined] -> Parent is array node
   * - [string, string] -> Parent is object node (arrow is from object field)
   */
  const traverse = ({
    traverseTarget,
    depth,
    arrayIndexForObject,
    sourceSet,
    parentNodePathIds,
  }: TraverseParams): CustomNode[] => {
    let nodes: CustomNode[] = [];

    const traverseObject = ({
      _obj,
      _nextDepth,
      _parentNodePathIds,
      _source,
      _sourceHandle,
    }: TraverseObjectParams) => {
      nodeSequence++;
      const nextNodeId: string = formatNodeId(nodeSequence);
      const target: string = nextNodeId;

      nodes = nodes.concat(
        traverse({
          traverseTarget: _obj,
          depth: _nextDepth,
          arrayIndexForObject: null,
          sourceSet: {
            source: _source,
            sourceHandle: _sourceHandle,
          },
          parentNodePathIds: _parentNodePathIds,
        })
      );
      addDefaultEdge({
        source: _source,
        target,
        sourceHandle: _sourceHandle,
      });
    };

    const traverseArray = ({
      _array,
      _nextDepth,
      _parentNodePathIds,
      _source,
      _sourceHandle,
    }: TraverseArrayParams) => {
      _array.forEach((arrayItem: any, arrayIndex: number) => {
        const arrayItemValidator = validateJsonDataType(arrayItem);

        nodeSequence++;
        const nextNodeId = formatNodeId(nodeSequence);
        const target: string = nextNodeId;

        if (arrayItemValidator.isObjectData) {
          // Array > Object
          nodes = nodes.concat(
            traverse({
              traverseTarget: arrayItem as object,
              depth: _nextDepth,
              arrayIndexForObject: arrayIndex,
              sourceSet: {
                source: _source,
                sourceHandle: _sourceHandle,
              },
              parentNodePathIds: _parentNodePathIds,
            })
          );
          addDefaultEdge({
            source: _source,
            target,
            sourceHandle: _sourceHandle,
          });
        } else if (arrayItemValidator.isArrayData) {
          // Array > Array
          const items: any[] = arrayItem as any[];

          nodes = nodes.concat(
            convertArrayToNode({
              nodeId: nextNodeId,
              depth: _nextDepth,
              arrayIndex,
              items,
              parentNodePathIds: _parentNodePathIds,
              isRootNode: false,
            })
          );
          addDefaultEdge({
            source: _source,
            target,
            sourceHandle: _sourceHandle,
          });

          const isEmptyArray: boolean = items.length === 0;

          if (!isEmptyArray) {
            nodes = nodes.concat(
              traverse({
                traverseTarget: items,
                depth: _nextDepth,
                arrayIndexForObject: null,
                sourceSet: {
                  source: _source,
                  sourceHandle: _sourceHandle,
                },
                parentNodePathIds: _parentNodePathIds,
              })
            );
          }
        } else if (arrayItemValidator.isPrimitiveData) {
          // Array > Primitive
          nodes = nodes.concat(
            convertPrimitiveToNode({
              nodeId: nextNodeId,
              depth: _nextDepth,
              arrayIndex,
              value: arrayItem as string | number | boolean | null,
              parentNodePathIds: _parentNodePathIds,
            })
          );
          addDefaultEdge({
            source: _source,
            target,
            sourceHandle: _sourceHandle,
          });
        }
      });
    };

    const currentNodeId: string = formatNodeId(nodeSequence);
    const source: string = currentNodeId;
    const nextDepth: number = depth + 1;
    const nextParentNodePathIds: string[] = parentNodePathIds.concat([
      currentNodeId,
    ]);
    const isRootNode: boolean = sourceSet.source === undefined;

    if (isObject(traverseTarget)) {
      nodes = nodes.concat(
        convertObjectToNode({
          nodeId: currentNodeId,
          depth,
          obj: traverseTarget,
          parentNodePathIds,
          arrayIndexForObject,
          isRootNode,
        })
      );

      Object.entries(traverseTarget).forEach(([propertyK, propertyV]) => {
        const sourceHandle: string = propertyK;

        if (isObject(propertyV)) {
          traverseObject({
            _obj: propertyV,
            _nextDepth: nextDepth,
            _parentNodePathIds: nextParentNodePathIds,
            _source: source,
            _sourceHandle: sourceHandle,
          });
        } else if (isArray(propertyV)) {
          traverseArray({
            _array: propertyV,
            _nextDepth: nextDepth,
            _parentNodePathIds: nextParentNodePathIds,
            _source: source,
            _sourceHandle: sourceHandle,
          });
        }
      });
    } else if (isArray(traverseTarget)) {
      /**
       * Unlike 'object' JSON code, 'array' JSON code needs to add an extra node if root node.
       */
      if (isRootNode) {
        nodes = nodes.concat(
          convertArrayToNode({
            nodeId: currentNodeId,
            depth,
            arrayIndex: ARRAY_ROOT_NODE_INDEX,
            items: traverseTarget,
            parentNodePathIds: ROOT_PARENT_NODE_PATH_IDS,
            isRootNode,
          })
        );
      }

      traverseArray({
        _array: traverseTarget,
        _nextDepth: nextDepth,
        _parentNodePathIds: nextParentNodePathIds,
        _source: source,
        _sourceHandle: undefined,
      });
    }

    return nodes;
  };

  return {
    nodes: traverse({
      traverseTarget: json,
      depth: ROOT_NODE_DEPTH,
      parentNodePathIds: ROOT_PARENT_NODE_PATH_IDS,
      arrayIndexForObject: null,
      sourceSet: {},
    }),
    edges,
  };
};
