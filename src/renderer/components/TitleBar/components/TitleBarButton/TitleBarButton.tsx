import { Icon } from "react-bootstrap-icons"

import "./TitleBarButton.scss";

interface Props {
    icon: Icon;
    onClick: () => void;
}
export default function TitleBarButton({icon: Icon, onClick}: Props) {
  return (
    <div className="title-bar-icon-wrapper" onClick={onClick}>
        <Icon className="title-bar-icon"/>
    </div>
  )
}
