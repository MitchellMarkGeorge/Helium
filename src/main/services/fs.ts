import { FileType, ThemeFileSystemEntry } from "common/types";
import fs from "fs/promises";
import path from "path";
import main from "./ipc/main";
import { isJunk } from "junk";

// THINK ABOUT GRACEFUL-FS!!!!!!!
// FS-EXTRA

export class FsService {

public static pathExists  (path: string) {
  return fs
    .access(path)
    .then(() => true)
    .catch(() => false);
} 
  public static async readFile(filePath: string) {
    const buffer = await fs.readFile(filePath, { encoding: "utf8" });
    return buffer.toString();
  }

  public static detectFileType(name: string): FileType {
  // handle special names name (eg: .prettier.rc)
  if (name === ".eslintrc" || name === ".prettierrc") return FileType.JSON;
  // if (name === '.eslintignore' || name === '.prettierignore') return FileType.PLAIN;
  const extension = path.extname(name);
  switch (extension) {
    case ".liquid":
      return FileType.LIQUID;
    case ".md":
    case ".markdown":
    case ".mkd":
      return FileType.MARKDOWN;
    case ".yaml":
    case ".yml":
      return FileType.YAML;
    case ".toml":
      return FileType.TOML;
    case ".json":
    case ".json5":
      return FileType.JSON;
    case ".js":
    case ".cjs":
    case ".mjs":
      return FileType.JAVASCRIPT;
    case ".ts":
      return FileType.TYPESCRIPT;
    case ".css":
      return FileType.CSS;
    case ".scss":
    case ".sass":
      return FileType.SASS;
    case ".less":
      return FileType.LESS;
    case ".html":
    case ".htm":
      return FileType.HTML;
    default:
      return FileType.PLAIN_TEXT;
  }

  }

// this method is responsible for reading a path and doing a bunch of processing to return a usable array of file entries
  public static async readDirectory(dirPath: string): Promise<ThemeFileSystemEntry[]> {
  // think about this
  if (!path.isAbsolute(dirPath)) {
    dirPath = path.resolve(dirPath);
  }
  // check if path exists
  // make sure the path is a directory
  if (!(await this.pathExists(dirPath)))
    throw new Error(`${dirPath} does not exist`);
  const stats = await fs.lstat(dirPath); // how do I want to handle symlinks???
  // const stats = await fs.stat(path); // how do I want to handle symlinks???
  if (!stats.isDirectory()) throw new Error(`${dirPath} is not a directory`);
  const fileEntries = await fs.readdir(dirPath, { withFileTypes: true }); // use with file types??
  // should filter it out to only folders and directories (what about symlinks??)

  const result: ThemeFileSystemEntry[] = [];

  for (let i = 0; i < fileEntries.length; i++) {
    const entry = fileEntries[i];
    if (!entry.isDirectory() && !entry.isFile()) continue;
    if (isJunk(entry.name)) continue;

    if (entry.isSymbolicLink())
      throw new Error(
        `${path.join(dirPath, entry.name)} symbolic links not supported`
      );
    // how to handle symlinks
    // this should be dependent on how shopify handles them
    // my guess is that symlinks cant be handled so it rejects them
    //1. ignore them completly (I don't like this as ther is a reason why it is symlinked)
    // 2. "resolve" them and if it is "dangling", ignore it
    result.push({
      basename: entry.name,
      isDirectory: entry.isDirectory(),
      isFile: entry.isFile(),
      fileType: entry.isFile() ? this.detectFileType(entry.name) : null,
      path: path.join(dirPath, entry.name), // use path.resolve()
    });
  }

  return result.sort((a, b) => a.basename.localeCompare(b.basename));

  }

}



export class FsPreloadApi{
  public static init() {
    main.handle<{ filePath: string; encoding: BufferEncoding }>(
      "read-file",
      async (_, { filePath, encoding }) => {
        // TODO: change this to atomic writes https://www.npmjs.com/package/write-file-atomic
        const buffer = await fs.readFile(filePath, { encoding });
        return buffer.toString();
      }
    );

    main.handle<{
      filePath: string;
      content: string;
      encoding: BufferEncoding;
    }>("write-file", async (_, { filePath, content, encoding }) => {
      const parentDirectory = path.dirname(filePath);
      if (!(await FsService.pathExists(parentDirectory))) {
        await fs.mkdir(parentDirectory, { recursive: true });
      }
      return fs.writeFile(filePath, content, { encoding });
    });

    main.handle<string>("delete-file", (_, path) => {
      return fs.rm(path);
    });

    main.handle<string>("delete-directory", (_, path) => {
      return fs.rm(path, { force: true, recursive: true });
    });

    main.handle<string>("create-directory", (_, path) => {
      return fs.mkdir(path, { recursive: true });
    });

    // for now
    main.handle<string, Promise<ThemeFileSystemEntry[]>>(
      "read-directory",
      (_, path) => {
        console.log(path);
        //handle this
        return Promise.resolve([]);
        //   return fse.mkdir(path, { recursive: true});
      }
    );

    main.handle<string>("path-exists", (_, path) => {
      //handle this
      return FsService.pathExists(path);
    });

    main.handle<{ oldPath: string; newPath: string }>(
      "rename",
      (_, { oldPath, newPath }) => {
        //handle this
        return fs.rename(oldPath, newPath);
      }
    );
  }
}
