import type { getAppPreloadApi } from "main/preload/app";
import type { constants } from "main/utils/constants";
import type { getFsPreloadApi } from "main/preload/fs";
import type { getShopifyPreloadApi } from "main/preload/shopify";
import type utils from "main/utils/utils";

export type HeliumId = `helium-${string}`;

export const enum PreviewState {
  OFF = "OFF",
  RUNNING = "RUNNING",
  STARTING = "STARTING",
  STOPPING = "STOPPING",
  ERROR = "ERROR",
  UNAVALIBLE = "UNAVALIBLE",
}
export interface ThemeInfo {
  shopifyId: number | null; // string
//   heliumId: HeliumId; // not needed right now
  path: string;
  // these values are optional as config files might not be provided
  name: string | null;
  version: string | null;
  author: string | null;
}

export interface StoreInfo {
  heliumId: HeliumId; // not needed right now
  // UI does not need passworkd
  themeAccessPassword: string; // encrypted
  url: string;
  name: string;
}

export interface ConnectStoreOptions {
    storeName: string;
    storeUrl: string;
    password: string;
}

// HeliumAPI, HeliumGlobal???
export interface HeliumGlobal {
  app: ReturnType<typeof getAppPreloadApi>;
  fs: ReturnType<typeof getFsPreloadApi>;
  shopify: ReturnType<typeof getShopifyPreloadApi>;
  utils: typeof utils;
  constants: typeof constants
}

export interface InitalState {
  connectedStore: StoreInfo | null;
  currentTheme: ThemeInfo | null; 
  themeFiles: ThemeFileSystemEntry[];
  previewState: PreviewState;
}

export enum Language {
  LIQUID = 'Liquid',
  MARKDOWN = 'Markdown',
  YAML = 'YAML',
  JSON = 'JSON',
  JAVASCRIPT = 'JavaScript',
  TYPESCRIPT = 'TypeScript',
  CSS = 'CSS',
  SCSS = 'SCSS', //scss
  LESS = 'Less',
  HTML = 'HTML',
  PLAIN_TEXT = "Plain Text",
}


export enum BinaryFileType {
  IMAGE = "Image",
  BINARY = "Binary" // show error
}

export type FileType = Language | BinaryFileType
export const FileTypeEnum = { ...Language,...BinaryFileType };

// export interface FileSystemEntry {

export interface ThemeFile {
  path: string;
  basename: string;
  type: "file";
  fileType: FileType;
}

export interface ThemeDirectory {
  path: string;
  basename: string;
  type: "directory";
}

export type ThemeFileSystemEntry = ThemeFile | ThemeDirectory;

export interface OpenThemeResult {
  themeInfo: ThemeInfo;
  files: ThemeFileSystemEntry[];
}

export interface ThemeDirectoryChange {
  // TODO: for now
  changedDirectory: string;
  // type: ThemeDirectoryChangeType
}
export const enum ThemeDirectoryChangeType {
  FILE_ADDED = 'FILE_ADDED',
  FILE_DELETED = 'FILE_DELETED',
  FOLDER_ADDED = 'FOLDER_ADDED',
  FOLDER_REMOVED = 'FOLDER_REMOVED',
}

export interface StartThemePreviewOptions {
  host: string;
  port: string; 
}