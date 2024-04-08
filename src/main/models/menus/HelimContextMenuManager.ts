import main from "main/services/ipc/main";
import { HeliumApplication } from "../HeliumApplication";
import { HeliumContextMenu } from "./HeliumContextMenu";
import { MenuItemConstructorOptions } from "electron";
import { ThemeFileSystemEntry } from "common/types";

export class HeliumContextMenuManager {
  private newFileMenu: HeliumContextMenu;
  private fileItemMenu: HeliumContextMenu;
  private folderItemMenu: HeliumContextMenu;
  private editorMenu: HeliumContextMenu;
  constructor(private heliumApplication: HeliumApplication) {
    this.newFileMenu = new HeliumContextMenu();
    this.fileItemMenu = new HeliumContextMenu();
    this.folderItemMenu = new HeliumContextMenu();
    this.editorMenu = new HeliumContextMenu();

    main.listen("show-new-file-context-menu", (heliumWindow) => {
      const newFileTemplate = this.getNewFileTemplate();
      this.newFileMenu.show(heliumWindow, newFileTemplate);
    });

    main.listen<ThemeFileSystemEntry>(
      "show-file-item-context-menu",
      (heliumWindow, fileEntry) => {
        const fileItemTemplate = this.getFileItemTemplate(fileEntry);
        this.fileItemMenu.show(heliumWindow, fileItemTemplate);
      }
    );

    main.listen<ThemeFileSystemEntry>(
      "show-folder-item-context-menu",
      (heliumWindow, folderEntry) => {
        const folderItemTemplate = this.getFolderItemTemplate(folderEntry);
        this.folderItemMenu.show(heliumWindow, folderItemTemplate);
      }
    );

    main.listen("show-editor-context-menu", (heliumWindow) => {
      const editorTemplate = this.getEditorTemplate();
      this.editorMenu.show(heliumWindow, editorTemplate);
    });
  }

  private getNewFileTemplate(): MenuItemConstructorOptions[] {
    return [
      {
        label: "New File",
        click: () => this.heliumApplication.triggerEvent("new-file"),
      },
      {
        label: "New Folder",
        click: () => this.heliumApplication.triggerEvent("new-file"),
      },
    ];
  }

  private getFileItemTemplate(
    fileEntry: ThemeFileSystemEntry
  ): MenuItemConstructorOptions[] {
    return [
      { label: "Copy" },
      { label: "Paste" },
      { type: "separator" },
      {
        label: "Copy Path",
      },
      { type: "separator" },
      {
        label: "Rename",
      },
      {
        label: "Delete",
      },
    ];
  }

  private getFolderItemTemplate(
    folderEntry: ThemeFileSystemEntry
  ): MenuItemConstructorOptions[] {
    return [
      { label: "New Folder" },
      { label: "New File" },
      { label: "Reveal in Finder" },
      { type: "separator" },
      { label: "Copy" },
      { label: "Paste" },
      { type: "separator" },
      {
        label: "Copy Path",
      },
      { type: "separator" },
      {
        label: "Rename",
      },
      {
        label: "Delete",
      },
    ];
  }

  private getEditorTemplate(): MenuItemConstructorOptions[] {
    return [
      {
        label: "New File",
        click: () => this.heliumApplication.triggerEvent("new-file"),
      },
      {
        label: "New Folder",
        click: () => this.heliumApplication.triggerEvent("new-file"),
      },
    ];
  }
}
