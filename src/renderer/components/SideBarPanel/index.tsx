import { observer } from "mobx-react-lite";
import { SideBarItemOption } from "renderer/models/workspace/types";
import Text from "renderer/components/ui/Text";
import FileExplorerPanel from "./components/FileExplorerPanel";
import PreviewPanel from "./components/PreviewPanel";
import StorePanel from "./components/StorePanel";
import ThemePanel from "./components/ThemePanel";
import "./SideBarPanel.scss";
import classNames from "classnames";
import IconButton from "../ui/IconButton/IconButton";
import { ThreeDots } from "react-bootstrap-icons";
import { useWorkspace } from "renderer/hooks/useWorkspace";

interface Props {
  activeSideBarOption: SideBarItemOption;
}
function SideBarPanel(props: Props) {
  const isShowingFileExplorerPanel =
    props.activeSideBarOption === SideBarItemOption.FILES;

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

  const sidebarPanelHeaderClasses = classNames("sidebar-panel-header", {
    "file-explorer-panel-header": isShowingFileExplorerPanel,
  });

  const sideBarTitleAction = isShowingFileExplorerPanel ? (
    <IconButton
      icon={ThreeDots}
      onClick={() => window.helium.app.showNewFileContextMenu()}
    />
  ) : null;

  return (
    <div className="sidebar-panel">
      <div className={sidebarPanelHeaderClasses}>
        <Text size="xs">{getSideBarTitle(props.activeSideBarOption)}</Text>
        {sideBarTitleAction}
      </div>
      <div className="sidebar-panel-body">
        {getSideBarPanelBody(props.activeSideBarOption)}
      </div>
    </div>
  );
}

export default observer(SideBarPanel);
