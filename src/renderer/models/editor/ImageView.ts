import { OpenFileOptions, View } from "./types";

export class ImageView implements View {
    // should it have a default value of null???
    private imagePath: string | null;
    constructor() {
        this.imagePath = null;
    }

    public getImagePath() {
        return this.imagePath;
    }
    
    public async openFile({ path }: OpenFileOptions) {
        this.imagePath = path;
    }

    cleanup(): void {
        this.imagePath = null;
    }
}