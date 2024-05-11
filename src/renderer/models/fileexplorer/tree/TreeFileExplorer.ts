// class to handle FileExplorer state
// it is done here since the filetree state needs to be avalibe even then the FileExplorer component is

import { ThemeFileSystemEntry } from "common/types";
import { StateModel } from "../../StateModel";
import { Workspace } from "../../workspace/Workspace";
import { Entry, FileExplorer, FileEntry, DirectoryEntry } from "../types";
import { DirectoryNode, FileNode, TreeNode } from "./types";
import { isDirectoryNode, isExpanded, isFileNode } from "./utils";
import pathe from "pathe";
import { SideBarItemOption } from "renderer/models/workspace/types";

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
  // root tree node
  private fileExplorerTree: DirectoryNode | null;
  private subTreeCache: Map<string, TreeNode[]>;
  // does this need to be here???
  public selectedEntry: string | null;
  constructor(workspace: Workspace) {
    super(workspace);
    this.fileExplorerTree = null;
    this.selectedEntry = null;
    this.subTreeCache = new Map<string, TreeNode[]>();
    // can add all the listeners here
  }

  public init(files: ThemeFileSystemEntry[]) {
    if (this.workspace.theme) {
      const { path } = this.workspace.theme;

      const rootNode: DirectoryNode = {
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

  private toTreeNode(entry: ThemeFileSystemEntry): TreeNode {
    if (entry.isDirectory) {
      const dirNode: DirectoryNode = {
        name: entry.basename,
        path: entry.path,
        type: "directory",
        isExpanded: false,
        items: null,
      };
      return dirNode;
    } else {
      const fileNode: FileNode = {
        name: entry.basename,
        path: entry.path,
        type: "file",
        fileType: entry.fileType,
      };
      return fileNode;
    }
  }

  private findNode(path: string, tree: DirectoryNode): TreeNode | null {
    if (tree.items === null) return null;
    for (let i = 0; i < tree.items.length; i++) {
      const node = tree.items[i];
      if (node.path === path) {
        return node;
      } else if (
        path.startsWith(node.path) &&
        // make sure this condition is correct
        // checks if the provided path is a subpath of the directory node path
        // eg: if path = "name/test.ts" and node path = "name",
        // we want to continue going down that directory node in order to find the node
        isDirectoryNode(node)
      ) {
        return this.findNode(path, node);
      }
    }
    return null;
  }

  // is this needed
  public isFileExplorerVisible() {
    return (
      this.workspace.isSidePanelOpen &&
      this.workspace.selectedSideBarOption === SideBarItemOption.FILES
    );
  }

  public async reload() {
    // is this still needed
    // this method pretty much wipes the slate clean
    // in an ideal world, it would still keep all expanded subtrees an only update the expanded trees
    // it would also clean up the sub tree cache
    if (this.workspace.theme) {
      const { path } = this.workspace.theme;
      this.subTreeCache.clear();
      const rootFiles = await window.helium.fs.readDirectory(path);
      this.init(rootFiles);
    }
  }

  private expandRecursive(path: string) {
    // the idea of this mehtod is to recursively expand a dir path that is not in
  }

  private async getSubtree(dirPath: string) {}

  public async expand(dirPath: string) {
    if (this.fileExplorerTree) {
      const node = this.findNode(dirPath, this.fileExplorerTree);
      if (!node || !isDirectoryNode(node)) return;
      // we do not need to handle expansion of parent direcotries
      // as there is no case where that would be possible (for now)

      // the only case that we might want this behaviour is after reloading and the user selects
      // a tab and the file explorer has to respond (this only happens if we make the file explorer show the current tab)
      if (!node.isExpanded && node.items === null) {
        let subTree: TreeNode[] = [];
        if (this.subTreeCache.has(dirPath)) {
          subTree = this.subTreeCache.get(dirPath) as TreeNode[];
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
  }

  public collapse(dirPath: string) {
    if (this.fileExplorerTree) {
      const node = this.findNode(dirPath, this.fileExplorerTree);
      if (!node || !isDirectoryNode(node)) return;
      if (node.isExpanded && node.items !== null) {
        // no reason to cache subtree as if it was expanded, its subtree is already cached
        node.isExpanded = false;
        node.items = null;
      }
    }
  }

  public getEntryArray(): Entry[] {
    if (this.fileExplorerTree) {
      return this.mapTreeToArray(this.fileExplorerTree, 0);
    } else return [];
  }

  private mapTreeToArray(tree: DirectoryNode, depth: number) {
    if (tree.items === null) return [];
    const result: Entry[] = [];
    for (let i = 0; i < tree.items.length; i++) {
      const node = tree.items[i];
      if (isFileNode(node)) {
        const fileEntry: FileEntry = {
          basename: node.name,
          depth,
          path: node.path,
          fileType: node.fileType,
          type: "file",
        };
        result.push(fileEntry);
      } else if (isDirectoryNode(node)) {
        const directoryEntry: DirectoryEntry = {
          basename: node.name,
          depth,
          path: node.path,
          type: "directory",
          isExpanded: node.isExpanded,
        };
        result.push(directoryEntry);
        if (node.isExpanded && node.items && node.items.length > 0) {
          const subTree = this.mapTreeToArray(node, depth + 1);
          result.push(...subTree);
        }
      }
    }
    return result;
  }
}
