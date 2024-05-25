import {
  BinaryFileType,
  FileType,
  FileTypeEnum,
  Language,
  ThemeFileSystemEntry,
  ThemeDirectory,
  ThemeFile,
} from "./types";

export const assertIsDefined = <T>(
  value: T,
  message: string
): asserts value is NonNullable<T> => {
  if (value === undefined || value === null) {
    throw new Error(message);
  }
};

export async function wait(miliseconds: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, miliseconds);
  });
}

export function getErrorMessage(error: unknown) {
  if (error instanceof Error) return error.message;
  return String(error);
}

export function isBinaryFile(fileType: FileType): fileType is BinaryFileType {
  return fileType === FileTypeEnum.BINARY || fileType === FileTypeEnum.IMAGE;
}

export function isTextFile(fileType: FileType): fileType is Language {
  return !isBinaryFile(fileType) && Object.values(Language).includes(fileType);
}

export function isDirectory(
  themeEntry: ThemeFileSystemEntry
): themeEntry is ThemeDirectory {
  return themeEntry.type === "directory";
}

export function isFile(
  themeEntry: ThemeFileSystemEntry
): themeEntry is ThemeFile {
  return themeEntry.type === "file";
}

