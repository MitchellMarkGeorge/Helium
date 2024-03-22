import { ThemeInfo } from "common/types";
import { HeliumWindow } from "./HeliumWindow";

export default class ShopifyCli {
    // operates on the context of the current theme in heliumWinow.getCurrentTheme();
    private isPreviewRunning;
    constructor(private heliumWindow: HeliumWindow) {
        this.isPreviewRunning = false;
    }

    public async getThemes() {
        return;
    }

    public async startThemePreview() {
        return;
    }

    public async stopThemePreview() {
        return;
    }

    public async pullTheme(id: string) {
        return;
    }

    public async pushTheme() {
        return;
    }

    public async publishTheme() {
        return;
    }


}