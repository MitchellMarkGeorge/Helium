import { HeliumId } from "common/types";
// using this instead of crypto as I need thos in the renderer
import { v4 as uuid } from 'uuid';

const isMac = process.platform === "darwin";
const isWindows = process.platform === "win32";
const isLinux = process.platform === "linux";
const generateHeliumId = (): HeliumId => `helium-${uuid()}`;

export default {
    isMac,
    isWindows,
    isLinux,
    generateHeliumId,
}