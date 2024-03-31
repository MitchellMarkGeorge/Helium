import { ipcRenderer } from "electron";
import ipc  from "../services/ipc";
import { HeliumWindowState } from "../types";
import { InitalState } from "common/types";

export function getInitalState(windowId: number): Promise<InitalState>  {
    return ipcRenderer.invoke('get-inital-state', windowId);
}


// get inital window state

export const getAppApi = () => ({
    // these ones don't need to return promises...
    closeWindow: ipc.invoke('close-window'),
    minimizeWindow: ipc.invoke('minimize-window'),
    maximizeWindow: ipc.invoke('maximize-window'),
    getWindowState: ipc.invoke<void, HeliumWindowState>('get-window-state'),
    openFolderDialog: ipc.invoke<void, string[]>('open-folder-dialog'),
});