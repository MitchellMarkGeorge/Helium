import classNames from "classnames";
import { observer } from "mobx-react-lite";
import { Ban, BroadcastPin } from "react-bootstrap-icons";
import "./PreviewStatus.scss"
import { PreviewState } from "common/types";

interface Props {
  previewState: PreviewState;
  isStoreConnected: boolean
}

function PreviewStatus({ previewState, isStoreConnected }: Props) {
  const previewStatusClasses = classNames("preview-status", {
    "preview-avalible": previewState === PreviewState.OFF && isStoreConnected,
    "preview-running": previewState === PreviewState.RUNNING,
  });
  const Icon = previewState === PreviewState.UNAVALIBLE ? Ban : BroadcastPin;
  return (
    <div className={previewStatusClasses}>
      <Icon className="preview-status-icon" />
    </div>
  );
}

export default observer(PreviewStatus);
