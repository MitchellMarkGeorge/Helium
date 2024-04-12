import path from "path";
import { FsService } from "./fs";

interface SettingThemeInfo {
    name: string;
    theme_name: string;
    theme_author: string;
    theme_version: string;
    theme_documentation_url?: string;
    theme_support?: string;
}

export class ThemeService {

public static accessPath  (rootThemePath: string) {
  return path.join(rootThemePath, "assets");
}

public static configPath  (rootThemePath: string, ...paths: string[])  {
  return path.join(rootThemePath, "config", ...paths);
}

public static layoutPath  (rootThemePath: string, ...paths: string[])  {
  return path.join(rootThemePath, "layout", ...paths);
}

public static localesPath  (rootThemePath: string)  {
  return path.join(rootThemePath, "locales");
}

public static sectionsPath  (rootThemePath: string)  {
  return path.join(rootThemePath, "sections");
}

public static snippetsPath  (rootThemePath: string)  {
  return path.join(rootThemePath, "snippets");
}

public static templatesPath  (rootThemePath: string)  {
  return path.join(rootThemePath, "templates");
}

public static templatesCustommerPath  (rootThemePath: string)  {
  return path.join(rootThemePath, "templates", "customers");
}

public static async readThemeInfo(settingsSchemaPath: string): Promise<SettingThemeInfo>   {
    // think about this type
    const settingsSchema: {name: string}[] = JSON.parse(await FsService.readFile(settingsSchemaPath));

    return settingsSchema.find(setting => setting.name === 'theme_info') as SettingThemeInfo;
}
}



