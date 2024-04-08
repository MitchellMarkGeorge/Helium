import type { getAppApi } from "main/preload/app";
import type { getFsApi } from "main/preload/fs";
import type { getShopifyApi } from "main/preload/shopify";
import type utils from "main/utils";

export type HeliumId = `helium-${string}`;

export const enum PreviewState {
  OFF = "OFF",
  ON = "ON",
  STARTING = "STARTING",
  STOPPING = "STOPPING",
  ERROR = "ERROR",
}
export interface ThemeInfo {
  shopifyId: number | null;
//   heliumId: HeliumId; // not needed right now
  path: string;
  // these values are optional as config files might not be provided
  name: string | null;
  verson: string | null;
  author: string | null;
}

export interface StoreInfo {
  heliumId: HeliumId; // not needed right now
  // UI does not need passworkd
  themeAccessPassword: string; // hashed
  url: string;
}

export interface ConnectStoreOptions {
    storeUrl: string;
    password: string;
}

// HeliumAPI, HeliumGlobal???
export interface HeliumGlobal {
  app: ReturnType<typeof getAppApi>;
  fs: ReturnType<typeof getFsApi>;
  shopify: ReturnType<typeof getShopifyApi>;
  utils: typeof utils;
  // initalState: InitalState;
}

export interface InitalState {
  connectedStore: StoreInfo | null;
  currentTheme: ThemeInfo | null; // tuple with ThemeFileEntry array
  themeFiles: ThemeFileSystemEntry[];
  previewState: PreviewState;
}

export const enum FileType {
  LIQUID = 'Liquid',
  MARKDOWN = 'Markdown',
  YAML = 'Yaml',
  TOML = 'Toml',
  JSON = 'JSON',
  JAVASCRIPT = 'JavaScript',
  JSX = 'JSX',
  TYPESCRIPT = 'TypeScript',
  TYPESCRIPT_JSX = 'TypeScript JSX',
  CSS = 'CSS',
  SASS = 'Sass', //scss
  LESS = 'Less',
  HTML = 'HTML',
  PLAIN = "Plain Text",
}

// export interface FileSystemEntry {
export interface ThemeFileSystemEntry {
  path: string;
  basename: string;
  isFile: boolean;
  isDirectory: boolean;
  fileType: FileType | null;
}

export interface OpenThemeResult {
  themeInfo: ThemeInfo;
  files: ThemeFileSystemEntry[];
}

export interface ThemeDirectoryChange {
  // TODO: for now
  changedPath: string;
  // type: ThemeDirectoryChangeType
}
export const enum ThemeDirectoryChangeType {
  FILE_ADDED = 'FILE_ADDED',
  FILE_DELETED = 'FILE_DELETED',
  FOLDER_ADDED = 'FOLDER_ADDED',
  FOLDER_REMOVED = 'FOLDER_REMOVED',
}
