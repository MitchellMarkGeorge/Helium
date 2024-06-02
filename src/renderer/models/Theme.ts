import { ThemeInfo } from "common/types";
import { action, computed, makeObservable, observable } from "mobx";
import pathe from 'pathe';

// think about file tree
export class Theme {
  @observable public accessor path: string;
  @observable public accessor name: string | null;
  @observable public accessor version: string | null;
  @observable public accessor author: string | null;

  // for the file explorer: for now
  // this the inital state that the FileExplorer compenent wit receive
  // what happends when a a file/folder is added/deleted?????

  // inital idea was to have the FileExplorer handle all operations and keeps all local state (i.e. the file tree itself, opened files)
  // however, an issue arises when handling folder change (how do I handle that????)

  // the Theme class should not be working on the file tree
  // in an ideal world, the file tree would be completly isolated (i.e Atom)

  // looking at it now, there is no real good reason to keep the files as they are only used in the file tree.
  // tabs only exist FROM the file tree

  // After some brainstoring, I have come to a conclusion:
  // it is better for the file explorer to handle all file related things
  // and on new tab, it will pass off the ThemeFileSystemEntry object that is uses




  constructor(info: ThemeInfo) {
    this.path = info.path;
    this.name = info.name;
    this.version = info.version;
    this.author = info.author;
  }

  @computed
  public get themeName() {
    return this.name
    ? this.name
    : pathe.basename(this.path);
  }
  

  @action
  public updateFromThemeInfo(info: ThemeInfo) {
    this.path = info.path;
    this.name = info.name;
    this.version = info.version;
    this.author = info.author;
  }
}
