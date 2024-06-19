import classNames from "classnames";
import "./SideBarItem.scss";
import { observer } from "mobx-react-lite";
import { Icon } from "react-bootstrap-icons";

// MIGRATE TO CSS VARISBLES

interface Props {
  icon: Icon;
  isActive: boolean;
  onClick: () => void;
}

function SideBarItem(props: Props) {
  const sideBarItemClasses = classNames({
    "sidebar-item": true,
    active: props.isActive,
  });

  const Icon = props.icon;

  return (
    <div className={sideBarItemClasses} onClick={props.onClick}>
      <Icon className="sidebar-item-icon" />
    </div>
  );
}

export default observer(SideBarItem);
