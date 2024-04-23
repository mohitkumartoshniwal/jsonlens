import * as vscode from "vscode";
import { APPLICATION_CONSTANTS } from "./constants";
import { JsonFile, WebviewMessage } from "./types";
import { formatPanelTitle, getNonce, getUri } from "./utilities";
import path from "path";

export class JSONLensPanel {
  /**
   * Track the currently panel. Only allow a single panel to exist at a time.
   */
  public static currentPanel: JSONLensPanel | undefined;

  public static readonly viewType = APPLICATION_CONSTANTS.viewTypeId;

  private readonly _panel: vscode.WebviewPanel;
  private readonly _extensionPath: string;
  private readonly _extensionUri: vscode.Uri;

  private _disposables: vscode.Disposable[] = [];

  public static createOrShow(
    context: vscode.ExtensionContext,
    jsonFile: JsonFile,
    column: vscode.ViewColumn
  ) {
    const { fileName } = jsonFile;
    const panelTitle = formatPanelTitle(fileName);

    // If we already have a panel, show it.
    // if (JSONLensPanel.currentPanel !== undefined) {
    //   JSONLensPanel.currentPanel._panel.reveal(vscode.ViewColumn.Active);
    //   JSONLensPanel.currentPanel._panel.title = panelTitle;
    //   JSONLensPanel.currentPanel._panel.webview.postMessage({
    //     command: "json",
    //     jsonData,
    //     fileName,
    //   } as WebviewMessage);

    //   return;
    // }

    // Otherwise, create a new panel.
    const panel = vscode.window.createWebviewPanel(
      JSONLensPanel.viewType,
      panelTitle,
      column,
      {
        enableScripts: true,
        retainContextWhenHidden: true,
        localResourceRoots: [
          vscode.Uri.joinPath(context.extensionUri, "out"),
          vscode.Uri.joinPath(context.extensionUri, "webview-ui/build"),
        ],
      }
    );

    JSONLensPanel.currentPanel = new JSONLensPanel(panel, context, jsonFile);
  }

  private constructor(
    panel: vscode.WebviewPanel,
    context: vscode.ExtensionContext,
    jsonFile: JsonFile
  ) {
    const { jsonData, fileName } = jsonFile;
    const panelTitle = formatPanelTitle(fileName);

    this._panel = panel;
    this._extensionPath = context.extensionPath;
    this._extensionUri = context.extensionUri;

    this._panel.webview.html = this._initWebviewContent(panelTitle);

    this._panel.webview.onDidReceiveMessage(
      (message: WebviewMessage) => {
        switch (message.command) {
          case "webview-ready": {
            this._panel.webview.postMessage({
              command: "json",
              jsonData,
              fileName,
            } as WebviewMessage);

            return;
          }
        }
      },
      null,
      this._disposables
    );

    const editor = vscode.window.activeTextEditor;
    vscode.workspace.onDidChangeTextDocument((changeEvent) => {
      if (changeEvent.document === editor?.document) {
        this._panel.webview.postMessage({
          command: "json",
          jsonData: changeEvent.document.getText(),
          fileName,
        } as WebviewMessage);
      }
    });

    // This happens when the user closes the panel or when the panel is closed programmatically
    this._panel.onDidDispose(() => this.dispose(), null, this._disposables);
  }

  /**
   * Cleans up and disposes of webview resources when the webview panel is closed.
   */
  public dispose() {
    JSONLensPanel.currentPanel = undefined;

    // Dispose of the current webview panel
    this._panel.dispose();

    // Dispose of all disposables (i.e. commands) for the current webview panel
    while (this._disposables.length) {
      const disposable = this._disposables.pop();
      if (disposable) {
        disposable.dispose();
      }
    }
  }
  private _initWebviewContent(panelTitle: string) {
    const webview = this._panel.webview;

    this._panel.title = panelTitle;
    this._panel.iconPath = vscode.Uri.file(
      path.join(this._extensionPath, "webview-ui", "build", "favicon.ico")
    );

    const stylesUri = getUri(webview, this._extensionUri, [
      "webview-ui",
      "build",
      "assets",
      "index.css",
    ]);
    // The JS file from the React build output
    const scriptUri = getUri(webview, this._extensionUri, [
      "webview-ui",
      "build",
      "assets",
      "index.js",
    ]);

    const nonce = getNonce();

    return /*html*/ `
        <!DOCTYPE html>
          <html lang="en">
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <meta http-equiv="Content-Security-Policy" content="default-src 'unsafe-inline' 'unsafe-eval' vscode-resource: data: http: https:;">
            <link rel="stylesheet" type="text/css" href="${stylesUri}">
          </head>
  
          <body>
            <noscript>You need to enable JavaScript to run this app.</noscript>
            <div id="root"></div>
            <script nonce="${nonce}" src="${scriptUri}"></script>
          </body>
        </html>`;
  }
}
