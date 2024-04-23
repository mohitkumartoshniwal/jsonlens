// TYPES REPEATED IN EXTENSION_UI

export type WebviewMessage =
  | {
      // React -> Extension(VS Code)
      command: "webview-ready";
    }
  | {
      // Extension(VS Code) -> React
      command: "json";
      jsonData: string;
      fileName: string;
    };

export type JsonFile = {
  jsonData: string;
  fileName: string;
};
