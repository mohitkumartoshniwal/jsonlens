import { useEffect, useState } from "react";
import { ReactFlowProvider } from "reactflow";
import { MdOutlineLightMode, MdOutlineNightlight } from "react-icons/md";

import { debounce, useFile, THEMES } from "@jsonlens/json-parts";

import { vscode } from "./vscode";
import { WebviewMessage } from "./types";
import { Graph } from "./components/Graph";

function getTheme() {
  const theme = document.body.getAttribute("data-vscode-theme-kind");
  if (theme?.includes(THEMES.LIGHT)) return THEMES.LIGHT;
  return THEMES.DARK;
}

function App() {
  const [_, setContents] = useFile((state) => [
    state.contents,
    state.setContents,
  ]);

  const debouncedSetContents = debounce((contents) => {
    setContents(contents);
  }, 800);

  useEffect(() => {
    vscode.postMessage({
      command: "webview-ready",
    });

    window.addEventListener("message", (event) => {
      const message = event.data as WebviewMessage;

      if (message.command === "json") {
        const jsonData = message.jsonData;
        debouncedSetContents(jsonData);
      }
    });
  }, []);

  const [theme, setTheme] = useState(THEMES.DARK);

  const toggleTheme = () => {
    const nextTheme = theme === THEMES.DARK ? THEMES.LIGHT : THEMES.DARK;
    setTheme(nextTheme);
    const root = window.document.documentElement;
    root.classList.remove(theme);
    root.classList.add(nextTheme);
  };

  useEffect(() => {
    const theme = getTheme();
    setTheme(theme);
    window.document.documentElement.classList.add(theme);
  }, []);

  return (
    <ReactFlowProvider>
      <button
        className="absolute z-20 top-3 right-8 text-xl text-darkText dark:text-white"
        onClick={toggleTheme}
      >
        {theme === THEMES.DARK ? (
          <MdOutlineLightMode />
        ) : (
          <MdOutlineNightlight />
        )}
      </button>
      <Graph theme={theme} />
    </ReactFlowProvider>
  );
}

export default App;
