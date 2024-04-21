import { FSWatcher } from "chokidar";
import { HeliumWindow } from "../HeliumWindow";

export abstract class Watcher {
  protected fsWatchers: Map<string, FSWatcher>;
  constructor(protected heliumWindow: HeliumWindow) {
    this.fsWatchers = new Map<string, FSWatcher>();
  }

  public isWatching(path: string) {
    return this.fsWatchers.has(path);
  }

  public stopWatching(path: string) {
    if (!this.isWatching(path)) {
      throw new Error(`There is no path ${path} being watched`);
    }

    let watcher = this.fsWatchers.get(path) as FSWatcher;

    // need to confirm which method to use
    watcher.close(); // set to null????
    // watcher.unwatch(dirPath);

    // need to make sure that the watcher is garbage collected
    this.fsWatchers.delete(path);
  }

  public removeAllWatchers() {
    // might be async
    for (const watcher of this.fsWatchers.values()) {
      // am I sure that this is garbage collected
      watcher.close();
    }
    this.fsWatchers.clear();
    // am I sure that this is garbage collected
  }

  public abstract watch(path: string): void;
}
