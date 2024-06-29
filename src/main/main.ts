import { HeliumApplication } from "./models/HeliumApplication";
import { Menu, app } from "electron";
import { HeliumLaunchOptions } from "./types";
import path from "path";
import os from "os";

interface OpenFileEnvent {
  preventDefault: () => void;
}

function start() {
  // https://www.electronjs.org/docs/latest/tutorial/performance#8-call-menusetapplicationmenunull-when-you-do-not-need-a-default-menu
  Menu.setApplicationMenu(null);
  // let launchOptions: HeliumLaunchOptions | undefined = undefined;
  let launchOptions: HeliumLaunchOptions | undefined = {
    themePath: path.join(os.homedir(), "dawn-test"),
  };

  // this method is called when a recent document/folder it meant to be opened
  const setLaunchOptions = (event: OpenFileEnvent, openPath: string) => {
    event.preventDefault();
    // this path
    launchOptions = { themePath: openPath };
  };

  app.on("open-file", setLaunchOptions);

  app.on("ready", () => {
    // remove the listener so it can be handled agaon
    app.removeListener("open-file", setLaunchOptions);
    const heliumApp = HeliumApplication.init();
    heliumApp.launch(launchOptions);
  });
}

start();
