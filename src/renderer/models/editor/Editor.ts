import { FileType, FileTypeEnum, Language, ThemeFile } from "common/types";
import { isBinaryFile, isImageFile, isTextFile } from "common/utils";
import { StateModel } from "../StateModel";
import { Workspace } from "../workspace/Workspace";
import { EditorFile, ViewType } from "./types";
import { ModelManager } from "./ModelManager";
import { ImageView } from "./ImageView";
import { TabManager } from "./TabManager";
import pathe from "pathe";
import { action, computed, flow, observable } from "mobx";

const OPEN_FILE_LOADER_DELAY = 3 * 1000; // 3 seconds

// pretty much the EditorPanel state
export class Editor extends StateModel {
  private monacoModelManager: ModelManager;
  @observable private accessor openFiles: EditorFile[];
  @observable public accessor activeFileIndex: number | null;
  @observable.deep private currentFile: EditorFile | null;

  constructor(workspace: Workspace) {
    super(workspace);
    this.openFiles = [];
    this.activeFileIndex = null;
    this.currentFile = null;
    this.monacoModelManager = new ModelManager();
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

  public isFileOpen(filePath: string) {
    return this.openFiles.some((file) => file.path === filePath);
  }

  public getOpenFilePaths() {
    return this.openFiles.map((file) => file.path);
  }

  @computed
  public get hasOpenFiles() {
    return this.openFiles.length !== 0;
  }

  public isCurrentFile(filePath: string) {
    return this.currentFile?.path === filePath;
  }

  @action
  public closeFile(filePath: string) {
    if (this.isFileOpen(filePath)) {
      // get the file to be closed
      // is this needed
      const closedFile = this.openFiles.find((file) => file.path === filePath);

      if (closedFile) {
        // check if it is the current file we are closeing
        const isCurrentFile = this.isCurrentFile(filePath);
        const index = this.openFiles.findIndex((file) => file.path === filePath);

        // remove the file
        this.openFiles.splice(index, 1);

        // if there are no open files left, reset everything
        if (this.openFiles.length === 0)  {
          this.reset();
          return;
        }

        // if the closed file was a text file, dispose of it's model
        if (isTextFile(closedFile.fileType)) {
          this.monacoModelManager.disposeEditorModel(filePath);
        }

        // if it was the current file that was closed, change the current file
        if (isCurrentFile) {
          const newCurrentFileIndex = index === this.openFiles.length ? index - 1 : index; 
          this.currentFile = this.openFiles[newCurrentFileIndex];
        }


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
  public async selectFile(filePath: string) {
    if (!this.isFileOpen(filePath)) {
      this.workspace.notifications.showMessageModal({
        type: "error",
        message: `${filePath} is not open`,
        secondaryButtonText: "Close",
      });
      return;
    }
    
    if (!this.isCurrentFile(filePath)) {
      const selectedFile = this.openFiles.find(file => file.path === filePath);
      if (selectedFile) {
        this.currentFile = selectedFile;
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
      this.workspace.notifications.showMessageModal({
        type: "error",
        message: `File is already open`,
        secondaryButtonText: "Close",
      });
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

    this.openFiles.push(file);
    this.currentFile = file;
  });
}
