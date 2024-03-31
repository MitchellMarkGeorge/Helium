// const openTheme = (pathOrUrl: string) => {

import { ConnectStoreOptions } from "common/types";
import { HeliumWindow } from "../models/HeliumWindow"
import ipc from "./ipc";

    
// }


export function initShopifyService (heliumWindow: HeliumWindow) {
    // console.log(heliumWindow);
  const windowId = heliumWindow.getId();

  ipc.scopedHandle(windowId, 'open-theme', () => {
    return true; // think about this
  })

  ipc.scopedHandle(windowId, 'start-theme-preview', () => {
    return heliumWindow.shopifyCli.startThemePreview();
  })

  ipc.scopedHandle(windowId, 'stop-theme-preview', () => {
    return heliumWindow.shopifyCli.stopThemePreview();
  })

  ipc.scopedHandle<string>(windowId, 'pull-theme', (_, themeId) => {
    return heliumWindow.shopifyCli.pullTheme(themeId);
  })

  ipc.scopedHandle<string>(windowId, 'push-theme', () => {
    return heliumWindow.shopifyCli.pushTheme();
  });

  ipc.scopedHandle<ConnectStoreOptions>(windowId, 'connect-store', (_, options) => {
    return heliumWindow.connectStore(options);
  })

  ipc.scopedHandle<string>(windowId, 'get-connected-store', () => {
    return heliumWindow.getConnectedStore();
  })
}