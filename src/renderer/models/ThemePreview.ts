import { PreviewState } from "common/types";
import { StateModel } from "./StateModel";
import { Workspace } from "./workspace/Workspace";
import { action, computed, observable, runInAction } from "mobx";

export class ThemePreview extends StateModel {
    // i could also just read only
  @observable private accessor previewState: PreviewState;
  @observable private accessor previewHost: string;
  @observable private accessor previewPort: string;
  constructor(workspace: Workspace) {
    super(workspace);
    this.previewState = PreviewState.UNAVALIBLE;
    this.previewHost = window.helium.constants.DEFAULT_PREVIEW_HOST;
    this.previewPort = window.helium.constants.DEFAULT_PREVIEW_PORT;

    this.setupPreviewStateListener();
  }

  @action
  public updatePreviewState(previewState: PreviewState) {
    this.previewState = previewState;
  }

  @action
  public updatePreviewOptions(options: {host: string, port: string}) {
    this.previewHost = options.host;
    this.previewPort = options.port;
  }

  private setupPreviewStateListener() {
    window.helium.shopify.onPreviewStateChange((newPreviewState) => {
      // runInAction???
      this.previewState = newPreviewState;
    });
  }

  public getPreviewState() {
    return this.previewState;
  }

  @computed
  public get isRunning() {
    return this.previewState === PreviewState.RUNNING;
  }

  @computed
  public get isUnavalible() {
    // only unavalible when there is no connected theme
    return this.previewState === PreviewState.UNAVALIBLE;
  }

  @action
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
        runInAction(() => {
          this.workspace.notifications.showNotification({
            type: "error",
            message: "Error: Unable to start Theme Preview for this theme.",
          });
        })
      }
    }
  }

  @action
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
        runInAction(() => {
          this.workspace.notifications.showNotification({
            type: "error",
            message: "Error: Unable to start Theme Preview for this theme.",
          });
        })
      }
    }
  }

  @action
  public reset(): void {
    // depends on whether there is a connected store and if it is running
    if (this.workspace.isStoreConnected) {
      this.previewState = PreviewState.OFF;
    } else {
      this.previewState = PreviewState.OFF;
    }
  }
}
