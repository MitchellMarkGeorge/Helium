import { FileType, FileTypeEnum, ThemeFile } from "common/types";
import { isBinaryFile, isTextFile } from "common/utils";
import { StateModel } from "../StateModel";
import { Workspace } from "../workspace/Workspace";
import { OpenFileOptions, ViewType } from "./types";
import { CodeEditorView } from "./CodeEditor";
import { MarkdownView } from "./MarkdownView";
import { ImageView } from "./ImageView";

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

  public cleanup(): void {
      this.viewType = ViewType.DEFAULT;
      this.codeEditor.cleanup();
      this.imageViewer.cleanup();
      this.markdownViewer.cleanup();
  }

  public getViewType() {
    return this.viewType;
  }

  public async openFile(options: OpenFileOptions) {
    const { fileType } = options;
    const isImage = isBinaryFile(fileType) && fileType === FileTypeEnum.IMAGE;
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
  }

  public reset() {
    this.viewType = ViewType.DEFAULT;
  }
}
