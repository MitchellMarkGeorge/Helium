import { PreviewState, StoreInfo, ThemeInfo } from "common/types";
import ipc from "../services/ipc";

export const getShopifyApi = (currentWindowId: number) => ({
    // these ones don't need to return promises...
    openTheme: ipc.scopedInvoke(currentWindowId, 'open-theme'),
    startThemePreview: ipc.scopedInvoke(currentWindowId, 'start-theme-preview'),
    stopThemePreview: ipc.scopedInvoke(currentWindowId, 'stop-theme-preview'),
    pullTheme: ipc.scopedInvoke<string>(currentWindowId, 'pull-theme'),
    pushTheme: ipc.scopedInvoke<string>(currentWindowId, 'push-theme'),
    getConnectedStore: ipc.scopedInvoke<void, StoreInfo>(currentWindowId, 'push-theme'),

    onThemeInfoChange: ipc.scopedListener<ThemeInfo>(currentWindowId, 'push-theme'),
    onPreviewStateChange: ipc.scopedListener<PreviewState>(currentWindowId, 'push-theme'),
});