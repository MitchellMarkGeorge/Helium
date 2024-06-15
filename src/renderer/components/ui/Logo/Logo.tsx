import HeliumLogo from "renderer/assets/Logo.svg";
import "./Logo.scss";

interface Props {
  full?: boolean;
  size: string;
}

export default function Logo(props: Props) {
  const logo = <HeliumLogo height={props.size} width={props.size} />;
  return props.full ? <div className="logo-container">{logo}</div> : logo;
}
