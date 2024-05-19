import { watch } from "chokidar";
import { Watcher } from "./Watcher";
import path from "path";
import { isJunk } from "junk";
import { ThemeDirectoryChange } from "common/types";

export class DirectoryWatcher extends Watcher {

  public watch(dirPath: string): void {
    if (this.fsWatchers.has(dirPath)) {
      throw new Error(`${dirPath} already has watcher attached`);
    }
    const watcher = watch(dirPath, {
      // LOOK INTO ALL OPTIONS
      // should generally ignore junk files 
      ignored: (testPath) => {
        const fileName = path.basename(testPath);
        return isJunk(fileName); // should just be file name
      },
      followSymlinks: false,
      depth: 1 // confirm this
    });

    const onDirectoryChange = () => {
      const change: ThemeDirectoryChange = {
        changedDirectory: dirPath,
      };
      this.heliumWindow.emitEvent("on-directory-change", change);
    };

    // child directory has been added
    watcher.on("addDir", onDirectoryChange);
    // child file has been added
    watcher.on("add", onDirectoryChange);
    // child file has been deleted
    watcher.on("unkink", onDirectoryChange);
    // child directory has been deleted
    watcher.on("unlinkDir", onDirectoryChange);

    this.fsWatchers.set(dirPath, watcher);
  }
}
