import { Language } from "common/types";
import { FilePathInputResult, FolderPathInputResult, InputResult } from "../notification/types";

export const enum SideBarItemOption {
  FILES = "FILES",
  STORE = "STORE",
  PREVIEW = "PREVIEW",
  THEME_INFO = "THEME_INFO",
}

export interface NewFileModalOptions {
  newFileInput: FilePathInputResult
}

export interface ConnectStoreModalOptions {
  storeName: string;
  storeUrl: string;
  themeAccessPassword: string;
}

export interface NewFolderModalOptions {
  newFolderInput: FolderPathInputResult
}

export interface LoadingState {
  isLoading: boolean;
  loadingMessage: string | null;
}