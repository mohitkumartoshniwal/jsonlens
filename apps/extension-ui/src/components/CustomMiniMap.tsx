"use client";

import { CSSProperties, ComponentProps, useMemo } from "react";
import { MiniMap } from "reactflow";

import { THEMES } from "@jsonlens/json-parts";

type MinimapTheme = {
  backgroundColor: CSSProperties["backgroundColor"];
  maskColor: ComponentProps<typeof MiniMap>["maskColor"];
  nodeColor: ComponentProps<typeof MiniMap>["nodeColor"];
};

type Props = {
  theme: THEMES;
};

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

export const CustomMiniMap = ({ theme }: Props) => {
  const minimapTheme =
    theme === THEMES.DARK ? darkMinimapTheme : lightMinimapTheme;

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
