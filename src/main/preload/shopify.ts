import {
  ConnectStoreOptions,
  PreviewState,
  StoreInfo,
  ThemeInfo,
} from "common/types";
import renderer from "main/services/ipc/renderer";

export const getShopifyPreloadApi = () => ({
  openTheme: renderer.invoke("open-theme"),
  startThemePreview: renderer.invoke("start-theme-preview"),
  stopThemePreview: renderer.invoke("stop-theme-preview"),
  pullTheme: renderer.invoke<string>("pull-theme"),
  pushTheme: renderer.invoke<string>("push-theme"),
  connectStore: renderer.invoke<ConnectStoreOptions>("connect-store"),
  getConnectedStore: renderer.invoke<void, StoreInfo>("get-connected-store"),
  onThemeInfoChange: renderer.listen<ThemeInfo>("on-theme-info-change"),
  onPreviewStateChange: renderer.listen<PreviewState>("on-preview-state-change"),
  onStoreChange: renderer.listen<StoreInfo>("on-store-change"),
});
