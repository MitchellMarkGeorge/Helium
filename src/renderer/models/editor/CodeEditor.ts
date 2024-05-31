import { FileType, Language, ThemeFile } from "common/types";
import { StateModel } from "../StateModel";
import { Workspace } from "../workspace/Workspace";
import monaco from "monaco-editor";
import pathe from "pathe";
import { FileEntry } from "../fileexplorer/types";
import {
  MonacoCodeEditor,
  MonacoTextModel,
  OpenFileOptions,
  View,
} from "./types";
import { isTextFile } from "common/utils";

interface CreateEditorModelOptions {
  path: string;
  language: Language;
  text: string;
}

// think about better name for this
export class CodeEditorView implements View {
  private editorModelMap: Map<string, MonacoTextModel>;
  // this should be a file object
  // private editorModelMap: WeakMap<ThemeFile, MonacoTextModel>;
  private monacoCodeEditor: MonacoCodeEditor | null;
  private activeModel: MonacoTextModel | null;
  // if for some reason the CodeEditor is showing and the activeModel is null
  // it should render an error page
  // private unsavedPaths: Set<string>;
  constructor() {
    this.editorModelMap = new Map();
    this.monacoCodeEditor = null;
    this.activeModel = null; // or should I use a default model???
  }

  public setMonacoCodeEditor(instace: MonacoCodeEditor) {
    this.monacoCodeEditor = instace;
  }

  public getActiveModel() {
    return this.activeModel;
  }

  public setActiveModelFromPath(path: string, fileType: Language) {
    let model = this.getEditorModel(path);
    // if (!model) {
    //   // this should never be the case but just to be safe...
    //   model = this.createEditorModel({
    //     path,
    //     language: fileType,
    //     text: "",
    //   });
    //   this.saveEditorModel(path, model);
    // }
    this.activeModel = model;
  }

  public getEditorValue() {
    // could throw an error
    return this.monacoCodeEditor ? this.monacoCodeEditor.getValue() : null;
  }

  public createEditorModel({ path, language, text }: CreateEditorModelOptions) {
    const monacoLanguage = this.toMonacoLanguage(language);
    const monacoURI = monaco.Uri.parse(this.getFileURL(path));
    return monaco.editor.createModel(text, monacoLanguage, monacoURI);
  }

  public hasEditorModel(path: string) {
    return this.editorModelMap.has(path);
  }

  public saveEditorModel(path: string, model: MonacoTextModel) {
    this.editorModelMap.set(path, model);
  }

  public getEditorModel(path: string) {
    return this.editorModelMap.get(path) || null;
  }

  public getCursorPosition() {
    return this.monacoCodeEditor ? this.monacoCodeEditor.getPosition() : null;
  }

  public async openFile({ path, fileType }: OpenFileOptions) {
    let model: MonacoTextModel;
    if (isTextFile(fileType)) {
      if (!this.hasEditorModel(path)) {
        const fileContent = await window.helium.fs.readFile({
          filePath: path,
          encoding: "utf8",
        });
        model = this.createEditorModel({
          path,
          language: fileType,
          text: fileContent,
        });
        this.saveEditorModel(path, model);
      } else {
        model = this.getEditorModel(path) as MonacoTextModel;
      }
      this.activeModel = model;
    }
  }

  public deleteEditorModel(filePath: string) {
    if (this.editorModelMap.has(filePath)) {
      const model = this.editorModelMap.get(filePath);
      // should I check if it is already disposed?
      model?.dispose();
      this.editorModelMap.delete(filePath); // do this first??
    }
  }

  // might need to be reworked
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

  reset(): void {
    // dispose of all models
    for (let model of this.editorModelMap.values()) {
      if (!model.isDisposed) {
        // model.isAttachedToEditor()// should I check if it is attached to an editor???
        model.dispose();
      }
    }

    this.editorModelMap.clear();

    if (!this.activeModel?.isDisposed) {
      this.activeModel?.dispose();
    }
    this.activeModel = null;

    this.monacoCodeEditor?.dispose();

    this.monacoCodeEditor = null;
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
