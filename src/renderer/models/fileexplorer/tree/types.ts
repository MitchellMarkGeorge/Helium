import { FileType } from "common/types";

export interface TreeNode  {
    type: "directory" | "file"; // is this needed
    name: string;
    path: string;
}

export interface FileNode extends TreeNode {
    type: "file";
    fileType: FileType | null;
}

export interface DirectoryNode extends TreeNode {
    type: "directory";
    isExpanded: boolean;
    items: TreeNode[] | null
}