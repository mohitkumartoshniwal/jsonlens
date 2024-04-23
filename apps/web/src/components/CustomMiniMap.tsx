import { MiniMap } from "reactflow";
import { MinimapTheme } from "../types";
import { THEMES, useCustomTheme } from "@jsonlens/json-parts";
import { useEffect, useState } from "react";

const lightMinimapTheme: MinimapTheme = {
  backgroundColor: "#ffffff", // backgroundContrast
  maskColor: undefined,
  nodeColor: "lightgray",
};

const darkMinimapTheme: MinimapTheme = {
  backgroundColor: "#16181A", // backgroundContrast
  maskColor: "rgba(15, 15, 15, 0.7)",
  nodeColor: "white",
};
export const CustomMiniMap = () => {
  const { isDarkMode } = useCustomTheme();
  const [minimapTheme, setMinimapTheme] = useState(darkMinimapTheme);

  useEffect(() => {
    setMinimapTheme(isDarkMode ? darkMinimapTheme : lightMinimapTheme);
  }, [isDarkMode]);

  return (
    <MiniMap
      pannable
      position="bottom-left"
      style={{
        backgroundColor: minimapTheme.backgroundColor,
      }}
      maskColor={minimapTheme.maskColor}
      nodeColor={minimapTheme.nodeColor}
    />
  );
};
