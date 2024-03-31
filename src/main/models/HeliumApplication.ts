import { BrowserWindow, app, ipcMain } from "electron";
import { HeliumWindowManager } from "./HeliumWindowManager";
import utils from "../utils";
import { HeliumWindowOptions } from "../types";

export default class HeliumApplication {
  private static instance: HeliumApplication;
  private windowManager: HeliumWindowManager;

  private constructor() {
    // sets no limit on listeners (since they are dynamicaly scoped to each winodw);
    ipcMain.setMaxListeners(0);
    this.handleGetWindowIdEvent();
    this.handleGetInitalState();
    this.windowManager = new HeliumWindowManager();
    // build menu bar
    // build
  }

  // simply init???
  static initInstance() {
    if (HeliumApplication.instance) {
      throw new Error("HeliumApplication() already initalized");
    } else {
      this.instance = new HeliumApplication();
      return this.instance;
    }
  }
  static getInstance() {
    if (!HeliumApplication.instance) {
      throw new Error(
        "Must initalize HeliumApplication class using HeliumApplication.initInstance(options)"
      );
    }
    return HeliumApplication.instance;
  }

  public launch() {
    app.whenReady().then(() => {
      this.createNewWindow();

      app.on("activate", () => {
        if (this.windowManager.getNumOfWindows() === 0) {
          this.createNewWindow();
        }
      });
    });

    app.on("window-all-closed", () => {
      if (utils.isMac) {
        this.quit();
      }
    });
  }

  public getLastFocusedWindow() {
    return this.windowManager.getLastFocusedWindow();
  }

  public getWindowFromBrowserWindow(browserWindow: BrowserWindow) {
    this.windowManager.getWindowFromBrowserWindow(browserWindow);
  }

  public quit() {
    // ipcMain.removeAllListeners();
    app.quit();
  }

  public createNewWindow(options?: HeliumWindowOptions) {
    // abstracting this away in case I want to do something else when a new window is opened.
    this.windowManager.openNewWindow(options);
  }

  private handleGetWindowIdEvent() {
    ipcMain.handle('get-window-id', (event) => {
        const browserWindow = BrowserWindow.fromWebContents(event.sender);
        return browserWindow.id;
    });
  }

  private handleGetInitalState() {
    ipcMain.handle('get-inital-state', (event, windowId) => {
        const heliumWindow = this.windowManager.getWindowById(windowId);
        return heliumWindow.getInitalState();
    });
  }
}
