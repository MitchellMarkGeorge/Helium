# File System API

Global: `window.helium.fs`

## Methods
- **readFile({ filePath, encoding }) => Promise<string>**
- **writeFile({ filePath, content, encoding }) => Promise<void>**
- **deleteFile(path: string) => Promise<void>**
- **trashItem(path: string) => Promise<void>**
- **deleteDirectory(path: string) => Promise<void>**
- **createDirectory(path: string) => Promise<void>**
- **createFile(path: string) => Promise<void>**
- **readDirectory(path: string) => Promise<ThemeFileSystemEntry[]>**
- **pathExists(path: string) => Promise<boolean>**
- **rename({ oldPath, newPath }) => Promise<void>**
- **watchDirectory(path: string) => Promise<void>**
- **stopWatchingDirectory(path: string) => Promise<void>**
- **removeAllDirectoryWatchers() => Promise<void>**
- **onDirectoryChange(cb: (change: ThemeDirectoryChange) => void) => void**
- **onFileChange(cb: (change: ThemeDirectoryChange) => void) => void**
- **detectFileType(path: string) => Promise<FileType>**

## Examples
```ts
// Read a file
const content = await window.helium.fs.readFile({ filePath, encoding: "utf8" });

// Write file
await window.helium.fs.writeFile({ filePath, content: "hello", encoding: "utf8" });

// List entries in a directory
const entries = await window.helium.fs.readDirectory(themePath);
```
