// class to handle FileExplorer state
// it is done here since the filetree state needs to be avalibe even then the FileExplorer component is

import { ThemeFileSystemEntry } from "common/types";
import { StateModel } from "../../StateModel";
import { Workspace } from "../../workspace/Workspace";
import {
  FileExplorerEntry,
  FileExplorer,
  FileExplorerFileEntry,
  FileExplorerDirectoryEntry,
} from "../types";
import {
  FileExplorerDirectoryNode,
  FileExplorerFileNode,
  FileExplorerNode,
} from "./types";
import { isDirectoryNode, isExpanded, isFileNode } from "./utils";
import pathe from "pathe";

// right now there is a case where a previously open diractory is cloased and then opened agin
// and the subtree has been updated while it was closed (and the watcher has been removed)
// then the subtree cache will be invalid

// 2 things to do:
// 1) keep the watcher for any folder that has been opened and update the cache when anything changes
// the problem with this approach is that there could be a race condition where the user is expanding the directory again and the watcher has not been triggered/added
// this would make the subtree inacurate
// 2) dont have a subtree cache and just read the directory everytime it is expanded
// this makes sure that it only responds to change update events when the directory is open

// as of right now, I will use approach 2 until I know how to handle the race condition
// atom does not use a cache system tho

// unmounted (another sidepanel is shownn)
export class TreeFileExplorer extends StateModel implements FileExplorer {
  private fileExplorerTree: FileExplorerDirectoryNode | null;
  private subTreeCache: Map<string, FileExplorerNode[]>;
  constructor(workspace: Workspace) {
    super(workspace);
    this.fileExplorerTree = null;
    this.subTreeCache = new Map<string, FileExplorerNode[]>();
    // can add all the listeners here
  }

  public init(files: ThemeFileSystemEntry[]) {
    if (this.workspace.theme) {
      const { path } = this.workspace.theme;

      const rootNode: FileExplorerDirectoryNode = {
        path,
        name: this.workspace.theme.getThemeName(),
        type: "directory",
        isExpanded: false,
        items: this.toSubTree(files),
      };

      this.fileExplorerTree = rootNode;
    }
  }

  private toSubTree(files: ThemeFileSystemEntry[]) {
    return files.map(this.toTreeNode);
  }

  private toTreeNode(entry: ThemeFileSystemEntry): FileExplorerNode {
    if (entry.isDirectory) {
      const dirNode: FileExplorerDirectoryNode = {
        name: entry.basename,
        path: entry.path,
        type: "directory",
        isExpanded: false,
        items: null,
      };
      return dirNode;
    } else {
      const fileNode: FileExplorerFileNode = {
        name: entry.basename,
        path: entry.path,
        type: "file",
        fileType: entry.fileType,
      };
      return fileNode;
    }
  }

  private findNode(
    path: string,
    tree: FileExplorerDirectoryNode
  ): FileExplorerNode | null {
    if (tree.items === null) return null;
    for (let i = 0; i < tree.items.length; i++) {
      const node = tree.items[i];
      if (node.path === path) {
        return node;

        // } else if (path.startsWith(node.path) && isDirectoryNode(node)) {
      } else if (
        // make sure this condition is correct
        pathe.dirname(path) === pathe.dirname(node.path) &&
        // needs to be a directory node
        isDirectoryNode(node)
      ) {
        return this.findNode(path, node);
      }
    }
    return null;
  }

  public isFileExplorerVisible() {
    // if the side panel is open
    // and the current side bar item is Files
    return true;
  }

  public async reload() {
    // is this still needed
    // this method pretty much wipes the slate clean
    // in an ideal world, it would still keep all expanded subtrees

    // the idea bedind this method is to pretty much rebuild the entire file tree
    // and remove any subtrees from the cache if their parent directories are not open
    // (my implementation of) reload will pretty much reset the entire
    if (this.workspace.theme) {
      const { path } = this.workspace.theme;
      this.subTreeCache.clear();
      const rootFiles = await window.helium.fs.readDirectory(path);
      this.init(rootFiles);
    }
  }

  public async expand(dirPath: string) {
    if (this.fileExplorerTree) {
      const node = this.findNode(dirPath, this.fileExplorerTree);
      if (!node || !isDirectoryNode(node)) return;
      let subTree: FileExplorerNode[] = [];
      // do we neeed to to handle parent directories that have not been expanded???
      if (!node.isExpanded && node.items === null) {
        if (this.subTreeCache.has(dirPath)) {
          subTree = this.subTreeCache.get(dirPath) as FileExplorerNode[];
        }
      } else {
        const fileEntries = await window.helium.fs.readDirectory(dirPath);
        subTree = this.toSubTree(fileEntries);
        // what if it is an empty array???
        this.subTreeCache.set(dirPath, subTree);
      }
      node.isExpanded = true;
      node.items = subTree;
    }
  }

  public collapse(dirPath: string) {
    if (this.fileExplorerTree) {
      const node = this.findNode(dirPath, this.fileExplorerTree);
      if (!node || !isDirectoryNode(node)) return;
      if (node.isExpanded && node.items !== null) {
        // cache the subtreee
        // is this needed?
        // handle if empty array
        if (node.items.length > 0) {
          this.subTreeCache.set(dirPath, node.items);
        }
        node.isExpanded = false;
        node.items = null;
      }
    }
  }

  public getEntryArray(): FileExplorerEntry[] {
    if (this.fileExplorerTree) {
      return this.mapTreeToArray(this.fileExplorerTree, 0);
    } else return [];
  }

  private mapTreeToArray(tree: FileExplorerDirectoryNode, depth: number) {
    let result: FileExplorerEntry[] = [];
    if (tree.items === null) return [];
    for (let i = 0; i < tree.items.length; i++) {
      const node = tree.items[i];
      if (isFileNode(node)) {
        const fileEntry: FileExplorerFileEntry = {
          basename: node.name,
          depth,
          path: node.path,
          fileType: node.fileType,
          type: "file",
        };
        result.push(fileEntry);
      } else if (isDirectoryNode(node)) {
        const directoryEntry: FileExplorerDirectoryEntry = {
          basename: node.name,
          depth,
          path: node.path,
          type: "directory",
          isExpanded: node.isExpanded,
        };
        result.push(directoryEntry);
        if (node.isExpanded && node.items && node.items.length > 0) {
          const subTree = this.mapTreeToArray(node, depth + 1);
          result = result.concat(subTree);
        }
      }
    }
    return result;
  }
}
