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
}
export interface ThemeInfo {
  shopifyId?: number;
//   heliumId: HeliumId; // not needed right now
  path: string;
  name: string;
  verson: string;
  author: string;
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
  connectedStore: StoreInfo;
  currentTheme: ThemeInfo; // tuple with ThemeFileEntry array
  themeFiles: ThemeFileSystemEntry[];
  previewState: PreviewState;
}

export const enum FileType {
  PLAIN = "PLAIN",
}

// export interface FileSystemEntry {
export interface ThemeFileSystemEntry {
  path: string;
  basename: string;
  isFile: boolean;
  isDirectory: boolean;
  fileType: FileType | null;
}
