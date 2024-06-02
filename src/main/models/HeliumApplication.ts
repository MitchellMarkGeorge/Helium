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

export class HeliumApplication {
  private static instance: HeliumApplication;
  private windowManager: HeliumWindowManager;
  private appMenu: HeliumAppMenu;
  private hasLaunched = false;

  private constructor() {
    this.windowManager = new HeliumWindowManager();
    this.appMenu = new HeliumAppMenu();

    // used when folder is droped on app icon
    // and for opening recent file
    app.on("open-file", (event, openPath) => {
      event.preventDefault();

      // should probably stop trying to resolve the paths
      // just need them to be full

      // check if `this.hasLaunched`???
      // check if a window with that folder exists

      // if the path does not exist, it should still load the editor window
      // and just show an error notification if it unavalible to open it
      const existingWindow = this.windowManager.getWindowForPath(openPath);
      if (existingWindow) {
        existingWindow.makeVisible();
      } else {
        this.createNewWindow({ themePathOrUrl: openPath });
      }
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
      // prevents second instace from being created
      const gotTheLock = app.requestSingleInstanceLock();
      if (!gotTheLock) {
        app.quit();
      } else {
        app.on("second-instance", () => {
          const lastFocusedWindow = this.instance.getLastFocusedWindow();
          if (lastFocusedWindow) {
            if (lastFocusedWindow.browserWindow.isMinimized()) {
              lastFocusedWindow.browserWindow.restore();
            }
            lastFocusedWindow.browserWindow.focus();
          }
        });
      }
      // good thing about this method is that it allows us to do any async loaing here first if needed
      this.instance = new HeliumApplication();
      // at this point we know the HeliumApplication instance is avalible
      this.instance.appMenu.init();
      // can even start lsp service here...
      initContextMenuService();
      // init preload services
      this.instance.initPreloadServices();

      return this.instance;
    }
  }
  static getInstance() {
    if (!HeliumApplication.instance) {
      throw new Error(
        "Must initalize HeliumApplication class using HeliumApplication.init(options)"
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

  public emitEventOnFocusedWindow<T = void>(eventName: string, args?: T) {
    // emit event on focused window
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
