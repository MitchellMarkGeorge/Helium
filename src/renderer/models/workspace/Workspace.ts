import {
  FileTypeEnum,
  InitalState,
  Language,
  PreviewState,
  ThemeFileSystemEntry,
  ThemeInfo,
} from "common/types";
import { CreateNewFileOptions, LoadingState, SideBarItemOption } from "./types";
import { Notifications } from "../notification/Notifications";
import { Theme } from "../Theme";
import { getErrorMessage, isBinaryFile } from "common/utils";
import pathe from "pathe";
import { TreeFileExplorer } from "../fileexplorer/tree/TreeFileExplorer";
import { FileExplorer } from "../fileexplorer/types";
import { TabManager } from "../tabs/TabManager";
import { Editor } from "../editor/Editor";
import { OpenFileOptions } from "../editor/types";

// NOTE
// WHEN READING FILES, I NEED A WAY TO SHOW A PROGRESSBAR IF IT TAKES TOO LONG

const DEFAULT_LOADING_STATE: LoadingState = {
  isLoading: false,
  loadingMessage: null,
}

export class Workspace {
  //   public currentFilePath: string | null;
  public previewState: PreviewState; // should this be null by default (since no state has been given)
  private isShowingWorkspace: boolean;
  public selectedSideBarOption: SideBarItemOption | null;
  public isSidePanelOpen: boolean;
  public readonly notifications: Notifications;
  public theme: Theme | null;
  private loadingState: LoadingState;
  // NOTE: Due to implementation details, ArrayFileExplorer and TreeFileExplorer
  // are not in behavioural parity (see the note on the ArrayFileExplorer.expand() method) method.
  // As of right now, it is better to use the TreeFileExplorer implementation
  // but down the line, it would be great to move to this implementation (after some fixes)
  public fileExplorer: FileExplorer;
  public tabs: TabManager;
  // public editor: Editor;
  public editor: Editor;
  private unsavedPaths: Set<string>;

  // STILL NEED TO HANDLE FILE STATUSES
  constructor() {
    // NEED A CLASS TO TRACK TAB/EDITOR STATUS
    this.isShowingWorkspace = false;
    // this.currentFilePath = null;
    this.selectedSideBarOption = null;
    this.previewState = PreviewState.OFF; // by default
    this.isSidePanelOpen = false;

    this.notifications = new Notifications(this);
    this.fileExplorer = new TreeFileExplorer(this);
    this.tabs = new TabManager(this);
    this.editor = new Editor(this);
    // this.editor = new Editor(this);
    this.theme = null;
    this.unsavedPaths = new Set<string>();
    this.loadingState = DEFAULT_LOADING_STATE;
  }

  public initFromInitalState({
    themeFiles,
    currentTheme: themInfo,
    connectedStore,
    previewState,
  }: InitalState) {
    // check isReadyToShowWorkspace???
    // this is like a second constructor
    // could also be async
    if (this.theme) throw new Error();
    if (themInfo) {
      this.theme = new Theme(themInfo);
      this.fileExplorer.init(themeFiles);
    }

    if (connectedStore) {
      // preview state is only possible if there is a stoer
      this.previewState = previewState;
    }
    this.isShowingWorkspace = true;
    window.helium.app.sendWorkspaceIsShowing();
    // window.helium.app.sendReadyToShowWorkspace();
  }

  public updateLoadingState(state: LoadingState) {
    this.loadingState = state;
  }

  public get isLoading() {
    return this.loadingState.isLoading && this.loadingState.loadingMessage !== null;
  }

  public resetLoadingState() {
    this.loadingState = DEFAULT_LOADING_STATE;
  }

  public setTheme(theme: Theme) {
    this.theme = theme;
  }

  public get windowTitle(): string {
    // dependednt on current theme name
    // add an effect that whenever the windowTitle changes, set it at the electron level
    if (this.theme) {
      return this.theme.getThemeName();
    } else {
      return window.helium.constants.DEFAULT_WINOW_TITLE;
    }
  }

  public showNewFileDialog(parentPath?: string) {
    // should validate if path already exists
    this.notifications.showPathInputModal({
      title: "New File",
      // might be better to use an object...
      inputFields: [
        {
          label: "Name",
          for: "file",
          parentPath: parentPath || null,
          placeholder: "Enter file name",
        },
      ],
      buttons: [
        {
          text: "Cancel",
        },
        {
          text: "Create File",
          onClick: (inputs) => {
            // should it be a map instead???
            console.log(inputs);
            if (inputs?.filePath && inputs.fileType && inputs.fileName) {
              // this.createNewFile(inputs.filePath, inputs.fileType as Language);
              this.createNewFile({
                fileName: inputs.fileName,
                filePath: inputs.filePath,
                fileType: inputs.fileType as Language,
              });
            }
          },
        },
      ],
    });
  }

  public showNewFolderDialog(parentPath?: string) {
    // should validate if path already exists
    this.notifications.showPathInputModal({
      title: "New Folder",
      // might be better to use an object...
      inputFields: [
        {
          label: "Name",
          for: "directory",
          parentPath: parentPath || null,
          placeholder: "Enter directory name",
        },
      ],
      buttons: [
        {
          text: "Cancel",
        },
        {
          text: "Create Folder",
          onClick: (inputs) => {
            console.log(inputs);
            if (inputs?.folderPath) {
              this.createNewFolder(inputs.folderPath);
            }
          },
        },
      ],
    });
  }

  public async createNewFile({
    fileName,
    filePath,
    fileType,
  }: CreateNewFileOptions) {
    await window.helium.fs.createFile(filePath);
    const parerentDirectory = pathe.dirname(filePath);
    if (this.fileExplorer.isExpanded(parerentDirectory)) {
      await this.fileExplorer.rebuildSubTree(parerentDirectory);
    }

    this.tabs.addTab({
      tab: {
        path: filePath,
        fileType,
        basename: fileName,
      },
    });
  }

  public async deleteFile(filePath: string) {
    await window.helium.fs.deleteFile(filePath);
    const parerentDirectory = pathe.dirname(filePath);
    if (this.fileExplorer.isExpanded(parerentDirectory)) {
      await this.fileExplorer.rebuildSubTree(parerentDirectory);
    }

    if (this.tabs.hasTab(filePath)) {
      this.tabs.closeTab(filePath);
    }
    // also delete model in editor (inlcuding if it was a markdown file)
  }

  public async createNewFolder(folderPath: string) {
    await window.helium.fs.createDirectory(folderPath);
    const parerentDirectory = pathe.dirname(folderPath);
    if (this.fileExplorer.isExpanded(parerentDirectory)) {
      await this.fileExplorer.rebuildSubTree(parerentDirectory);
    }
  }

  public async deleteFolder(directoryPath: string) {
    await window.helium.fs.de(filePath);
    const parerentDirectory = pathe.dirname(filePath);
    if (this.fileExplorer.isExpanded(parerentDirectory)) {
      await this.fileExplorer.rebuildSubTree(parerentDirectory);
    }

    if (this.tabs.hasTab(filePath)) {
      this.tabs.closeTab(filePath);
    }
  }

  // will become flow
  public async openThemeFromDialog() {
    // check if there is already a theme open
    // if there is, clear everything
    // this should not fail
    const [themePath] = await window.helium.app.openFolderDialog();
    if (themePath) {
      let themeInfo: ThemeInfo | null = null;
      let files: ThemeFileSystemEntry[] = [];
      try {
        const results = await window.helium.shopify.openTheme(themePath);
        themeInfo = results.themeInfo;
        files = results.files;
      } catch (error) {
        this.notifications.showMessageModal({
          message: getErrorMessage(error),
          type: "error",
          buttons: { text: "Close" },
        });
        return;
      }

      if (this.hasTheme) {
        // clean up
        // this  removing all
        // this.theme.cleanup();
        this.fileExplorer.cleanup();
        this.tabs.cleanup();
        this.editor.cleanup();
        this.notifications.cleanup();
      }
      // set values from here
      if (themeInfo) {
        this.theme = new Theme(themeInfo);
        this.fileExplorer.init(files);
      }
    }
  }

  public openFile(options: OpenFileOptions) {
    const isImage = options.fileType === FileTypeEnum.IMAGE;
    if (isBinaryFile(options.fileType) && !isImage) {
      this.notifications.showNotification({
        type: "error",
        message: `Unable to open binary file at ${options.path}`,
      });
      return;
    }

    if (this.tabs.hasTab(options.path)) {
      this.tabs.selectTab(options.path);
    } else {
      const tab = {
        basename: options.basename || pathe.basename(options.path),
        fileType: options.fileType,
        path: options.path,
      };
      this.tabs.addTab({ tab });
      // this.workspace.tabs.selectActiveTab(entry);
      // the editor will then open the file
      // reading the content from the operating system
      // and then saving the model internally
      // await this.workspace.editor.openFile(entry);
      // await this.workspace.editor.openFile(entry.path);
    }
  }

  public async saveCurrentFile() {
    const activeTab = this.tabs.getActiveTab();
    const currentEditorValue = this.editor.codeEditor.getEditorValue();
    if (activeTab && this.isFileUnsaved(activeTab.path) && currentEditorValue) {
      await window.helium.fs.writeFile({
        filePath: activeTab.path,
        content: currentEditorValue,
        encoding: "utf8",
      });
      this.markAsSaved(activeTab.path);
    }
  }

  public markAsUnsaved(path: string) {
      this.unsavedPaths.add(path);
  }

  public markAsSaved(path: string) {
    this.unsavedPaths.delete(path);
  }

  public isFileUnsaved(path: string) {
    return this.unsavedPaths.has(path);
  }

  public get shouldShowWorkspace() {
    return this.isShowingWorkspace;
  }

  public get hasTheme() {
    return this.theme !== null;
  }

  public get isWorkspaceUnsaved() {
    return this.unsavedPaths.size >= 1;
  }

  public setShowWorkspace(showWorkspace: boolean) {
    this.isShowingWorkspace = showWorkspace;
  }

  public toggleSidePanel() {
    this.isSidePanelOpen = !this.isSidePanelOpen;
  }

  public selectSideBarOption(option: SideBarItemOption) {
    this.selectedSideBarOption = option;
  }
}
