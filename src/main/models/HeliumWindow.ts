import { BrowserWindow, app, safeStorage, shell } from "electron";
import {
  ConnectStoreOptions,
  InitalState,
  OpenThemeResult,
  PreviewState,
  StoreInfo, ThemeFileSystemEntry,
  ThemeInfo
} from "common/types";
import isDev from "electron-is-dev";
import fileSystemService from "main/services/fs";
import themeService from "main/services/theme";
import { HeliumWindowOptions, HeliumWindowState } from "../types";
import ShopifyCli from "./ShopifyCli";
import { wait } from "common/utils";
import utils from "main/utils";
import { Watcher } from "./watchers/Watcher";
import { DirectoryWatcher } from "./watchers/DirectoryWatcher";
import fse from 'fs-extra';

// This allows TypeScript to pick up the magic constants that's auto-generated by Forge's Webpack
// plugin that tells the Electron app where to look for the Webpack-bundled app code (depending on
// whether you're running in development or production).
declare const MAIN_WINDOW_WEBPACK_ENTRY: string;
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string;

const DEFAULT_INITAL_STATE: InitalState = {
  connectedStore: null,
  currentTheme: null,
  previewState: PreviewState.OFF,
  themeFiles: [],
};

export class HeliumWindow {
  public browserWindow: BrowserWindow;
  private currentTheme: ThemeInfo | null = null;
  private connectedStore: StoreInfo | null = null;
  public shopifyCli: ShopifyCli;
  public directoryWatcher: Watcher;
  // this will be informed by the renderer
  private isWorkspaceShowing: boolean;
  constructor(private options?: HeliumWindowOptions) {
    this.isWorkspaceShowing = false;
    this.directoryWatcher = new DirectoryWatcher(this);
    console.log(options);
    this.shopifyCli = new ShopifyCli(this);
    // console.log(path.resolve(__dirname, "../assets/icons/Desktop Logo.icns"));
    // console.log(path.join(__dirname, "../assets", "icons", "helium.png"));

    this.browserWindow = new BrowserWindow({
      title: "Helium IDE",
      // can seem unnatural
      // center: true,
      // frame: false,
      width: 1200,
      height: 900,
      minHeight: 600,
      minWidth: 600,
      // dont hard code this
      backgroundColor: "#171717",
      // icon: path.resolve(__dirname, "../assets", "icons", "helium.png"),
      show: false,
      webPreferences: {
        preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
      },
    });

    // modified link handlers
    this.browserWindow.webContents.setWindowOpenHandler((details) => {
      shell.openExternal(details.url);
      return { action: "deny" };
    });

    this.browserWindow.webContents.on("will-navigate", (event) => {
      event.preventDefault();
      shell.openExternal(event.url);
    });

    // wait for the dom to be ready before showing the window
    // think about this
    this.browserWindow.webContents.once("dom-ready", () => {
      this.browserWindow.show();
    });

    this.browserWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

    if (isDev) {
      this.browserWindow.webContents.openDevTools();
    }
  }

  public getId() {
    return this.browserWindow.id;
  }

  public getCurrentTheme() {
    return this.currentTheme;
  }

  public getConnectedStore() {
    return this.connectedStore;
  }

  public setIsWorkspaceShowing(isWorkspaceShowing: boolean) {
    this.isWorkspaceShowing = isWorkspaceShowing;
  }

  public async openTheme(themePath: string): Promise<OpenThemeResult> {
    // RITGHT NOW, THIS ONLY WORKS THEMES THAT USE THE STANDARD OS 2.0 DIRECTORY STRUCTURE
    // check if path exists. if not, throw error
    if (!(await fse.pathExists(themePath))) {
      throw new Error(`${themePath} does not exist`);
    }
    // read the directory to get all the root level files and folders in array
    const files = await fileSystemService.readDirectory(themePath);
    // validate theme file structure. if not valid, throw error
    // think about this... what if they user is using a setup that includes some kind of build step??
    // also this does not take into account .git folders and the rest
    if (!(await this.isThemeFileStructureValid(themePath, files))) {
      throw new Error(`${themePath} is not a valid OS 2.0 theme directory`); // need a better mesage
    }
    // read theme info from settings_schema.json
    const settingsSchemaFilePath = themeService.configPath(
      themePath,
      "settings_schema.json"
    );
    if (!(await fse.pathExists(settingsSchemaFilePath))) {
      throw new Error(`${settingsSchemaFilePath} does not exist`);
    }

    const { theme_author, theme_name, theme_version } =
      await themeService.readThemeInfo(settingsSchemaFilePath);

    const openedTheme: ThemeInfo = {
      path: themePath,
      name: theme_name,
      author: theme_author,
      version: theme_version,
      shopifyId: null,
    };

    // attach watcher to this path so the ui is notified of any changes at the root level
    // this.directoryWatcher.watch(themePath);

    app.addRecentDocument(themePath);

    this.currentTheme = openedTheme;

    return { themeInfo: openedTheme, files };
  }

  private async isThemeFileStructureValid(
    themePath: string,
    files: ThemeFileSystemEntry[]
  ) {
    // https://shopify.dev/docs/themes/architecture#directory-structure-and-component-types
    // should return the reason

    // should at least have a layout/theme.liquid. if this is not present, return false
    if (
      !fse.pathExists(
        themeService.layoutPath(themePath, "theme.liquid")
      )
    )
      return false;

    // get all directories in theme folder
    // might try and use a set here since its more efficient
    const directoryPaths = files
      .filter((file) => file.type === "directory")
      .map((dir) => dir.path);

    // theme paths that must to be in the folder to be valid
    const themePaths = [
      themeService.accessPath(themePath),
      themeService.configPath(themePath),
      themeService.localesPath(themePath),
      themeService.sectionsPath(themePath),
      themeService.templatesPath(themePath),
    ];

    // return if every theme path is present in the theme derectory
    return themePaths.every((themeDir) => directoryPaths.includes(themeDir));
  }

  public connectStore(options: ConnectStoreOptions) {
    // in UI make sure preview is not running
    // this is used for new stores
    // will this method be async???
    const themeAccessPassword = safeStorage
      .encryptString(options.password)
      .toString();

    const store = {
      heliumId: utils.generateHeliumId(),
      themeAccessPassword,
      url: options.storeUrl,
    };

    this.connectedStore = store;
    this.emitEvent("on-store-change", this.connectedStore);
  }

  public getWindowState(): HeliumWindowState {
    return {
      isMinimized: this.browserWindow.isMinimized(),
      isMaximized: this.browserWindow.isMaximized(),
      isFocused: this.browserWindow.isFocused(),
    };
  }

  public async loadInitalState(): Promise<InitalState> {
    // if there are any inital options (stores or themes) to be loaded
    const MIN_WAIT_TIME = 2 * 1000; // 2 seconds
    const startTime = Date.now();
    if (this.options) {
      const { themePathOrUrl, connectedStore, previewOn } = this.options;
      let files: ThemeFileSystemEntry[] = [];

      if (themePathOrUrl) {
        const result = await this.openTheme(themePathOrUrl);
        files = result.files;
      }

      if (connectedStore) {
        this.connectStore(connectedStore);
      }

      if (previewOn) {
        await this.shopifyCli.startThemePreview();
        // handle if there was error
      }

      const endTime = Date.now();
      // this code block makes sure that the loading screen shows for at least 2 seconds so it is not a jarring experince for the user
      // if the function returns early
      // calculate the total time taken 
      const timeTaken = endTime - startTime;
      // if the time taken is less than the minimum wait time
      if (timeTaken < MIN_WAIT_TIME) {
        // calculate the remaining wait time and wait it out
        // after that return the inital load data
        const remainingWaitTime = MIN_WAIT_TIME - timeTaken;
        // make sure it it not 0
        if (remainingWaitTime > 0) {
          await wait(remainingWaitTime);
        }
      }
      return {
        currentTheme: this.currentTheme,
        themeFiles: files,
        connectedStore: this.connectedStore,
        previewState: this.shopifyCli.getPreviewState(),
      };
    } else {
      // wait at least 2 seconds before returning the inital data
      await wait(MIN_WAIT_TIME);
      return DEFAULT_INITAL_STATE;
    }
    // the loading screen should show for a minimum of 1 or 2 seconcds (500ms???) so it doesnt seem too jarring
    // if loading takes longer that is fine
  }

  public emitEvent<T = void>(eventName: string, args?: T) {
    // only emit events when the workspace is showing
    // i could also queue this up and emit it later
    if (this.isWorkspaceShowing) {
      this.browserWindow.webContents.send(eventName, args);
      // main.emitEventFromWindow(this, "on-inital-state-ready", initalState);
    }
  }

  public cleanup() {
    // do all clean up stuff here
    this.directoryWatcher.removeAllWatchers();
  }

  public close() {
    this.browserWindow.close();
  }
}
