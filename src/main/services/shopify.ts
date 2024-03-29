// const openTheme = (pathOrUrl: string) => {

import { HeliumWindow } from "../models/HeliumWindow"
import ipc from "./ipc";

    
// }


export function initShopifyService (heliumWindow: HeliumWindow) {
    // console.log(heliumWindow);
  const windowId = heliumWindow.getId();

  ipc.scopedHandle(windowId, 'open-theme', (event, args) => {
    return true; // think about this
  })

  ipc.scopedHandle(windowId, 'start-theme-preview', (event, args) => {
    return heliumWindow.shopifyCli.startThemePreview();
  })

  ipc.scopedHandle(windowId, 'stop-theme-preview', (event, args) => {
    return heliumWindow.shopifyCli.stopThemePreview();
  })

  ipc.scopedHandle<string>(windowId, 'pull-theme', (event, themeId) => {
    return heliumWindow.shopifyCli.pullTheme(themeId);
  })

  ipc.scopedHandle<string>(windowId, 'push-theme', () => {
    return heliumWindow.shopifyCli.pushTheme();
  });

  ipc.scopedHandle<string>(windowId, 'get-connected-store', () => {
    return heliumWindow.getConnectedStore();
  })

  ipc.scopedHandle<string>(windowId, 'is-preview-running', () => {
    return heliumWindow.shopifyCli.getPreviewState();
  })
}