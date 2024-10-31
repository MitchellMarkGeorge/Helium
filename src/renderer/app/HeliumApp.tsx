import { wait } from "common/utils";
import { Workspace } from "../models/workspace/Workspace";
import { action, flow } from "mobx";
import { createRoot } from "react-dom/client";
import TitleBar from "../components/TitleBar/TitleBar";
import HeliumWorkspace from "../components/Workspace/HeliumWorkspace";
import StatusBar from "../components/StatusBar/StatusBar";
import { WorkspaceContext } from "renderer/contexts/Workspace";
import "./HeliumApp.scss";
import Modals from "renderer/components/ui/Modals";
import { createHighlighter, ThemeInput } from "shiki";
import { shikiToMonaco } from "@shikijs/monaco";
import monaco from "monaco-editor";

import theme from "./theme.json";

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

    const highlighter = yield createHighlighter({
      themes: [theme as unknown as ThemeInput],
      langs: [
        "javascript",
        "typescript",
        "json",
        "json5",
        "jsonc",
        "yaml",
        "liquid",
        "html",
        "css",
        "less",
        "sass",
        "scss",
      ],
    });

    shikiToMonaco(highlighter, monaco);
    // const themeIds = highlighter.getLoadedThemes()
    // for (const themeId of themeIds) {
    //   const tmTheme = highlighter.getTheme(themeId)
    //   const monacoTheme = textmateThemeToMonacoTheme(tmTheme)
    //   console.log(monacoTheme);
    // }

    const app = (
      <WorkspaceContext.Provider value={this.workspace}>
        <div className="app-container">
          <TitleBar />
          <HeliumWorkspace />
          <StatusBar />
          <Modals />
        </div>
      </WorkspaceContext.Provider>
    );

    const root = createRoot(document.getElementById("app") as HTMLElement);
    root.render(app);

    // load inital state
    // if there was an error, set the default inial state
    // and show an error message
    try {
      // document.body.style.cursor = "progress";
      const initalState = yield window.helium.app.loadInitalState();
      // throw new Error();
      this.workspace.initFromInitalState(initalState);
      // yield wait(1000);
      // this.workspace.notifications.showMessageModal({
      //   type: "error",
      //   message: "This is a test.",
      //   secondaryButtonText: "Close"
      // });
    } catch (error) {
      // document.body.style.cursor = "auto";
      this.workspace.initFromInitalState(
        window.helium.constants.DEFAULT_INITAL_STATE
      );
      console.log("error");
      yield wait(500);
      this.workspace.notifications.showMessageModal({
        type: "error",
        // thik of better error message
        message: "There was an error loading the inital state.", // might use error message,
        secondaryButtonText: "Close",
      });
    }
    // document.body.style.cursor = "auto";
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
