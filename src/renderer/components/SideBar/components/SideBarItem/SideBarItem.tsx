import classNames from "classnames";
import "./SideBarItem.scss";
import { observer } from "mobx-react-lite";
import { Icon } from "react-bootstrap-icons";
import Text from "renderer/components/ui/Text";

interface Props {
  icon: Icon;
  badgeCount?: number;
  isActive: boolean;
  onClick: () => void;
}

function SideBarItem({ isActive, badgeCount, icon: Icon, onClick }: Props) {
  const hasBadgeCount = badgeCount !== undefined;
  const sideBarItemClasses = classNames("sidebar-item", {
    active: isActive,
  });

  const icon = <Icon className="sidebar-item-icon" />;

  const iconMarkup = hasBadgeCount ? (
    <div className="badge-container">
      {icon}
      <Text size="xs" className="badge">
        {badgeCount}
      </Text>
    </div>
  ) : (
    icon
  );

  return (
    <div className={sideBarItemClasses} onClick={onClick}>
      {iconMarkup}
    </div>
  );
}

export default observer(SideBarItem);
