import { ThemeDirectoryChange, ThemeFileSystemEntry } from "common/types";
import renderer from "../services/ipc/renderer";

export const getFsApi = () => ({
    readFile: renderer.invoke<{ filePath: string, encoding: BufferEncoding}, string>('read-file'),
    writeFile: renderer.invoke<{ filePath: string, content: string, encoding: BufferEncoding}, void>('write-file'),
    deleteFile: renderer.invoke<string>('delete-file'),
    createDirectory: renderer.invoke<string>('create-directory'),
    readDirectory: renderer.invoke<string, Promise<ThemeFileSystemEntry[]>>('read-directory'),
    pathExists: renderer.invoke<string, boolean>('path-exists'),
    rename: renderer.invoke<{oldPath: string, newPath: string}>('rename'),
    // NOTE: this is a ROOT LEVEL listener. It should only report on the addition or deletion of files/folders
    attatchDirectoryWatcher: renderer.invoke<string>('attach-directory-watcher'),
    removeDirectoryWatcher: renderer.invoke<string>('remove-directory-watcher'),
    removeAllDirectoryWatchers: renderer.invoke<string>('remove-all-directory-watchers'),
    onDirectoryChange: renderer.listen<ThemeDirectoryChange>('on-directory-change'),
    // fix this
    onFileChange: renderer.listen<ThemeDirectoryChange>('on-file-change'),
});