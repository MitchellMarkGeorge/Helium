import { ThemeFileSystemEntry, ThemeInfo } from "common/types";

// think about file tree
export class Theme {
  public path: string;
  public name: string | null;
  public version: string | null;
  public author: string | null;

  private files: Map<string, ThemeFileSystemEntry>;
  // for the file tree: for now
  private filePaths: string[];


  constructor(info: ThemeInfo, files: ThemeFileSystemEntry[]) {
    this.path = info.path;
    this.name = info.name;
    this.version = info.version;
    this.author = info.author;
    this.files = new Map<string, ThemeFileSystemEntry>(files.map(entry => [entry.path, entry]));
    this.filePaths = files.map((entry) => entry.path);
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
