import { BrowserWindow } from "electron";
import { HeliumWindowOptions } from "../types";
import { HeliumWindow } from "./HeliumWindow";

export class HeliumWindowManager {
  private lastFocusedWindow: HeliumWindow | null;
  private windows: HeliumWindow[];
  constructor() {
    this.windows = [];
    // there is a chance there is no window focused (eg: all the windows are minimized)
    // what we need is the last focused window
    this.lastFocusedWindow = null;
  }

  public openNewWindow(options?: HeliumWindowOptions) {
    const newWindow = new HeliumWindow(options);
    this.windows.push(newWindow);

    // add new listener that sets the focused window variable
    newWindow.browserWindow.on("focus", () => {
      // think about this
      this.lastFocusedWindow = newWindow;
    });

    return newWindow;
  }

  public getWindows() {
    return this.windows;
  }

  public getNumOfWindows() {
    return this.windows.length;
  }

  public getWindowFromBrowserWindow(browserWindow: BrowserWindow) {
    return this.windows.find(
      (heliumWindow) => heliumWindow.browserWindow === browserWindow
    );
  }

  public getWindowById(windowId: number) {
    return this.windows.find(
      (heliumWindow) => heliumWindow.browserWindow === BrowserWindow.fromId(windowId)
    );
  }

  public getLastFocusedWindow() {
    return this.lastFocusedWindow;
  }
}
