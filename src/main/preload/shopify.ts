import { ConnectStoreOptions, PreviewState, StoreInfo, ThemeInfo } from "common/types";
import ipc from "../services/ipc";

export const getShopifyApi = (currentWindowId: number) => ({
  openTheme: ipc.scopedInvoke(currentWindowId, "open-theme"),
  startThemePreview: ipc.scopedInvoke(currentWindowId, "start-theme-preview"),
  stopThemePreview: ipc.scopedInvoke(currentWindowId, "stop-theme-preview"),
  pullTheme: ipc.scopedInvoke<string>(currentWindowId, "pull-theme"),
  pushTheme: ipc.scopedInvoke<string>(currentWindowId, "push-theme"),
  connectStore: ipc.scopedInvoke<ConnectStoreOptions>(currentWindowId, "connect-store"),
  getConnectedStore: ipc.scopedInvoke<void, StoreInfo>(
    currentWindowId,
    "get-connected-store"
  ),

  // onThemeInfoChange: ipc.scopedListener<ThemeInfo>(currentWindowId, 'push-theme'),
//   onThemeInfoChange: (callback: (updatedThemeInfo: ThemeInfo) => void) => {
//     ipcRenderer.on("theme-info-change", (_, updatedThemeInfo: ThemeInfo) =>
//       callback(updatedThemeInfo)
//     );
//   },
  onThemeInfoChange: ipc.eventListener<ThemeInfo>('theme-info-change'),

//   onPreviewStateChange: (callback: (newPreviewState: PreviewState) => void) => {
//     ipcRenderer.on("preview-state-change", (_, newPreviewState: PreviewState) =>
//       callback(newPreviewState)
//     );
//   },

  onPreviewStateChange: ipc.eventListener<PreviewState>('preview-state-change'),

//   onStoreChange: (callback: (newStore: StoreInfo) => void) => {
//     ipcRenderer.on("store-change", (_, newStore: StoreInfo) =>
//       callback(newStore)
//     );
//   },
  onStoreChange: ipc.eventListener<StoreInfo>('store-change'),
});
