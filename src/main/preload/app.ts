import { HeliumWindowState } from "../types";
// get inital window state

import renderer from "../services/ipc/renderer";
import { InitalState } from "common/types";

export const getAppPreloadApi = () => ({
  // these ones don't need to return promises...
  closeWindow: renderer.invoke("close-window"),
  setWindowTitle: renderer.invoke<string>("set-window-title"),
  minimizeWindow: renderer.invoke("minimize-window"),
  maximizeWindow: renderer.invoke("maximize-window"),
  getWindowState: renderer.invoke<void, HeliumWindowState>("get-window-state"),
  // can return an empty array
  openFolderDialog: renderer.invoke<void, string[]>("open-folder-dialog"),
  loadInitalState: renderer.invoke<void, InitalState>("load-inital-state"),
  openUrl: renderer.invoke<string>("open-url"),
  on: renderer.on(),
  sendWorkspaceIsShowing: renderer.emit("workspace-is-showing"),
  showNewFileContextMenu: renderer.emit("show-new-file-context-menu"),
  showFileItemContextMenu: renderer.emit("show-file-item-context-menu"),
  showFolderItemContextMenu: renderer.emit("show-folder-item-context-menu"),
  showEditorContextMenu: renderer.emit("show-editor-context-menu"),
});
