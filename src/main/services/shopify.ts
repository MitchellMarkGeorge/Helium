// const openTheme = (pathOrUrl: string) => {

import { ConnectStoreOptions } from "common/types";
import { HeliumWindow } from "../models/HeliumWindow"
import ipc from "./ipc";

    
// }


export function initShopifyService () {
    // console.log(heliumWindow);

  ipc.handle('open-theme', () => {
    return true; // think about this
  })

  ipc.handle('start-theme-preview', (heliumWindow) => {
    return heliumWindow.shopifyCli.startThemePreview();
  })

  ipc.handle('stop-theme-preview', (heliumWindow) => {
    return heliumWindow.shopifyCli.stopThemePreview();
  })

  ipc.handle<string>('pull-theme', (heliumWindow, themeId) => {
    return heliumWindow.shopifyCli.pullTheme(themeId);
  })

  ipc.handle<string>('push-theme', (heliumWindow) => {
    return heliumWindow.shopifyCli.pushTheme();
  });

  ipc.handle<ConnectStoreOptions>('connect-store', (heliumWindow, options) => {
    return heliumWindow.connectStore(options);
  })

  ipc.handle<string>('get-connected-store', (heliumWindow) => {
    return heliumWindow.getConnectedStore();
  })
}