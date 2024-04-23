import { useMemo } from "react";
import { Handle, HandleProps, HandleType, Position } from "reactflow";

type Props = Pick<HandleProps, "id" | "type"> & {
  style?: React.CSSProperties;
};

export const DefaultHandle = ({ id, type, style = {} }: Props) => {
  const handleTypeToPositionMap: Record<HandleType, Position> = useMemo(
    () => ({
      source: Position.Right,
      target: Position.Left,
    }),
    []
  );

  return (
    <Handle
      style={{ backgroundColor: "transparent", border: "none", ...style }}
      id={id}
      type={type}
      position={handleTypeToPositionMap[type]}
    />
  );
};
