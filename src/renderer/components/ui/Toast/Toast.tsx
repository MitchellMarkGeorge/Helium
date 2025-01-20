import {
  CheckCircleFill,
  XCircleFill,
  InfoCircleFill,
  ExclamationTriangleFill,
  XLg,
} from "react-bootstrap-icons";

import type { NotificationOptions } from "../../../models/notification/types";

import Text from "../Text";

import "./Toast.scss";
import IconButton from "../IconButton/IconButton";

interface Props {
  options: NotificationOptions;
  close: () => void;
}

export default function Toast({ options, close }: Props) {
  const getIcon = () => {
    switch (options.type) {
      case "success":
        return <CheckCircleFill color="#16A34A" size="1rem" />;
      case "error":
        return <XCircleFill color="#DC2626" size="1rem" />;
      case "info":
        return <InfoCircleFill color="#3B82F6" size="1rem" />;
      case "warning":
        return <ExclamationTriangleFill color="#D97706" size="1rem" />;
    }
  };

  return (
    <div className="toast">
      <div className="toast-content">
        {getIcon()}
{/* need to truncate this */}
        <Text size="xs" className="toast-message">{options.message}</Text>
      </div>
      <IconButton icon={XLg} onClick={close} />
    </div>
  );
}
