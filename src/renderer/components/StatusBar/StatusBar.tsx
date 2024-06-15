import { observer } from "mobx-react-lite";
import { useWorkspace } from "renderer/hooks/useWorkspace";

import "./StatusBar.scss";

function StatusBar() {
  const workspace = useWorkspace();
  if (!workspace.isShowingWorkspace) {
    return null;
  } else return <div className="statusbar"></div>;
}

export default observer(StatusBar);
