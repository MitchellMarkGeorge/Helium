import { observer } from "mobx-react-lite";
import Logo from "renderer/components/ui/Logo";
import "./HeliumWorkspace.scss";
import { useWorkspace } from "renderer/hooks/useWorkspace";
import SideBar from "../SideBar/SideBar";
import Button from "../ui/Button";
import {
  ImperativePanelHandle,
  Panel,
  PanelGroup,
  PanelResizeHandle,
} from "react-resizable-panels";
import SideBarPanel from "../SideBarPanel";
import EditorPanel from "../EditorPanel";
import { useEffect, useRef } from "react";
import { action, autorun } from "mobx";
import classNames from "classnames";
import ThemePreviewPanel from "../ThemePreviewPanel";

// should this be in state
// this makes sure that the first time it is expanded that it does not use the minSize
// and that subsequently it uses the previous size
let hasBeenExpanded = false;

function HeliumWorkspace() {
  const workspace = useWorkspace();

  const sideBarPanelRef = useRef<ImperativePanelHandle>(null);

  useEffect(() => {
    // const disposer = autorun(() => {
    return autorun(() => {
      console.log("in auto run");
      console.log(sideBarPanelRef.current?.isCollapsed());
      if (workspace.isSidePanelOpen && sideBarPanelRef.current?.isCollapsed()) {
        console.log("will expand");
        sideBarPanelRef.current.expand(!hasBeenExpanded ? 25 : undefined);
        hasBeenExpanded = true;
      } else if (
        !workspace.isSidePanelOpen &&
        sideBarPanelRef.current?.isExpanded()
      ) {
        sideBarPanelRef.current.collapse();
      }
    });
    // return disposer;
  }, []);

  // for now
  const loadingMarkup = <Logo full size="9rem" />;

  const workspaceContainerClasses = classNames("workspace-container", {
    "sidebar-expanded": workspace.isSidePanelOpen,
  });

  const workspaceMarkup = (
    <div className={workspaceContainerClasses}>
      <SideBar />
      <PanelGroup direction="horizontal">
        <Panel
          className="workspace-panel"
          ref={sideBarPanelRef}
          collapsible
          minSize={20}
          defaultSize={0}
          maxSize={50}
          order={1}
          id="sidebar-panel"
          // onExpand={}
          onCollapse={action(() => {
            if (workspace.isSidePanelOpen) {
              workspace.isSidePanelOpen = false;
            }
          })}
          onExpand={action(() => {
            if (!workspace.isSidePanelOpen) {
              workspace.isSidePanelOpen = true;
            }
          })}
        >
          <SideBarPanel activeSideBarOption={workspace.activeSideBarOption} />
        </Panel>
        <PanelResizeHandle className="workspace-resizer" />
        <Panel order={2} className="workspace-panel" minSize={30} id="editor-panel">
          <EditorPanel />
        </Panel>
        {workspace.themePreview.shouldShowThemePreview ? (
          <>
            <PanelResizeHandle className="workspace-resizer" />
            <Panel order={3} className="workspace-panel" minSize={30} id="theme-preview">
              <ThemePreviewPanel />
            </Panel>
          </>
        ) : null}
      </PanelGroup>
    </div>
  );

  return (
    <div className="workspace">
      {workspace.isShowingWorkspace ? workspaceMarkup : loadingMarkup}
    </div>
  );
}

export default observer(HeliumWorkspace);
