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

export default {
    isMac,
    isWindows,
    isLinux,
}