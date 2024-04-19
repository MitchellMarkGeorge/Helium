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
    if (this.lastFocusedWindow === null) {
      this.lastFocusedWindow = newWindow;
    } 

    // add new listener that sets the focused window variable
    newWindow.browserWindow.on("focus", () => {
      // think about this
      this.lastFocusedWindow = newWindow;
    });

    newWindow.browserWindow.on('closed', () => {
      // remove it from the array
      // should dereference the browser window
      this.removeWindow(newWindow);
    });

    this.windows.push(newWindow);

    return newWindow;
  }

  public removeWindow(heliumWindow: HeliumWindow) {
    const index = this.windows.indexOf(heliumWindow);

    if (index !== -1) {
      this.windows.splice(index, 1);
    }
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
