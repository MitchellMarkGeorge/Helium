import { ipcRenderer } from "electron";
import ipc  from "../services/ipc";
import { HeliumWindowState } from "../types";

export async function getCurrentWindowId(): Promise<number>  {
    return await ipcRenderer.invoke('get-window-id');
}

export const getAppApi = (currentWindowId: number) => ({
    // these ones don't need to return promises...
    closeWindow: ipc.scopedInvoke(currentWindowId, 'close-window'),
    minimizeWindow: ipc.scopedInvoke(currentWindowId, 'minimize-window'),
    maximizeWindow: ipc.scopedInvoke(currentWindowId, 'maximize-window'),
    getWindowState: ipc.scopedInvoke<void, HeliumWindowState>(currentWindowId, 'get-window-state'),
});