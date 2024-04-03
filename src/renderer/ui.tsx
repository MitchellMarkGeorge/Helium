class HeliumUI {

    // private state;


    constructor() {
        // init state class here
    }

    public async render() {

        // this.setupListeners()
        // there actually is no reason to set up the listerners inside the react components
        // dynamically import components before using them
        // render root component here
        // loadInitalData
        // update workspace when done
    }

    private setUpOnThemeInfoChange() {
        window.helium.shopify.onThemeInfoChange((themeInfo) => {
            console.log(themeInfo);
        })
    }
}