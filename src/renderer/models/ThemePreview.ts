import { PreviewState } from "common/types";
import { StateModel } from "./StateModel";
import { Workspace } from "./workspace/Workspace";
import { action, computed, observable, runInAction } from "mobx";
import { wait } from "common/utils";

export class ThemePreview extends StateModel {
  // i could also just read only
  @observable private accessor previewState: PreviewState;
  @observable private accessor previewHost: string;
  @observable private accessor previewPort: string;

  @observable public accessor useDefaultSettings: boolean;
  constructor(workspace: Workspace) {
    super(workspace);
    this.previewState = PreviewState.UNAVALIBLE;
    this.previewHost = window.helium.constants.DEFAULT_PREVIEW_HOST;
    this.previewPort = window.helium.constants.DEFAULT_PREVIEW_PORT;
    this.useDefaultSettings = true;

    this.setupPreviewStateListener();
  }

  @action
  public updatePreviewState(previewState: PreviewState) {
    this.previewState = previewState;
  }

  @action
  public updatePreviewOptions(options: { host: string; port: string }) {
    this.previewHost = options.host;
    this.previewPort = options.port;
  }

  @action
  public updatePreviewHost(host: string) {
    this.previewHost = host;
  }

  @action
  public updatePreviewPort(port: string) {
    this.previewPort = port;
  }

  @computed
  public get previewOptions() {
    return {
      host: this.previewHost,
      port: this.previewPort,
    };
  }

  private setupPreviewStateListener() {
    window.helium.shopify.onPreviewStateChange(
      action((newPreviewState) => {
        console.log(newPreviewState);

        if (this.isStopping && newPreviewState === PreviewState.OFF) {
          this.workspace.notifications.showNotification({
            type: "info",
            message: "Theme Preview stopped",
          });
        }
        // runInAction???
        this.previewState = newPreviewState;
        if (this.isStarting) {
          this.workspace.notifications.showNotification({
            type: "info",
            message: "Starting Theme Preview...",
          });
        } else if (this.isRunning) {
          this.workspace.notifications.showNotification({
            type: "success",
            message: "Theme Preview running"
          });
        } else if (this.isStopping) {
          this.workspace.notifications.showNotification({
            type: "info",
            message: "Stopping Theme Preview..."
          });
        }
      })
    );
  }

  public getPreviewState() {
    return this.previewState;
  }

  @computed
  public get isStarting() {
    return this.previewState === PreviewState.STARTING;
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

  @computed
  public get isStopping() {
    // only unavalible when there is no connected theme
    return this.previewState === PreviewState.STOPPING;
  }

  @action
  public async start() {
    if (!this.isRunning) {
      try {
        // should time out after a while (10-15 seconds)
        
        const options = this.useDefaultSettings ? undefined : {
          host: this.previewHost,
          port: this.previewPort,
        }; 


        await window.helium.shopify.startThemePreview(options);
      } catch (e) {

        console.log(e);

        await wait(500);
        // error details???
        runInAction(() => {
          this.workspace.notifications.showNotification({
            type: "error",
            message: "Error: Unable to start Theme Preview for this theme.",
          });
        });
      }
    }
  }

  @action
  public async stop() {
    if (this.isRunning) {
      // this.workspace.notifications.showNotification({
      //   type: "info",
      //   message: "Shutting down Theme Preview...",
      // });
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
        });
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
