import { observer } from "mobx-react-lite";
import "./TitleBar.scss";
import { useWorkspace } from "renderer/hooks/useWorkspace";
import classNames from "classnames";

function TitleBar() {
  const workspace = useWorkspace();

  const tilebarClasses = classNames({
    titlebar: true,
    'workspace-showing': workspace.isShowingWorkspace,
  });

  return (
    <div className={tilebarClasses}>
      {workspace.isShowingWorkspace && (
        <>
          <div className="titlebar-title text-sm">{workspace.windowTitle}</div>
          <div className="titlebar-icons">
            <i className="bi bi-layout-sidebar"></i>
            <i className="bi bi-gear"></i>
          </div>
        </>
      )}
    </div>
  );
}

export default observer(TitleBar);
