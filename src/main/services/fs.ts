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

export function initFsService(heliumWindow: HeliumWindow) {
  // console.log(heliumWindow);
  const windowId = heliumWindow.getId();

  ipc.scopedHandle<{ filePath: string; encoding: BufferEncoding }>(
    windowId,
    "read-file",
    async (_, { filePath, encoding }) => {
      const buffer = await fs.readFile(filePath, { encoding });
      return buffer.toString();
    }
  );

  ipc.scopedHandle<{
    filePath: string;
    content: string;
    encoding: BufferEncoding;
  }>(windowId, "write-file", async (_, { filePath, content, encoding }) => {
    const parentDirectory = path.dirname(filePath);
    if (!(await pathExists(parentDirectory))) {
      await fs.mkdir(parentDirectory, { recursive: true });
    }
    return fs.writeFile(filePath, content, { encoding });
  });

  ipc.scopedHandle<string>(windowId, "delete-file", (_, path) => {
    return fs.rm(path);
  });

  ipc.scopedHandle<string>(windowId, "delete-directory", (_, path) => {
    return fs.rm(path, { force: true, recursive: true });
  });

  ipc.scopedHandle<string>(windowId, "create-directory", (_, path) => {
    return fs.mkdir(path, { recursive: true });
  });

  // for now
  ipc.scopedHandle<string, Promise<ThemeFileSystemEntry[]>>(
    windowId,
    "read-directory",
    (_, path) => {
      //handle this
      return Promise.resolve([]);
      //   return fse.mkdir(path, { recursive: true});
    }
  );

  ipc.scopedHandle<string>(windowId, "path-exists", (_, path) => {
    //handle this
    return pathExists(path);
  });

  ipc.scopedHandle<{ oldPath: string; newPath: string }>(
    windowId,
    "rename",
    (_, { oldPath, newPath }) => {
      //handle this
      return fs.rename(oldPath, newPath);
    }
  );
}
