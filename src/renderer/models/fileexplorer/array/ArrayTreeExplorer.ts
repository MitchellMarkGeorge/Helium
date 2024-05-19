import { StateModel } from "renderer/models/StateModel";
import { DirectoryEntry, Entry, FileEntry, FileExplorer } from "../types";
import { Workspace } from "renderer/models/workspace/Workspace";
import { ThemeFileSystemEntry } from "common/types";
import { isDirectory, isTextFile } from "common/utils";
import { isDirectoryEntry } from "../utils";

// NOTE: ThemeFileSytemEntry and File entry are pretty similar...

const ROOT_DEPTH = 0;

// NOTE: Due to implementation details, ArrayFileExplorer and TreeFileExplorer
// are not in behavioural parity (see the note on the expand() method) method.
// As of right now, it is better to use the TreeFileExplorer implementation
// but down the line, it would be great to move to this implementation (after some fixes)

// realistically, the only difference is that this one soed not use a cache
// UPDATE: now that it uses a sub tree cache, it ***should*** be on parity witth the TreeFileExplorer
// but there its correctness and potential side effects have not been fully identified
export class ArrayFileExplorer extends StateModel implements FileExplorer {
  private entryArray: Entry[];
  public selectedEntry: string | null;
  private expandedDirectories: Set<string>;
  private subTreeCache: Map<string, Entry[]>;
  // use a weak set?
  constructor(workspace: Workspace) {
    super(workspace);
    this.entryArray = [];
    this.selectedEntry = null;
    this.expandedDirectories = new Set<string>();
    this.subTreeCache = new Map<string, Entry[]>();
  }
  public init(files: ThemeFileSystemEntry[]): void {
    this.entryArray = this.toEntryArray(files, ROOT_DEPTH);
  }

  private toEntryArray(files: ThemeFileSystemEntry[], depth: number) {
    return files.map((entry) => this.toEntry(entry, depth));
  }

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

  public collapse(dirPath: string): void {
    const dirIndex = this.entryArray.findIndex(
      (entry) => entry.path === dirPath
    );
    if (dirIndex < 0) return;
    const dirEntry = this.entryArray[dirIndex];
    if (
      isDirectoryEntry(dirEntry) &&
      this.expandedDirectories.has(dirPath) &&
      dirEntry.isExpanded
    ) {
    const subTree = this.getDirectorySubTree(dirPath, dirIndex);

      // confirm numbers
      // does it count the first element as part of the length?
      // should validate that its a directory entry first
      dirEntry.isExpanded = false;
      this.expandedDirectories.delete(dirEntry.path);
      this.entryArray = this.removeSubtree(dirIndex + 1, subTree.length);
      // by only caching the subtree when the directory is being collapsed, all expanded child trees
      // are left intact and can be simply substited when expanded again (with expansion states intact)
      // TLDR: doing it this way makes sure that a "complete" subtree is saved with expansion states intact

      // another reason this works so well is that it also updates the cache from the previous saved sub tree
      // so if child trees are also expanded and colaped in the subtree, the latest version of the subtree will be saved automatically

      // final advantage of this approach:
      // it removes the need to have the expandedDirectories set as it was mostly used in rebuilding the sub tree
      // it ***should*** make the implementation completely reliant on the internal expanded state of the Entry object, just like TreeFileExplorer
      this.subTreeCache.set(dirPath, subTree);
    }
  }

  private getDirectorySubTree(dirPath: string, dirIndex: number) {
      let subTree: Entry[] = [];
      // using dirIndex + 1 as we want to start counting after the directory entry itself
      for (let i = dirIndex + 1; i < this.entryArray.length; i++) {
        const entry = this.entryArray[i];
        // this tests if the given entry is in the subtree of the given directory
        if (entry.path.startsWith(dirPath)) {
          subTree.push(entry)
        } else {
          // exit immediately
          break;
          // think about this
        }
      }
      return subTree;
  }

  private removeSubtree(startingIndex: number, subTreeLength: number) {
    const clone = [...this.entryArray];
    // const clone = this.entryArray.slice(); // [...this.entryArray]
    clone.splice(startingIndex, subTreeLength);
    return clone;
  }

  private insertSubtree(startingIndex: number, subTree: Entry[]) {
    const clone = [...this.entryArray];
    clone.splice(startingIndex, 0, ...subTree);
    return clone;
  }

  // the exanded paths should be provided
  private async rebuildSubTree(entry: DirectoryEntry, expandedPaths: string[]) {

    const fileEntries = await window.helium.fs.readDirectory(entry.path);
    const entries = this.toEntryArray(fileEntries, entry.depth + 1);

    const subTree = [];
    for (let i = 0; i < entries.length; i++) {
      const entry = entries[i];
      // add the entry to the array
      subTree.push(entry);
      // only problem with this is that the sub tree will not be "cleaned"
      // i.e if there are any folders that no longer exist when being expanded like this,
      // they will stay in the set
      if (isDirectoryEntry(entry) && expandedPaths.includes(entry.path)) {
        // recursively build the subtree based on their saved expandion state
        entry.isExpanded = true;
        let childTree = await this.rebuildSubTree(entry, expandedPaths);
        // insert built child tree into stubtree
        subTree.splice(i + 1, 0, ...childTree);
      }
    }
    return subTree;
  }

  // OLD:
  // the only problem is that this does not have parity with the TreeFileExplorer
  // since the TreeFileExplorer uses a cache, it will not be up to date with the file system
  // howerver, since this array version doesn't use a cache, every time a directory is collapes and expanded again,
  // the entire subtree is rebuilt with changes, leaving other parts of the subtree dout of sync
  public async expand(dirPath: string) {
    // recursively build the sub tree based on the expansion state then insert it
    const dirIndex = this.entryArray.findIndex(
      (entry) => entry.path === dirPath
    );
    const dirEntry = this.entryArray[dirIndex];
    if (dirIndex < 0) return;
    if (
      !this.expandedDirectories.has(dirPath) &&
      isDirectoryEntry(dirEntry) &&
      dirEntry.isExpanded
    ) {
      let subTree: Entry[] = []
      if (this.subTreeCache.has(dirPath)) {
        subTree = this.subTreeCache.get(dirPath) as Entry[]
      } else {
        // build the subtree (included expanded child trees)
        // subTree = await this.buildSubTree(dirPath, dirEntry.depth);
        const fileEntries = await window.helium.fs.readDirectory(dirPath);
        subTree = this.toEntryArray(fileEntries, dirEntry.depth + 1);
      }
      this.expandedDirectories.add(dirPath);
      dirEntry.isExpanded = true;
      this.entryArray = this.insertSubtree(dirIndex + 1, subTree);
    }
  }

  public getEntryArray(): Entry[] {
    return this.entryArray;
  }

  public async openFile(entry: FileEntry) {
    // should we also check if the model exists???
    // the model should ALWAYS texist if there was a tab
    // models might still be present even a tab is closed
    if (this.workspace.tabs.hasTab(entry)) {
      this.workspace.tabs.selectActiveTab(entry);
      return;
    } else {
      if (
        isTextFile(entry.fileType) &&
        !this.workspace.editor.hasEditorModel(entry)
      ) {
        // the editor will then open the file
        // reading the content from the operating system
        // and then saving the model internally
        await this.workspace.editor.openFile(entry);
      }
      this.workspace.tabs.addNewTab({ entry });
    }
  }

  public async reload() {
    if (this.workspace.theme) {
      const { path } = this.workspace.theme;
      this.expandedDirectories.clear();
      this.subTreeCache.clear();
      const rootFiles = await window.helium.fs.readDirectory(path);
      this.init(rootFiles);
    }
  }
}
