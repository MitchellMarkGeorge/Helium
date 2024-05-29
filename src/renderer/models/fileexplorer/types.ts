import { FileType, ThemeFileSystemEntry } from "common/types";
import { StateModel } from "../StateModel";

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

export abstract class FileExplorer extends StateModel {
    public abstract init(files: ThemeFileSystemEntry[]): void;
    public abstract selectedEntry: string | null;
    public abstract expand(dirPath: string): Promise<void>;
    public abstract collapse(dirPath: string): void;
    public abstract reload(): Promise<void>;
    public abstract getEntryArray(): Entry[];
    public abstract isExpanded(dirPath: string): boolean;
    public abstract reloadDirectory(dirPath: string): Promise<void>;
}



