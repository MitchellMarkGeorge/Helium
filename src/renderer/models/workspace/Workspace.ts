import {
  InitalState,
  PreviewState,
  ThemeFileSystemEntry,
  ThemeInfo,
} from "common/types";
import { SideBarItemOption } from "./types";
import { Notifications } from "../notification/Notifications";
import { Theme } from "../Theme";
import { getErrorMessage } from "common/utils";
import pathe from "pathe";
import { TreeFileExplorer } from "../fileexplorer/tree/TreeFileExplorer";
import { FileExplorer } from "../fileexplorer/types";
import { TabManager } from "../tabs/TabManager";
import { Editor } from "../editor/Editor";

export class Workspace {
  //   public currentFilePath: string | null;
  public previewState: PreviewState; // should this be null by default (since no state has been given)
  private isShowingWorkspace: boolean;
  public selectedSideBarOption: SideBarItemOption | null;
  public isSidePanelOpen: boolean;
  public readonly notifications: Notifications;
  public theme: Theme | null;
// NOTE: Due to implementation details, ArrayFileExplorer and TreeFileExplorer
// are not in behavioural parity (see the note on the ArrayFileExplorer.expand() method) method.
// As of right now, it is better to use the TreeFileExplorer implementation
// but down the line, it would be great to move to this implementation (after some fixes)
  public fileExplorer: FileExplorer;
  public tabs: TabManager;
  public editor: Editor;

  // STILL NEED TO HANDLE FILE STATUSES
  constructor() {
    // NEED A CLASS TO TRACK TAB/EDITOR STATUS
    this.isShowingWorkspace = false;
    // this.currentFilePath = null;
    this.selectedSideBarOption = null;
    this.previewState = PreviewState.OFF; // by default
    this.isSidePanelOpen = false;

    this.notifications = new Notifications(this);
    this.fileExplorer = new TreeFileExplorer(this);
    this.tabs = new TabManager(this);
    this.editor = new Editor(this);
    this.theme = null;

  }

  public initFromInitalState({
    themeFiles,
    currentTheme: themInfo,
    connectedStore,
    previewState,
  }: InitalState) {
    // check isReadyToShowWorkspace???
    // this is like a second constructor
    // could also be async
    if (this.theme) throw new Error();
    if (themInfo) {
      this.theme = new Theme(themInfo);
      this.fileExplorer.init(themeFiles)
    }

    if (connectedStore) {
      // preview state is only possible if there is a stoer
      this.previewState = previewState;
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
    if (this.theme) {
      return this.theme.getThemeName();
    } else {
      return window.helium.constants.DEFAULT_WINOW_TITLE;
    }
  }

  //   public get currentFileEntry(): ThemeFileSystemEntry | null {
  //     return this.currentFilePath ? this.fs.getEntry(this.currentFilePath) : null;
  //   }

  // will become flow
  public async openThemeFromDialog() {
    // check if there is already a theme open
    // if there is, clear everything
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
        this.theme = new Theme(themeInfo);
        this.fileExplorer.init(files)
      }
    }
  }

  public get shouldShowWorkspace() {
    return this.isShowingWorkspace;
  }

  public get hasTheme() {
    return this.theme !== null;
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
