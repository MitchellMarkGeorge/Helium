import { FileType, FileTypeEnum, ThemeFile } from "common/types";
import { isBinaryFile, isTextFile } from "common/utils";
import { StateModel } from "../StateModel";
import { Workspace } from "../workspace/Workspace";
import { OpenFileOptions, ViewType } from "./types";
import { CodeEditorView } from "./CodeEditor";
import { ImageView } from "./ImageView";
import { TabManager } from "../tabs/TabManager";
import pathe from "pathe";

const OPEN_FILE_LOADER_DELAY = 3 * 1000; // 3 seconds

// pretty much the EditorPanel state
export class Editor extends StateModel {
  private viewType: ViewType;
  // TODO: figure out how to give access to these objects
  public codeEditor: CodeEditorView;
  public imageViewer: ImageView;
  public tabs: TabManager;
  public activeFile: string | null;
  constructor(workspace: Workspace) {
    super(workspace);
    this.activeFile = null;
    this.viewType = ViewType.DEFAULT;
    this.tabs = new TabManager(workspace);
    this.codeEditor = new CodeEditorView();
    this.imageViewer = new ImageView();
    //
  }


  public reset(): void {
    this.viewType = ViewType.DEFAULT;
    this.tabs.reset();
    this.codeEditor.reset();
    this.imageViewer.reset();
  }

  public isShowingCodeEditor() {
    return this.viewType === ViewType.CODE;
  }

  public isShowingImagePreview() {
    return this.viewType === ViewType.IMAGE;
  }

  public getViewType() {
    return this.viewType;
  }

  public getActiveTab() {
    return this.tabs.getActiveTab();
  }

  public isFileOpen(filePath: string) {
    return this.tabs.hasTab(filePath);
  }

  public getOpenFiles() {
    return this.tabs.getTabs();
  }

  public closeFile(filePath: string) {
    // look back at this
    const closedTab = this.tabs.getTab(filePath);
    if (closedTab) {
      const wasActiveTab = this.tabs.isActiveTab(filePath);
      // clean up closed file
      // if (isTextFile(closedTab.fileType)) {
      //   // I should do the clean up in after the new file is being shown
      //   this.codeEditor.deleteEditorModel(filePath);
      // } else {
      //   // was image file
      //   this.imageViewer.reset();
      // }
      // NOTE: should this method return then new active tab???
      // removes and selects new tab
      this.tabs.removeTab(filePath);
      // get the new active tab after
      const newActiveTab = this.tabs.getActiveTab();
      if (newActiveTab) {
        if (wasActiveTab) {
          // should not be async
          const isImage =
            isBinaryFile(newActiveTab.fileType) &&
            newActiveTab.fileType === FileTypeEnum.IMAGE;

          const { path: newActivePath } = newActiveTab;

          if (isImage) {
            this.imageViewer.setImagePath(newActivePath);
            this.viewType = ViewType.IMAGE;
          } else if (isTextFile(newActiveTab.fileType)) {
            this.codeEditor.setActiveModelFromPath(newActivePath, newActiveTab.fileType);
            this.viewType = ViewType.CODE;
          }
        }
      } else {
        // if there is no active tab (meaning there are no tabs to show)
        // return to the defualt viewType
        this.viewType = ViewType.DEFAULT;
      }
      // clean up closed file
      if (isTextFile(closedTab.fileType)) {
        // I should do the clean up in after the new file is being shown
        this.codeEditor.deleteEditorModel(filePath);
      } else {
        // was image file
        this.imageViewer.reset();
      }
    }
  }

  public closeAll(files: string[]) {
    // will implement later lol
  }

  public async selectOpenFile(options: OpenFileOptions) {
    if (this.tabs.hasTab(options.path)) {
    }
  }

  public getEditorValue() {
    if (this.isShowingCodeEditor()) {
      return this.codeEditor.getEditorValue();
    } else return null;
  }

  public async openFile(options: OpenFileOptions) {
    const { fileType } = options;
    const isImage = isBinaryFile(fileType) && fileType === FileTypeEnum.IMAGE;

    if (isBinaryFile(options.fileType) && !isImage) {
      this.workspace.notifications.showMessageModal({
        type: "error",
        message: `Unable to open binary file at ${options.path}`,
        secondaryButtonText: "Close",
      });
      return;
    }
    // this will show the loader after 3 seconds if it has not finished reading the file
    // should this be donw in the try catch???
    // const delayLoaderTimeout = setTimeout(() => this.workspace.showIsLoading("Opening File"), OPEN_FILE_LOADER_DELAY);
    if (this.tabs.hasTab(options.path)) {
      this.tabs.selectTab(options.path);
    } else {
      const tab = {
        basename: options.basename || pathe.basename(options.path),
        fileType: options.fileType,
        path: options.path,
      };
      this.tabs.addTab({ tab });
    }
    try {
      if (isImage) {
        // any need to await this
        await this.imageViewer.openFile(options);
        this.activeFile = options.path;
        this.viewType = ViewType.IMAGE;
      } else if (isTextFile(fileType)) {
        // or path
        // should show loader if this takes some time
        this.activeFile = options.path;
        await this.codeEditor.openFile(options);
        this.viewType = ViewType.CODE;
      } else {
        // think about this
        this.viewType = ViewType.DEFAULT;
      }
    } catch (error) {
      this.workspace.notifications.showMessageModal({
        type: "error",
        message: `Unable to open file ${options.path}`,
        secondaryButtonText: "Close",
      });
      return; // is this needed?
    } finally {
      // clearTimeout(delayLoaderTimeout);
      // if (this.workspace.isLoading) {
      //   this.workspace.resetLoadingState();
      // }
    }
  }

  public resetViewType() {
    this.viewType = ViewType.DEFAULT;
  }
}
