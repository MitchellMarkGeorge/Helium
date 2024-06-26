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
import SideBarPanel from "../SideBar/SideBarPanel";
import EditorPanel from "../EditorPanel";
import { useEffect, useRef } from "react";
import { action, autorun } from "mobx";

// should this be in state
// this makes sure that the first time it is expanded that it does not use the minSize
// and that subsequently it uses the previous size
let hasBeenExpanded = false;

function HeliumWorkspace() {
  const workspace = useWorkspace();

  const sideBarPanelRef = useRef<ImperativePanelHandle>(null);

  useEffect(() => {
    const disposer = autorun(() => {
      console.log('in auto run');
      console.log(sideBarPanelRef.current?.isCollapsed());
      if (workspace.isSidePanelOpen && sideBarPanelRef.current?.isCollapsed()) {
        console.log("will expand");
        sideBarPanelRef.current.expand(!hasBeenExpanded ? 25 : undefined);
        hasBeenExpanded = true;
      } else if (!workspace.isSidePanelOpen && sideBarPanelRef.current?.isExpanded()) {
        sideBarPanelRef.current.collapse();
      }
    });
    return disposer;
  }, []);

  const loadingMarkup = <Logo full size="9rem" />;

  const workspaceMarkup = (
    <PanelGroup direction="horizontal">
      <SideBar />
      <Panel
        ref={sideBarPanelRef}
        collapsible
        minSize={10}
        defaultSize={0}
        order={1}
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
      <Panel order={2}>
        <EditorPanel viewType={workspace.editor.getViewType()} />
      </Panel>
    </PanelGroup>
  );

  return (
    <div className="workspace">
      {workspace.isShowingWorkspace ? workspaceMarkup : loadingMarkup}
    </div>
  );
}

export default observer(HeliumWorkspace);
