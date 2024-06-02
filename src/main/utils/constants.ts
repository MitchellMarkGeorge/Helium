import { InitalState, PreviewState } from "common/types";

const DEFAULT_INITAL_STATE: InitalState = {
  connectedStore: null,
  currentTheme: null,
  previewState: PreviewState.UNAVALIBLE,
  themeFiles: [],
};
export const constants = {
    DEFAULT_WINOW_TITLE: "Helium IDE",
    DEFAULT_PREVIEW_HOST: "127.0.0.1", 
    DEFAULT_PREVIEW_PORT:  "9292", 
    DEFAULT_INITAL_STATE,
}