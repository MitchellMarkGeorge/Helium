import { HeliumApplication } from "./models/HeliumApplication";
import { Menu, app } from "electron";
import { HeliumLaunchOptions } from "./types";
import path from "path";

interface OpenFileEnvent {
  preventDefault: () => void;
}

function start() {
  // https://www.electronjs.org/docs/latest/tutorial/performance#8-call-menusetapplicationmenunull-when-you-do-not-need-a-default-menu
  Menu.setApplicationMenu(null);
  let launchOptions: HeliumLaunchOptions | undefined = undefined;

  const setLaunchOptions = (event: OpenFileEnvent, openPath: string) => {
    event.preventDefault();
    launchOptions = { themePath: path.resolve(openPath) };
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
