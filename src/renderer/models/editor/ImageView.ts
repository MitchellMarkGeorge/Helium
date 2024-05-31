import { action, observable } from "mobx";
import { OpenFileOptions, View } from "./types";

export class ImageView implements View {
    // should it have a default value of null???
    @observable private accessor imagePath: string | null;
    constructor() {
        this.imagePath = null;
    }

    public getImagePath() {
        return this.imagePath;
    }

    @action
    public setImagePath(imagePath: string) {
        this.imagePath = imagePath;
    }
    
    @action
    public async openFile({ path }: OpenFileOptions) {
        this.imagePath = path;
    }

    @action
    reset(): void {
        this.imagePath = null;
    }
}