import { Menu, MenuItemConstructorOptions } from "electron";
import { HeliumWindow } from "../HeliumWindow";

// this class might not be needed...
export class HeliumContextMenu {
    public show(heliumWindow: HeliumWindow, template: MenuItemConstructorOptions[]) {
        const menu = Menu.buildFromTemplate(template);
        menu.popup({ window: heliumWindow.browserWindow });
    }
}