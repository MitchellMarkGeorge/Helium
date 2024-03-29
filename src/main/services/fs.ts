import { ThemeFileSystemEntry } from "common/types";
import { HeliumWindow } from "../models/HeliumWindow";
import ipc from "./ipc";
import { outputFile, remove, mkdir, pathExists, rename } from "fs-extra";
import fs from "fs/promises";

export function initFsService(heliumWindow: HeliumWindow) {
  // console.log(heliumWindow);
  const windowId = heliumWindow.getId();

  ipc.scopedHandle<{ path: string; encoding: BufferEncoding }>(
    windowId,
    "read-file",
    async (_, { path, encoding }) => {
      const buffer = await fs.readFile(path, { encoding });
      return buffer.toString();
    }
  );

  ipc.scopedHandle<{ path: string; content: string; encoding: BufferEncoding }>(
    windowId,
    "write-file",
    (_, { path, content, encoding }) => {
      return outputFile(path, content, { encoding });
    }
  );

  ipc.scopedHandle<string>(windowId, "delete-file", (_, path) => {
    return remove(path);
  });

  ipc.scopedHandle<string>(windowId, "create-directory", (_, path) => {
    return mkdir(path, { recursive: true });
  });

  ipc.scopedHandle<string, Promise<ThemeFileSystemEntry[]>>(windowId, "read-directory", (_, path) => {
    //handle this
    return Promise.resolve([]);
    //   return fse.mkdir(path, { recursive: true});
  });

  ipc.scopedHandle<string>(windowId, "path-exists", (_, path) => {
    //handle this
    return pathExists(path);
  });

  ipc.scopedHandle<{oldPath: string, newPath: string}>(windowId, "rename", (_, {oldPath, newPath}) => {
    //handle this
    return rename(oldPath, newPath);
  });
}
