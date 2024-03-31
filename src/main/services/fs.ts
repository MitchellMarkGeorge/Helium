import { ThemeFileSystemEntry } from "common/types";
import { HeliumWindow } from "../models/HeliumWindow";
import ipc from "./ipc";
import fs from "fs/promises";
import path from "path";

const pathExists = (path: string) =>
  fs
    .access(path)
    .then(() => true)
    .catch(() => false);

export function initFsService() {

  ipc.handle<{ filePath: string; encoding: BufferEncoding }>(
    "read-file",
    async (_, { filePath, encoding }) => {
      const buffer = await fs.readFile(filePath, { encoding });
      return buffer.toString();
    }
  );

  ipc.handle<{
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

  ipc.handle<string>("delete-file", (_, path) => {
    return fs.rm(path);
  });

  ipc.handle<string>("delete-directory", (_, path) => {
    return fs.rm(path, { force: true, recursive: true });
  });

  ipc.handle<string>("create-directory", (_, path) => {
    return fs.mkdir(path, { recursive: true });
  });

  // for now
  ipc.handle<string, Promise<ThemeFileSystemEntry[]>>(
    "read-directory",
    (_, path) => {
      //handle this
      return Promise.resolve([]);
      //   return fse.mkdir(path, { recursive: true});
    }
  );

  ipc.handle<string>("path-exists", (_, path) => {
    //handle this
    return pathExists(path);
  });

  ipc.handle<{ oldPath: string; newPath: string }>(
    "rename",
    (_, { oldPath, newPath }) => {
      //handle this
      return fs.rename(oldPath, newPath);
    }
  );
}
