import { HeliumWindow } from "../models/HeliumWindow";
import ipc from "./ipc";

// handleAppEvents???K
export function handleAppIpc(heliumWindow: HeliumWindow) {
    // console.log(heliumWindow);
  const windowId = heliumWindow.getId();

  ipc.scopedHandle(windowId, "close-window", () => {
    heliumWindow.browserWindow.close();
  });

  ipc.scopedHandle(windowId, "minimize-window", () => {
    heliumWindow.browserWindow.minimize();
  });

  ipc.scopedHandle(windowId, "maximize-window", () => {
    heliumWindow.browserWindow.maximize();
  });

  ipc.scopedHandle(windowId, "get-window-state", () => {
    return heliumWindow.getWindowState();
  });
}
