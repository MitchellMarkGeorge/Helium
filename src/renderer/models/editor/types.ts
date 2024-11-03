
import type monaco from "monaco-editor"
import { FileType } from "common/types";

export type MonacoTextModel = monaco.editor.ITextModel;
export type MonacoViewState = monaco.editor.ICodeEditorViewState;
export type MonacoCodeEditor = monaco.editor.IStandaloneCodeEditor;

export const enum ViewType {
    IMAGE = "IMAGE",
    TEXT = "CODE",
}

export interface CursorPosition {
    line: number;
    column: number;
}

export interface EditorFile {
    path: string;
    fileType: FileType
    basename?: string;
}

// rename this
export const enum FileStatus {
    SAVED = "SAVED",
    UNSAVED = "UNSAVED"
}