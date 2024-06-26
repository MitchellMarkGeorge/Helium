import { QuestionCircle } from "react-bootstrap-icons";
import "./HelpButton.scss";

export default function HelpButton() {
  return (
    <div className="statusbar-help-button-container">
        <QuestionCircle className="statusbar-help-button-icon"/>
    </div>
  )
}
