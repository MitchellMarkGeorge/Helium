import { Icon } from "react-bootstrap-icons"

import "./TitleBarButton.scss";

interface Props {
    icon: Icon;
}
export default function TitleBarButton({icon: Icon}: Props) {
  return (
    <div className="title-bar-icon-wrapper">
        <Icon className="title-bar-icon"/>
    </div>
  )
}
