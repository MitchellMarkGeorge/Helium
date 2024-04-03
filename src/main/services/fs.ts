import { ThemeFileSystemEntry } from "common/types";
import fs from "fs/promises";
import path from "path";
import main from "./ipc/main";

// THINK ABOUT GRACEFUL-FS!!!!!!!
// FS-EXTRA

const pathExists = (path: string) =>
  fs
    .access(path)
    .then(() => true)
    .catch(() => false);

// this method is responsible for reading a path and doing a bunch of processing to return a usable array of file entries
export const readDirectory = async (path: string): Promise<ThemeFileSystemEntry[]> => {
  // check if path exists
  // make sure the path is a directory
  if (!await pathExists(path)) throw new Error(`${path} does not exist`);
  const stats = await fs.lstat(path); // how do I want to handle symlinks???
  // const stats = await fs.stat(path); // how do I want to handle symlinks???
  if (!stats.isDirectory()) throw new Error(`${path} is not a directory`);
  const fileEntries = await fs.readdir(path, { withFileTypes: true }) // use with file types?? // what kind of performance implications does this have???
  // otherwise, wil would have to do Promise.all(fileEntries.map(name => fs.lstat(path.join(path, name))))


}

export function initFsService() {
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
    if (!(await pathExists(parentDirectory))) {
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
    return pathExists(path);
  });

  main.handle<{ oldPath: string; newPath: string }>(
    "rename",
    (_, { oldPath, newPath }) => {
      //handle this
      return fs.rename(oldPath, newPath);
    }
  );
}
