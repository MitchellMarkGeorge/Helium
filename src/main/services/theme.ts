import path from "path";
import { pathExists, readFile } from "./fs";

interface SettingThemeInfo {
    name: string;
    theme_name: string;
    theme_author: string;
    theme_version: string;
    theme_documentation_url?: string;
    theme_support?: string;
}

const accessPath = (rootThemePath: string) => {
  return path.join(rootThemePath, "assets");
};

const configPath = (rootThemePath: string, ...paths: string[]) => {
  return path.join(rootThemePath, "config", ...paths);
};

const layoutPath = (rootThemePath: string, ...paths: string[]) => {
  return path.join(rootThemePath, "layout", ...paths);
};

const localesPath = (rootThemePath: string) => {
  return path.join(rootThemePath, "locales");
};

const sectionsPath = (rootThemePath: string) => {
  return path.join(rootThemePath, "sections");
};

const snippetsPath = (rootThemePath: string) => {
  return path.join(rootThemePath, "snippets");
};

const templatesPath = (rootThemePath: string) => {
  return path.join(rootThemePath, "templates");
};

const templatesCustommerPath = (rootThemePath: string) => {
  return path.join(rootThemePath, "templates", "customers");
};

const readThemeInfo = async (settingsSchemaPath: string): Promise<SettingThemeInfo>  => {
    // think about this type
    const settingsSchema: {name: string}[] = JSON.parse(await readFile(settingsSchemaPath));

    return settingsSchema.find(setting => setting.name === 'theme_info') as SettingThemeInfo;
};


export default {
  accessPath,
  configPath,
  layoutPath,
  localesPath,
  sectionsPath,
  snippetsPath,
  templatesPath,
  templatesCustommerPath,
  readThemeInfo
};
