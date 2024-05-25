import { OpenFileOptions, View } from "./types";

export class MarkdownView implements View {
  private markdownContentMap: Map<string, string>;
  private currentMarkdownContent: string | null;
  constructor() {
    this.currentMarkdownContent = null;
    this.markdownContentMap = new Map();
  }

  public getMarkdownContent() {
    return this.currentMarkdownContent;
  }

  private hasMarkdownContent(path: string) {
    return this.markdownContentMap.has(path);
  }

  public async openFile({ path }: OpenFileOptions) {
    // read file and save content
    if (this.hasMarkdownContent(path)) {
      this.currentMarkdownContent = this.markdownContentMap.get(path) || null;
    } else {
      const markdown = await window.helium.fs.readFile({
        filePath: path,
        encoding: "utf8",
      });
      this.currentMarkdownContent = markdown;
    }
    console.log(path);
  }

  cleanup(): void {
    this.markdownContentMap.clear();
    this.currentMarkdownContent = null;
  }
}
