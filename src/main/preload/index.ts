// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

import { contextBridge, ipcRenderer } from "electron";
import { getAppApi, getCurrentWindowId } from "./app";
import utils from "../utils";
import { getFsApi } from "./fs";

async function runPreload() {
  ipcRenderer.setMaxListeners(0);
  const currentWindowId = await getCurrentWindowId();
  // can do an initial state load here and then expose it (themes, settings, )

  contextBridge.exposeInMainWorld("helium", {
    app: getAppApi(currentWindowId),
    fs: getFsApi(currentWindowId),
    utils
  });
}

runPreload();
