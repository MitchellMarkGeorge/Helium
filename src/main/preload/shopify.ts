import {
  ConnectStoreOptions,
  PreviewState,
  StoreInfo,
  ThemeInfo,
} from "common/types";
import ipc from "../services/ipc";

export const getShopifyApi = () => ({
  openTheme: ipc.invoke("open-theme"),
  startThemePreview: ipc.invoke("start-theme-preview"),
  stopThemePreview: ipc.invoke("stop-theme-preview"),
  pullTheme: ipc.invoke<string>("pull-theme"),
  pushTheme: ipc.invoke<string>("push-theme"),
  connectStore: ipc.invoke<ConnectStoreOptions>("connect-store"),
  getConnectedStore: ipc.invoke<void, StoreInfo>("get-connected-store"),
  onThemeInfoChange: ipc.eventListener<ThemeInfo>("theme-info-change"),
  onPreviewStateChange: ipc.eventListener<PreviewState>("preview-state-change"),
  onStoreChange: ipc.eventListener<StoreInfo>("store-change"),
});
