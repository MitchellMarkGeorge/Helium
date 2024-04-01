import { ThemeFileSystemEntry } from "common/types";
import renderer from "../services/ipc/renderer";

export const getFsApi = () => ({
    readFile: renderer.invoke<{ filePath: string, encoding: BufferEncoding}, string>('read-file'),
    writeFile: renderer.invoke<{ filePath: string, content: string, encoding: BufferEncoding}, void>('write-file'),
    deleteFile: renderer.invoke<string>('delete-file'),
    createDirectory: renderer.invoke<string>('create-directory'),
    readDirectory: renderer.invoke<string, Promise<ThemeFileSystemEntry[]>>('read-directory'),
    pathExists: renderer.invoke<string, boolean>('path-exists'),
    rename: renderer.invoke<{oldPath: string, newPath: string}>('rename'),
});