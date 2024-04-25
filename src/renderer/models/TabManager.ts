import { StateModel } from "./StateModel";
import { Workspace } from "./workspace/Workspace";

// interface Tab {
//     path: string
//     status: ...
// }

export class TabManager extends StateModel {
  public tabs: string[];
  //   private currentTab // should this be an index or not???
  public currentTabPath: string | null;
  constructor(workspace: Workspace) {
    super(workspace);
    this.currentTabPath = null;
    this.tabs = [];
  }

  public addNewTab(path: string) {
    this.tabs.push(path);
  }

  // should this be index instead
  public closeTab(path: string) {
    // remove from tabs (mobx)
    // remove the requested tab
    // select the next left tab if possible
    // else set it to null
  }
}
