
const isMac = process.platform === "darwin";
const isWindows = process.platform === "win32";
const isLinux = process.platform === "linux";

export default {
    isMac,
    isWindows,
    isLinux,
}