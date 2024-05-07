import { ThemeFileSystemEntry, ThemeInfo } from "common/types";
import pathe from 'pathe';

// think about file tree
export class Theme {
  public path: string;
  public name: string | null;
  public version: string | null;
  public author: string | null;

  private files: Map<string, ThemeFileSystemEntry>;
  // for the file explorer: for now
  // this the inital state that the FileExplorer compenent wit receive
  // what happends when a a file/folder is added/deleted?????

  // inital idea was to have the FileExplorer handle all operations and keeps all local state (i.e. the file tree itself, opened files)
  // however, an issue arises when handling folder change (how do I handle that????)

  // the Theme class should not be working on the file tree
  // in an ideal world, the file tree would be completly isolated (i.e Atom)

  // looking at it now, there is no real good reason to keep the files as they are only used in the file tree.
  // tabs only exist FROM the file tree

  // After some brainstoring, I have come to a conclusion:
  // it is better for the file explorer to handle all file related things
  // and on new tab, it will pass off the ThemeFileSystemEntry object that is uses

  // one thing: for this to work, the file tree state cant live in the component since it will be unmounted when another side panel is used
    private rootFilePaths: string[];



  constructor(info: ThemeInfo) {
    this.path = info.path;
    this.name = info.name;
    this.version = info.version;
    this.author = info.author;
    // for now
    this.files = new Map<string, ThemeFileSystemEntry>();
    this.rootFilePaths = [];
    // this.rootFilePaths = files.map((entry) => entry.path);
  }

  public getThemeName() {
    return this.name
    ? this.name
    : pathe.basename(this.path);
  }

  public updateFromThemeInfo(info: ThemeInfo) {
    this.path = info.path;
    this.name = info.name;
    this.version = info.version;
    this.author = info.author;
  }

  public addFileEntries(files: ThemeFileSystemEntry[]) {
    for (let i = 0; i < files.length; i++) {
      const entry = files[i];
      // if there is an entry with that path already throw an error
      if (this.files.has(entry.path)) throw new Error('File entry already exists');
      // or should I just skip it????Kj
      this.files.set(entry.path, entry);
    }
  }


  public getFileEntry(path: string) {
    if (!this.files.has(path)) {
      throw new Error();
    }
    return this.files.get(path) as ThemeFileSystemEntry;
  }

  public deleteEntry(path: string) {
    if (!this.files.has(path)) {
      throw new Error();
    }

    this.files.delete(path);
  }

  public updateFileEntry(
    path: string,
    updates: Partial<Omit<ThemeFileSystemEntry, "path">>
  ) {
    if (!this.files.has(path)) {
      throw new Error();
    }

    const entry = this.files.get(path) as ThemeFileSystemEntry;

    // should we be creating a new object
    this.files.set(path, { ...entry, ...updates });
    // this.entries.set(path, Object.assign(entry, updates));
  }

}
