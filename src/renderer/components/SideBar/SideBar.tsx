import { useWorkspace } from "renderer/hooks/useWorkspace";
import "./Sidebar.scss";
import { observer } from "mobx-react-lite";
import { BroadcastPin, Cart, Files, Palette } from "react-bootstrap-icons";
import { SideBarItemOption } from "renderer/models/workspace/types";
import SideBarItem from "./components/SideBarItem/SideBarItem";
import { action } from "mobx";

function SideBar() {
  const workspace = useWorkspace();

  // should I make this a map (option -> icon)
  const sideBarItems = [
    SideBarItemOption.FILES,
    SideBarItemOption.PREVIEW,
    SideBarItemOption.THEME_INFO,
    SideBarItemOption.STORE,
  ];

  const getSideBarItemIcon = (option: SideBarItemOption) => {
    switch (option) {
      case SideBarItemOption.FILES:
        return Files;
      case SideBarItemOption.PREVIEW:
        return BroadcastPin;
      case SideBarItemOption.THEME_INFO:
        return Palette;
      case SideBarItemOption.STORE:
        return Cart;
    }
  };

  const isActive = (sideBarOption: SideBarItemOption) => {
    // need to figure out the toggle behavior
    if (!workspace.isSidePanelOpen) return false;
    console.log(sideBarOption, workspace.activeSideBarOption === sideBarOption);
    return workspace.activeSideBarOption === sideBarOption;
  };

  // mainly used for order

  return (
    <div className="sidebar">
      {sideBarItems.map((option) => (
        <SideBarItem
          icon={getSideBarItemIcon(option)}
          isActive={isActive(option)}
          key={option}
          onClick={action(() => {
            console.log(option);
            if (!workspace.activeSideBarOption || workspace.activeSideBarOption === option) {
              console.log("toggle");
              workspace.toggleSidePanel();
            }
            console.log("setting option");
            workspace.selectSideBarOption(option);
          })}
        />
      ))}
    </div>
  );
}

export default observer(SideBar);
