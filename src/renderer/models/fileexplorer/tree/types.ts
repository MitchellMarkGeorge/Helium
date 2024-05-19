import { FileType } from "common/types";
import { DirectoryEntry, Entry, FileEntry } from "../types";

// idealy, the TreeNode type would be a wrapper around the FileEntry
export interface TreeNode  {
    // type: "directory" | "file"; // is this needed
    entry: Entry; // this way data is not duplicated
}

export interface FileNode extends TreeNode {
    // type: "file";
    entry: FileEntry; // this way data is not duplicated
}

export interface DirectoryNode extends TreeNode {
    entry: DirectoryEntry;
    // type: "directory";
    // isExpanded: boolean;
    items: TreeNode[] | null
}