// const openTheme = (pathOrUrl: string) => {

import { ConnectStoreOptions } from "common/types";
import main from "./ipc/main";

export function initShopifyService () {
    // console.log(heliumWindow);

  main.handle('open-theme', () => {
    return true; // think about this
  })

  main.handle('start-theme-preview', (heliumWindow) => {
    return heliumWindow.shopifyCli.startThemePreview();
  })

  main.handle('stop-theme-preview', (heliumWindow) => {
    return heliumWindow.shopifyCli.stopThemePreview();
  })

  main.handle<string>('pull-theme', (heliumWindow, themeId) => {
    return heliumWindow.shopifyCli.pullTheme(themeId);
  })

  main.handle<string>('push-theme', (heliumWindow) => {
    return heliumWindow.shopifyCli.pushTheme();
  });

  main.handle<ConnectStoreOptions>('connect-store', (heliumWindow, options) => {
    return heliumWindow.connectStore(options);
  })

  main.handle<string>('get-connected-store', (heliumWindow) => {
    return heliumWindow.getConnectedStore();
  })
}