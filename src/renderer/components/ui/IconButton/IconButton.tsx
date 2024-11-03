import { Icon } from "react-bootstrap-icons"

import "./IconButton.scss";

interface Props {
    icon: Icon;
    onClick: React.MouseEventHandler<HTMLDivElement>;
}
export default function IconButton({icon: Icon, onClick}: Props) {
  // I should use a button here instead of a div
  return (
    <div className="icon-button-wrapper" onClick={onClick}>
        <Icon size="0.75rem" className="icon-button-icon"/>
    </div>
  )
}
