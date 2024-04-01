class HeliumUI {

    // private state;


    constructor() {
        // init state class here
    }

    public async render() {

        // this.setupListeners()
        // there actually is no reason to set up the listerners inside the react components
        // render root component here
        // dynamically import components before using them
    }

    private setUpOnThemeInfoChange() {
        window.helium.shopify.onThemeInfoChange((themeInfo) => {
            console.log(themeInfo);
        })
    }
}