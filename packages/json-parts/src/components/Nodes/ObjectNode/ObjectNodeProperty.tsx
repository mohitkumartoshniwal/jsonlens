/* eslint-disable @typescript-eslint/no-explicit-any */

import { DefaultHandle } from "../../Handle/DefaultHandle";
import { validateJsonDataType } from "../../../helpers/json.helper";
import { isEmptyArray, isEmptyObject } from "../../../utils/utils";

type Props = {
  nodeId: string;
  propertyK: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  propertyV: any;
  hasChildNode: boolean;
};

export const ObjectNodeProperty = ({
  // nodeId,
  propertyK,
  propertyV,
  hasChildNode,
}: Props) => {
  const {
    isObjectData,
    isArrayData,
    isStringData,
    isNumberData,
    isBooleanData,
    isNullData,
  } = validateJsonDataType(propertyV);

  return (
    <div className="relative flex h-nodeContentHeight items-center justify-between pr-2 ">
      <span className="mr-4 font-medium text-primary text-purple-500 ">
        {propertyK}:
      </span>

      {isObjectData && (
        <span>{isEmptyObject(propertyV as object) ? "{}" : "{...}"}</span>
      )}
      {isArrayData && (
        <span>{isEmptyArray(propertyV as unknown[]) ? "[]" : "[...]"}</span>
      )}

      {isStringData && (
        <div className="font-semibold overflow-hidden text-ellipsis whitespace-nowrap max-w-valueMaxWidth">
          {`"${propertyV}"`}
        </div>
      )}
      {isNumberData && (
        <span className="font-semibold overflow-hidden text-ellipsis whitespace-nowrap text-orange-400">
          {propertyV}
        </span>
      )}

      {isBooleanData && (
        <span
          className={`font-semibold ${propertyV ? "text-blue-500" : "text-red-500"} `}
        >{`${propertyV}`}</span>
      )}
      {isNullData && (
        <span className="font-semibold text-gray-400">{`${propertyV}`}</span>
      )}

      {hasChildNode && <DefaultHandle id={propertyK} type="source" />}
    </div>
  );
};
