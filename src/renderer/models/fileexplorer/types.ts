import { FileType, ThemeFileSystemEntry } from "common/types";

// TODO: rename all of these types to remove the *FileExplorer* prefix

export interface FileExplorerEntry {
    depth: number;
    path: string;
    basename: string;
    type: "directory" | "file"
}

export interface FileExplorerFileEntry extends FileExplorerEntry {
    fileType: FileType | null; 
    type: "file";
}

export interface FileExplorerDirectoryEntry extends FileExplorerEntry {
    isExpanded: boolean;
    type: "directory";
}

export interface FileExplorer {
    init(files: ThemeFileSystemEntry[]): void;
    expand(dirPath: string): Promise<void>;
    collapse(dirPath: string): void;
    reload(): Promise<void>;
    isFileExplorerVisible(): boolean; 
    getEntryArray(): FileExplorerEntry[];
}



