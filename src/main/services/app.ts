import { dialog, app } from "electron";
import { HeliumWindow } from "../models/HeliumWindow";
import ipc from "./ipc";

// handleAppEvents???K
export function initAppService() {

  ipc.handle("close-window", (heliumWindow) => {
    heliumWindow.browserWindow.close();
  });

  ipc.handle("minimize-window", (heliumWindow) => {
    heliumWindow.browserWindow.minimize();
  });

  ipc.handle("maximize-window", (heliumWindow) => {
    heliumWindow.browserWindow.maximize();
  });

  ipc.handle("get-window-state", (heliumWindow) => {
    return heliumWindow.getWindowState();
  });

  ipc.handle("open-folder-dialog", async (heliumWindow) => {
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
