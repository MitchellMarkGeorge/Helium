import { BrowserWindow, Menu, WebContents, app } from "electron";
import { HeliumWindowManager } from "./HeliumWindowManager";
import utils from "../utils";
import { HeliumWindowOptions } from "../types";
import { initAppService } from "main/services/app";
import { initShopifyService } from "main/services/shopify";
import { initFsService } from "main/services/fs";

export class HeliumApplication {
  private static instance: HeliumApplication;
  private windowManager: HeliumWindowManager;

  private constructor() {
    // makes sure that no default menu is put in place
    Menu.setApplicationMenu(null)
    this.windowManager = new HeliumWindowManager();
    // build menu bar
    // build
    initAppService();
    initShopifyService();
    initFsService();

    // if there are a lot of events to listen to, handle them in another file
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

  public getWindowFromWebContents(webContent: WebContents) {
    const browserWindow = BrowserWindow.fromWebContents(webContent);
    return this.windowManager.getWindowFromBrowserWindow(browserWindow);
  }

  public quit() {
    // ipcMain.removeAllListeners();
    app.quit();
  }

  public createNewWindow(options?: HeliumWindowOptions) {
    // abstracting this away in case I want to do something else when a new window is opened.
    this.windowManager.openNewWindow(options);
  }
}
