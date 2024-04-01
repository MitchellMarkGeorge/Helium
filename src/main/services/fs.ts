import { ThemeFileSystemEntry } from "common/types";
import fs from "fs/promises";
import path from "path";
import main from "./ipc/main";

const pathExists = (path: string) =>
  fs
    .access(path)
    .then(() => true)
    .catch(() => false);

export function initFsService() {
  main.handle<{ filePath: string; encoding: BufferEncoding }>(
    "read-file",
    async (_, { filePath, encoding }) => {
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
