import {
  TreeNode,
  DirectoryNode,
  FileNode,
} from "./types";

export function isDirectoryNode(
  node: TreeNode
): node is DirectoryNode {
  return node.type === "directory";
}

export function isFileNode(
  node: TreeNode
): node is FileNode {
  return node.type === "file";
}

export function isExpanded(node: DirectoryNode) {
    // makes sure that items is not null if the directory node is expanded
    // even if it is an empty folder, it will return an empty array
    return node.isExpanded && node.items !== null;
}
