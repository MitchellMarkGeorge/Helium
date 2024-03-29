import { ipcRenderer } from "electron";
import ipc  from "../services/ipc";
import { HeliumWindowState } from "../types";

export function getCurrentWindowId(): Promise<number>  {
    return ipcRenderer.invoke('get-window-id');
}

// get inital window state

export const getAppApi = (currentWindowId: number) => ({
    // these ones don't need to return promises...
    closeWindow: ipc.scopedInvoke(currentWindowId, 'close-window'),
    minimizeWindow: ipc.scopedInvoke(currentWindowId, 'minimize-window'),
    maximizeWindow: ipc.scopedInvoke(currentWindowId, 'maximize-window'),
    getWindowState: ipc.scopedInvoke<void, HeliumWindowState>(currentWindowId, 'get-window-state'),
    openFolderDialog: ipc.scopedInvoke<void, string[]>(currentWindowId, 'open-folder-dialog'),
});