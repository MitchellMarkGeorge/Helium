import { dialog, app } from "electron";
import { HeliumWindow } from "../models/HeliumWindow";
import ipc from "./ipc";

// handleAppEvents???K
export function initAppService(heliumWindow: HeliumWindow) {
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

  ipc.scopedHandle(windowId, "open-folder-dialog", async () => {
    const { filePaths } = await dialog.showOpenDialog(
      heliumWindow.browserWindow,
      {
        // defaultPath: utils.getHome(),
        // think about abstracting this away
        // should the user be able to change the home directory
        defaultPath: app.getPath('home'),
        buttonLabel: "Open Theme",
        properties: ["openDirectory"],
      }
    );
    return filePaths;
  });
}
