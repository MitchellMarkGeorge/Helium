import {
  FileTypeEnum,
  InitalState,
  Language,
  PreviewState,
  ThemeFileSystemEntry,
  ThemeInfo,
} from "common/types";
import {
  NewFileOptions,
  LoadingState,
  SideBarItemOption,
  NewFolderOptions,
} from "./types";
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
};

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

  // shows loading indicator in status bar and if it is already loading,
  // it updates the loading message
  public showIsLoading(loadingMessage: string) {
    if (!this.isLoading) {
      this.loadingState = {
        isLoading: true,
        loadingMessage,
      };
    } else {
      this.loadingState.loadingMessage = loadingMessage;
    }
  }

  public updateLoadingMessage(loadingMessage: string) {
    if (this.isLoading) {
      this.loadingState.loadingMessage = loadingMessage;
    }
  }

  public get isLoading() {
    return (
      this.loadingState.isLoading && this.loadingState.loadingMessage !== null
    );
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

  private showNewFileModal(parentPath?: string) {
    // should validate if path already exists
    return this.notifications.showPathInputModal<NewFileOptions>({
      title: "New File",
      inputFields: [
        // make sure to only allow text files
        {
          label: "Name",
          for: "file",
          parentPath: parentPath || null,
          placeholder: "Enter file name",
        },
      ],
      primaryButtonText: "Create File",
      secondaryButtonText: "Cancel",
    });
  }

  private showNewFolderModal(parentPath?: string) {
    // should validate if path already exists
    return this.notifications.showPathInputModal<NewFolderOptions>({
      title: "New Folder",
      inputFields: [
        {
          label: "Name",
          for: "directory",
          parentPath: parentPath || null,
          placeholder: "Enter folder name",
        },
      ],
      primaryButtonText: "Create Folder",
      secondaryButtonText: "Cancel",
    });
  }

  private showTrashItemConfirmation(name: string, isFile: boolean) {
    // should validate if path already exists
    return this.notifications.showMessageModal({
      type: "warning",
      message: `Are you sure you want to delete ${
        isFile ? "file" : "folder"
      } ${name}`,
      primaryButtonText: "Move to Trash",
      secondaryButtonText: "Cancel",
    });
  }

  public async createNewFile(parentPath?: string) {
    const modalResponse = await this.showNewFileModal(parentPath);

    if (modalResponse.buttonClicked === "primary" && modalResponse.result) {
      const { fileName, filePath, fileType } = modalResponse.result;
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
  }

  public async trashFile(filePath: string, fileName: string) {
    const modalResponse = await this.showTrashItemConfirmation(fileName, true);

    if (modalResponse.buttonClicked === "primary") {
      await window.helium.fs.trashItem(filePath);
      const parerentDirectory = pathe.dirname(filePath);
      if (this.fileExplorer.isExpanded(parerentDirectory)) {
        await this.fileExplorer.rebuildSubTree(parerentDirectory);
      }

      if (this.tabs.hasTab(filePath)) {
        this.tabs.closeTab(filePath);
      }
      // also delete model in editor (inlcuding if it was a markdown file)
    }
  }

  public async createNewFolder(parentFolderPath: string) {
    const modalResponse = await this.showNewFolderModal(parentFolderPath);

    if (modalResponse.buttonClicked === "primary" && modalResponse.result) {
      const { folderPath } = modalResponse.result;
      await window.helium.fs.createDirectory(folderPath);
      const parerentDirectory = pathe.dirname(folderPath);
      if (this.fileExplorer.isExpanded(parerentDirectory)) {
        await this.fileExplorer.rebuildSubTree(parerentDirectory);
      }
    }
  }

  public async trashFolder(folderPath: string, folderName: string) {
    const modalResponse = await this.showTrashItemConfirmation(
      folderName,
      true
    );

    if (modalResponse.buttonClicked === "primary") {
      await window.helium.fs.trashItem(folderPath);
      const parerentDirectory = pathe.dirname(folderPath);
      if (this.fileExplorer.isExpanded(parerentDirectory)) {
        await this.fileExplorer.rebuildSubTree(parerentDirectory);
      }

      // this should also remove any open editor models or tabs that are in said directory
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
          message: `Unable to open folder: ${getErrorMessage(error)}`,
          type: "error",
          secondaryButtonText: "Close",
        });
        return;
      }

      // set values from here
      if (this.hasTheme && themeInfo) {
        this.reset();
        this.theme = new Theme(themeInfo);
        this.fileExplorer.init(files);
      }
    }
  }

  public openFile(options: OpenFileOptions) {
    const isImage = options.fileType === FileTypeEnum.IMAGE;
    if (isBinaryFile(options.fileType) && !isImage) {
      this.notifications.showMessageModal({
        type: "error",
        message: `Unable to open binary file at ${options.path}`,
        secondaryButtonText: "Close",
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
    // will only add if not in set
    this.unsavedPaths.add(path);
  }

  public markAsSaved(path: string) {
    // will only delete if in set
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

  public reset() {
    this.fileExplorer.reset();
    this.tabs.reset();
    this.editor.reset();
    this.notifications.reset();
    if (this.isLoading) {
      this.resetLoadingState();
    }
  }
}
