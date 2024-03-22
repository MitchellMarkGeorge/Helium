// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

import { contextBridge, ipcRenderer } from "electron";
import { getAppApi, getCurrentWindowId } from "./app";

async function runPreload() {
  ipcRenderer.setMaxListeners(0);
  const currentWindowId = await getCurrentWindowId();
  contextBridge.exposeInMainWorld("helium", {
    app: getAppApi(currentWindowId),
  });
}

runPreload();
