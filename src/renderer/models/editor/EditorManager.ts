import { FileType, Language } from "common/types";
import { StateModel } from "../StateModel";
import { Workspace } from "../workspace/Workspace";
import monaco from "monaco-editor";
import pathe from "pathe";

interface CreateEditorModelOptions {
  path: string;
  language: Language;
  text: string;
}

// think about better name for this
class EditorManager extends StateModel {
  private editorModelMap: Map<string, monaco.editor.ITextModel>;
  constructor(workspace: Workspace) {
    super(workspace);
    this.editorModelMap = new Map();
  }

  public createEditorModel({ path, language, text }: CreateEditorModelOptions) {
    const monacoLanguage = this.toMonacoLanguage(language);
    const monacoURI = monaco.Uri.parse(this.getFileURL(path));
    const model = monaco.editor.createModel(text, monacoLanguage, monacoURI);
    this.editorModelMap.set(path, model);
    return model;
  }

  public getEditorModel(path: string) {
    return this.editorModelMap.get(path) || null;
  }

  public deleteEditorModel(path: string) {
    if (this.editorModelMap.has(path)) {
      this.editorModelMap.delete(path);
    }
  }

  // might need to be reworked
  public get activeModel() {
    const activeEntry = this.workspace.tabs.activeEntry;
    if (!activeEntry) return null;
    return this.getEditorModel(activeEntry.path);
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
