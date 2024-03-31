import { IpcMainInvokeEvent, ipcMain, ipcRenderer } from "electron";

// A for argument type, R for return type

const scopedHandle = <A = void, R = void>(
  windowId: number,
  eventName: string,
  func: (event: IpcMainInvokeEvent, args: A) => R
) => ipcMain.handle(`${eventName}-${windowId}`, func);

const scopedInvoke =
  <A = void, R = void>(windowId: number, eventName: string) =>
  (arg: A): Promise<R> =>
    ipcRenderer.invoke(`${eventName}-${windowId}`, arg);

const eventListener =
  <A = void>(eventName: string) =>
  (callback: (arg: A) => void) => {
    ipcRenderer.on(eventName, (_, arg: A) => callback(arg));
  };

export default {
  scopedHandle,
  scopedInvoke,
  eventListener,
};
