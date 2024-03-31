import { ipcMain, ipcRenderer } from "electron";
import HeliumApplication from "main/models/HeliumApplication";
import { HeliumWindow } from "main/models/HeliumWindow";

const heliumApp = HeliumApplication.getInstance();

// A for argument type, R for return type

const handle = <A = void, R = void>(
  eventName: string,
  callback: (window: HeliumWindow, args: A) => R // callback takes the window handle is involed from and any arguments
) => {
  ipcMain.handle(eventName, (event, args: A) => {
    const heliumWindow = heliumApp.getWindowFromWebContents(event.sender);
    return callback(heliumWindow, args);
  });
};

const invoke =
  <A = void, R = void>(eventName: string) =>
  (arg: A): Promise<R> =>
    ipcRenderer.invoke(eventName, arg);

const eventListener =
  <A = void>(eventName: string) =>
  (callback: (arg: A) => void) => {
    ipcRenderer.on(eventName, (_, arg: A) => callback(arg));
  };

export default {
  invoke,
  handle,
  eventListener,
};
