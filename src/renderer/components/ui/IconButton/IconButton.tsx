import { Icon } from "react-bootstrap-icons";

import "./IconButton.scss";

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: Icon;
}
export default function IconButton({ icon: Icon, ...rest }: Props) {
  // I should use a button here instead of a div
  return (
    <button className="icon-button" {...rest}>
      <Icon className="icon-button-icon" />
    </button>
  );
}
