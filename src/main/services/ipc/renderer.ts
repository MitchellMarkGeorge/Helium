import { ipcRenderer } from "electron";

// A for argument type, R for return type
const invoke =
  <A = void, R = void>(eventName: string) =>
  (arg: A): Promise<R> =>
    ipcRenderer.invoke(eventName, arg);

const emit =
  <A = void>(eventName: string) =>
  (arg: A) =>
    ipcRenderer.send(eventName, arg);


const listen =
  <A = void>(eventName: string) =>
  (callback: (arg: A) => void) => {
    ipcRenderer.on(eventName, (_, arg: A) => callback(arg));
  };

const listenOnce =
  <A = void>(eventName: string) =>
  (callback: (arg: A) => void) => {
    ipcRenderer.once(eventName, (_, arg: A) => callback(arg));
  };

export default {
  invoke,
  emit,
  listen,
  listenOnce,
};