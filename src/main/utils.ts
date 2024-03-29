import { app } from "electron";
import isDev from "electron-is-dev";
import os from "os";

const isMac = () => {
    return os.platform() === "darwin";
};
const isWindows = () => {
    return os.platform() === "win32";
};
const isLinux = () => {
    return os.platform() === "linux";
};

const getHome = () => {
    return app.getPath('home');
}

export default {
    isMac,
    isWindows,
    isLinux,
    getHome,
    isDev
}