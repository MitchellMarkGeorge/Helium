import { observer } from "mobx-react-lite";
import Logo from "renderer/components/ui/Logo";
import "./HeliumWorkspace.scss";
import { useWorkspace } from "renderer/hooks/useWorkspace";
import SideBar from "../SideBar/SideBar";
import Button from "../ui/Button";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import SideBarPanel from "../SideBar/SideBarPanel";
import EditorPanel from "../EditorPanel";

function HeliumWorkspace() {
  const workspace = useWorkspace();

  const loadingPlaceholder = <Logo full size="9rem" />;

  const workspaceMarkup = (
    <PanelGroup direction="horizontal">
      <SideBar />
      <Panel collapsible collapsedSize={0} minSize={10} defaultSize={20}>
        <SideBarPanel activeSideBarOption={workspace.activeSideBarOption} />
      </Panel>
      <PanelResizeHandle className="workspace-resizer" />
      <Panel>
        <EditorPanel view={workspace.editor.getViewType()} />
      </Panel>
    </PanelGroup>
  );

  return (
    <div className="workspace">
      {workspace.isShowingWorkspace ? workspaceMarkup : loadingPlaceholder}
    </div>
  );
}

export default observer(HeliumWorkspace);
