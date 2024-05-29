import { PreviewState } from "common/types";
import { StateModel } from "./StateModel";
import { Workspace } from "./workspace/Workspace";

export class ThemePreview extends StateModel {
    // i could also just read only
  private previewState: PreviewState;
  private previewHost: string;
  private previewPort: string;
  constructor(workspace: Workspace) {
    super(workspace);
    this.previewState = PreviewState.UNAVALIBLE;
    this.previewHost = window.helium.constants.DEFAULT_PREVIEW_HOST;
    this.previewPort = window.helium.constants.DEFAULT_PREVIEW_PORT;

    this.initPreviewStateListener();
  }

  public setPreviewState(previewState: PreviewState) {
    this.previewState = previewState;
  }

  public updatePreviewOptions(options: {host: string, port: string}) {
    this.previewHost = options.host;
    this.previewPort = options.port;
  }

  private initPreviewStateListener() {
    window.helium.shopify.onPreviewStateChange((newPreviewState) => {
      this.previewState = newPreviewState;
    });
  }

  public getPreviewState() {
    return this.previewState;
  }

  public get isRunning() {
    return this.previewState === PreviewState.RUNNING;
  }

  public get isUnavalible() {
    // only unavalible when there is no connected theme
    return this.previewState === PreviewState.UNAVALIBLE;
  }

  public async start() {
    if (!this.isRunning) {
      this.workspace.notifications.showNotification({
        type: "info",
        message: "Starting Theme Preview...",
      });
      try {
        // should time out after a while (10-15 seconds)
        await window.helium.shopify.startThemePreview({
            host: this.previewHost,
            port: this.previewPort,
        });
      } catch {
        // error details???
        this.workspace.notifications.showNotification({
          type: "error",
          message: "Error: Unable to start Theme Preview for this theme.",
        });
      }
    }
  }

  public async stop() {
    if (this.isRunning) {
      this.workspace.notifications.showNotification({
        type: "info",
        message: "Shutting down Theme Preview...",
      });
      try {
        // should time out after a while
        await window.helium.shopify.stopThemePreview();
      } catch {
        // error details???
        this.workspace.notifications.showNotification({
          type: "error",
          message: "Error: Unable to start Theme Preview for this theme.",
        });
      }
    }
  }

  public reset(): void {
    // depends on whether there is a connected store and if it is running
    if (this.workspace.hasStoreConnected) {
      this.previewState = PreviewState.OFF;
    } else {
      this.previewState = PreviewState.OFF;
    }
  }
}
