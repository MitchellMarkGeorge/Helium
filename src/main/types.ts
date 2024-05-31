import { ConnectStoreOptions } from "common/types";

export interface HeliumWindowOptions {
    themePathOrUrl?: string; // path or Github URL
    connectedStore?: ConnectStoreOptions; 
    previewOn?: boolean; // if the window should be started with the preview on
}

export interface HeliumLaunchOptions {
  themePath?: string;
}


export interface HeliumWindowState {
  isMinimized: boolean;
  isMaximized: boolean;
  isFocused: boolean;
}
