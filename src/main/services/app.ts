import { dialog, app, shell } from "electron";
import main from "./ipc/main";

// handleAppEvents???K

export function initAppPreloadApi() {
  main.handle("close-window", (heliumWindow) => {
    heliumWindow.browserWindow.close();
  });

  main.handle("minimize-window", (heliumWindow) => {
    heliumWindow.browserWindow.minimize();
  });

  main.handle("maximize-window", (heliumWindow) => {
    heliumWindow.browserWindow.maximize();
  });

  main.handle("get-window-state", (heliumWindow) => {
    return heliumWindow.getWindowState();
  });

  main.handle("open-folder-dialog", async (heliumWindow) => {
    const { filePaths } = await dialog.showOpenDialog(
      heliumWindow.browserWindow,
      {
        // defaultPath: utils.getHome(),
        // think about abstracting this away
        // should the user be able to change the home directory
        defaultPath: app.getPath("home"),
        buttonLabel: "Open Theme",
        properties: ["openDirectory"],
      }
    );
    return filePaths;
  });

  main.handle("load-inital-state", (heliumWindow) => {
    return heliumWindow.loadInitalState();
  });

  main.handle<string>("open-url", (_, url) => {
    return shell.openExternal(url);
  });

  main.listen("workspace-is-showing", (heliumWindow) => {
    heliumWindow.setIsWorkspaceShowing(true);
  })
}
