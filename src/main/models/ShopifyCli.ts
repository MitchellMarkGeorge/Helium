import { PreviewState } from "common/types";
import { HeliumWindow } from "./HeliumWindow";
import { ChildProcess, exec, spawn } from "child_process";
import waitOn from "wait-on";

export default class ShopifyCli {
  // operates on the context of the current theme in heliumWinow.getCurrentTheme();
  // might rename to previewStatus
  private currentPreviewState: PreviewState;
  // private previewLink: string;
  // might group this into some kind of PreviewState
  private previewHost: string;
  private previewPort: number; // numnber??
  private previewChildProcess: ChildProcess | null;
  // tracks if the signal to shutdown the preview process was deleiverd successfuly
  private hasSentPreviewKillSignal: boolean;

  //   private onPreviewProcessExited: () => void;
  constructor(private heliumWindow: HeliumWindow) {
    this.currentPreviewState = PreviewState.OFF;
    this.previewChildProcess = null;
    // this.previewLink = ''; // FOR NOW
    this.previewHost = "127.0.0.1";
    this.previewPort = 9292;
    this.hasSentPreviewKillSignal = false;
    // this.onPreviewProcessExited = () => {};
  }

  private get localPreviewLink() {
    return `http://${this.previewHost}:${this.previewPort}`;
  }

  private set previewState(newState: PreviewState) {
    this.currentPreviewState = newState;
    this.heliumWindow.emitEvent(
      "on-preview-state-change",
      this.currentPreviewState
    );
  }

  private get previewState() {
    return this.currentPreviewState;
  }

  private get themePath() {
    return this.heliumWindow.getCurrentTheme()?.path as string;
  }

  public getPreviewState() {
    return this.currentPreviewState;
  }

  public async getThemes() {
    return Promise.resolve();
    // return new Promise((resolve, reject) => {
    //     const command = '';
    //     const output = await exec(command, );
    // });
  }

  public async startThemePreview() {
    // PREVIEW STATE CHECK WILL BE DONE BY UI
    if (this.previewChildProcess) {
      throw new Error("Theme Preview already running");
    }

    if (this.hasSentPreviewKillSignal) this.hasSentPreviewKillSignal = false; // reset value
    const command = "shopify theme dev";
    this.previewChildProcess = spawn(command, {
      cwd: this.themePath, // might end up not setting this - might just set the theme path manuallu through the env options
      env: {}, // put all options here
    });

    // set the preview state to starting
    this.previewState = PreviewState.STARTING;

    this.previewChildProcess.on("spawn", async () => {
      // this.previewState = PreviewState.STARTING;
      // wait for preview url to be avalible
      try {
        await waitOn({
          resources: [`http-get://${this.previewHost}:${this.previewPort}/`],
        });
        // once the preview url is avalible set the preview state as running
        this.currentPreviewState = PreviewState.RUNNING;
      } catch (error) {
        // if there was an error in waiting for the preview to be avalible,
        // change the preview state to error then stopping (might time it out so its not immediate)
        this.previewState = PreviewState.ERROR;

        this.previewState = PreviewState.STOPPING;
        // try an kill the kill the process and save if it was killed successfully
        this.hasSentPreviewKillSignal = this.previewChildProcess?.kill("SIGTERM") as boolean;
        // this should in turn trigger either the 'error' -> 'exit' event
        // or just the 'exit' event
      }
    });

    this.previewChildProcess.on("error", async (err) => {
        // this error event should only handle:
        // 1) if there is an error in spawining the process
        // 2) if there is an error in sending the kill signal to the process

      // only problem is that I dont know if this is triggered on kill
      if (
        this.previewState === PreviewState.STARTING ||
        !this.hasSentPreviewKillSignal && this.previewState === PreviewState.STOPPING
      ) {
        // if there was an error spawining the preview proccess or the preview kill signal was unable to be send
        console.log(err.message);
        // THIS SHOULD ONLY BE CALLED IF THERE WAS A PROBLEM STARTING THE PROCESS,
        // OR IF THERE WAS AN ERROR TRYING TO KILL IT
        // set the preview sate to error
        this.previewState = PreviewState.ERROR;
        // clean up by removing all listeners and set it to null
        this.previewChildProcess?.removeAllListeners();
        this.previewChildProcess = null;
        // wait for the preview url to no longer be avalible
        await waitOn({
          resources: [`http-get://${this.previewHost}:${this.previewPort}/`],
          reverse: true,
        });
        // set preview state to off
        this.previewState = PreviewState.OFF;
        // reset value
        this.hasSentPreviewKillSignal = false;
      }
    });

    // should I use close
    // should probably use close (dont know what other child processes)
    this.previewChildProcess.on("exit", async (exitCode, signal) => {
      // 0 is a good exit code
      // if the process did not end successfully, set the preview state to error
      if (exitCode !== 0) { // look at the signal
        // handle any other kind of error
        this.previewState = PreviewState.ERROR;
      }
      // wait for preview url to not be avalible right now
      await waitOn({
        resources: [`http-get://${this.previewHost}:${this.previewPort}/`],
        reverse: true,
      });

    // clean up by removing all listeners and set the process objects to null
      this.previewChildProcess?.removeAllListeners();
      this.previewChildProcess = null;
        // set preview state to off
      this.previewState = PreviewState.OFF;
        // reset value
      this.hasSentPreviewKillSignal = false;
    });
  }

  public async stopThemePreview() {
    // PREVIEW STATE CHECK WILL BE DONE BY UI
    if (!this.previewChildProcess) {
      throw new Error("Theme Preview is not running");
    }
    this.previewState = PreviewState.STOPPING;
    this.hasSentPreviewKillSignal = this.previewChildProcess?.kill("SIGTERM");
    // this.previewChildProcess.kill("SIGTERM");
    // THE PROCESS NEEDS TO BE KILLED GRACEFULLY SO IT DOES NOT TRIGGERE THE "ERROR" event
    // I need a way to return a promise
  }

  public async pullTheme(id: string) {
    console.log(id);
  }

  public async pushTheme() {
    return;
  }

  public async publishTheme() {
    return;
  }

  public async logOut() {
    // think about this
  }
}
