import { PersonCircle } from "react-bootstrap-icons";
import Text from "renderer/components/ui/Text";
import "./ConnectedStore.scss";
import { observer } from "mobx-react-lite";


interface Props {
  connectedStoreName?: string;
}
function ConnectedStore({ connectedStoreName }: Props) {
  return (
    <div className="statusbar-store">
      <PersonCircle className="statusbar-store-icon" />
      <Text size="xs">{connectedStoreName || "No connected store"}</Text>
    </div>
  );
}

export default observer(ConnectedStore);
