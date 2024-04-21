import { FileType } from "common/types";
import isBinaryPath from "is-binary-path";
import isImage from "is-image";
import isTextPath from "is-text-path";
import path from "path";

const fileNameMap: Record<string, FileType> = {
  ".eslintrc": FileType.JSON,
  ".prettierrc": FileType.JSON,
};

// can move this to commmon/utils and use the pathe module instead
const detectTextFileType = (filePath: string) => {
  const fileExtension = path.extname(filePath);
  switch (fileExtension) {
    // confirm all of these are correct
    case ".liquid":
      return FileType.LIQUID;
    case ".md":
    case ".markdown":
    case ".mkd":
      return FileType.MARKDOWN;
    case ".yaml":
    case ".yml":
      return FileType.YAML;
    case ".toml":
      return FileType.TOML;
    case ".json":
    case ".json5":
    case ".map":
      return FileType.JSON;
    case ".js":
    case ".cjs":
    case ".mjs":
      return FileType.JAVASCRIPT;
    case ".ts":
      // what if this is a binary video ts file
      return FileType.TYPESCRIPT;
    case ".css":
      return FileType.CSS;
    case ".scss":
    case ".sass":
      return FileType.SCSS;
    case ".less":
      return FileType.LESS;
    case ".html":
    case ".htm":
      return FileType.HTML;
    default:
      return FileType.PLAIN_TEXT;
  }
};

const detectFileTypeFromName = (fileName: string) => {
  return fileNameMap[fileName] || null;
};

const detect = (filePath: string): FileType => {
  const fileName = path.basename(filePath);

  // handle files with FileTypes based on their name
  const fileTypeFromName = detectFileTypeFromName(fileName);

  if (fileTypeFromName) {
    return fileTypeFromName;
  }

  // handle reguler text files
  if (isTextPath(filePath)) return detectTextFileType(filePath);
  // handle image files
  if (isImage(filePath)) return FileType.IMAGE;
  // handle binary files
  if (isBinaryPath(filePath)) return FileType.BINARY;

  // if none of the above, just return plain text
  return FileType.PLAIN_TEXT;
};

export default { detect };
