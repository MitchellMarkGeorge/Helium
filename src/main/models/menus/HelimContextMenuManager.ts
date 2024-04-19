import main from "main/services/ipc/main";
import { HeliumApplication } from "../HeliumApplication";
import { HeliumContextMenu } from "./HeliumContextMenu";
import { MenuItemConstructorOptions } from "electron";
import { ThemeFileSystemEntry } from "common/types";

export function initContextMenuService () {
  const newFileMenu = new HeliumContextMenu();
  const fileItemMenu = new HeliumContextMenu();
  const folderItemMenu = new HeliumContextMenu();
  const editorMenu = new HeliumContextMenu();

  main.listen("show-new-file-context-menu", (heliumWindow) => {
    const newFileTemplate = getNewFileTemplate();
    newFileMenu.show(heliumWindow, newFileTemplate);
  });

  main.listen<ThemeFileSystemEntry>(
    "show-file-item-context-menu",
    (heliumWindow, fileEntry) => {
      const fileItemTemplate = getFileItemTemplate(fileEntry);
      fileItemMenu.show(heliumWindow, fileItemTemplate);
    }
  );

  main.listen<ThemeFileSystemEntry>(
    "show-folder-item-context-menu",
    (heliumWindow, folderEntry) => {
      const folderItemTemplate = getFolderItemTemplate(folderEntry);
      folderItemMenu.show(heliumWindow, folderItemTemplate);
    }
  );

  main.listen("show-editor-context-menu", (heliumWindow) => {
    const editorTemplate = getEditorTemplate();
    editorMenu.show(heliumWindow, editorTemplate);
  });
}

function getNewFileTemplate(): MenuItemConstructorOptions[] {
  const heliumApplication = HeliumApplication.getInstance();
  return [
    {
      label: "New File",
      click: () => heliumApplication.triggerEvent("new-file"),
    },
    {
      label: "New Folder",
      click: () => heliumApplication.triggerEvent("new-folder"),
    },
  ];
}

function getFileItemTemplate(
  fileEntry: ThemeFileSystemEntry
): MenuItemConstructorOptions[] {
  const heliumApplication = HeliumApplication.getInstance();
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

function getFolderItemTemplate(
  folderEntry: ThemeFileSystemEntry
): MenuItemConstructorOptions[] {
  const heliumApplication = HeliumApplication.getInstance();
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

function getEditorTemplate(): MenuItemConstructorOptions[] {
  const heliumApplication = HeliumApplication.getInstance();
  return [
    {
      label: "New File",
      click: () => heliumApplication.triggerEvent("new-file"),
    },
    {
      label: "New Folder",
      click: () => heliumApplication.triggerEvent("new-file"),
    },
  ];
}
