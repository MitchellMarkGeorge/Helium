import { ConnectStoreOptions } from "common/types";
import { computed, makeObservable, observable } from "mobx";

export class Store {
    @observable public accessor storeName: string;
    @observable public accessor storeUrl: string;
    // the password is not needed in the renderer
    constructor(options: Omit<ConnectStoreOptions, 'password'>) {

        this.storeName = options.storeName;
        this.storeUrl = options.storeUrl;
    }

}