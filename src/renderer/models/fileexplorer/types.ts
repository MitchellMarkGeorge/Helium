import { FileType, ThemeFileSystemEntry } from "common/types";

// TODO: rename all of these types to remove the *FileExplorer* prefix

export interface Entry {
    depth: number;
    path: string;
    basename: string;
    type: "directory" | "file"
}

export interface FileEntry extends Entry {
    fileType: FileType; 
    type: "file";
}

export interface DirectoryEntry extends Entry {
    isExpanded: boolean;
    type: "directory";
}

export interface FileExplorer {
    init(files: ThemeFileSystemEntry[]): void;
    selectedEntry: string | null;
    expand(dirPath: string): Promise<void>;
    collapse(dirPath: string): void;
    openFile(entry: FileEntry): Promise<void>;
    reload(): Promise<void>;
    getEntryArray(): Entry[];
}



