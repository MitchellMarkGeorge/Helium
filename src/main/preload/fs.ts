import { ThemeFileSystemEntry } from "common/types";
import ipc from "../services/ipc";

export const getFsApi = () => ({
    // these ones don't need to return promises...
    readFile: ipc.invoke<{ filePath: string, encoding: BufferEncoding}, string>('read-file'),
    writeFile: ipc.invoke<{ filePath: string, content: string, encoding: BufferEncoding}, void>('write-file'),
    deleteFile: ipc.invoke<string>('delete-file'),
    createDirectory: ipc.invoke<string>('create-directory'),
    readDirectory: ipc.invoke<string, Promise<ThemeFileSystemEntry[]>>('read-directory'),
    pathExists: ipc.invoke<string, boolean>('path-exists'),
    rename: ipc.invoke<{oldPath: string, newPath: string}>('rename'),
});