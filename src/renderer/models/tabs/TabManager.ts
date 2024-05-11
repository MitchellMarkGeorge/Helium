import { StateModel } from "../StateModel";
import { FileEntry } from "../fileexplorer/types";
import { Workspace } from "../workspace/Workspace";

// interface Tab {
//     path: string
//     status: ...
// }

export class TabManager extends StateModel {
  public tabs: FileEntry[];
  //   private currentTab // should this be an index or not???
  // better to
  // public activeEntry
  public activeTabIndex: number | null;
  constructor(workspace: Workspace) {
    super(workspace);
    this.activeTabIndex = null;
    this.tabs = [];
  }

  public addNewTab(entry: FileEntry, setAsActive = true) {
    this.tabs.push(entry);
    if (setAsActive) {
      this.activeTabIndex = this.tabs.length - 1;
    }
    // this should in response create a new view (editor, image)
  }

  public get activeEntry() {
    // the only problem is that I'm not sure is this gets recomputed even when the index is the same

    // actually, this should work since the tabs array changes if a tab is closed

    // this method can in theory work outside of the mobx system
    if (this.activeTabIndex === null) return null;
    return this.tabs[this.activeTabIndex];
  }

  public goToNextTab() {
    if (this.activeTabIndex && this.tabs.length > 1) {
      const isLastTab = this.activeTabIndex === this.tabs.length - 1;
      if (isLastTab) {
        this.activeTabIndex = 0;
      } else {
        this.activeTabIndex += 1;
      }
    }
  }

  public goToPrevioudTab() {
    if (this.activeTabIndex && this.tabs.length > 1) {
      const isFirstTab = this.activeTabIndex === 0;
      if (isFirstTab) {
        this.activeTabIndex = this.tabs.length - 1;
      } else {
        this.activeTabIndex -= 1;
      }
    }
  }

  public closeTab(tabIndex: number) {
    // inspired by this
    // https://ant.design/components/tabs
    if (this.activeTabIndex) {
      // handle invalid value
      if (tabIndex < 0 || tabIndex >= this.tabs.length) return;

      const newTabsArray = [...this.tabs].splice(tabIndex, 1);

      const isActiveTab = this.activeTabIndex === tabIndex;

      // if there are no tabs left
      if (newTabsArray.length === 0) {
        this.tabs = [];
        this.activeTabIndex = null;
        return;
      }

      if (isActiveTab) {
        const newIndex = tabIndex === newTabsArray.length ? tabIndex - 1 : tabIndex;
        this.activeTabIndex = newIndex;
      }

      this.tabs = newTabsArray;
    }
  }
}
