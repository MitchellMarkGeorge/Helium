import classNames from "classnames";
import { observer } from "mobx-react-lite";
import { BroadcastPin } from "react-bootstrap-icons";
import "./PreviewStatus.scss"
import { PreviewState } from "common/types";

interface Props {
  previewState: PreviewState;
}

function PreviewStatus({ previewState }: Props) {
  const previewStatusClasses = classNames("preview-status", {
    "preview-avalible": previewState === PreviewState.OFF,
    "preview-running": previewState === PreviewState.RUNNING,
  });
  return (
    <div className={previewStatusClasses}>
      <BroadcastPin className="preview-status-icon" />
    </div>
  );
}

export default observer(PreviewStatus);
