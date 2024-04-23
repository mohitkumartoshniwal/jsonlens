"use client";

import { ReactNode } from "react";
import { ReactFlowProvider } from "reactflow";
import { ThemeProvider as NextThemesProvider } from "next-themes";

type Props = {
  children: ReactNode;
};

const Providers = ({ children }: Props) => {
  return (
    <NextThemesProvider attribute="class" defaultTheme="system" enableSystem>
      <ReactFlowProvider>{children}</ReactFlowProvider>
    </NextThemesProvider>
  );
};

export default Providers;
