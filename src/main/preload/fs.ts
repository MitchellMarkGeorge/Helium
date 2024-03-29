import { ThemeFileSystemEntry } from "common/types";
import ipc from "../services/ipc";

export const getFsApi = (currentWindowId: number) => ({
    // these ones don't need to return promises...
    readFile: ipc.scopedInvoke<{ path: string, encoding: BufferEncoding}, string>(currentWindowId, 'read-file'),
    writeFile: ipc.scopedInvoke<{ path: string, content: string, encoding: BufferEncoding}, void>(currentWindowId, 'write-file'),
    deleteFile: ipc.scopedInvoke<string>(currentWindowId, 'delete-file'),
    createDirectory: ipc.scopedInvoke<string>(currentWindowId, 'create-directory'),
    readDirectory: ipc.scopedInvoke<string, Promise<ThemeFileSystemEntry[]>>(currentWindowId, 'read-directory'),
    pathExists: ipc.scopedInvoke<string, boolean>(currentWindowId, 'path-exists'),
    rename: ipc.scopedInvoke<{oldPath: string, newPath: string}>(currentWindowId, 'rename'),
});