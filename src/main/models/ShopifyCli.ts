import { PreviewState, StartThemePreviewOptions } from "common/types";
import { HeliumWindow } from "./HeliumWindow";
import { ChildProcess, spawn } from "child_process";
import waitOn from "wait-on";
import { safeStorage } from "electron";
import commandExists from "command-exists";
import { constants } from "main/utils/constants";
// can use get-port-pleae
// think about execa

const CLI_COMMANDS = {
  START_PREVIEW: "shopify theme dev",
};

const WAIT_ON_TIMEOUT = 60 * 1000 // 30 seconds

export default class ShopifyCli {
  // operates on the context of the current theme in heliumWinow.getCurrentTheme();
  // might rename to previewStatus
  private previewState: PreviewState;
  // might group this into some kind of PreviewState
  private previewHost: string;
  private previewPort: string;
  // will just use the native ChildProcess for now
  // need to figure out if I want to use it...
  private previewChildProcess: ChildProcess | null;
  // tracks if the signal to shutdown the preview process was deleiverd successfuly
  private hasSentPreviewKillSignal: boolean;

  constructor(private readonly heliumWindow: HeliumWindow) {
    // PREVIEW IS ONLY UNAVASLIBLE IF THE CLI IS NOT PRESENT
    // THE PREVIEW IS SAID TO BE "AVALIBLE" IF CLI IS PRESENT (PreviewState.OFF - might rename this)
    this.previewState = this.checkCliAvailibility();
    // this.previewState = PreviewState.UNAVALIBLE;
    this.previewChildProcess = null;
    this.previewHost = constants.DEFAULT_PREVIEW_HOST;
    this.previewPort = constants.DEFAULT_PREVIEW_PORT;
    this.hasSentPreviewKillSignal = false;
  }

  // private async checkCliAvailibility() {
  //   let cliAvailible = false;
  //   try {
  //     await commandExists('shopify')
  //     cliAvailible = true;
  //   } catch (error) {
  //     cliAvailible = false
  //   }

  //   if (cliAvailible) {
  //     this.previewState = PreviewState.OFF;
  //   } else {
  //     this.previewState = PreviewState.UNAVALIBLE;
  //   }
  // }

  private checkCliAvailibility() {
    // using the sync version for now so I can call it in the constructor
    let cliAvailible = commandExists.sync("shopify");
    console.log("CLI Availible", cliAvailible);

    return cliAvailible ? PreviewState.OFF : PreviewState.UNAVALIBLE;
  }

  private get localPreviewLink() {
    return `http://${this.previewHost}:${this.previewPort}`;
  }

  public get isPreviewRunning() {
    return this.previewState === PreviewState.RUNNING;
  }

  public setPreviewIsAvalible() {
    if (
      !this.isPreviewRunning &&
      this.previewState === PreviewState.UNAVALIBLE
    ) {
      this.updatePreviewState(PreviewState.OFF);
    }
  }

  public setPreviewIsUnavalible() {
    if (
      !this.isPreviewRunning &&
      this.previewState !== PreviewState.UNAVALIBLE
    ) {
      this.updatePreviewState(PreviewState.UNAVALIBLE);
    }
  }

  // use a method like `updatePreviewState(state);` instead????
  private updatePreviewState(newState: PreviewState) {
    this.previewState = newState;
    this.heliumWindow.emitEvent("on-preview-state-change", this.previewState);
  }

  private get themePath() {
    return this.heliumWindow.getCurrentTheme()?.path as string;
  }

  public getPreviewState() {
    return this.previewState;
  }

  public async getThemes() {
    return Promise.resolve();
    // return new Promise((resolve, reject) => {
    //     const command = '';
    //     const output = await exec(command, );
    // });
  }

  /**
   * problem with this right now is that it might try and send preview state updates
   * even if the workspace is not showing (like on inital launch with a given inital state).
   * Simple fix would be to ignore the preview state updates
   */

  public startThemePreview(options?: StartThemePreviewOptions) {
    // PREVIEW STATE CHECK AND CONNECTED STORE CHECK WILL BE DONE BY UI
    // asserting values here again for type system and general correctness
    return new Promise<void>((resolve, reject) => {
      const storeInfo = this.heliumWindow.getConnectedStore();
      const currentTheme = this.heliumWindow.getCurrentTheme();

      if (!currentTheme) {
        return reject(new Error("No Theme opened to use for Theme Preview"));
      }

      if (!storeInfo) {
        return reject(new Error("No connected store to use for Theme Preview"));
      }

      if (this.previewChildProcess || this.isPreviewRunning) {
        return reject(new Error("Theme Preview process already running"));
        // should this be using a string instead? error parsing from the main process has been spooky
        // reject('');
      }

      // reset the value
      if (this.hasSentPreviewKillSignal) {
        this.hasSentPreviewKillSignal = false;
      }

      console.log(process.env);

      const themeAccessPassword = safeStorage.decryptString(
        Buffer.from(storeInfo.themeAccessPassword, "base64")
      );

      console.log(themeAccessPassword);

      if (options) {
        this.previewHost = options.host;
        this.previewPort = options.port;
      }

      // does this need a shell???
      // I won't be surprised if the command requires/should have the shell...
      try {
        this.previewChildProcess = spawn(CLI_COMMANDS.START_PREVIEW, {
          // should the cwd be process.cwd
          cwd: this.themePath, // might end up not setting this - might just set the theme path manually through the env options
          env: {
            // should extend from process.env??
            // I should look an see wht is in this opject
            ...process.env,
            SHOPIFY_FLAG_STORE: storeInfo.url,
            SHOPIFY_CLI_THEME_TOKEN: themeAccessPassword,
            SHOPIFY_FLAG_PATH: this.themePath,
            SHOPIFY_FLAG_HOST: this.previewHost,
            SHOPIFY_FLAG_PORT: this.previewPort,
            SHOPIFY_FLAG_OPEN: "true", // for now
          }, // put all options here
          shell: true,
        });

        // let scriptOutput = "";

        this.previewChildProcess.stdout?.setEncoding('utf8');

        this.previewChildProcess.stdout?.on('data', (data) => {
          console.log(`stdout: ${data}`);
        })

        // set the preview state to starting
        this.updatePreviewState(PreviewState.STARTING);


        // should I use `once` for events??
        this.previewChildProcess.on("spawn", async () => {
          
          // wait for preview url to be avalible
          console.log('spawed...')
          try {
            console.log(`waiting on ${this.previewHost}:${this.previewPort}`),
            await waitOn({
              resources: [
                `http-get://${this.previewHost}:${this.previewPort}`,
              ],
              timeout: WAIT_ON_TIMEOUT,
            }); // use timeout??
            console.log('preview url ready...')
            // once the preview url is avalible set the preview state as running
            // this.previewState = PreviewState.RUNNING;
            this.updatePreviewState(PreviewState.RUNNING);
            return resolve();
          } catch (error) {
            // if there was an error in waiting for the preview to be avalible,
            // change the preview state to error (might time it out so its not immediate)
            console.log('error waiting for the url')
            this.updatePreviewState(PreviewState.ERROR);
            // stop/kill the preview process
            await this.stopThemePreview();
            reject(); // reject after the preview process has been shut down
          }
        });

        // this error event should only handle if there is an error in spawining the process
        this.previewChildProcess.on("error", async (err) => {
          if (this.previewState === PreviewState.STARTING) {
            // if there was an error spawining the preview proccess
            console.log(err.message);
            console.log('error spawning')
            // set the preview sate to error
            this.updatePreviewState(PreviewState.ERROR);
            // set the preview sate to stopping (might time this out)
            this.updatePreviewState(PreviewState.STOPPING);
            // clean up preview process
            await this.cleanupPreviewProcess();
            // do we know if the process has been killed
            // set preview state to off
            this.updatePreviewState(PreviewState.OFF);
            reject(); // should it reject later??? should it reject as soon as everything is cleaned up???
          }
        });
      } catch (error) {
        console.log(error);
      }
    });
  }

  public async stopThemePreview() {
    // PREVIEW STATE CHECK WILL BE DONE BY UI
    return new Promise<void>((resolve, reject) => {
      if (this.previewChildProcess) {
        // add this error listener specially when the preview is trying to be stopped
        // should I ignore this event
        this.previewChildProcess.on("error", async () => {
          // this error event should only handle if there is an error in sending the kill signal to the process
          // if this happens, shouldn't I try and kill it again???
          // can try and implement the `execa.killTimeout` feature
          if (
            !this.hasSentPreviewKillSignal &&
            this.previewState === PreviewState.STOPPING
          ) {
            this.updatePreviewState(PreviewState.ERROR);
            // won't set the state to sporring here since that was the inital state before this error occured
            await this.cleanupPreviewProcess();
            this.updatePreviewState(PreviewState.OFF);
            // reject("There was an errror in killing the process"); // should it reject later??? should it reject as soon as everything is cleaned up???
            // reject();
            return reject();
          }
        });

        // add the close handler before killing the process
        this.previewChildProcess.on("close", async (exitCode) => {
          // 0 is a good exit code
          // if the process did not end successfully, set the preview state to error
          const exitedWithError = exitCode !== 1;

          if (exitedWithError) {
            // might look at the signal
            // handle any other kind of error
            if (this.previewState !== PreviewState.ERROR) {
              // handles if the status is already in error
              this.updatePreviewState(PreviewState.ERROR);
            }
          }
          // should be in PreviewState.STOPPING
          await this.cleanupPreviewProcess();
          // set preview state to off
          this.updatePreviewState(PreviewState.OFF);

          if (exitedWithError) {
            return reject();
          } else {
            return resolve();
          }
        });

        this.updatePreviewState(PreviewState.STOPPING);
        this.hasSentPreviewKillSignal = this.previewChildProcess?.kill(); // should I try and kill the children
      } else {
        // "Theme Process is not running"
        // add messages
        reject();
      }
    });
  }

  private async cleanupPreviewProcess() {
    // assumes the process has been killed
    if (this.previewChildProcess) {
      // wait for preview url to not be avalible right now
      await waitOn({
        resources: [`http-get://${this.previewHost}:${this.previewPort}/`],
        reverse: true, // use timeout
      });

      // clean up by removing all listeners and set the process objects to null
      // this is not neccessary - when the object is garbage collected, the listerners should be collected as well
      this.previewChildProcess?.removeAllListeners(); // is this nessesary?
      this.previewChildProcess = null;

      // reset value
      // childProcess.killed???
      this.hasSentPreviewKillSignal = false;
    }
  }

  public pullTheme(id: string) {
    // not needed right now
    console.log(id);
    return Promise.resolve();
  }

  public pushTheme() {
    // not needed right now
    return Promise.resolve();
  }

  public publishTheme() {
    // not needed right now
    return Promise.resolve();
  }

  public async logOut() {
    // think about this
  }
}
