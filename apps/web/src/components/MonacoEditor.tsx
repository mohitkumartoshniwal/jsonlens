import Editor, { useMonaco } from "@monaco-editor/react";
import { useCallback, useEffect } from "react";
import { debounce, useCustomTheme, useFile } from "@jsonlens/json-parts";
import { useApp } from "../stores/useApp";
import { SAMPLE_DATA } from "../constants/constants";

const editorOptions = {
  formatOnPaste: true,
  formatOnType: true,
  minimap: {
    enabled: false,
  },
};

const MonacoEditor = () => {
  const { isDarkMode } = useCustomTheme();

  const setIsLoading = useApp((state) => state.setIsLoading);
  const theme = isDarkMode ? "vs-dark" : "light";
  const format = useFile((state) => state.format);

  const monaco = useMonaco();
  const [contents, setContents] = useFile((state) => [
    state.contents,
    state.setContents,
  ]);

  const debouncedSetContents = debounce((contents) => {
    setContents(contents);
  }, 1000);

  useEffect(() => {
    monaco?.languages.json.jsonDefaults.setDiagnosticsOptions({
      validate: true,
      allowComments: true,
    });
  }, [monaco?.languages.json.jsonDefaults]);

  const handleGraphChange = useCallback(
    (contents: string | undefined) => {
      if (contents === undefined) return;

      debouncedSetContents(contents);
    },
    [setContents]
  );

  function onMount() {
    setIsLoading(true);
    setContents(SAMPLE_DATA);
  }
  return (
    <Editor
      theme={theme}
      height="100%"
      language={format}
      options={editorOptions}
      onMount={onMount}
      value={contents}
      onChange={handleGraphChange}
    />
  );
};

export default MonacoEditor;
