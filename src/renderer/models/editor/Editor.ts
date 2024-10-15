import { FileType, FileTypeEnum, Language, ThemeFile } from "common/types";
import { isBinaryFile, isImageFile, isTextFile } from "common/utils";
import { StateModel } from "../StateModel";
import { Workspace } from "../workspace/Workspace";
import { EditorFile, OpenFileOptions, ViewType } from "./types";
import { CodeEditorView } from "./CodeEditor";
import { ImageView } from "./ImageView";
import { TabManager } from "./TabManager";
import pathe from "pathe";
import { action, computed, flow, observable } from "mobx";

const OPEN_FILE_LOADER_DELAY = 3 * 1000; // 3 seconds

// pretty much the EditorPanel state
export class Editor extends StateModel {
  // TODO: figure out how to give access to these objects
  private monacoModelManager: CodeEditorView;
  // private imageViewer: ImageView;
  private tabs: TabManager;
  // private activeFilePath: string | null;
  // think about this name
  // private activeViewType: ViewType | null;

  @observable.deep private currentFile: EditorFile | null;

  constructor(workspace: Workspace) {
    super(workspace);
    this.currentFile = null;
    // this.activeFilePath = null;
    // this.activeViewType = null
    // this.viewType = ViewType.DEFAULT;
    this.tabs = new TabManager();
    // modelmanager
    this.monacoModelManager = new CodeEditorView();
    // this is not needed
    // this.imageViewer = new ImageView();
    //
  }

  @action
  public reset(): void {
    this.currentFile = null;
    this.tabs.reset();
    this.monacoModelManager.reset();
  }

  // @action
  // public updateViewType(newViewType: ViewType) {
  //   if (this.activeViewType !== newViewType) {
  //     this.activeViewType = newViewType;
  //   }
  // }

  @computed
  public get isShowingCodeEditor() {
    return this.currentFile ? isTextFile(this.currentFile.fileType) : false;
  }

  @computed
  public get isShowingImagePreview() {
    return this.currentFile ? isImageFile(this.currentFile.fileType) : false;
  }

  // public getActiveViewType() {
  //   return this.activeViewType;
  // }

  public getCurrentFile() {
    return this.currentFile;
    // return this.tabs.activeTab;

  }

  public isFileOpen(filePath: string) {
    // abstracting this method like this as this could change in the future
    return this.tabs.hasTab(filePath);
  }

  public getOpenFilePaths() {
    return this.tabs.getTabs().map((tab) => tab.path);
  }

  @computed
  public get hasOpenFiles() {
    return this.tabs.getTabs().length !== 0;
  }

  @action
  public closeFile(filePath: string) {
    // get the file to be closed
    const closedTab = this.tabs.getTab(filePath);
    // if the file to be closed exists
    if (closedTab) {
      // check if it was the active tab at the time of being closed
      const wasActiveTab = this.tabs.isActiveTab(filePath);
      // should clean up be done here???
      this.tabs.removeTab(filePath);

      // get the new active tab after
      const newActiveTab = this.tabs.activeTab;
      // check if there is an active tab and the closed tab was the previous active tab
      // if the closed tab was the previous active tab, that means a differenct tab was now selected
      // if it wasnt the active tab when it was lcosed, that means that the view should stay the same
      if (newActiveTab && wasActiveTab) {
        // in this case, update the view to show the new tab's content (either image or code/text)
        // since it already open, we know it can only be an image or a (valid) text file
        if (isImageFile(newActiveTab.fileType)) {
          this.imageViewer.setImagePath(newActiveTab.path);
          // this.viewType = ViewType.IMAGE;
          this.updateViewType(ViewType.IMAGE);
        } else {
          this.monacoModelManager.setActiveModelFromPath(
            newActiveTab.path,
            newActiveTab.fileType as Language 
          );
          // this.viewType = ViewType.CODE;
          this.updateViewType(ViewType.TEXT);
        }
      } else {
        // if there is no active tab (meaning there are no tabs to show/all files have been closed)
        // and reset all views
        this.reset();
      }
      // clean up closed file
      if (isTextFile(closedTab.fileType)) {
        // I should do the clean up in after the new file is being shown
        this.monacoModelManager.deleteEditorModel(filePath);
      } else {
        // was image file
        this.imageViewer.reset();
      }
    }
  }

  @action
  public closeAll(files: string[]) {
    // will implement later lol
  }

  /**
   * Selects an already open file
   * @param options
   */
  @action
  public async selectFile(options: OpenFileOptions) {
    if (!this.isFileOpen(options.path)) {
      this.workspace.notifications.showMessageModal({
        type: "error",
        message: `${options.basename} is not open`,
        secondaryButtonText: "Close",
      });
      return;
    }

    // if it is already the active tab, just ignore
    if (!this.tabs.isActiveTab(options.path)) {
      // since the file is already open, we know it can only be an image or valid text file
      this.tabs.selectTab(options.path);
      if (isImageFile(options.fileType)) {
        this.imageViewer.setImagePath(options.path);
        // this.viewType = ViewType.IMAGE;
        this.updateViewType(ViewType.IMAGE);
      } else {
        this.monacoModelManager.setActiveModelFromPath(
          options.path,
          options.fileType as Language // since it already open, we know
        );
        // this.viewType = ViewType.CODE;
        this.updateViewType(ViewType.TEXT);
      }
    }
  }

  // computed???
  public getEditorValue() {
    if (this.isShowingCodeEditor) {
      return this.monacoModelManager.getEditorValue();
    } else return null;
  }

  /**
   * Opens new file in the `EditorPanel`
   */
  @action
  public openFile = flow(function* (this: Editor, options: OpenFileOptions) {
    if (this.isFileOpen(options.path)) {
      this.workspace.notifications.showMessageModal({
        type: "error",
        message: `File is already open`,
        secondaryButtonText: "Close",
      });
      return;
    }
    const { fileType } = options;

    if (isBinaryFile(fileType)) {
      this.workspace.notifications.showMessageModal({
        type: "error",
        message: `Unable to open binary file (${options.basename})`,
        secondaryButtonText: "Close",
      });
      return;
    }

    try {
      if (isImageFile(options.fileType)) {
        // any need to await this
        yield this.imageViewer.openFile(options);
        // this.viewType = ViewType.IMAGE;
        this.updateViewType(ViewType.IMAGE);
        this.activeFilePath = options.path;
        // IMPORTANT: only create the tab when it is opened successfully
        this.createNewTab(options, true);
      } else if (isTextFile(fileType)) {
        // or path
        // should show loader if this takes some time
        yield this.monacoModelManager.openFile(options);
        // this.viewType = ViewType.CODE;
        this.updateViewType(ViewType.TEXT);
        this.activeFilePath = options.path;
        // IMPORTANT: only create the tab when it is opened successfully
        this.createNewTab(options, true);
      } else {
        // invalid file type
        this.workspace.notifications.showMessageModal({
          type: "error",
          message: `Unable to open file with unsupported type (${options.basename})`,
          secondaryButtonText: "Close",
        });
        return;
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
  });

  @action
  private createNewTab(options: OpenFileOptions, setAsActive: boolean) {
    const tab = {
      basename: options.basename || pathe.basename(options.path),
      fileType: options.fileType,
      path: options.path,
    };

    // add the tab and then set as active it
    this.tabs.addTab({ tab, setAsActive });
  }
}
