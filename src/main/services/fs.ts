import { FileType, ThemeFileSystemEntry } from "common/types";
import fs from "fs/promises";
import path from "path";
import main from "./ipc/main";
import { isJunk } from "junk";
import filetypeService from "./filetype";

// THINK ABOUT GRACEFUL-FS!!!!!!!
// FS-EXTRA

function pathExists(path: string) {
  return fs
    .access(path)
    .then(() => true)
    .catch(() => false);
}
async function readFile(filePath: string) {
  const buffer = await fs.readFile(filePath, { encoding: "utf8" });
  return buffer.toString();
}

// this method is responsible for reading a path and doing a bunch of processing to return a usable array of file entries
async function readDirectory(dirPath: string): Promise<ThemeFileSystemEntry[]> {
  // needs to be absolute/normalized
  // as of right now, we only work with absolute paths so there is no need to normalize it
  // if (!path.isAbsolute(dirPath)) {
  //   dirPath = path.resolve(dirPath);
  // }
  // check if path exists
  // make sure the path is a directory
  if (!(await pathExists(dirPath)))
    throw new Error(`${dirPath} does not exist`);
  const stats = await fs.lstat(dirPath); // how do I want to handle symlinks???
  // const stats = await fs.stat(path); // how do I want to handle symlinks???
  if (!stats.isDirectory()) throw new Error(`${dirPath} is not a directory`);
  const fileEntries = await fs.readdir(dirPath, { withFileTypes: true, encoding: 'utf8' }); // use with file types??
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
    // entry.path
    const fullPath = path.join(dirPath, entry.name); // use path.resolve()???
    result.push({
      basename: entry.name,
      isDirectory: entry.isDirectory(),
      isFile: entry.isFile(),
      fileType: entry.isFile() ? filetypeService.detect(fullPath) : null,
      path: fullPath,
    });
  }

  return result.sort((a, b) => a.basename.localeCompare(b.basename));
}

export function initFsPreloadApi() {
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
      return readDirectory(path);
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

  // what case will I have to do this in the renderer
  main.handle<string>("watch-directory", (heliumWindow, dirPath) => {
    heliumWindow.directoryWatcher.watch(dirPath);
  });

  main.handle<string>("stop-watching-directory", (heliumWindow, dirPath) => {
    heliumWindow.directoryWatcher.stopWatching(dirPath);
  });
}

export default {
  pathExists,
  readDirectory,
  readFile,
};
