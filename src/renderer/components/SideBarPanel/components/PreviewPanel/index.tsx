import { action } from "mobx";
import { observer } from "mobx-react-lite";
import Button from "renderer/components/ui/Button";
import Text from "renderer/components/ui/Text";
import { useWorkspace } from "renderer/hooks/useWorkspace";
import "./PreviewPanel.scss";

function PreviewPanel() {
  const workspace = useWorkspace();
  const isPreviewRunning = workspace.themePreview.isRunning;

  const openTheme = action(() => {
    workspace.openThemeFromDialog();
  });

  if (workspace.hasTheme) {
    return (
      <div className="preview-panel-body">
        <Button
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
        <Button
          variant="primary"
          fullWidth
          onClick={openTheme}
        >
          Open Theme
        </Button>
      </div>
    );
  }
}

export default observer(PreviewPanel);
