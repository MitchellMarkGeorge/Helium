import { observer } from "mobx-react-lite";
import { SideBarItemOption } from "renderer/models/workspace/types"
import Text from "renderer/components/ui/Text";
import "./SideBarPanel.scss";

interface Props {
    activeSideBarOption: SideBarItemOption | null;
}
function SideBarPanel(props: Props) {
  return (
    <div className="sidebar-panel">
        <div className="sidebar-panel-title">
            <Text size="xs">Title</Text>
        </div>
    </div>
  )
}

export default observer(SideBarPanel);
