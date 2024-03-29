import { IpcMainInvokeEvent, ipcMain, ipcRenderer } from "electron";

// A for argument type, R for return type

const scopedHandle = <A = void, R = void>(
  windowId: number,
  eventName: string,
  func: (event: IpcMainInvokeEvent, args: A) => R
) => ipcMain.handle(`${eventName}-${windowId}`, func);

const scopedInvoke =
  <A = void, R = void>(windowId: number, eventName: string) =>
  (arg: A) =>
    ipcRenderer.invoke(`${eventName}-${windowId}`, arg) as Promise<R>;

const scopedListener =
  <A = void>(windowId: number, eventName: string) =>
  (callback: (arg: A) => void) => {
    ipcRenderer.on(`${eventName}-${windowId}`, (_, args: A) => callback(args)) 
    // callback.call(this, )
  }

export default {
  scopedHandle,
  scopedInvoke,
  scopedListener,
};
