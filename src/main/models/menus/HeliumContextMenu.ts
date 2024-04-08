import { Menu, MenuItemConstructorOptions } from "electron";
import { HeliumWindow } from "../HeliumWindow";

// this class might not be needed...
export class HeliumContextMenu {
    // private menu: Menu;
    // constructor(template: MenuItemConstructorOptions[]) {
    //     this.menu = Menu.buildFromTemplate(template);
    // }


    // public show(heliumWindow: HeliumWindow) {
    //     this.menu.popup({ window: heliumWindow.browserWindow });
    // }

    public show(heliumWindow: HeliumWindow, template: MenuItemConstructorOptions[]) {
        const menu = Menu.buildFromTemplate(template);
        menu.popup({ window: heliumWindow.browserWindow });
    }
}