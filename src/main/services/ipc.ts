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

export default {
  scopedHandle,
  scopedInvoke,
};
