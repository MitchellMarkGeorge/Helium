import { InitalState, PreviewState, ThemeFileSystemEntry, ThemeInfo } from "common/types";
import { SideBarItemOption } from "./types";
import { Notifications } from "../notification/Notifications";
import { FileSystemManager } from "../FileSystemManager";
import { Theme } from "../Theme";
import { getErrorMessage } from "common/utils";

export class Workspace {
  //   public currentFilePath: string | null;
  public previewState: PreviewState; // should this be null by default (since no state has been given)
  private isShowingWorkspace: boolean;
  public selectedSideBarOption: SideBarItemOption | null;
  public isSidePanelOpen: boolean;
  public readonly notifications: Notifications;
  public readonly fs: FileSystemManager;
  public theme: Theme | null;
  constructor() {
    this.isShowingWorkspace = false;
    // this.currentFilePath = null;
    this.selectedSideBarOption = null;
    this.previewState = PreviewState.OFF; // by default
    this.isSidePanelOpen = false;

    this.notifications = new Notifications(this);
    this.fs = new FileSystemManager();
    this.theme = null;
  }

  public initFromInitalState({ themeFiles, currentTheme, connectedStore, previewState  }: InitalState) {
    // check isReadyToShowWorkspace???
    // this is like a second constructor
    // could also be async
    if (this.theme) throw new Error();
    if (currentTheme) {
        this.theme = new Theme(currentTheme, themeFiles);
    }

    if (connectedStore) {
        // preview state is only possible if there is a stoer

    }
    this.isShowingWorkspace = true;
    window.helium.app.sendWorkspaceIsShowing();
    // window.helium.app.sendReadyToShowWorkspace();
  }

  public setTheme(theme: Theme) {
    this.theme = theme;
  }

  public get windowTitle(): string {
    // dependednt on current theme name
    // add an effect that whenever the windowTitle changes, set it at the electron level
    return this.theme && this.theme.name
      ? this.theme.name
      : window.helium.constants.DEFAULT_WINOW_TITLE;
  }

  //   public get currentFileEntry(): ThemeFileSystemEntry | null {
  //     return this.currentFilePath ? this.fs.getEntry(this.currentFilePath) : null;
  //   }

  public async openThemeFromDialog() {
    // this should not fail
    const [themePath] = await window.helium.app.openFolderDialog();
    if (themePath) {
      let themeInfo: ThemeInfo | null = null;
      let files: ThemeFileSystemEntry[] = [];
      try {
        const results = await window.helium.shopify.openTheme(themePath);
        themeInfo = results.themeInfo;
        files = results.files;
      } catch (error) {
        this.notifications.showMessageModal({
            message: getErrorMessage(error),
            type: "error",
            buttons: { text: "Close" },
        });
        return;
      }
      // set values from here
      if (themeInfo) {
        this.theme = new Theme(themeInfo, files);
      }
    }
  }

  public get shouldShowWorkspace() {
    return this.isShowingWorkspace;
  }

  public get isEdited() {
    return false;
  }

  public setShowWorkspace(showWorkspace: boolean) {
    this.isShowingWorkspace = showWorkspace;
  }

  public toggleSidePanel() {
    this.isSidePanelOpen = !this.isSidePanelOpen;
  }

  public selectSideBarOption(option: SideBarItemOption) {
    this.selectedSideBarOption = option;
  }
}
