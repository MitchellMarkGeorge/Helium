import { ConnectStoreOptions } from "common/types";

export class Store {
    private storeName: string;
    private storeUrl: string;
    // the password is not needed in the renderer
    constructor(options: Omit<ConnectStoreOptions, 'password'>) {
        this.storeName = options.storeName;
        this.storeUrl = options.storeUrl;
    }

    public getStoreURL() {
        return this.storeUrl;
    }

    public getStoreName() {
        return this.storeName;
    }
}