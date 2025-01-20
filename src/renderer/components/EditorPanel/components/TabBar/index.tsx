import "./TabBar.scss";
import Tab from "./components/Tab";
import { EditorFile } from "renderer/models/editor/types";
import { observer } from "mobx-react-lite";
import { useWorkspace } from "renderer/hooks/useWorkspace";

interface Props {
  tabs: EditorFile[];
}

function TabBar({ tabs }: Props) {
  const workspace = useWorkspace();
  return (
    <div className="tab-bar">
      {tabs.map((file) => (
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
