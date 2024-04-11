import { PreviewState } from "common/types";
import { HeliumWindow } from "./HeliumWindow";
import { ChildProcess, exec, spawn } from "child_process";
import waitOn from "wait-on";

const COMMANDS = {
    START_PREVIEW: 'shopify theme dev',
}

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

  public startThemePreview() {
    // PREVIEW STATE CHECK WILL BE DONE BY UI

    return new Promise<void>((resolve, reject) => {
      if (this.previewChildProcess) {
        throw new Error("Theme Preview process already running");
      }

      if (this.hasSentPreviewKillSignal) this.hasSentPreviewKillSignal = false; // reset value
      // does this need a shell???
      // I won't be surprised if the command requires shell...
      this.previewChildProcess = spawn(COMMANDS.START_PREVIEW, {
        cwd: this.themePath, // might end up not setting this - might just set the theme path manuallu through the env options
        env: {}, // put all options here
        // shell: true,
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
          resolve();
        } catch (error) {
          // if there was an error in waiting for the preview to be avalible,
          // change the preview state to error then stopping (might time it out so its not immediate)
          this.previewState = PreviewState.ERROR;

          this.previewState = PreviewState.STOPPING;
          // try an kill the kill the process and save if it was killed successfully
          this.hasSentPreviewKillSignal = this.previewChildProcess?.kill(
            "SIGTERM"
          ) as boolean;
          // this should in turn trigger either the 'error' -> 'exit' event
          // or just the 'exit' event
        }
      });

      this.previewChildProcess.on("error", async (err) => {
        // this error event should only handle if there is an error in spawining the process
        // 2) if there is an error in sending the kill signal to the process

        // TODO: CREATE ANOTHER ERROR HANDLER FOR THE `stopThemePreview()` to just handle the kill signal error

        // only problem is that I dont know if this is triggered on kill
        if (this.previewState === PreviewState.STARTING) {
          // if there was an error spawining the preview proccess or the preview kill signal was unable to be send
          console.log(err.message);
          // THIS SHOULD ONLY BE CALLED IF THERE WAS A PROBLEM STARTING THE PROCESS,
          // OR IF THERE WAS AN ERROR TRYING TO KILL IT
          // set the preview sate to error
          this.previewState = PreviewState.ERROR;
          reject(); // should it reject later??? should it reject as soon as everything is cleaned up???
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
    });
  }

  public async stopThemePreview() {
    // PREVIEW STATE CHECK WILL BE DONE BY UI
    return new Promise<void>((resolve, reject) => {
      if (this.previewChildProcess) {
        // add this error listener specially when the preview is trying to be stopped
        // shoudl I still handle this
        this.previewChildProcess.on("error", async (error) => {
            // this error event should only handle if there is an error in sending the kill signal to the process
            // if this happens, shouldn't I try and kill it again???
            // think about this
            // this.previewChildProcess?.pid;
            // process.kill()
          if (
            !this.hasSentPreviewKillSignal &&
            this.previewState === PreviewState.STOPPING
          ) {
            this.previewState = PreviewState.ERROR;
            reject('There was an errror in killing the process'); // should it reject later??? should it reject as soon as everything is cleaned up???
            // clean up by removing all listeners and set it to null
            this.previewChildProcess?.removeAllListeners();
            this.previewChildProcess = null;
            // wait for the preview url to no longer be avalible
            await waitOn({
              resources: [
                `http-get://${this.previewHost}:${this.previewPort}/`,
              ],
              reverse: true,
            });
            // set preview state to off
            this.previewState = PreviewState.OFF;
            // reset value
            this.hasSentPreviewKillSignal = false;
          }
        });
        // add the close handler before killing the process
        this.previewChildProcess.on("close", async (exitCode, signal) => {
          // 0 is a good exit code
          // if the process did not end successfully, set the preview state to error
          const exitedWithError = exitCode !== 1;

          if (exitedWithError) {
            // look at the signal
            // handle any other kind of error
            this.previewState = PreviewState.ERROR;
            reject(); // here for now
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
          resolve();
        });

        this.previewState = PreviewState.STOPPING;
        this.hasSentPreviewKillSignal =
          this.previewChildProcess?.kill("SIGTERM");
        // this.previewChildProcess.kill("SIGTERM");
        // I need a way to return a promise
      } else {
        // "Theme Process is not running"
        reject(new Error("Theme Preview process does not exist"));
      }
    });
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
