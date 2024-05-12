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
export class ArrayFileExplorer extends StateModel implements FileExplorer {
  private entryArray: Entry[];
  public selectedEntry: string | null;
  private expandedDirectories: Set<string>;
  // use a weak set?
  constructor(workspace: Workspace) {
    super(workspace);
    this.entryArray = [];
    this.selectedEntry = null;
    this.expandedDirectories = new Set<string>();
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
  collapse(dirPath: string): void {
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
      let subTreeLength = 0;
      // using dirIndex + 1 as we want to start counting after the directory entry itself
      for (let i = dirIndex + 1; i < this.entryArray.length; i++) {
        const entry = this.entryArray[i];
        // this tests if the given entry is in the subtree of the given directory
        if (entry.path.startsWith(dirPath)) {
          subTreeLength += 1;
        } else {
          // exit immediately
          break;
          // think about this
        }
      }

      // confirm numbers
      // does it count the first element as part of the length?
      // should validate that its a directory entry first
      dirEntry.isExpanded = false;
      this.expandedDirectories.delete(dirEntry.path);
      this.entryArray = this.removeSubtree(dirIndex + 1, subTreeLength);
    }
  }

  private removeSubtree(startingIndex: number, subTreeLength: number) {
    const clone = this.entryArray.slice(); // [...this.entryArray]
    clone.splice(startingIndex, subTreeLength);
    return clone;
  }
  private insertSubtree(startingIndex: number, subTree: Entry[]) {
    const clone = [...this.entryArray];
    clone.splice(startingIndex, 0, ...subTree);
    return clone;
  }

  private async buildSubTree(dirPath: string, depth: number) {
    const fileEntries = await window.helium.fs.readDirectory(dirPath);
    const entries = this.toEntryArray(fileEntries, depth);

    const subTree = [];
    for (let i = 0; i < entries.length; i++) {
      const entry = entries[i];
      // add the entry to the array
      subTree.push(entry);
      // only problem with this is that the sub tree will not be "cleaned"
      // i.e if there are any folders that no longer exist when being expanded like this,
      // they will stay in the set
      if (isDirectoryEntry(entry) && this.expandedDirectories.has(entry.path)) {
        // recursively build the subtree based on their saved expandion state
        entry.isExpanded = true;
        let childTree = await this.buildSubTree(entry.path, entry.depth + 1);
        // insert built child tree into stubtree
        subTree.splice(i + 1, 0, ...childTree);
      }
    }
    return subTree;
  }

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
      // build the subtree (included expanded child trees)
      const subTree = await this.buildSubTree(dirPath, dirEntry.depth);
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
      const rootFiles = await window.helium.fs.readDirectory(path);
      this.init(rootFiles);
    }
  }
}
