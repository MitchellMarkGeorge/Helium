import { FileTypeEnum } from "common/types";
import { observer } from "mobx-react-lite";
import {
  Braces,
  ChevronDown,
  ChevronRight,
  FileEarmark,
  FileEarmarkBinary,
  FileEarmarkImage,
  Folder,
  Folder2Open,
  Water,
} from "react-bootstrap-icons";
import Text from "renderer/components/ui/Text";
import { Entry, FileEntry } from "renderer/models/fileexplorer/types";
import { isDirectoryEntry, isFileEntry } from "renderer/models/fileexplorer/utils";
import CSS from "./icons/css.svg";
import HTML from "./icons/html.svg";
import JS from "./icons/js.svg";
import LESS from "./icons/less.svg";
import MARKDOWN from "./icons/markdown.svg";
import SASS from "./icons/sass.svg";
import TS from "./icons/ts.svg";
import YAML from "./icons/yaml.svg";
import "./FileExplorerItem.scss";
import { action, toJS } from "mobx";
import { OpenFileOptions } from "renderer/models/editor/types";
import { useWorkspace } from "renderer/hooks/useWorkspace";
import classNames from "classnames";

interface Props {
  entry: Entry;

//   openFile: (options: OpenFileOptions) => Promise<void>;
//   expandDirectory: (dirPath: string) => Promise<void>;
//   collapseDirectory: (dirPath: string) => void;
}

function FileExplorerItem({ entry }: Props) {
    const workspace = useWorkspace();
    const isSelected = workspace.fileExplorer.selectedEntry === entry.path;
    const fileExplorerItemClassnames = classNames("file-explorer-item", {
      "selected": isSelected
    })
  const getChevron = () => {
    if (isDirectoryEntry(entry)) {
      if (entry.isExpanded) return <ChevronDown />;
      else return <ChevronRight />;
    }
    return null;
  };

  const getIcon = () => {
    if (isDirectoryEntry(entry)) {
      if (entry.isExpanded) return <Folder2Open />;
      else return <Folder />;
    }
    return getFileIcon();
  };

  const getFileIcon = () => {
    switch ((entry as FileEntry).fileType) {
      case FileTypeEnum.LIQUID:
        return <Water color="#3B82F6" size="1rem"/>;
      case FileTypeEnum.CSS:
        return <CSS height="1rem" width="1rem"/>;
      case FileTypeEnum.HTML:
        return <HTML height="1rem" width="1rem" />;
      case FileTypeEnum.JSON:
        return <Braces color="#EAB308" size="1rem" />;
      case FileTypeEnum.MARKDOWN:
        return <MARKDOWN height="1rem" width="1rem" />;
      case FileTypeEnum.LESS:
        return <LESS height="1rem" width="1rem"/>;
      case FileTypeEnum.SCSS:
        return <SASS height="1rem" width="1rem" />;
      case FileTypeEnum.TYPESCRIPT:
        return <TS height="1rem" width="1rem"/>;
      case FileTypeEnum.JAVASCRIPT:
        return <JS height="1rem" width="1rem"/>;
      case FileTypeEnum.YAML:
        return <YAML height="1rem" width="1rem"/>;
      case FileTypeEnum.IMAGE:
        return <FileEarmarkImage color="#22C55E" size="1rem"/>;
      case FileTypeEnum.BINARY:
        return <FileEarmarkBinary color="#65A30D" size="1rem"/>;
      case FileTypeEnum.PLAIN_TEXT:
      default:
        return <FileEarmark size="1rem"/>;
    }
  };

  return (
    <div
      // className="file-explorer-item"
      className={fileExplorerItemClassnames}
    //   style={{ paddingLeft: `${entry.depth * 20}px`, paddingRight: "20px" }}
      // style={{ paddingLeft: `${(entry.depth * 20) / 16}rem`, paddingRight: "1.25rem" }}
      style={{ paddingLeft: `${(entry.depth * 20) / 16}rem` }}
      onClick={action(() => {
        // workspace.fileExplorer.
        workspace.fileExplorer.selectEntry(entry.path);
        if (isDirectoryEntry(entry)) {
            if (entry.isExpanded) {
               workspace.fileExplorer.collapse(entry.path); 
            } else {
                // console.log("here");
                workspace.fileExplorer.expand(entry.path);
            }
        } else if (isFileEntry(entry)) {
            console.log(toJS(entry));
            // workspace.openFile(entry);
        }
      })}
    >
      <div className="file-explorer-item-chevron">{getChevron()}</div>
      <div className="file-explorer-item-icon">{getIcon()}</div>
      <Text size="xs" className="file-explorer-item-text">{entry.basename}</Text>
    </div>
  );
}

export default observer(FileExplorerItem);
