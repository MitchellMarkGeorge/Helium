import isDev from "electron-is-dev";

const isMac = process.platform === "darwin";
const isWindows = process.platform === "win32";
const isLinux = process.platform === "linux";

// const getHome = () => {
//     return app.getPath('home');
// }

export default {
    isMac,
    isWindows,
    isLinux,
    // getHome,
}