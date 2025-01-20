import {
  Braces,
  FileEarmark,
  FileEarmarkBinary,
  FileEarmarkImage,
  Water,
} from "react-bootstrap-icons";
import CSS from "../assets/icons/css.svg";
import HTML from "../assets/icons/html.svg";
import JS from "../assets/icons/js.svg";
import LESS from "../assets/icons/less.svg";
import MARKDOWN from "../assets/icons/markdown.svg";
import SASS from "../assets/icons/sass.svg";
import TS from "../assets/icons/ts.svg";
import YAML from "../assets/icons/yaml.svg";
import { FileType, FileTypeEnum } from "common/types";

export function useFileIcon(fileType: FileType | null) {
  if (fileType === null) return null;
  switch (fileType) {
    case FileTypeEnum.LIQUID:
      return <Water color="#3B82F6" size="1rem" />;
    case FileTypeEnum.CSS:
      return <CSS height="1rem" width="1rem" />;
    case FileTypeEnum.HTML:
      return <HTML height="1rem" width="1rem" />;
    case FileTypeEnum.JSON:
      return <Braces color="#EAB308" size="1rem" />;
    case FileTypeEnum.MARKDOWN:
      return <MARKDOWN height="1rem" width="1rem" />;
    case FileTypeEnum.LESS:
      return <LESS height="1rem" width="1rem" />;
    case FileTypeEnum.SCSS:
      return <SASS height="1rem" width="1rem" />;
    case FileTypeEnum.TYPESCRIPT:
      return <TS height="1rem" width="1rem" />;
    case FileTypeEnum.JAVASCRIPT:
      return <JS height="1rem" width="1rem" />;
    case FileTypeEnum.YAML:
      return <YAML height="1rem" width="1rem" />;
    case FileTypeEnum.IMAGE:
      return <FileEarmarkImage color="#22C55E" size="1rem" />;
    case FileTypeEnum.BINARY:
      return <FileEarmarkBinary color="#65A30D" size="1rem" />;
    case FileTypeEnum.PLAIN_TEXT:
    default:
      return <FileEarmark size="1rem" />;
  }
}
