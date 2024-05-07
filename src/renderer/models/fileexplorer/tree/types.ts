import { FileType } from "common/types";

export interface FileExplorerNode  {
    type: "directory" | "file"; // is this needed
    name: string;
    path: string;
}

export interface FileExplorerFileNode extends FileExplorerNode   {
    type: "file";
    fileType: FileType | null;
}

export interface FileExplorerDirectoryNode extends FileExplorerNode {
    type: "directory";
    isExpanded: boolean;
    items: FileExplorerNode[] | null
}