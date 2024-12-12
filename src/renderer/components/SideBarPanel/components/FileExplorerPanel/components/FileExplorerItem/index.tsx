import { observer } from "mobx-react-lite";
import {
  ChevronDown,
  ChevronRight,
  Folder,
  Folder2Open,
} from "react-bootstrap-icons";
import Text from "renderer/components/ui/Text";
import { Entry, FileEntry } from "renderer/models/fileexplorer/types";
import {
  isDirectoryEntry,
  isFileEntry,
} from "renderer/models/fileexplorer/utils";
import "./FileExplorerItem.scss";
import { action, toJS } from "mobx";
import { useWorkspace } from "renderer/hooks/useWorkspace";
import classNames from "classnames";
import { useFileIcon } from "renderer/hooks/useFileIcon";
import { EditorFile } from "renderer/models/editor/types";

interface Props {
  entry: Entry;

  //   openFile: (options: OpenFileOptions) => Promise<void>;
  //   expandDirectory: (dirPath: string) => Promise<void>;
  //   collapseDirectory: (dirPath: string) => void;
}

const INDENTATION_PADDING_UNIT = 20;

function FileExplorerItem({ entry }: Props) {
  const workspace = useWorkspace();

  const fileIcon = useFileIcon(isFileEntry(entry) ? entry.fileType : null);

  const isSelected = workspace.fileExplorer.selectedEntry === entry.path;

  const fileExplorerItemClassnames = classNames("file-explorer-item", {
    selected: isSelected,
  });

  const getChevron = () => {
    if (isDirectoryEntry(entry)) {
      if (entry.isExpanded) return <ChevronDown />;
      else return <ChevronRight />;
    }
    return null;
  };

  const entryToEditorFile = (
    entry: FileEntry,
    hasTab: boolean = true
  ): EditorFile => {
    const { path, fileType, basename } = entry;
    return { path, fileType, basename, hasTab, isUnsaved: false };
  };

  const getIcon = () => {
    if (isDirectoryEntry(entry)) {
      if (entry.isExpanded) return <Folder2Open />;
      else return <Folder />;
    }
    return fileIcon;
  };

  return (
    <div
      // className="file-explorer-item"
      className={fileExplorerItemClassnames}
      //   style={{ paddingLeft: `${entry.depth * 20}px`, paddingRight: "20px" }}
      // style={{ paddingLeft: `${(entry.depth * 20) / 16}rem`, paddingRight: "1.25rem" }}
      style={{
        paddingLeft: `${(entry.depth * INDENTATION_PADDING_UNIT) / 16}rem`,
      }}
      onContextMenu={() => {
        if (isDirectoryEntry(entry)) {
          window.helium.app.showFolderItemContextMenu(entry.path);
        } else if (isFileEntry(entry)) {
          window.helium.app.showFileItemContextMenu(entry.path);
        }
      }}
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
          // workspace.openFile({
          //   fileType: entry.fileType,
          //   path: entry.path,
          //   basename: entry.basename,
          //   hasTab: true,
          // });
          const editorFile = entryToEditorFile(entry);
          console.log(editorFile);
          workspace.editor.openFile(editorFile);
        }
      })}
    >
      <div className="file-explorer-item-chevron">{getChevron()}</div>
      <div className="file-explorer-item-icon">{getIcon()}</div>
      {/*  should this be sm?       */}
      <Text size="xs" className="file-explorer-item-text">
        {entry.basename}
      </Text>
    </div>
  );
}

export default observer(FileExplorerItem);
