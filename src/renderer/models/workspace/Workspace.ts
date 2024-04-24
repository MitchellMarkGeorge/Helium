import { InitalState, PreviewState, ThemeFileSystemEntry } from "common/types";
import { SideBarItemOption } from "./types";
import { Notifications } from "../notification/Notifications";

export class Workspace {
  public currentFilePath: string | null;
  public tabs: string[];
  public previewState: PreviewState; // should this be null by default (since no state has been given)
  private showWorkspace: boolean;
  public selectedSideBarOption: SideBarItemOption | null;
  public isSidePanelOpen: boolean;
  public notifications: Notifications;
  constructor() {
    this.showWorkspace = false;
    this.currentFilePath = null;
    this.selectedSideBarOption = null;
    this.tabs = [];
    this.previewState = PreviewState.OFF; // by default
    this.isSidePanelOpen = false;

    this.notifications = new Notifications(this);
  }

  public init(data: InitalState) {}

  public get windowTitle(): string {
    return "";
  }

  public get currentFileEntry(): ThemeFileSystemEntry | null {
    return null;
  }

  public async openThemeFromDialog() {
    const [themePath] = await window.helium.app.openFolderDialog();
    if (themePath) {
      const { themeInfo, files } = await window.helium.shopify.openTheme(
        themePath
      );
      // set values from here
    }
  }

  public get shouldShowWorkspace() {
    return this.showWorkspace;
  }

  public get isEdited() {
    return false;
  }

  public setShowWorkspace(showWorkspace: boolean) {
    this.showWorkspace = showWorkspace;
  }

  public toggleSidePanel() {
    this.isSidePanelOpen = !this.isSidePanelOpen;
  }

  public selectSideBarOption(option: SideBarItemOption) {
    this.selectedSideBarOption = option;
  }

  // should be moved to the tabs state
  public closeTab(path: string) {}
  public openTab(path: string) {}
}
