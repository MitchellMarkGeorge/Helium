import { BrowserWindow, WebContents, app } from "electron";
import { HeliumWindowManager } from "./HeliumWindowManager";
import utils from "../utils";
import { HeliumLaunchOptions, HeliumWindowOptions } from "../types";
import { initAppPreloadApi } from "main/services/app";
import { initShopifyPreloadApi } from "main/services/shopify";
import { initFsPreloadApi } from "main/services/fs";
import { HeliumAppMenu } from "./menus/HeliumAppMenu";
import { initContextMenuService } from "../services/contextmenu";
import { HeliumWindow } from "./HeliumWindow";
import path from 'path';

export class HeliumApplication {
  private static instance: HeliumApplication;
  private windowManager: HeliumWindowManager;
  private appMenu: HeliumAppMenu;
  private hasLaunched = false;

  private constructor() {
    this.windowManager = new HeliumWindowManager();
    this.appMenu = new HeliumAppMenu();

    initContextMenuService();
    // init preload services
    this.initPreloadServices();

    // used when folder is droped on app icon
    // and for opening recent file
    app.on("open-file", (event, openPath) => {
      event.preventDefault();
      // check if `this.hasLaunched`???
      this.createNewWindow({ themePathOrUrl: path.resolve(openPath) });
    });
    app.on("activate", () => {
      if (this.windowManager.getNumOfWindows() === 0) {
        this.createNewWindow();
      }
    });

    app.on("window-all-closed", () => {
      if (!utils.isMac) {
        this.quit();
      }
    });
  }

  static init() {
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

  public launch(options?: HeliumLaunchOptions) {
    if (!this.hasLaunched) {
      this.createNewWindow(
        options ? { themePathOrUrl: options?.themePath } : undefined
      );
    } else {
      throw new Error("HeliumApplication instance has been launched");
    }
    this.hasLaunched = true; // do I need to do this???
  }

  public getLastFocusedWindow() {
    return this.windowManager.getLastFocusedWindow();
  }

  public getWindowFromWebContents(webContent: WebContents) {
    const browserWindow = BrowserWindow.fromWebContents(
      webContent
    ) as BrowserWindow;
    return this.windowManager.getWindowFromBrowserWindow(
      browserWindow
    ) as HeliumWindow; // for now
  }

  public quit() {
    // ipcMain.removeAllListeners();
    app.quit();
  }

  public createNewWindow(options?: HeliumWindowOptions) {
    // abstracting this away in case I want to do something else when a new window is opened.
    this.windowManager.openNewWindow(options);
  }

  public triggerEvent<T = void>(eventName: string, args?: T) {
    // triggers event on focused window
    const focusedWindow = this.getLastFocusedWindow();
    if (focusedWindow) {
      focusedWindow.emitEvent(eventName, args);
    }
  }

  public closeFocusedWindow() {
    const focusedWindow = this.getLastFocusedWindow();
    if (focusedWindow) {
      focusedWindow.close();
    }
  }

  private initPreloadServices() {
    initAppPreloadApi();
    initFsPreloadApi();
    initShopifyPreloadApi();
  }
}
