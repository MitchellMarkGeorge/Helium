import { DirectoryEntry, Entry, FileEntry } from "./types";

export function isDirectoryEntry(
  entry: Entry
): entry is DirectoryEntry {
  return entry.type === "directory";
}

export function isFileEntry(
  entry: Entry
): entry is FileEntry {
  return entry.type === "file";
}