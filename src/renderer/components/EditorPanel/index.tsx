import { ViewType } from "renderer/models/editor/types";
import Logo from "../ui/Logo";
import { observer } from "mobx-react-lite";
import { useWorkspace } from "renderer/hooks/useWorkspace";

function EditorPanel() {
  const workspace = useWorkspace();
  if (workspace.editor.hasOpenFiles) {
    return <div></div>;
  } else {
    return <Logo full size="9rem"/>
  }
}

export default observer(EditorPanel);
