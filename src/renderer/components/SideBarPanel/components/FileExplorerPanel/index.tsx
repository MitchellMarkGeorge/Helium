import { action } from "mobx";
import { observer } from "mobx-react-lite";
import Button from "renderer/components/ui/Button";
import Text from "renderer/components/ui/Text";
import { useWorkspace } from "renderer/hooks/useWorkspace";
import FileExplorer from "./components/FileExplorer";

function FileExplorerPanel() {
  const workspace = useWorkspace();
  const entryArray = workspace.fileExplorer.asEntryArray;

  const openTheme = action(() => {
    workspace.openThemeFromDialog();
  });

  if (workspace.hasTheme) {
    if (entryArray.length === 0) {
      return (
        <div className="empty-panel-body">
          <Text size="xs" className="empty-panel-text">
            No files in this directory.
          </Text>
          <Button variant="primary" fullWidth>
            Create New File
          </Button>
        </div>
      );
    }
    return (
      <FileExplorer
        entries={entryArray}
      />
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

export default observer(FileExplorerPanel);
