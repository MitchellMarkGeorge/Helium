import { FileType, Language } from "common/types";
import { StateModel } from "../StateModel";
import { Workspace } from "../workspace/Workspace";
import monaco from "monaco-editor";
import pathe from "pathe";
import { FileEntry } from "../fileexplorer/types";
import { MonacoCodeEditor, MonacoTextModel } from "./types";
import { isTextFile } from "common/utils";

interface CreateEditorModelOptions {
  entry: FileEntry;
  language: Language;
  text: string;
}


// think about better name for this
export class Editor extends StateModel {
  // could make this a weak map (entry -> model)
  //   private editorModelMap: Map<string, monaco.editor.ITextModel>;
  // using a weak map here so that when the file entry is no longer reference,
  // it is garbage collected automatically
  private editorModelMap: WeakMap<FileEntry, MonacoTextModel>;
  private monacoCodeEditor: MonacoCodeEditor | null;
  constructor(workspace: Workspace) {
    super(workspace);
    this.editorModelMap = new WeakMap();
    this.monacoCodeEditor = null;
  }

  public setMonacoCodeEditor(instace: MonacoCodeEditor) {
    this.monacoCodeEditor = instace;
  }

  public getEditorValue() {
    // could throw an error
   return this.monacoCodeEditor ? this.monacoCodeEditor.getValue() : null; 
  }

  public createEditorModel({
    entry,
    language,
    text,
  }: CreateEditorModelOptions) {
    const monacoLanguage = this.toMonacoLanguage(language);
    const monacoURI = monaco.Uri.parse(this.getFileURL(entry.path));
    const model = monaco.editor.createModel(text, monacoLanguage, monacoURI);
    return model;
  }

  public hasEditorModel(entry: FileEntry) {
    return this.editorModelMap.has(entry);
  }

  public saveEditorModel(entry: FileEntry, model: MonacoTextModel) {
    this.editorModelMap.set(entry, model);
  }

  public getEditorModel(entry: FileEntry) {
    return this.editorModelMap.get(entry) || null;
  }

  public getCursorPosition() {
   return this.monacoCodeEditor ? this.monacoCodeEditor.getPosition() : null; 
  }

  public async openFile(entry: FileEntry) {
    if (isTextFile(entry.fileType)) {
      if (!this.workspace.editor.hasEditorModel(entry)) {
        const fileContent = await window.helium.fs.readFile({
          filePath: entry.path,
          encoding: "utf8",
        });
        let model = this.workspace.editor.createEditorModel({
          entry,
          language: entry.fileType,
          text: fileContent,
        });
        this.workspace.editor.saveEditorModel(entry, model);
      }
    }
  }

  //   public deleteEditorModel(path: string) {
  //     if (this.editorModelMap.has(path)) {
  //       const model = this.editorModelMap.get(path);
  //     this.editorModelMap.set(path, model);
  //       // should I check if it is already disposed?
  //       model?.dispose();
  //       this.editorModelMap.delete(path);
  //     }
  //   }

  // might need to be reworked
  public get activeModel() {
    const activeEntry = this.workspace.tabs.activeEntry;
    if (!activeEntry) return null;
    return this.getEditorModel(activeEntry);
  }

  private getFileURL(filePath: string) {
    // got from here:
    // https://github.com/sindresorhus/file-url/blob/main/index.js
    // do I have to resolve it first
    let pathName = pathe.resolve(filePath);
    pathName = pathName.replace(/\\/g, "/");

    // Windows drive letter must be prefixed with a slash.
    if (pathName[0] !== "/") {
      pathName = `/${pathName}`;
    }

    // Escape required characters for path components.
    // See: https://tools.ietf.org/html/rfc3986#section-3.3
    return encodeURI(`file://${pathName}`).replace(/[?#]/g, encodeURIComponent);
  }

  private toMonacoLanguage(language: Language) {
    switch (language) {
      case Language.LIQUID:
        return "liquid";
      case Language.HTML:
        return "html";
      case Language.CSS:
        return "css";
      case Language.JAVASCRIPT:
        return "javascript";
      case Language.TYPESCRIPT:
        return "typescript";
      case Language.LESS:
        return "less";
      case Language.SCSS:
        return "scss";
      case Language.JSON:
        return "json";
      case Language.MARKDOWN:
        return "markdown";
      case Language.YAML:
        return "yaml";
      default:
        return "plaintext";
    }
  }
}
