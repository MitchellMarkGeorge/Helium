import { observer } from "mobx-react-lite";
import { SideBarItemOption } from "renderer/models/workspace/types";
import Text from "renderer/components/ui/Text";
import "./SideBarPanel.scss";
import FileExplorerPanel from "./components/FileExplorerPanel";
import PreviewPanel from "./components/PreviewPanel";
import StorePanel from "./components/StorePanel";
import ThemePanel from "./components/ThemePanel";
import Checkbox from "../ui/Checkbox";

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
        return "Development Store";
      case SideBarItemOption.THEME_INFO:
        return "Theme";
    }
  };

  const getSideBarPanelBody = (option: SideBarItemOption) => {
    switch (option) {
      case SideBarItemOption.FILES:
        return <FileExplorerPanel />;
      case SideBarItemOption.PREVIEW:
        return <PreviewPanel />;
      case SideBarItemOption.STORE:
        return <StorePanel />;
      case SideBarItemOption.THEME_INFO:
        return <ThemePanel />;
    }
  };

  return (
    <div className="sidebar-panel">
      <div className="sidebar-panel-title">
        <Text size="xs">{getSideBarTitle(props.activeSideBarOption)}</Text>
      </div>
      <div className="sidebar-panel-body">
        {getSideBarPanelBody(props.activeSideBarOption)}
      </div>
    </div>
  );
}

export default observer(SideBarPanel);
