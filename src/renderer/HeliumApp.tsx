import { wait } from "common/utils";
import { Workspace } from "./models/workspace/Workspace";
import { action, flow } from "mobx";

export class HeliumApp {
  private workspace: Workspace;

  constructor() {
    this.workspace = new Workspace();
  }

  // do I have to do this??????
  // this might not be needed
  // normal async/await might work
  @action
  public render = flow(function* (this: HeliumApp) {
    this.setupListeners();
    // there actually is no reason to set up the listerners inside the react components
    // dynamically import components before using them
    // render root component here

    // load inital state
    // if there was an error, set the default inial state
    // and show an error message
    try {
      const initalState = yield window.helium.app.loadInitalState();
      this.workspace.initFromInitalState(initalState);
    } catch (error) {
      this.workspace.initFromInitalState(
        window.helium.constants.DEFAULT_INITAL_STATE
      );
      yield wait(500);
      this.workspace.notifications.showMessageModal({
        type: "error",
        message: "There was an error loading the editor", // might use error message,
        secondaryButtonText: "Close",
      });
    }
    // update workspace when done
  });

  private setupListeners() {
    this.setupOnThemeInfoChange();
  }

  // this should be moved the Theme model
  private setupOnThemeInfoChange() {
    window.helium.shopify.onThemeInfoChange((themeInfo) => {
      if (this.workspace.hasTheme) {
        this.workspace.theme?.updateFromThemeInfo(themeInfo);
      }
    });
  }
}
