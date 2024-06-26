import classNames from "classnames";
import { observer } from "mobx-react-lite";
import { BroadcastPin } from "react-bootstrap-icons";

interface Props {
  isPreviewRunning: boolean;
  isPreviewAvalible: boolean;
}

function PreviewStatus({ isPreviewAvalible, isPreviewRunning }: Props) {
  const previewStatusClasses = classNames("preview-status", {
    "preview-avalible": isPreviewAvalible && !isPreviewRunning,
    "preview-running": isPreviewAvalible && isPreviewRunning,
  });
  return (
    <div className={previewStatusClasses}>
      <BroadcastPin className="preview-status-icon" />
    </div>
  );
}

export default observer(PreviewStatus);
