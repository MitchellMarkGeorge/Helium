export interface HeliumWindowOptions {
    themePathOrUrl: string; // path or Github URL
    connectedStore: {
      url: string;
      password: string
    }; 
    previewOn: boolean; // if the window should be started with the preview on
}


export interface HeliumWindowState {
  isMinimized: boolean;
  isMaximized: boolean;
  isFocused: boolean;
}
