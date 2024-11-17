import { CircleFill } from "react-bootstrap-icons";
import "./UnsavedIcon.scss";

interface Props extends React.HTMLAttributes<HTMLDivElement> {}

export default function UnsavedDot(props: Props) {
  return (
    <div
      className="unsaved-icon-wrapper"
      {...props}
    >
      <CircleFill className="unsaved-icon" />
    </div>
  );
}
