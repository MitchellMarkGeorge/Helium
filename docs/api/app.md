# App API

Global: `window.helium.app`

## Methods

- **closeWindow() => Promise<void>**: Close the current window.
- **setWindowTitle(title: string) => Promise<void>**: Set the Electron window title.
- **minimizeWindow() => Promise<void>**: Minimize window.
- **maximizeWindow() => Promise<void>**: Maximize window.
- **getWindowState() => Promise<HeliumWindowState>**: Returns `{ isMinimized, isMaximized, isFocused }`.
- **openFolderDialog() => Promise<string[]>**: Show OS directory picker and return selected paths.
- **loadInitalState() => Promise<InitalState>**: Load persisted state when app starts.
- **openUrl(url: string) => Promise<void>**: Open `url` in external browser.
- **on<E extends string>()(eventName: E, cb: (arg: any) => void) => void**: Subscribe to a custom event sent from main.
- **sendWorkspaceIsShowing() => void**: Notify main when workspace view is visible.
- **showNewFileContextMenu() => void**: Show context menu for creating a file at root.
- **showFileItemContextMenu(filePath: string) => void**: Show file item context menu.
- **showFolderItemContextMenu(folderPath: string) => void**: Show folder item context menu.
- **showEditorContextMenu() => void**: Show editor context menu (reserved).

## Examples

```ts
// Set title
window.helium.app.setWindowTitle("My Theme – Helium");

// Listen for a custom event from main
window.helium.app.on()("on-preview-state-change", (state) => {
  console.log("Preview state:", state);
});

// Open a directory
const [themePath] = await window.helium.app.openFolderDialog();
```
