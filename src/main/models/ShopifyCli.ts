import { PreviewState } from "common/types";
import { HeliumWindow } from "./HeliumWindow";


export default class ShopifyCli {
    // operates on the context of the current theme in heliumWinow.getCurrentTheme();
    private previewState: PreviewState;
    private previewLink: string;
    constructor(private heliumWindow: HeliumWindow) {
        this.previewState = PreviewState.OFF;
        this.previewLink = ''; // FOR NOW
    }

    public getPreviewState() {
        return this.previewState;
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
        console.log(id);
        return;
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