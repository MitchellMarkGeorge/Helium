import main from "main/services/ipc/main";
import { HeliumApplication } from "../models/HeliumApplication";
import { HeliumContextMenu } from "../models/menus/HeliumContextMenu";
import { MenuItemConstructorOptions, clipboard, shell } from "electron";
import { ThemeFileSystemEntry } from "common/types";

export function initContextMenuService() {
  const newFileMenu = new HeliumContextMenu();
  const fileItemMenu = new HeliumContextMenu();
  const folderItemMenu = new HeliumContextMenu();
  // not for now
  // const editorMenu = new HeliumContextMenu();

  main.listen("show-new-file-context-menu", (heliumWindow) => {
    const newFileTemplate = getNewFileTemplate();
    newFileMenu.show(heliumWindow, newFileTemplate);
  });

  main.listen<string>(
    "show-file-item-context-menu",
    (heliumWindow, filePath) => {
      const fileItemTemplate = getFileItemTemplate(filePath);
      fileItemMenu.show(heliumWindow, fileItemTemplate);
    }
  );

  main.listen<string>(
    "show-folder-item-context-menu",
    (heliumWindow, folderPath) => {
      const folderItemTemplate = getFolderItemTemplate(folderPath);
      folderItemMenu.show(heliumWindow, folderItemTemplate);
    }
  );

  // main.listen("show-editor-context-menu", (heliumWindow) => {
  //   const editorTemplate = getEditorTemplate();
  //   editorMenu.show(heliumWindow, editorTemplate);
  // });
}

function getNewFileTemplate(): MenuItemConstructorOptions[] {
  const heliumApplication = HeliumApplication.getInstance();
  return [
    {
      label: "New File",
      // create the new file in the root
      click: () => heliumApplication.emitEventOnFocusedWindow("new-file", null),
    },
    {
      label: "New Folder",
      // create the new file folder in the root
      click: () => heliumApplication.emitEventOnFocusedWindow("new-folder", null),
    },
  ];
}

function getFileItemTemplate(
  filePath: string
): MenuItemConstructorOptions[] {
  const heliumApplication = HeliumApplication.getInstance();
  return [
    // need to figure out approach
    // could have an "internal clipboard" where copied
    // { label: "Copy" },
    // { label: "Paste" },
    // { type: "separator" },
    {
      label: "Copy Path",
      click: () => {
        clipboard.writeText(filePath);
      },
    },
    { type: "separator" },
    {
      label: "Rename",
      click: () => heliumApplication.emitEventOnFocusedWindow("rename-file", filePath),
    },
    {
      label: "Delete",
      click: () => heliumApplication.emitEventOnFocusedWindow("delete-file", filePath),
    },
  ];
}

function getFolderItemTemplate(
  folderPath: string
): MenuItemConstructorOptions[] {
  const heliumApplication = HeliumApplication.getInstance();
  return [
    {
      label: "New Folder",
      // folderEntry represents the parent folder
      click: () => heliumApplication.emitEventOnFocusedWindow("new-folder", folderPath),
    },
    {
      label: "New File",
      // folderEntry represents the parent folder
      click: () => heliumApplication.emitEventOnFocusedWindow("new-file", folderPath),
    },
    {
      label: "Reveal in Finder",
      click: () => shell.showItemInFolder(folderPath),
    },
    { type: "separator" },
    // { label: "Copy" },
    // { label: "Paste" },
    // { type: "separator" },
    {
      label: "Copy Path",
      click: () => {
        clipboard.writeText(folderPath);
      },
    },
    { type: "separator" },
    {
      label: "Rename",
      click: () => heliumApplication.emitEventOnFocusedWindow("rename-file", folderPath),
    },
    {
      label: "Delete",
      click: () => heliumApplication.emitEventOnFocusedWindow("delete-file", folderPath),
    },
  ];
}

// function getEditorTemplate(): MenuItemConstructorOptions[] {
//   const heliumApplication = HeliumApplication.getInstance();
//   return [
//     {
//       label: "New File",
//       click: () => heliumApplication.triggerEvent("new-file"),
//     },
//     {
//       label: "New Folder",
//       click: () => heliumApplication.triggerEvent("new-file"),
//     },
//   ];
// }
