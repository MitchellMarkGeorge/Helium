import "./TabBar.scss";
import Tab from "./components/Tab";
import { EditorFile } from "renderer/models/editor/types";
import { observer } from "mobx-react-lite";
import { useWorkspace } from "renderer/hooks/useWorkspace";

interface Props {
  openFiles: EditorFile[];
}

function TabBar({ openFiles }: Props) {
  const workspace = useWorkspace();
  return (
    <div className="tab-bar">
      {openFiles.map((file) => (
        // <Tab entry={file} isSelected={file.path === selectedFilePath} key={file.path} />
        <Tab
          file={file}
          isSelected={workspace.editor.isCurrentFile(file.path)}
          key={file.path}
        />
      ))}
    </div>
  );
}

export default observer(TabBar);
