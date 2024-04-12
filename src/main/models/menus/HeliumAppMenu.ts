import { Menu, MenuItemConstructorOptions, app } from "electron";
import { HeliumApplication } from "../HeliumApplication";
import utils from "main/utils";
const MENU_SEPERATOR = { type: "separator" } as MenuItemConstructorOptions;

export class HeliumAppMenu {
  constructor(private heliumApplication: HeliumApplication) {
    Menu.setApplicationMenu(null);
  }

  public getAppMenuTemplate(): MenuItemConstructorOptions[] {
    return [
      this.getAboutMenu(), // only for MacOS
      //   { label: 'Helium IDE', role: "appMenu" }, // think about this
      // could try and use my own version
      this.getFileMenu(),
      this.getEditMenu(),
      this.getViewMenu(),
      {
        label: "Window",
        role: "window",
        submenu: [
          {
            label: "Minimize",
            role: "minimize",
          },
        ],
      },
      this.getThemeMenu(),
      {
        label: "Help",
        role: "help",
        submenu: [
          { label: "Toggle Developer Tools", role: "toggleDevTools" }, // only for dev
          { label: "Reload", role: "reload" }, // only for dev
          // link to help page
          // open Helium repo
        ],
      },
    ];
  }

  private getAboutMenu(): MenuItemConstructorOptions {
    return {
      label: "Helium IDE",
      submenu: [
        { label: "About Helium IDE", role: "about" },
        MENU_SEPERATOR,
        {
          label: "Services",
          role: "services",
          submenu: [],
        },
        MENU_SEPERATOR,
        {
          label: "Hide Helium IDE",
          accelerator: "Command+H",
          role: "hide",
        },
        {
          label: "Hide Others",
          accelerator: "Command+Shift+H",
          role: "hideOthers",
        },
        {
          label: "Show All",
          role: "unhide",
        },

        MENU_SEPERATOR,
        {
          label: "Quit",
          accelerator: "Command+Q",
          click: () => {
            this.heliumApplication.quit();
          },
        },
      ],
    };
  }

  private getFileMenu(): MenuItemConstructorOptions {
    return {
      label: "File",
      submenu: [
        {
          label: "New File",
          //   accelerator: "Command+N",
          click: () => this.triggerEvent("new-file"),
        },
        {
          label: "New Window",
          //   accelerator: "Command+N",
          click: () => this.triggerEvent("new-window"),
        },
        MENU_SEPERATOR,
        {
          label: "Open Theme",
          //   accelerator: "Command+N",
          click: () => this.triggerEvent("open-theme"),
        },
        {
          label: "Open Recent",
          role: "recentDocuments",
        },
        MENU_SEPERATOR,
        // should these items be disabled when no file is present???
        {
          label: "Save",
          accelerator: "Command+S",
          click: () => this.triggerEvent("save-file"),
        },
        {
          label: "Save As...",
          click: () => this.triggerEvent("safe-file-as"),
        },
        MENU_SEPERATOR,
        {
          label: "Close Tab",
          click: () => this.triggerEvent("close-tab"),
        },
        {
          label: "Close All Tabs",
          click: () => this.triggerEvent("close-all-tabs"),
        },
        {
          label: "Close Window",
          click: () => this.triggerEvent("close-window"),
        },
      ],
    };
  }

  private getEditMenu(): MenuItemConstructorOptions {
    return {
      label: "Edit",
      submenu: [
        { role: "undo" },
        { role: "redo" },
        MENU_SEPERATOR,
        { role: "cut" },
        { role: "copy" },
        { role: "paste" },
        { role: "selectAll" },
      ],
    };
  }

  private getViewMenu(): MenuItemConstructorOptions {
    return {
      label: "View",
      submenu: [
        { role: "togglefullscreen" },
        MENU_SEPERATOR,
        { role: "resetZoom" },
        { role: "zoomIn" },
        { role: "zoomOut" },
        MENU_SEPERATOR,
        {
          label: "Layout",
          submenu: [
            {
              label: "Split Editor",
              click: () => this.triggerEvent("split-editor"),
            },
            {
              label: "Toggle Sidebar",
              click: () => this.triggerEvent("toggle-sidebar"),
            },
          ],
        },
        MENU_SEPERATOR,
        {
          label: "Files",
          click: () => this.triggerEvent("open-sidebar", "files"),
        },
        {
          label: "Development Store",
          click: () => this.triggerEvent("open-sidebar", "store"),
        },
        {
          label: "Preview",
          click: () => this.triggerEvent("open-sidebar", "preview"),
        },
        {
          label: "Theme",
          click: () => this.triggerEvent("open-sidebar", "theme"),
        },
      ],
    };
  }

  private getThemeMenu(): MenuItemConstructorOptions {
    return {
      label: "Theme",
      submenu: [
        {
          label: "Create New Theme",
          click: () => this.triggerEvent("new-theme"),
        },
        MENU_SEPERATOR,
        { label: "Push Theme", click: () => this.triggerEvent("push-theme") },
        {
          label: "Publish Theme",
          click: () => this.triggerEvent("publish-theme"),
        },
        MENU_SEPERATOR,
        {
          label: "Start Preview",
          click: () => this.triggerEvent("start-preview"),
        }, // should be dynamic
        MENU_SEPERATOR,
        {
          label: "Connect Shop",
          click: () => this.triggerEvent("connect-store"),
        }, // should be dynamic
        { label: "Open Shop", click: () => this.triggerEvent("open-shop") }, // should be dynamic
      ],
    };
  }

  private getMacDockTemplate(): MenuItemConstructorOptions[] {
    return [
      {
        label: 'New Window', 
        click: () => this.heliumApplication.createNewWindow()
      }
    ]
  }

  public init() {
    const appMenuTemplate = this.getAppMenuTemplate();
    Menu.setApplicationMenu(Menu.buildFromTemplate(appMenuTemplate));

    if (utils.isMac) {
      const macDockTemplate = this.getMacDockTemplate();
      app.dock.setMenu(Menu.buildFromTemplate(macDockTemplate));
    }
  }

  private triggerEvent<T = void>(eventName: string, args?: T) {
    const focusedWindow = this.heliumApplication.getLastFocusedWindow();
    if (focusedWindow) {
      focusedWindow.emitEvent(eventName, args);
    }
  }
}
