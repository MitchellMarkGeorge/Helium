// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

import { contextBridge, ipcRenderer } from "electron";
import { getAppApi, getCurrentWindowId, getInitalState } from "./app";
import { getFsApi } from "./fs";
import { getShopifyApi } from "./shopify";
import utils from "main/utils";

async function runPreload() {
  // does this being async work???
  // are we sure this is done executing by the time the window is loaded???
  console.log("preload running here");
  ipcRenderer.setMaxListeners(0);
  const currentWindowId = await getCurrentWindowId();
  console.log(currentWindowId);
  // 
  const initalState = await getInitalState(currentWindowId);
  console.log(initalState);
  // reloading the window via webContent.reload() seems to clear the preloaded api (everything is undefined) (at least being async)
  // reloading the window via webContent.reloadIgnoringCache() seems to do the expected thing and "redefined" the preloaded api (they all show up)
  // dont know if this has anything to do with this method being async/relying on async code

  // can do an initial state load here and then expose it (themes, settings, )

  // THE ONLY WAY TO DO THIS SYNC IS TO 
  //1) GET THE HELIUM_WINDOW FOR EVERY IPC HANDLEUSING BrowserWindow.fromWebContent()
  //2) the inital data is loaded using a promise
  // NEED TO THINK ABOUT EACH APROACH

  // THE ADVANTAGE OF SCOPING THE API TO THE BROWSER WIDNOW ID IS THAT IPC events are scoped to each winodw
  // Disadvantge: for n windows, there are n IPC handlers (more memory usage)

  contextBridge.exposeInMainWorld("helium", {
    // consider moving these apis to the service folder
    app: getAppApi(currentWindowId),
    fs: getFsApi(currentWindowId),
    shopify: getShopifyApi(currentWindowId),
    initalState,
    utils,
  });
}

runPreload();

// contextBridge.exposeInMainWorld("helium", 5);