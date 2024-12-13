import { action } from "mobx";
import { observer } from "mobx-react-lite";
import Button from "renderer/components/ui/Button";
import Text from "renderer/components/ui/Text";
import { useWorkspace } from "renderer/hooks/useWorkspace";
import "./PreviewPanel.scss";
import Checkbox from "renderer/components/ui/Checkbox";
import Input from "renderer/components/ui/Input";
import { Fieldset } from "@headlessui/react";

function PreviewPanel() {
  const workspace = useWorkspace();
  const isPreviewRunning = workspace.themePreview.isRunning;
  const useDefaultSettings = workspace.themePreview.useDefaultSettings;
  const { host, port } = workspace.themePreview.previewOptions;

  const openTheme = action(() => {
    workspace.openThemeFromDialog();
  });

  const toggleUseDefaultSettings = action(() => {
    workspace.themePreview.useDefaultSettings = !useDefaultSettings;
  });

  if (workspace.hasTheme) {
    if (!workspace.isStoreConnected) {
      return (
        <div className="empty-panel-body">
          <Text size="xs" className="empty-panel-text">
            No store connected.
          </Text>
          <Button
            variant="primary"
            fullWidth
            onClick={() => workspace.connectStore()}
          >
            Connect Store
          </Button>
        </div>
      );
    }

    const previewSettingInputMarkup = !useDefaultSettings ? (
      <>
        <Input
          label="Host"
          value={host}
          name="host"
          disabled={isPreviewRunning}
          onChange={(e) =>
            workspace.themePreview.updatePreviewHost(e.target.value)
          }
        />
        <Input
          label="Port Number"
          value={port}
          name="port"
          type="number"
          disabled={isPreviewRunning}
          onChange={(e) =>
            workspace.themePreview.updatePreviewPort(e.target.value)
          }
        />
      </>
    ) : null;

    return (
      <div className="preview-panel-body">
        <Checkbox
          label="Use default settings"
          checked={useDefaultSettings}
          onChange={() => toggleUseDefaultSettings()}
        />
        {previewSettingInputMarkup}
        <Button
          onClick={() => {
            if (isPreviewRunning) {
              workspace.themePreview.stop();
            } else {
              workspace.themePreview.start();
            }
          }}
          variant={isPreviewRunning ? "destructive" : "primary"}
          fullWidth
        >
          {isPreviewRunning ? "Stop Preview" : "Start Preview"}
        </Button>
      </div>
    );
  } else {
    return (
      <div className="empty-panel-body">
        <Text size="xs" className="empty-panel-text">
          No theme opened.
        </Text>
        <Button variant="primary" fullWidth onClick={openTheme}>
          Open Theme
        </Button>
      </div>
    );
  }
}

export default observer(PreviewPanel);
