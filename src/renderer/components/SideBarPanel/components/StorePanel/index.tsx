import Button from "renderer/components/ui/Button";
import Text from "renderer/components/ui/Text";
import { useWorkspace } from "renderer/hooks/useWorkspace";
import "./StorePanel.scss";
import { observer } from "mobx-react-lite";
import { action } from "mobx";

function StorePanel() {
  const workspace = useWorkspace();

  const showConnectStoreModal = action(() => {
    workspace.notifications.showInputModal({
      title: "Connect Store",
      inputFields: [
        { key: "devUrl", label: "Shopify Dev URL", placeholder: "URL" },
        {
          key: "themeAccessPasword",
          label: "Theme Access Password",
          placeholder: "password",
          isPassword: true,
        },
      ],
      primaryButtonText: 'Connect',
      secondaryButtonText: 'Cancel',
    });
  });

  if (workspace.isStoreConnected) {
    return (
      <div className="store-panel-body">
        <div className="store-field">
          <div className="store-field-label text-xs">Connected Store URL</div>
          <div className="store-field-value text-xs">
            {workspace.connectedStore?.storeUrl}
          </div>
        </div>
        <Button variant="destructive" fullWidth>
          Disconnect Store
        </Button>
      </div>
    );
  } else {
    return (
      <div className="empty-panel-body">
        <Text size="xs" className="empty-panel-text">
          No store connected.
        </Text>
        <Button variant="primary" fullWidth onClick={showConnectStoreModal}>
          Connect Store
        </Button>
      </div>
    );
  }
}

export default observer(StorePanel);
