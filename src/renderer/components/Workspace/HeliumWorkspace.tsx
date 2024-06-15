import { observer } from "mobx-react-lite"
import Logo from "renderer/components/ui/Logo/Logo"
import "./HeliumWorkspace.scss";
import { useWorkspace } from "renderer/hooks/useWorkspace";
import SideBar from "../SideBar/SideBar";

function HeliumWorkspace() {
  const workspace = useWorkspace();

  return (
    <div className="workspace">
      {workspace.isShowingWorkspace ? <SideBar/> : <Logo full size="9rem"/>}
    </div>
  )
}

export default observer(HeliumWorkspace);

