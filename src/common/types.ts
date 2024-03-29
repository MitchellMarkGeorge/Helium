import type { getAppApi } from "main/preload/app";
import type { getFsApi } from "main/preload/fs";
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
  heliumId: HeliumId;
  path: string;
  name: string;
  verson: string;
  author: string;
}

export interface StoreInfo {
  heliumId: HeliumId;
  themeAccessPassword: string;
  url: string;
}

// HeliumAPI, HeliumGlobal???
export interface Helium {
  app: ReturnType<typeof getAppApi>;
  fs: ReturnType<typeof getFsApi>;
  utils: typeof utils;
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
