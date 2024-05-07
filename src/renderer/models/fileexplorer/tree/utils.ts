import {
  FileExplorerNode,
  FileExplorerDirectoryNode,
  FileExplorerFileNode,
} from "./types";

export function isDirectoryNode(
  node: FileExplorerNode
): node is FileExplorerDirectoryNode {
  return node.type === "directory";
}

export function isFileNode(
  node: FileExplorerNode
): node is FileExplorerFileNode {
  return node.type === "directory";
}

export function isExpanded(node: FileExplorerDirectoryNode) {
    // makes sure that items is not null if the directory node is expanded
    // even if it is an empty folder, it will return an empty array
    return node.isExpanded && node.items !== null;
}
