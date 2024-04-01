import { WebContents, ipcMain } from "electron";
import { HeliumApplication } from "main/models/HeliumApplication";
import { HeliumWindow } from "main/models/HeliumWindow";

console.log(HeliumApplication);

// A for argument type, R for return type
// for some reason this here dosen't work...
// const heliumApp = HeliumApplication.getInstance();

const handle = <A = void, R = void>(
  eventName: string,
  callback: (window: HeliumWindow, args: A) => R // callback takes the window handle is involed from and any arguments
) => {
  ipcMain.handle(eventName, (event, args: A) => {
    const heliumApp = HeliumApplication.getInstance();
    const heliumWindow = heliumApp.getWindowFromWebContents(event.sender);
    return callback(heliumWindow, args);
  });
};

const listen = <A = void, R = void>(
  eventName: string,
  callback: (window: HeliumWindow, args: A) => R // callback takes the window handle is involed from and any arguments
) => {
  ipcMain.on(eventName, (event, args: A) => {
    const heliumApp = HeliumApplication.getInstance();
    const heliumWindow = heliumApp.getWindowFromWebContents(event.sender);
    return callback(heliumWindow, args);
  });
};

// could either use 
const triggerEvent = <T>(webContents: WebContents, eventName: string, args: T) => {
  webContents.send(eventName, args);
}

const emitEventFromWindow = <T>(heliumWindow: HeliumWindow, eventName: string, args: T) => {
  const webContent = heliumWindow.browserWindow.webContents;
  triggerEvent(webContent, eventName, args);
}

export default { handle, listen, triggerEvent, emitEventFromWindow };