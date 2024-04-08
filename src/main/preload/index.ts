// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

import { contextBridge } from "electron";
import { getAppApi } from "./app";
import { getFsApi } from "./fs";
import { getShopifyApi } from "./shopify";
import utils from "main/utils";

contextBridge.exposeInMainWorld("helium", {
  // consider moving these apis to the service folder
  app: getAppApi(),
  fs: getFsApi(),
  shopify: getShopifyApi(),
  utils,
});
