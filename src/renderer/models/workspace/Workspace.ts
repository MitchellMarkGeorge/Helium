import { InitalState, ThemeFileSystemEntry, ThemeInfo } from "common/types";
import {
  NewFileModalOptions,
  LoadingState,
  SideBarItemOption,
  NewFolderModalOptions,
  ConnectStoreModalOptions,
} from "./types";
import { Notifications } from "../notification/Notifications";
import { Theme } from "../Theme";
import { getErrorMessage } from "common/utils";
import pathe from "pathe";
import { TreeFileExplorer } from "../fileexplorer/tree/TreeFileExplorer";
import { FileExplorer } from "../fileexplorer/types";
import { Editor } from "../editor/Editor";
import { OpenFileOptions } from "../editor/types";
import { ThemePreview } from "../ThemePreview";
import { Store } from "../Store";
import { action, computed, flow, observable } from "mobx";

// NOTE
// WHEN READING FILES, I NEED A WAY TO SHOW A PROGRESSBAR IF IT TAKES TOO LONG

const DEFAULT_LOADING_STATE: LoadingState = {
  isLoading: false,
  loadingMessage: null,
};

export class Workspace {
  //   public currentFilePath: string | null;
  @observable public accessor isShowingWorkspace: boolean;
  @observable public accessor activeSideBarOption: SideBarItemOption;
  @observable public accessor isSidePanelOpen: boolean;
  @observable public accessor theme: Theme | null;
  @observable public accessor connectedStore: Store | null;
  @observable private accessor loadingState: LoadingState;
  @observable private accessor unsavedPaths: Set<string>; // think about decorator

  // NOTE: Due to implementation details, ArrayFileExplorer and TreeFileExplorer
  // are not in behavioural parity (see the note on the ArrayFileExplorer.expand() method) method.
  // As of right now, it is better to use the TreeFileExplorer implementation
  // but down the line, it would be great to move to this implementation (after some fixes)
  public notifications: Notifications;
  public fileExplorer: FileExplorer;
  public editor: Editor;
  public themePreview: ThemePreview;

  // STILL NEED TO HANDLE FILE STATUSES
  constructor() {
    // NEED A CLASS TO TRACK TAB/EDITOR STATUS
    this.isShowingWorkspace = false;
    // this.currentFilePath = null;
    // default option
    this.activeSideBarOption = SideBarItemOption.FILES;
    this.isSidePanelOpen = false;

    this.notifications = new Notifications(this);
    this.fileExplorer = new TreeFileExplorer(this);
    // this.tabs = new TabManager(this);
    this.editor = new Editor(this);
    this.themePreview = new ThemePreview(this);

    this.theme = null;
    this.connectedStore = null;
    // think about this
    this.unsavedPaths = new Set<string>();
    // this.unsavedPaths = observable.set<string>();
    this.loadingState = DEFAULT_LOADING_STATE;
  }

  // set values using loadInitalState()
  // if there is an error loading the inital state, show an error
  // and initalize it with default values
  @action
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
      this.connectedStore = new Store({
        storeName: connectedStore.name,
        storeUrl: connectedStore.url,
      });
      this.themePreview.updatePreviewState(previewState);
    }
    this.isShowingWorkspace = true;
    window.helium.app.sendWorkspaceIsShowing();
    // window.helium.app.sendReadyToShowWorkspace();
  }

  // shows loading indicator in status bar and if it is already loading,
  // it updates the loading message
  @action
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

  @action
  public updateLoadingMessage(loadingMessage: string) {
    if (this.isLoading) {
      this.loadingState.loadingMessage = loadingMessage;
    }
  }

  @computed
  public get isLoading() {
    return (
      this.loadingState.isLoading && this.loadingState.loadingMessage !== null
    );
  }

  @action
  public resetLoadingState() {
    this.loadingState = DEFAULT_LOADING_STATE;
  }

  @action
  public setTheme(theme: Theme) {
    this.theme = theme;
  }

  @computed
  public get windowTitle(): string {
    // dependednt on current theme name
    // add an effect that whenever the windowTitle changes, set it at the electron level
    if (this.theme) {
      return this.theme.themeName;
    } else {
      return window.helium.constants.DEFAULT_WINOW_TITLE;
    }
  }

  @action
  private showNewFileModal(parentPath?: string) {
    // should validate if path already exists
    return this.notifications.showPathInputModal<NewFileModalOptions>({
      title: "New File",
      inputFields: {
        newPathInput: {
          label: "Name",
          for: "file",
          parentPath: parentPath || null,
          placeholder: "Enter file name",
        },
      },
      primaryButtonText: "Create File",
      secondaryButtonText: "Cancel",
    });
  }

  @action
  private showConnectStoreModal() {
    // should validate if path already exists
    return this.notifications.showInputModal<ConnectStoreModalOptions>({
      title: "Connect Store",
      inputFields: {
        storeNameInput: {
          label: "Store Name",
          placeholder: "Enter store name",
        },
        storeUrlInput: {
          label: "Store URL",
          placeholder: "Enter Shopify store URL",
        },
        themeAccessPasswordInput: {
          label: "Theme Access Passwaord",
          placeholder: "Enter Theme Access Password",
        },
      },
      primaryButtonText: "Connect",
      secondaryButtonText: "Cancel",
    });
  }

  @action
  private showNewFolderModal(parentPath?: string) {
    // should validate if path already exists
    return this.notifications.showPathInputModal<NewFolderModalOptions>({
      title: "New Folder",
      inputFields: {
        newFolderInput: {
          label: "Name",
          for: "directory",
          parentPath: parentPath || null,
          placeholder: "Enter folder name",
        },
      },
      primaryButtonText: "Create Folder",
      secondaryButtonText: "Cancel",
    });
  }

  @action
  private showTrashItemConfirmation(name: string, isFile: boolean) {
    // should validate if path already exists
    return this.notifications.showMessageModal({
      type: "warning",
      message: `Are you sure you want to delete ${
        isFile ? "file" : "folder"
      } ${name}?`,
      primaryButtonText: "Move to Trash",
      secondaryButtonText: "Cancel",
    });
  }

  @action
  private showDisconnectStoreConfirmation() {
    // should validate if path already exists
    return this.notifications.showMessageModal({
      type: "warning",
      message: `Are you sure you want to disconnect from the current store?`,
      primaryButtonText: "Disconnect Store",
      secondaryButtonText: "Cancel",
    });
  }

  @action // should it be flow
  public createNewFile = flow(function* (this: Workspace, parentPath?: string) {
    const modalResponse = yield this.showNewFileModal(parentPath);

    if (modalResponse.buttonClicked === "primary" && modalResponse.result) {
      const { newFileInput } = modalResponse.result;
      const { fileName, filePath, fileType } = newFileInput;
      try {
        yield window.helium.fs.createFile(filePath);
      } catch {
        this.notifications.showMessageModal({
          type: "error",
          message: `Unable to create the new ${fileName} file`,
          secondaryButtonText: "Close",
        });
        return;
      }
      const parerentDirectory = pathe.dirname(filePath);

      if (this.fileExplorer.isExpanded(parerentDirectory)) {
        yield this.fileExplorer.reloadDirectory(parerentDirectory);
      }

      this.editor.openFile({
        path: filePath,
        fileType,
        basename: fileName,
      });
    }
  });

  @action
  public trashFile = flow(function* (
    this: Workspace,
    filePath: string,
    fileName: string
  ) {
    const modalResponse = yield this.showTrashItemConfirmation(fileName, true);

    if (modalResponse.buttonClicked === "primary") {
      try {
        yield window.helium.fs.trashItem(filePath);
      } catch (error) {
        // await wait(500); // have a small delay between the modal showing and the message modal showing
        this.notifications.showMessageModal({
          type: "error",
          message: `Unable to trash ${fileName} file.`,
          secondaryButtonText: "Close",
        });
        return;
      }
      const parerentDirectory = pathe.dirname(filePath);
      if (this.fileExplorer.isExpanded(parerentDirectory)) {
        yield this.fileExplorer.reloadDirectory(parerentDirectory);
      }

      if (this.editor.isFileOpen(filePath)) {
        this.editor.closeFile(filePath);
      }
    }
  });

  @action
  public createNewFolder = flow(function* (
    this: Workspace,
    parentFolderPath: string
  ) {
    const modalResponse = yield this.showNewFolderModal(parentFolderPath);

    if (modalResponse.buttonClicked === "primary" && modalResponse.result) {
      const { newFolderInput } = modalResponse.result;
      const { folderName, folderPath } = newFolderInput;
      try {
        yield window.helium.fs.createDirectory(folderPath);
      } catch (error) {
        // await wait(500); // have a small delay between the modal showing and the message modal showing
        this.notifications.showMessageModal({
          type: "error",
          message: `Unable to create ${folderName} folder.`,
          secondaryButtonText: "Close",
        });
        return;
      }
      const parerentDirectory = pathe.dirname(folderPath);
      if (this.fileExplorer.isExpanded(parerentDirectory)) {
        yield this.fileExplorer.reloadDirectory(parerentDirectory);
      }
    }
  });

  @action
  public trashFolder = flow(function* (
    this: Workspace,
    folderPath: string,
    folderName: string
  ) {
    const modalResponse = yield this.showTrashItemConfirmation(
      folderName,
      true
    );

    if (modalResponse.buttonClicked === "primary") {
      try {
        yield window.helium.fs.trashItem(folderPath);
      } catch (error) {
        // await wait(500); // have a small delay between the modal showing and the message modal showing
        this.notifications.showMessageModal({
          type: "error",
          message: `Unable to trash ${folderName} file.`,
          secondaryButtonText: "Close",
        });
        return;
      }
      const parerentDirectory = pathe.dirname(folderPath);
      if (this.fileExplorer.isExpanded(parerentDirectory)) {
        yield this.fileExplorer.reloadDirectory(parerentDirectory);
      }

      // this should also remove any open editor models or tabs that are in said directory
      const openFilesPaths = this.editor.getOpenFilePaths();
      // get all child files of the folder that are curretnly open
      const childFilePaths = openFilesPaths.filter((path) =>
        path.startsWith(folderPath)
      );
      this.editor.closeAll(childFilePaths);
    }
  });

  // will become flow
  @action
  public openThemeFromDialog = flow(function* (this: Workspace) {
    // check if there is already a theme open
    // if there is, clear everything
    // this should not fail
    let themePath: string | undefined = undefined;
    try {
      const paths = yield window.helium.app.openFolderDialog();
      themePath = paths[0] || undefined;
    } catch {
      this.notifications.showMessageModal({
        type: "error",
        message: "Unable to open Theme dialog.",
        secondaryButtonText: "Close",
      });
      return;
    }
    if (themePath) {
      let themeInfo: ThemeInfo | null = null;
      let files: ThemeFileSystemEntry[] = [];
      try {
        console.log("hello")
        const results = yield window.helium.shopify.openTheme(themePath);
        themeInfo = results.themeInfo;
        files = results.files;
      } catch (error) {
        this.notifications.showMessageModal({
          type: "error",
          message: `Unable to open folder: ${getErrorMessage(error)}`,
          secondaryButtonText: "Close",
        });
        return;
      }

      // set values from here
      if (themeInfo) {
        if (this.hasTheme) {
          this.reset();
        }
        this.theme = new Theme(themeInfo);
        this.fileExplorer.init(files);
        if (this.isSidePanelOpen && this.activeSideBarOption !== SideBarItemOption.FILES) {
          this.selectSideBarOption(SideBarItemOption.FILES);
        }
      }
    }
  });

  @action
  public openFile(options: OpenFileOptions) {
    return this.editor.openFile(options);
  }

  @action
  public saveCurrentFile = flow(function* (this: Workspace) {
    const currentFile = this.editor.getCurrentFile();
    if (this.editor.isShowingCodeEditor) {
      const currentEditorValue = this.editor.getEditorValue();
      if (
        currentFile &&
        this.isFileUnsaved(currentFile.path) &&
        currentEditorValue
      ) {
        try {
          yield window.helium.fs.writeFile({
            filePath: currentFile.path,
            content: currentEditorValue,
            encoding: "utf8",
          });

          this.markAsSaved(currentFile.path);
        } catch {
          // should this be a notification instead???
          this.notifications.showMessageModal({
            type: "error",
            message: "Unable to save active file.",
            secondaryButtonText: "Close",
          });
        }
      }
    }
  });

  @action
  public markAsUnsaved(path: string) {
    // will only add if not in set
    this.unsavedPaths.add(path);
  }

  @action
  public markAsSaved(path: string) {
    // will only delete if in set
    this.unsavedPaths.delete(path);
  }

  // @computed
  // https://mobx.js.org/computeds-with-args.html#1-derivations-dont-_need_-to-be-computed
  public isFileUnsaved(path: string) {
    return this.unsavedPaths.has(path);
  }

  // @computed
  // public get shouldShowWorkspace() {
  //   return this.isShowingWorkspace;
  // }

  @computed
  public get hasTheme() {
    return this.theme !== null;
  }

  @computed
  public get isWorkspaceUnsaved() {
    return this.unsavedPaths.size >= 1;
  }

  // @action
  // public setShowWorkspace(showWorkspace: boolean) {
  //   this.isShowingWorkspace = showWorkspace;
  // }

  @action
  public toggleSidePanel() {
    this.isSidePanelOpen = !this.isSidePanelOpen;
  }

  @action
  public selectSideBarOption(option: SideBarItemOption) {
    this.activeSideBarOption = option;
  }

  @action
  public connectStore = flow(function* (this: Workspace) {
    if (!this.isStoreConnected) {
      const modalResponse = yield this.showConnectStoreModal();

      if (modalResponse.buttonClicked === "primary" && modalResponse.result) {
        const { storeNameInput, storeUrlInput, themeAccessPasswordInput } =
          modalResponse.result;

        try {
          yield window.helium.shopify.connectStore({
            storeName: storeNameInput.value,
            password: themeAccessPasswordInput.value,
            storeUrl: storeUrlInput.value,
          });
        } catch (error) {
          // unable to connect stoer
          this.notifications.showMessageModal({
            type: "error",
            message: "Unable to connect store",
            secondaryButtonText: "Close",
          });
          return;
        }

        // or should I be using the event listener???
        this.connectedStore = new Store({
          storeName: storeNameInput.value,
          storeUrl: storeUrlInput.value,
        });
        // the previewState will be updated by the event
      }
    }
  });

  @action
  public disconnectStore = flow(function* (this: Workspace) {
    if (this.isStoreConnected) {
      const modalResponse = yield this.showDisconnectStoreConfirmation();
      if (modalResponse.buttonClicked === "primary") {
        try {
          yield window.helium.shopify.disconnectStore();
        } catch (error) {
          this.notifications.showMessageModal({
            type: "error",
            message: "Unable to disconnect store",
            secondaryButtonText: "Close",
          });
          return;
        }

        // or should I be using the event listener???
        this.connectedStore = null;
        // the previewState will be updated by the event
      }
    }
  });

  @computed
  public get isStoreConnected() {
    return this.connectedStore !== null;
  }

  @action
  public reset() {
    this.fileExplorer.reset();
    this.editor.reset();
    this.notifications.reset();
    this.themePreview.reset();
    // todo: is an async operation is happening, we need to wait for it to finish
    if (this.isLoading) {
      this.resetLoadingState();
    }
  }
}
