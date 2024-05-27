import { FileType, ThemeDirectoryChange, ThemeFileSystemEntry } from "common/types";
import renderer from "../services/ipc/renderer";

export const getFsPreloadApi = () => ({
    readFile: renderer.invoke<{ filePath: string, encoding: BufferEncoding}, string>('read-file'),
    writeFile: renderer.invoke<{ filePath: string, content: string, encoding: BufferEncoding}, void>('write-file'),
    deleteFile: renderer.invoke<string>('delete-file'),
    trashItem: renderer.invoke<string>('trash-item'),
    deleteDirectory: renderer.invoke<string>('delete-directory'),
    createDirectory: renderer.invoke<string>('create-directory'),
    createFile: renderer.invoke<string>('create-file'),
    readDirectory: renderer.invoke<string, Promise<ThemeFileSystemEntry[]>>('read-directory'),
    pathExists: renderer.invoke<string, boolean>('path-exists'),
    rename: renderer.invoke<{oldPath: string, newPath: string}>('rename'),
    // NOTE: this is a ROOT LEVEL listener. It should only report on the addition or deletion of files/folders
    watchDirectory: renderer.invoke<string>('watch-directory'),
    stopWatchingDirectory: renderer.invoke<string>('stop-watching-directory'),
    removeAllDirectoryWatchers: renderer.invoke<string>('remove-all-directory-watchers'),
    onDirectoryChange: renderer.listen<ThemeDirectoryChange>('on-directory-change'),
    // fix this
    onFileChange: renderer.listen<ThemeDirectoryChange>('on-file-change'),
    detectFileType: renderer.invoke<string, FileType>('detect-file-type'),
});