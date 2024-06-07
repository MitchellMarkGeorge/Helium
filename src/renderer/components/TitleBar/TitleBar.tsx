import { observer } from "mobx-react-lite";
import "./TitleBar.scss";
import { useWorkspace } from "renderer/hooks/useWorkspace";

function TitleBar() {
  const workspace = useWorkspace();
  return (
    <div className="titlebar">
      <div className="titlebar-title text-sm">
        {workspace.shouldShowWorkspace ? workspace.windowTitle : "Loading..."}
      </div>
      <div className="titlebar-icons">
        <i className="bi bi-layout-sidebar"></i>
        <i className="bi bi-gear"></i>
      </div>
    </div>
  );
}

export default observer(TitleBar);
