import { observer } from "mobx-react-lite";
import { ExclamationTriangle, XCircle } from "react-bootstrap-icons";
import Text from "renderer/components/ui/Text";
import "./StatusBarErrors.scss";


interface Props {
  errors: number;
  warnings: number;
}

function StatusBarErrors({ errors, warnings }: Props) {
  return (
    <div className="statusbar-errors">
      <div className="statusbar-errors-item">
        <XCircle className="statusbar-errors-item-icon" />
        <Text size="xs">{errors}</Text>
      </div>
      <div className="statusbar-errors-item">
        <ExclamationTriangle className="statusbar-errors-item-icon" />
        <Text size="xs">{warnings}</Text>
      </div>
    </div>
  );
}

export default observer(StatusBarErrors);
