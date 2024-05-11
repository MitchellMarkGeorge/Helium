import { FileType, FileTypeEnum } from "common/types";
import isBinaryPath from "is-binary-path";
import isImage from "is-image";
import isTextPath from "is-text-path";
import path from "path";

// figure out how to do this
const fileNameMap: Record<string, FileType> = {
  ".eslintrc": FileTypeEnum.JSON,
  ".prettierrc": FileTypeEnum.JSON,
};

// can move this to commmon/utils and use the pathe module instead
const detectTextFileType = (filePath: string) => {
  const fileExtension = path.extname(filePath);
  switch (fileExtension) {
    // confirm all of these are correct
    case ".liquid":
      return FileTypeEnum.LIQUID;
    case ".md":
    case ".markdown":
    case ".mkd":
      return FileTypeEnum.MARKDOWN;
    case ".yaml":
    case ".yml":
      return FileTypeEnum.YAML;
    case ".json":
    case ".json5":
    case ".map":
      return FileTypeEnum.JSON;
    case ".js":
    case ".cjs":
    case ".mjs":
      return FileTypeEnum.JAVASCRIPT;
    case ".ts":
      // what if this is a binary video ts file
      return FileTypeEnum.TYPESCRIPT;
    case ".css":
      return FileTypeEnum.CSS;
    case ".scss":
    case ".sass":
      return FileTypeEnum.SCSS;
    case ".less":
      return FileTypeEnum.LESS;
    case ".html":
    case ".htm":
      return FileTypeEnum.HTML;
    default:
      return FileTypeEnum.PLAIN_TEXT;
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
  if (isImage(filePath)) return FileTypeEnum.IMAGE;
  // handle binary files
  if (isBinaryPath(filePath)) return FileTypeEnum.BINARY;

  // if none of the above, just return plain text
  return FileTypeEnum.PLAIN_TEXT;
};

export default { detect };
