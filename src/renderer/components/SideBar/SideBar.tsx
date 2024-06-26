import { useWorkspace } from "renderer/hooks/useWorkspace";
import "./Sidebar.scss";
import { observer } from "mobx-react-lite";
import { BroadcastPin, Cart, Files, Palette } from "react-bootstrap-icons";
import { SideBarItemOption } from "renderer/models/workspace/types";
import SideBarItem from "./components/SideBarItem/SideBarItem";
import { action } from "mobx";
import { useMemo } from "react";

function SideBar() {
  const workspace = useWorkspace();

  // mainly used for order
  const sideBarItems = useMemo(
    () => [
      { option: SideBarItemOption.FILES, icon: Files },
      { option: SideBarItemOption.PREVIEW, icon: BroadcastPin },
      { option: SideBarItemOption.THEME_INFO, icon: Palette },
      { option: SideBarItemOption.STORE, icon: Cart },
    ],
    []
  );

  const isActive = (sideBarOption: SideBarItemOption) => {
    // need to figure out the toggle behavior
    return workspace.activeSideBarOption === sideBarOption;
  };


  return (
    <div className="sidebar">
      {sideBarItems.map(({ option, icon }) => (
        <SideBarItem
          icon={icon}
          isActive={workspace.isSidePanelOpen && isActive(option)}
          key={option}
          onClick={action(() => {
            console.log(option);
            if (workspace.activeSideBarOption !== option) {
              if (!workspace.isSidePanelOpen) {
                workspace.toggleSidePanel();
              }
              workspace.selectSideBarOption(option);
            } else {
              workspace.toggleSidePanel();
            }
          })}
        />
      ))}
    </div>
  );
}

export default observer(SideBar);
