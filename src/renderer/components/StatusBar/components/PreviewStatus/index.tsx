import classNames from "classnames";
import { observer } from "mobx-react-lite";
import { Ban, BroadcastPin } from "react-bootstrap-icons";
import "./PreviewStatus.scss";
import { PreviewState } from "common/types";
import Spinner from "renderer/components/ui/Spinner";

interface Props {
  previewState: PreviewState;
  isStoreConnected: boolean;
  onClick: () => void;
}

function PreviewStatus({ previewState, isStoreConnected, onClick }: Props) {
  const isPreviewStarting = previewState === PreviewState.STARTING;
  const isPreviewOff = previewState === PreviewState.OFF;
  const previewStatusClasses = classNames("preview-status", {
    "preview-avalible":
      isStoreConnected && (isPreviewOff || isPreviewStarting),
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
      {isPreviewStarting ? (
        <Spinner size={"0.75rem"} />
      ) : (
        <Icon className="preview-status-icon" />
      )}
    </button>
  );
}

export default observer(PreviewStatus);
