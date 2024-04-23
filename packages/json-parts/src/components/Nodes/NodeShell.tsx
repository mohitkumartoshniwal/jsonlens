import { NodeType } from "../../types/node.types";

type Props = {
  nodeId: string;
  nodeType: NodeType;
  children: React.ReactNode;
};

export const NodeShell = ({ nodeId, nodeType, children }: Props) => {
  // TODO SELECT NODE HERE onClick
  return (
    <div
      className="bg-white dark:bg-node dark:text-white p-3 border-2 rounded-md border-gray-300 dark:border-gray-400 hover:dark:border-white  hover:border-purple-600 hover:cursor-pointer"
      onClick={() => console.log(`${nodeId} with ${nodeType} clicked`)}
    >
      {children}
    </div>
  );
};
