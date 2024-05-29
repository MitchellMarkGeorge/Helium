import { Language } from "common/types";

export const enum SideBarItemOption {
  FILES = "FILES",
  STORE = "STORE",
  PREVIEW = "PREVIEW",
  THEME_INFO = "THEME_INFO",
}

export interface NewFileOptions {
  fileName: string;
  fileType: Language;
  filePath: string;
}

export interface NewFolderOptions {
  folderPath: string;
  folderName: string;
}

export interface LoadingState {
  isLoading: boolean;
  loadingMessage: string | null;
}