import { HeliumWindowState } from "../types";
// get inital window state

import renderer from "../services/ipc/renderer";
import { InitalState } from "common/types";

export const getAppApi = () => ({
    // these ones don't need to return promises...
    closeWindow: renderer.invoke('close-window'),
    minimizeWindow: renderer.invoke('minimize-window'),
    maximizeWindow: renderer.invoke('maximize-window'),
    getWindowState: renderer.invoke<void, HeliumWindowState>('get-window-state'),
    openFolderDialog: renderer.invoke<void, string[]>('open-folder-dialog'),
    onceInitalStateReady: renderer.listenOnce<InitalState>('on-inital-state-ready'), // might rename to onInitalStateReady
    notifyUiReady: renderer.emit('ui-ready'),
});