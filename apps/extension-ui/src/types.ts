// TYPES REPEATED IN EXTENSION

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
// | {
//     // React -> Extension(VS Code)
//     command: "invalid-json";
//     warningMessage: string;
//   };

export type JsonFile = {
  jsonData: string;
  fileName: string;
};
