import { observer } from "mobx-react-lite";
import { SideBarItemOption } from "renderer/models/workspace/types";
import Text from "renderer/components/ui/Text";
import "./SideBarPanel.scss";

interface Props {
  activeSideBarOption: SideBarItemOption;
}
function SideBarPanel(props: Props) {

  const getSideBarTitle = (option: SideBarItemOption) => {
    switch (option) {
      case SideBarItemOption.FILES:
        return "Files";
      case SideBarItemOption.PREVIEW:
        return "Preview";
      case SideBarItemOption.STORE:
        return "Store";
      case SideBarItemOption.THEME_INFO:
        return "Theme";
    }
  };

  return (
    <div className="sidebar-panel">
      <div className="sidebar-panel-title">
        <Text size="xs">{getSideBarTitle(props.activeSideBarOption)}</Text>
      </div>
    </div>
  );
}

export default observer(SideBarPanel);
