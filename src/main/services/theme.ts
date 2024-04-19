import path from "path";
import fileSystemService from "./fs";

interface SettingThemeInfo {
  name: string;
  theme_name: string;
  theme_author: string;
  theme_version: string;
  theme_documentation_url?: string;
  theme_support?: string;
}

function accessPath(rootThemePath: string) {
  return path.join(rootThemePath, "assets");
}

function configPath(rootThemePath: string, ...paths: string[]) {
  return path.join(rootThemePath, "config", ...paths);
}

function layoutPath(rootThemePath: string, ...paths: string[]) {
  return path.join(rootThemePath, "layout", ...paths);
}

function localesPath(rootThemePath: string) {
  return path.join(rootThemePath, "locales");
}

function sectionsPath(rootThemePath: string) {
  return path.join(rootThemePath, "sections");
}

function snippetsPath(rootThemePath: string) {
  return path.join(rootThemePath, "snippets");
}

function templatesPath(rootThemePath: string) {
  return path.join(rootThemePath, "templates");
}

function templatesCustommerPath(rootThemePath: string) {
  return path.join(rootThemePath, "templates", "customers");
}

async function readThemeInfo(
  settingsSchemaPath: string
): Promise<SettingThemeInfo> {
  // think about this type
  const settingsSchema: { name: string }[] = JSON.parse(
    await fileSystemService.readFile(settingsSchemaPath)
  );

  return settingsSchema.find(
    (setting) => setting.name === "theme_info"
  ) as SettingThemeInfo;
}

export default {
  accessPath,
  configPath,
  layoutPath,
  snippetsPath,
  localesPath,
  sectionsPath,
  templatesPath,
  templatesCustommerPath,
  readThemeInfo,
};
