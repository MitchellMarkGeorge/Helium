import { isBinaryFile, isImageFile, isTextFile } from "common/utils";
import { StateModel } from "../StateModel";
import { Workspace } from "../workspace/Workspace";
import { CursorPosition, EditorFile, MonacoCodeEditor } from "./types";
import { MonacoManager } from "./MonacoManager";
import { action, computed, flow, observable } from "mobx";
import { FileEntry } from "../fileexplorer/types";

const OPEN_FILE_LOADER_DELAY = 3 * 1000; // 3 seconds

// pretty much the EditorPanel state
export class Editor extends StateModel {
  @observable.deep private accessor openFiles: EditorFile[];
  @observable public accessor activeFileIndex: number | null;
  @observable.deep private accessor currentFile: EditorFile | null;
  @observable.deep private accessor cursorPosition: CursorPosition | null;
  private monacoModelManager: MonacoManager;

  constructor(workspace: Workspace) {
    super(workspace);
    this.openFiles = [];
    this.activeFileIndex = null;
    this.currentFile = null;
    this.cursorPosition = null;
    this.monacoModelManager = new MonacoManager();
  }

  public getCursorPosition() {
    return this.cursorPosition;
  }

  @action
  public updateCurorPosition(position: CursorPosition) {
    this.cursorPosition = position;
  }

  @action
  public reset(): void {
    this.openFiles = [];
    this.currentFile = null;
    this.monacoModelManager.reset();
  }

  @computed
  public get isShowingCodeEditor() {
    return this.currentFile ? isTextFile(this.currentFile.fileType) : false;
  }

  @computed
  public get isShowingImagePreview() {
    return this.currentFile ? isImageFile(this.currentFile.fileType) : false;
  }

  @computed
  public get currentEditorModel() {
    if (this.currentFile) {
      return this.monacoModelManager.getEditorModel(this.currentFile.path);
    } else return null;
  }

  public setMonacoEditor(editor: MonacoCodeEditor) {
    this.monacoModelManager.setMonacoCodeEditor(editor);
  }

  public isFileOpen(filePath: string) {
    return this.openFiles.some((file) => file.path === filePath);
  }

  public hasTab(filePath: string) {
    return this.tabs.some((file) => file.path === filePath);
  }

  public getSavedViewState() {
    if (this.currentFile) {
      return this.monacoModelManager.getViewState(this.currentFile.path);
    }
    return null;
  }

  public getOpenFilePaths() {
    return this.openFiles.map((file) => file.path);
  }

  @computed
  public get hasOpenFiles() {
    return this.openFiles.length !== 0;
  }

  @computed
  public get hasTabs() {
    return this.tabs.length !== 0;
    // return this.openFiles.length !== 0;
  }

  public isCurrentFile(filePath: string) {
    return this.currentFile?.path === filePath;
  }

  public getCurrentFile() {
    return this.currentFile;
  }

  public getEditorModel(filePath: string) {
    return this.monacoModelManager.getEditorModel(filePath);
  }

  public getOpenFiles() {
    return this.openFiles;
  }

  @computed
  public get tabs() {
    return this.openFiles.filter((file) => file.hasTab === true);
  }

  // @action
  // public closeTab(file)

  @action
  public closeFile(filePath: string) {
    if (this.isFileOpen(filePath)) {
      // get the file to be closed
      const closedFile = this.openFiles.find((file) => file.path === filePath);

      if (closedFile) {
        // check if it is the current file we are closeing
        const isCurrentFile = this.isCurrentFile(filePath);
        const index = this.openFiles.findIndex(
          (file) => file.path === filePath
        );

        // remove the file
        this.openFiles.splice(index, 1);

        // if there are no open files left, reset everything
        if (this.openFiles.length === 0) {
          this.reset();
          return;
        }

        // if the closed file was a text file, dispose of it's model
        if (isTextFile(closedFile.fileType)) {
          this.monacoModelManager.disposeEditorModel(filePath);
        }

        // if it was the current file that was closed, change the current file
        if (isCurrentFile) {
          const newCurrentFileIndex =
            index === this.openFiles.length ? index - 1 : index;
          const newFile = this.openFiles[newCurrentFileIndex];
          this.currentFile = newFile;
          // this.restoreCurrentFileViewState(newFile.path);
        }
      }
    }
  }

  @action
  public closeTab(filePath: string) {
    const tabs = this.tabs;
    if (this.hasTab(filePath)) {
      // get the file to be closed
      const closedTab = tabs.find((file) => file.path === filePath);

      if (closedTab) {
        // check if it is the current file we are closeing
        const isCurrentFile = this.isCurrentFile(filePath);
        const index = tabs.findIndex(
          (file) => file.path === filePath
        );

        // remove the tab
        closedTab.hasTab = false;

        // if there are no open files left, reset everything
        if (this.tabs.length === 0) {
          this.reset();
          return;
        }

        // if it was the current file that was closed, change the current file
        if (isCurrentFile) {
          const newCurrentFileIndex = index === this.tabs.length ? index - 1 : index;
          const newFile = this.tabs[newCurrentFileIndex];
          this.currentFile = newFile;
        }
      }
    }
  }

  @action
  public closeAll(files: string[]) {
    // will implement later lol
  }

  @action
  public selectFile(filePath: string) {
    if (!this.isFileOpen(filePath)) {
      console.log("here!");
      this.workspace.notifications.showMessageModal({
        type: "error",
        message: `${filePath} is not open`,
        secondaryButtonText: "Close",
      });
      return;
    }

    if (!this.isCurrentFile(filePath)) {
      // save the current view state of the file before the model changes
      this.saveCurrentFileViewState();
      const selectedFile = this.openFiles.find(
        (file) => file.path === filePath
      );
      if (selectedFile) {
        this.currentFile = selectedFile;
      }
    }
  }

  private saveCurrentFileViewState() {
    const editor = this.monacoModelManager.getMonacoCodeEditor();
    if (this.currentFile && editor) {
      const currentViewState = editor.saveViewState();
      if (currentViewState) {
        console.log("save current view state", currentViewState);
        this.monacoModelManager.updateViewState(
          this.currentFile.path,
          currentViewState
        );
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
  public openFile = flow(function* (this: Editor, file: EditorFile) {
    if (this.isFileOpen(file.path)) {
      // this.workspace.notifications.showMessageModal({
      //   type: "error",
      //   message: `File is already open`,
      //   secondaryButtonText: "Close",
      // });
      if (!this.isCurrentFile(file.path)) {
        this.selectFile(file.path);
      }
      return;
    }
    const { fileType } = file;

    if (isBinaryFile(fileType)) {
      this.workspace.notifications.showMessageModal({
        type: "error",
        message: `Unable to open binary file (${file.basename})`,
        secondaryButtonText: "Close",
      });
      return;
    }

    if (isTextFile(fileType)) {
      try {
        // creates model from file and saves it
        yield this.monacoModelManager.createModelFromFile(file);
      } catch (error) {
        this.workspace.notifications.showMessageModal({
          type: "error",
          message: `Unable to open file ${file.path}`,
          secondaryButtonText: "Close",
        });
        return; // is this needed?
      }
    } else if (!isImageFile(fileType)) {
      // invalid file type
      this.workspace.notifications.showMessageModal({
        type: "error",
        message: `Unable to open file with unsupported type (${file.basename})`,
        secondaryButtonText: "Close",
      });
      return;
    }

    file.hasTab = true;

    this.openFiles.push(file);

    this.currentFile = file;
  });
}
