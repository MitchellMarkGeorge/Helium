import { observer } from "mobx-react-lite";
import "./TitleBar.scss";
import { useWorkspace } from "renderer/hooks/useWorkspace";
import classNames from "classnames";
import { LayoutSidebar, Gear, LayoutSidebarInset } from "react-bootstrap-icons";
import TitleBarButton from "./components/TitleBarButton/TitleBarButton";
import { action } from "mobx";
import Text from "renderer/components/ui/Text"

function TitleBar() {
  const workspace = useWorkspace();

  const tilebarClasses = classNames({
    'titlebar': true,
    "workspace-visible": workspace.isShowingWorkspace,
  });

  return (
    <div className={tilebarClasses}>
      <div className="titlebar-drag-region"></div>
      {workspace.isShowingWorkspace && (
        <>
          <Text size="sm" className="titlebar-title">{workspace.windowTitle}</Text>
          <div className="titlebar-icon-container">
            <TitleBarButton
              icon={
                workspace.isSidePanelOpen ? LayoutSidebarInset : LayoutSidebar
              }
              onClick={() => workspace.toggleSidePanel()}
            />
            <TitleBarButton icon={Gear} onClick={() => {}} />
          </div>
        </>
      )}
    </div>
  );
}

export default observer(TitleBar);
