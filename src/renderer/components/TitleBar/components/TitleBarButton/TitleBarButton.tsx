import { Icon } from "react-bootstrap-icons"

import "./TitleBarButton.scss";

interface Props {
    icon: Icon;
    onClick: () => void;
}
export default function TitleBarButton({icon: Icon, onClick}: Props) {
  // I should use a button here instead of a div
  return (
    <div className="title-bar-icon-wrapper" onClick={onClick}>
        <Icon size="1rem" className="title-bar-icon"/>
    </div>
  )
}
