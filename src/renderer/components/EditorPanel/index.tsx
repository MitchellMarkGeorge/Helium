import Logo from "../ui/Logo";
import { observer } from "mobx-react-lite";
import { useWorkspace } from "renderer/hooks/useWorkspace";

import "./EditorPanel.scss";
import TabBar from "./components/TabBar";
import CodeEditor from "./views/CodeEditor/CodeEditor";
import { EditorFile } from "renderer/models/editor/types";

function EditorPanel() {
  const workspace = useWorkspace();
  const currentFile = workspace.editor.getCurrentFile();
  if (workspace.editor.hasOpenFiles) {
    return (
      <div className="editor-panel">
        <TabBar
          openFiles={workspace.editor.getOpenFiles()}
        />
        <CodeEditor />
      </div>
    );
  } else {
    return <Logo full size="9rem" />;
    // return (
    //   <div className="editor-panel">
    //     <TabBar />
    //     <CodeEditor />
    //   </div>
    // );
  }
}

export default observer(EditorPanel);
