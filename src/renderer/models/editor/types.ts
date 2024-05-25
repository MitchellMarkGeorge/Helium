
import type monaco from "monaco-editor"
import { FileType } from "common/types";
export type MonacoTextModel = monaco.editor.ITextModel;
export type MonacoCodeEditor = monaco.editor.IStandaloneCodeEditor;

export const enum ViewType {
    IMAGE = "IMAGE",
    TEXT = "TEXT",
    MARKDOWN = "MARKDOWN",
    DEFAULT = "DEFULT",
}
export interface OpenFileOptions {
    path: string;
    fileType: FileType
    basename?: string;
}

// rename this
export interface View {
    openFile(options: OpenFileOptions): Promise<void>;
    cleanup(): void;
}

export const enum FileStatus {
    SAVED = "SAVED",
    UNSAVED = "UNSAVED"
}