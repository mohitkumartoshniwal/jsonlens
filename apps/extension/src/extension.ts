import {
  commands,
  ExtensionContext,
  OutputChannel,
  TextEditor,
  Uri,
  ViewColumn,
  window,
  workspace,
} from "vscode";
import path from "path";
import { JsonFile } from "./types";
import { JSONLensPanel } from "./JSONLensPanel";

export function activate(context: ExtensionContext) {
  context.subscriptions.push(
    commands.registerCommand("jsonlens.run", (uri) =>
      createWebviewForActiveEditor(context, ViewColumn.Active, uri)
    ),
    commands.registerCommand("jsonlens.preview", (uri) =>
      createWebviewForActiveEditor(context, ViewColumn.Beside, uri)
    )
  );
}

async function createWebviewForActiveEditor(
  context: ExtensionContext,
  column: ViewColumn,
  uri?: Uri
) {
  /**
   * If `uri` is not undefined, it means that this command was run from explorer directly. (Mouse right click)
   */
  if (uri !== undefined) {
    try {
      const fileContent = await workspace.fs.readFile(uri);

      const jsonFileFromExplorer: JsonFile = {
        jsonData: Buffer.from(fileContent).toString("utf-8"),
        fileName: path.basename(uri.fsPath),
      };

      JSONLensPanel.createOrShow(context, jsonFileFromExplorer, column);
    } catch (error) {
      console.error(error);
    }
  } else {
    const currentTextEditor: TextEditor | undefined =
      window.visibleTextEditors[0];

    const jsonFileFromTextEditor: JsonFile = {
      jsonData: currentTextEditor?.document.getText(),
      fileName: path.basename(currentTextEditor?.document.fileName),
    };

    JSONLensPanel.createOrShow(context, jsonFileFromTextEditor, column);
  }
}
