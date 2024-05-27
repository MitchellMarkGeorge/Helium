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

export class TreeFileExplorer extends StateModel implements FileExplorer {
  // inspired by
  //https://github.com/Graviton-Code-Editor/Graviton-App/blob/main/web/src/modules/side_panels/explorer/components/FilesystemExplorer.tsx
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

  //
  private toEntry(entry: ThemeFileSystemEntry, depth: number) {
    if (isDirectory(entry)) {
      const dirEntry: DirectoryEntry = {
        basename: entry.basename,
        path: entry.path,
        type: "directory",
        isExpanded: false,
        depth,
      };
      return dirEntry;
    } else {
      const fileEntry: FileEntry = {
        basename: entry.basename,
        path: entry.path,
        type: "file",
        fileType: entry.fileType,
        depth,
      };
      return fileEntry;
    }
  }

  public init(files: ThemeFileSystemEntry[]) {
    if (this.workspace.theme) {
      const { path } = this.workspace.theme;

      const rootNode: DirectoryNode = {
        entry: {
          basename: this.workspace.theme.getThemeName(),
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

  private findNode(path: string, tree: DirectoryNode): TreeNode | null {
    if (tree.entry.path === path) return tree;
    if (tree.items === null) return null;
    for (let i = 0; i < tree.items.length; i++) {
      const node = tree.items[i];
      const { entry } = node;
      if (entry.path === path) {
        return node;
      } else if (
        path.startsWith(entry.path) &&
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

  // needs to use flow
  public async openFile(entry: FileEntry) {
    const isImage = entry.fileType === FileTypeEnum.IMAGE;
    if (isBinaryFile(entry.fileType) && !isImage) {
      this.workspace.notifications.showNotification({
        type: "error",
        message: `Unable to open binary file at ${entry.path}`,
      });
      return;
    }

    if (this.workspace.tabs.hasTab(entry.path)) {
      this.workspace.tabs.selectTab(entry.path);
    } else {
      const tab = {
        basename: entry.basename,
        fileType: entry.fileType,
        path: entry.path,
      };
      this.workspace.tabs.addTab({ tab });
      // this.workspace.tabs.selectActiveTab(entry);
      // the editor will then open the file
      // reading the content from the operating system
      // and then saving the model internally
      // await this.workspace.editor.openFile(entry);
      // await this.workspace.editor.openFile(entry.path);
    }
  }

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

  public async rebuildSubTree(dirPath: string): Promise<void> {
    if (this.fileExplorerTree) {
      const node = this.findNode(dirPath, this.fileExplorerTree);    
      if (!node || !isDirectoryNode(node) || !node.entry.isExpanded) return;
      const expandedDirectories = this.getExpandedDirectories(node);
      const subTree = await this.rebuildSubTreeNode(node, expandedDirectories);
      node.entry.isExpanded = true;
      node.items = subTree;
    }
  }

  public async rebuildSubTreeNode(node: DirectoryNode, expandedPaths: string[]) {
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

  public async expand(dirPath: string) {
    if (this.fileExplorerTree) {
      const node = this.findNode(dirPath, this.fileExplorerTree);
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
          const fileEntries = await window.helium.fs.readDirectory(dirPath);
          subTree = this.toSubTree(fileEntries, node.entry.depth + 1);
          // what if it is an empty array???
          this.subTreeCache.set(dirPath, subTree);
        }
        node.entry.isExpanded = true;
        node.items = subTree;
      }
    }
  }

  public collapse(dirPath: string) {
    if (this.fileExplorerTree) {
      const node = this.findNode(dirPath, this.fileExplorerTree);
      if (!node || !isDirectoryNode(node)) return;
      if (node.entry.isExpanded && node.items !== null) {
        // no reason to cache subtree as if it was expanded, its subtree is already cached
        node.entry.isExpanded = false;
        // do I ***really*** need to set this to null?
        // when producing the entry array, I can just skip over it...
        // TODO: explore benefits of it being null
        node.items = null; 
      }
    }
  }

  public getEntryArray(): Entry[] {
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
        }
      }
    }
    return result;
  }
}
