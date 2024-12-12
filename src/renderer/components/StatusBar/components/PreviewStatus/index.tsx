import classNames from "classnames";
import { observer } from "mobx-react-lite";
import { Ban, BroadcastPin } from "react-bootstrap-icons";
import "./PreviewStatus.scss";
import { PreviewState } from "common/types";

interface Props {
  previewState: PreviewState;
  isStoreConnected: boolean;
  onClick: () => void;
}

function PreviewStatus({ previewState, isStoreConnected, onClick }: Props) {
  const previewStatusClasses = classNames("preview-status", {
    "preview-avalible": previewState === PreviewState.OFF && isStoreConnected,
    "preview-running": previewState === PreviewState.RUNNING,
  });

  const isPreviewUnavailable = previewState === PreviewState.UNAVALIBLE;
  const Icon = isPreviewUnavailable ? Ban : BroadcastPin;
  return (
    <button
      onClick={onClick}
      className={previewStatusClasses}
      disabled={isPreviewUnavailable}
    >
      <Icon className="preview-status-icon" />
    </button>
  );
}

export default observer(PreviewStatus);
