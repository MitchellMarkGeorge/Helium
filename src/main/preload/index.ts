// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

import { contextBridge } from "electron";
import { getAppPreloadApi } from "./app";
import { getFsPreloadApi } from "./fs";
import { getShopifyPreloadApi } from "./shopify";
import utils from "main/utils/utils";
import { constants } from "../utils/constants";

contextBridge.exposeInMainWorld("helium", {
  // consider moving these apis to the service folder
  app: getAppPreloadApi(),
  fs: getFsPreloadApi(),
  shopify: getShopifyPreloadApi(),
  utils,
  constants
});
