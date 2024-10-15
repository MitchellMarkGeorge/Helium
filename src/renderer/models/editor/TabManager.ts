import { FileType } from "common/types";
import { StateModel } from "../StateModel";
import { FileEntry } from "../fileexplorer/types";
import { Workspace } from "../workspace/Workspace";
import { action, computed, observable } from "mobx";
import { EditorFile } from "./types";

// type Tab = Omit<FileEntry, "depth" | "type">;

// FILE ENTRIES SHOULD HAVE NOTHING TO DO WITH FILE ENTRIES
// FILE ENTRY SHOULD ONLY BE FOR THE FILE EXPLORER

interface AddNewTabOptions {
  tab: EditorFile;
  setAsActive?: boolean;
}

export class TabManager {
  @observable private accessor tabs: EditorFile[];
  //   private currentTab // should this be an index or not???
  // better to
  // public activeEntry
  // should this instead point to the active tab?
  @observable public accessor activeTabIndex: number | null;
  constructor() {
    this.activeTabIndex = null;
    this.tabs = [];
  }

  public getTabs() {
    return this.tabs;
  }

  public getTab(filePath: string) {
    return this.tabs.find(tab => tab.fileType === filePath) || null;
  }

  @action
  public addTab({ tab, setAsActive = true }: AddNewTabOptions) {
    // check if the tab already exists???
    this.tabs.push(tab);
    if (setAsActive) {
      this.selectTab(this.tabs.length - 1);
      // this.activeTabIndex = this.tabs.length - 1;
    }
    // this should in response create a new view (editor, image)
  }

  @computed
  public get activeTab() {
    if (this.activeTabIndex) {
      return this.tabs[this.activeTabIndex];
    } else return null;
  }

  public isActiveTab(filePath: string) {
    const activeTab = this.activeTab;
    return activeTab ? activeTab.path === filePath : false;
  }

  public hasTab(path: string) {
    return this.tabs.some((tab) => tab.path === path);
  }

  public selectTab(path: string): void;
  public selectTab(index: number): void;
  @action
  public selectTab(indexOrPath: number | string) {
    const selectedIndex =
      typeof indexOrPath === "number"
        ? indexOrPath
        : this.tabs.findIndex((tab) => tab.path === indexOrPath); // should I use findIndex instead

    if (selectedIndex < 0 || selectedIndex >= this.tabs.length) return

    const isActiveTab = this.activeTabIndex === selectedIndex;
    if (isActiveTab) return;

    this.activeTabIndex = selectedIndex;
  }

  @action
  public goToNextTab() {
    if (this.activeTabIndex && this.tabs.length > 1) {
      const isLastTab = this.activeTabIndex === this.tabs.length - 1;
      if (isLastTab) {
        this.selectTab(0);
      } else {
        this.selectTab(this.activeTabIndex + 1);
      }
    }
  }

  @action
  public goToPrevioudTab() {
    if (this.activeTabIndex && this.tabs.length > 1) {
      const isFirstTab = this.activeTabIndex === 0;
      if (isFirstTab) {
        this.selectTab(this.tabs.length - 1);
      } else {
        this.selectTab(this.activeTabIndex - 1);
      }
    }
  }

  public removeTab(filePath: string): void;
  public removeTab(tabIndex: number): void;
  @action
  public removeTab(indexOrPath: number | string) {
    // inspired by this
    // https://ant.design/components/tabs
    //https://ant.design/components/tabs#tabs-demo-custom-add-trigger
    if (this.activeTabIndex) {
      // handle invalid value
      const tabIndex =
        typeof indexOrPath === "number"
          ? indexOrPath
          : this.tabs.findIndex((tab) => tab.path === indexOrPath);
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
        const newIndex =
          tabIndex === newTabsArray.length ? tabIndex - 1 : tabIndex;
        // this.activeTabIndex = newIndex;
        this.selectTab(newIndex);
      }

      this.tabs = newTabsArray;
    }
  }

  @action
  public removeAll(filePaths: string[]) {
    // implement later lool
  }

  @action
  public reset(): void {
    this.activeTabIndex = null;
    this.tabs = [];
  }
}
