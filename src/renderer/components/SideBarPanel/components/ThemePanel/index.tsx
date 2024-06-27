import Button from "renderer/components/ui/Button";
import Text from "renderer/components/ui/Text";
import { useWorkspace } from "renderer/hooks/useWorkspace";

import "./ThemePanel.scss";
import { action } from "mobx";
import { observer } from "mobx-react-lite";

function ThemePanel() {
  const workspace = useWorkspace();

  const openTheme = action(() => {
    workspace.openThemeFromDialog();
  });

  if (workspace.hasTheme) {
    return (
      <div className="theme-panel-body">
        <div className="theme-info-field-container">
          <div className="theme-field">
            <div className="theme-field-label text-xs">Theme Name</div>
            <div className="theme-field-value text-xs">
              {workspace.theme?.themeName}
            </div>
          </div>
          <div className="theme-field">
            <div className="theme-field-label text-xs">Theme Version</div>
            <div className="theme-field-value text-xs">
              {workspace.theme?.version}
            </div>
          </div>
          <div className="theme-field">
            <div className="theme-field-label text-xs">Theme Author</div>
            <div className="theme-field-value text-xs">
              {workspace.theme?.author}
            </div>
          </div>
        </div>
        <Button variant="primary" fullWidth>
          Push Theme
        </Button>
        <Button variant="primary" fullWidth>
          Publish Theme
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

export default observer(ThemePanel);
