import { FileType, FileTypeEnum, ThemeFile } from "common/types";
import { isBinaryFile, isTextFile } from "common/utils";
import { StateModel } from "../StateModel";
import { Workspace } from "../workspace/Workspace";
import { OpenFileOptions, ViewType } from "./types";
import { CodeEditorView } from "./CodeEditor";
import { MarkdownView } from "./MarkdownView";
import { ImageView } from "./ImageView";

const OPEN_FILE_DELAY = 3 * 1000; // 3 seconds

export class Editor extends StateModel {
  private viewType: ViewType;
  // TODO: figure out how to give access to these objects
  public codeEditor: CodeEditorView;
  public markdownViewer: MarkdownView;
  public imageViewer: ImageView;
  constructor(workspace: Workspace) {
    super(workspace);
    this.viewType = ViewType.DEFAULT;
    this.codeEditor = new CodeEditorView();
    this.imageViewer = new ImageView();
    this.markdownViewer = new MarkdownView();
  }

  public reset(): void {
    this.viewType = ViewType.DEFAULT;
    this.codeEditor.cleanup();
    this.imageViewer.cleanup();
    this.markdownViewer.cleanup();
  }

  public getViewType() {
    return this.viewType;
  }

  public async openFile(options: OpenFileOptions) {
    // this will show the loader after 3 seconds if it has not finished reading the file
    const delayLoaderTimeout = setTimeout(() => this.workspace.showIsLoading("Opening File"), OPEN_FILE_DELAY);
    const { fileType } = options;
    const isImage = isBinaryFile(fileType) && fileType === FileTypeEnum.IMAGE;
    try {
      if (isImage) {
        // any need to await this
        await this.imageViewer.openFile(options);
        this.viewType = ViewType.IMAGE;
      } else if (isTextFile(fileType)) {
        // or path
        // should show loader if this takes some time
        if (fileType === FileTypeEnum.MARKDOWN) {
          await this.markdownViewer.openFile(options);
          this.viewType = ViewType.MARKDOWN;
        } else {
          await this.codeEditor.openFile(options);
          this.viewType = ViewType.TEXT;
        }
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
      clearTimeout(delayLoaderTimeout);
      if (this.workspace.isLoading) {
        this.workspace.resetLoadingState();
      }
    }
  }

  public resetViewType() {
    this.viewType = ViewType.DEFAULT;
  }
}
