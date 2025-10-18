# Common Types

Source: `src/common/types.ts`

- **HeliumId**: Template string type `helium-${string}`
- **PreviewState**: `OFF | RUNNING | STARTING | STOPPING | ERROR | UNAVALIBLE`
- **ThemeInfo**: `{ shopifyId: number | null; path: string; name: string | null; version: string | null; author: string | null }`
- **StoreInfo**: `{ heliumId: HeliumId; themeAccessPassword: string; url: string; name: string }`
- **ConnectStoreOptions**: `{ storeName: string; storeUrl: string; password: string }`
- **HeliumGlobal**: shape of `window.helium`
- **InitalState**: `{ connectedStore: StoreInfo | null; currentTheme: ThemeInfo | null; themeFiles: ThemeFileSystemEntry[]; previewState: PreviewState }`
- **Language**: Union of supported text languages
- **BinaryFileType**: `IMAGE | BINARY`
- **FileType**: `Language | BinaryFileType`
- **ThemeFile**: `{ path; basename; type: "file"; fileType: FileType }`
- **ThemeDirectory**: `{ path; basename; type: "directory" }`
- **ThemeFileSystemEntry**: `ThemeFile | ThemeDirectory`
- **OpenThemeResult**: `{ themeInfo: ThemeInfo; files: ThemeFileSystemEntry[] }`
- **ThemeDirectoryChange**: `{ changedDirectory: string }`
- **ThemeDirectoryChangeType**: enum
- **StartThemePreviewOptions**: `{ host: string; port: string }`
