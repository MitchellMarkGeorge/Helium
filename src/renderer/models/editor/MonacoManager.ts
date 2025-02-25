import { FileType, Language, ThemeFile } from "common/types";
import { StateModel } from "../StateModel";
import { Workspace } from "../workspace/Workspace";
import monaco from "monaco-editor";
import pathe from "pathe";
import { FileEntry } from "../fileexplorer/types";
import {
  MonacoCodeEditor,
  MonacoTextModel,
  EditorFile,
  MonacoViewState,
} from "./types";
import { isTextFile } from "common/utils";
import { action, observable } from "mobx";

interface CreateEditorModelOptions {
  path: string;
  language: Language;
  text: string;
}

// think about better name for this
export class MonacoManager {
  // think about this
  @observable.shallow private accessor editorModelMap: Map<string, MonacoTextModel>;
  @observable.shallow private accessor editorViewState: Map<string, MonacoViewState>;
  @observable.shallow private accessor editorVersionId: Map<string, number>;
  // this should be a file object
  // private editorModelMap: WeakMap<ThemeFile, MonacoTextModel>;
  // does this need to be an observable???
  @observable.ref private accessor monacoCodeEditor: MonacoCodeEditor | null;
  // it should render an error page
  // private unsavedPaths: Set<string>;
  constructor() {
    this.editorModelMap = new Map();
    this.editorViewState = new Map();
    this.editorVersionId = new Map();
    this.monacoCodeEditor = null;
  }

  @action
  public setMonacoCodeEditor(instace: MonacoCodeEditor) {
    this.monacoCodeEditor = instace;
  }

  public getMonacoCodeEditor() {
    return this.monacoCodeEditor;
  }

  // computed???
  public getEditorValue() {
    // could throw an error
    return this.monacoCodeEditor ? this.monacoCodeEditor.getValue() : null;
  }

  public createEditorModel({ path, language, text }: CreateEditorModelOptions) {
    const monacoLanguage = this.toMonacoLanguage(language);
    const monacoURI = monaco.Uri.file(path);
    // const monacoURI = monaco.Uri.parse(this.getFileURL(path));
    return monaco.editor.createModel(text, monacoLanguage, monacoURI);
  }

  public hasEditorModel(path: string) {
    return this.editorModelMap.has(path);
  }

  public getViewState(filePath: string) {
    return this.editorViewState.get(filePath) || null;
  }

  public updateViewState(filePath: string, viewState: MonacoViewState) {
    return this.editorViewState.set(filePath, viewState);
  }

  @action
  public saveEditorModel(path: string, model: MonacoTextModel) {
    this.editorModelMap.set(path, model);
  }

  @action
  public updateEditorModelVersionId(path: string, versionId: number) {
    this.editorVersionId.set(path, versionId);
  }

  public getEditorModel(path: string) {
    return this.editorModelMap.get(path) || null;
  }

  public getVersionId(path: string) {
    return this.editorVersionId.get(path) || null;
  }

  @action
  // should it still be named openFile 
  public async createModelFromFile({ path, fileType }: EditorFile) {
    if (isTextFile(fileType)) {
      if (!this.hasEditorModel(path)) {
        const fileContent = await window.helium.fs.readFile({
          filePath: path,
          encoding: "utf8",
        });
        const model = this.createEditorModel({
          path,
          language: fileType,
          text: fileContent,
        });
        this.saveEditorModel(path, model);
        this.updateEditorModelVersionId(path, model.getAlternativeVersionId());
      } 
    }
  }

  @action
  public disposeEditorModel(filePath: string) {
    
    if (this.editorModelMap.has(filePath)) {
      const model = this.editorModelMap.get(filePath);
      // should I check if it is already disposed?
      console.log('disposing')
      model?.dispose();
      this.editorModelMap.delete(filePath); // do this first??
    }

    if (this.editorViewState.has(filePath)) {
      this.editorViewState.delete(filePath);
    }

    if (this.editorVersionId.has(filePath)) {
      this.editorVersionId.delete(filePath);
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

  @action
  reset(): void {
    // dispose of all models
    for (let model of this.editorModelMap.values()) {
      if (!model.isDisposed) {
        // model.isAttachedToEditor()// should I check if it is attached to an editor???
        model.dispose();
      }
    }

    this.editorModelMap.clear();

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
