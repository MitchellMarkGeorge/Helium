// class to handle FileExplorer state
// it is done here since the filetree state needs to be avalibe even then the FileExplorer component is

import { FileTypeEnum, ThemeFileSystemEntry } from "common/types";
import { StateModel } from "../../StateModel";
import { Workspace } from "../../workspace/Workspace";
import { Entry, FileExplorer, FileEntry, DirectoryEntry } from "../types";
import { DirectoryNode, FileNode, TreeNode } from "./types";
import { isDirectoryNode, isFileNode } from "./utils";
import { SideBarItemOption } from "../../workspace/types";
import { isBinaryFile, isDirectory, isTextFile } from "common/utils";
import { isDirectoryEntry } from "../utils";
import pathe from "pathe";
import { action, computed, flow, observable, toJS } from "mobx";

const EXPAND_DIRECTORY_LOADER_DELAY = 3 * 1000; // 3 seconds
const REBUILD_DIRECTORY_LOADER_DELAY = 3 * 1000; // 3 seconds

export class TreeFileExplorer extends StateModel implements FileExplorer {
  // inspired by
  //https://github.com/Graviton-Code-Editor/Graviton-App/blob/main/web/src/modules/side_panels/explorer/components/FilesystemExplorer.tsx
  // root tree node
  @observable private accessor fileExplorerTree: DirectoryNode | null;
  @observable private accessor subTreeCache: Map<string, TreeNode[]>;
  // does this need to be here???
  @observable public accessor selectedEntry: string | null;
  constructor(workspace: Workspace) {
    super(workspace);
    this.fileExplorerTree = null;
    this.selectedEntry = null;
    this.subTreeCache = new Map<string, TreeNode[]>();
    // can add all the listeners here
  }

  @action
  public reset(): void {
    this.selectedEntry = null;
    this.fileExplorerTree = null;
    this.subTreeCache.clear(); // could also react a new one
    // it shoudl also stop watching all folders
  }

  public isExpanded(dirPath: string): boolean {
    if (this.fileExplorerTree) {
      const expandedDirectories = this.getExpandedDirectories(
        this.fileExplorerTree
      );
      return expandedDirectories.includes(dirPath);
    } else return false;
  }

  @action
  public init(files: ThemeFileSystemEntry[]) {
    if (this.workspace.theme) {
      const { path } = this.workspace.theme;

      const rootNode: DirectoryNode = {
        entry: {
          basename: this.workspace.theme.themeName,
          type: "directory",
          path,
          depth: 0,
          isExpanded: false,
        },

        items: this.toSubTree(files, 1),
      };

      this.fileExplorerTree = rootNode;
    }
  }

  @action
  public selectEntry(path: string): void {
    this.selectedEntry = path;
  }

  private toSubTree(files: ThemeFileSystemEntry[], depth: number) {
    return files.map((fileEntry) => this.toTreeNode(fileEntry, depth));
  }

  private toTreeNode(fileEntry: ThemeFileSystemEntry, depth: number): TreeNode {
    if (isDirectory(fileEntry)) {
      const dirNode: DirectoryNode = {
        entry: {
          basename: fileEntry.basename,
          depth,
          isExpanded: false,
          path: fileEntry.path,
          type: "directory",
        },
        items: null,
      };
      return dirNode;
    } else {
      const fileNode: FileNode = {
        entry: {
          basename: fileEntry.basename,
          depth,
          fileType: fileEntry.fileType,
          path: fileEntry.path,
          type: "file",
        },
      };
      return fileNode;
    }
  }

  private isAncestorDirectory(parent: string, child: string) {
    // got from
    // https://stackoverflow.com/questions/37521893/determine-if-a-path-is-subdirectory-of-another-in-node-js
    // think about this one
    const parentDirs = parent.split(pathe.sep).filter((dir) => dir !== "");
    const childDirs = child.split(pathe.sep).filter((dir) => dir !== "");
    return parentDirs.every((dir, i) => childDirs[i] === dir);
  }

  private findNode(path: string, tree: DirectoryNode): TreeNode | null {
    if (tree.entry.path === path) return tree;
    if (tree.items === null) return null;
    console.log(toJS(tree.items));
    for (let i = 0; i < tree.items.length; i++) {
      const node = tree.items[i];
      const { entry } = node;
      console.log(entry.path, path);
      if (entry.path === path) {
        // console.log("found node");
        return node;
      } else if (
        // path.startsWith(entry.path) &&
        this.isAncestorDirectory(entry.path, path) &&
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
  @computed
  public get isFileExplorerVisible() {
    return (
      this.workspace.isSidePanelOpen &&
      this.workspace.activeSideBarOption === SideBarItemOption.FILES
    );
  }

  @action
  public reload = flow(function* (this: TreeFileExplorer) {
    // is this still needed
    // this method pretty much wipes the slate clean
    // in an ideal world, it would still keep all expanded subtrees an only update the expanded trees
    // it would also clean up the sub tree cache
    if (this.workspace.theme) {
      const { path } = this.workspace.theme;
      this.subTreeCache.clear();
      // could just reload
      // return this.rebuildSubTreeNode(this.fileExplorerTree, )
      let rootFiles: ThemeFileSystemEntry[] = [];
      try {
        rootFiles = yield window.helium.fs.readDirectory(path);
      } catch (error) {
        this.workspace.notifications.showMessageModal({
          type: "error",
          message: "Unable to reload the file explorer.",
          secondaryButtonText: "Close",
        });
      }
      this.init(rootFiles);
    }
  });

  private getExpandedDirectories(tree: DirectoryNode): string[] {
    let expandedPaths: string[] = [];
    if (tree.items === null) return [];
    for (let i = 0; i < tree.items.length; i++) {
      const node = tree.items[i];
      if (isDirectoryNode(node) && node.entry.isExpanded) {
        expandedPaths.push(node.entry.path);
        expandedPaths = expandedPaths.concat(this.getExpandedDirectories(node));
      }
    }
    return expandedPaths;
  }

  @action
  public reloadDirectory = flow(function* (
    this: TreeFileExplorer,
    dirPath: string
  ) {
    if (this.fileExplorerTree) {
      const node = this.findNode(dirPath, this.fileExplorerTree);
      if (!node || !isDirectoryNode(node) || !node.entry.isExpanded) return;
      try {
        const expandedDirectories = this.getExpandedDirectories(node);
        const subTree = yield this.rebuildSubTreeNode(
          node,
          expandedDirectories
        );
        node.entry.isExpanded = true;
        node.items = subTree;
      } catch {
        this.workspace.notifications.showMessageModal({
          type: "error",
          message: `Unable to reload ${node.entry.basename} directory.`,
          secondaryButtonText: "Close",
        });
      }
    }
  });

  private async rebuildSubTreeNode(
    node: DirectoryNode,
    expandedPaths: string[]
  ) {
    // get all the expanded folders
    // const expansionPaths = this.getExpandedPaths(node);
    // should what about using the sub tree cache
    // need to update subtree

    // problem with this right now is that rebuilding the tree also rebuilds expanded child trees
    // this is quite inefficient for if this method is just triggered when the
    // for example, if a new file is created in the root path, all the expanded childrend will be reloaded
    // if (this.subTreeCache.has(node.entry.path)) {
    //   // should I then
    //   this.subTreeCache.delete(node.entry.path);
    // }
    const files = await window.helium.fs.readDirectory(node.entry.path);
    const subTree = this.toSubTree(files, node.entry.depth + 1);
    for (let i = 0; i < subTree.length; i++) {
      const node = subTree[i];
      if (isDirectoryNode(node) && expandedPaths.includes(node.entry.path)) {
        let childTree: TreeNode[] = [];
        if (this.subTreeCache.has(node.entry.path)) {
          childTree = this.subTreeCache.get(node.entry.path) as TreeNode[];
        } else {
          childTree = await this.rebuildSubTreeNode(node, expandedPaths);
          this.subTreeCache.set(node.entry.path, childTree);
        }
        node.entry.isExpanded = true;
        node.items = childTree;
      }
    }
    return subTree;
    // node.items = subTree;
  }

  @action
  public expand = flow(function* (this: TreeFileExplorer, dirPath: string) {
    if (this.fileExplorerTree) {
      // should this be done in the try catch???
      // const delayLoaderTimeout = setTimeout(
      //   () => this.workspace.showIsLoading("Expanding Directory"),
      //   EXPAND_DIRECTORY_LOADER_DELAY
      // );
      try {
        const node = this.findNode(dirPath, this.fileExplorerTree);
        console.log(dirPath);
        console.log(toJS(node));
        if (!node || !isDirectoryNode(node)) return;
        // we do not need to handle expansion of parent direcotries
        // as there is no case where that would be possible (for now)

        // the only case that we might want this behaviour is after reloading and the user selects
        // a tab and the file explorer has to respond (this only happens if we make the file explorer show the current tab)
        if (!node.entry.isExpanded && node.items === null) {
          let subTree: TreeNode[] = [];
          if (this.subTreeCache.has(dirPath)) {
            subTree = this.subTreeCache.get(dirPath) as TreeNode[];
          } else {
            const fileEntries = yield window.helium.fs.readDirectory(dirPath);
            subTree = this.toSubTree(fileEntries, node.entry.depth + 1);
            // what if it is an empty array???
            // this.subTreeCache.set(dirPath, subTree);
          }
          node.entry.isExpanded = true;
          node.items = subTree;
        }
      } catch {
        this.workspace.notifications.showMessageModal({
          type: "error",
          message: `Unable to expand folder ${pathe.basename(dirPath)}`,
          secondaryButtonText: "Close",
        });
      } finally {
        // clearTimeout(delayLoaderTimeout);
        // if (this.workspace.isLoading) {
        //   this.workspace.resetLoadingState();
        // }
      }
    }
  });

  @action
  public collapse(dirPath: string) {
    if (this.fileExplorerTree) {
      const node = this.findNode(dirPath, this.fileExplorerTree);
      if (!node || !isDirectoryNode(node)) return;
      if (node.entry.isExpanded && node.items !== null) {
        // no reason to cache subtree as if it was expanded, its subtree is already cached
        node.entry.isExpanded = false;
        this.subTreeCache.set(dirPath, node.items);
        // do I ***really*** need to set this to null?
        // when producing the entry array, I can just skip over it...
        // TODO: explore benefits of it being null
        node.items = null;
      }
    }
  }

  @computed
  public get asEntryArray(): Entry[] {
    if (this.fileExplorerTree) {
      return this.mapTreeToArray(this.fileExplorerTree);
    } else return [];
  }

  private mapTreeToArray(tree: DirectoryNode) {
    if (tree.items === null) return [];
    const result: Entry[] = [];
    for (let i = 0; i < tree.items.length; i++) {
      const node = tree.items[i];
      result.push(node.entry);
      if (isDirectoryNode(node)) {
        if (node.entry.isExpanded && node.items && node.items.length > 0) {
          const subTree = this.mapTreeToArray(node);
          result.push(...subTree);
          // result = result.concat(subTree);
        }
      }
    }
    return result;
  }
}
