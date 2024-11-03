import { observer } from "mobx-react-lite";
import { useWorkspace } from "renderer/hooks/useWorkspace";

import "./StatusBar.scss";
import Button from "../ui/Button";
import Text from "../ui/Text";
import PreviewStatus from "./components/PreviewStatus";
import StatusBarErrors from "./components/StatusBarErrors";
import ConnectedStore from "./components/ConnectedStore";
import { QuestionCircle } from "react-bootstrap-icons";
import HelpButton from "./components/HelpButton";
import CursorPosition from "./components/CursorPosition/CursorPosition";

function StatusBar() {
  const workspace = useWorkspace();
  const previewState = workspace.themePreview.getPreviewState();

  const currentFile = workspace.editor.getCurrentFile();
  const cursorPosition = workspace.editor.getCursorPosition();

  const currentLanguageMarkup = currentFile ? (
    <Text size="xs">{currentFile.fileType}</Text>
  ) : null;

  const currentCursorPositionMarkup = cursorPosition ? (
    <CursorPosition cursorPosition={cursorPosition} />
  ) : null;

  if (!workspace.isShowingWorkspace) {
    return null;
  } else
    return (
      <div className="statusbar">
        <div className="statusbar-section">
          <PreviewStatus
            previewState={previewState}
            isStoreConnected={workspace.isStoreConnected}
          />
          <StatusBarErrors errors={0} warnings={0} />
        </div>
        <div className="statusbar-section editor-info">
          {currentCursorPositionMarkup}
          {currentLanguageMarkup}
          <ConnectedStore
            connectedStoreName={workspace.connectedStore?.storeName}
          />
          <HelpButton />
        </div>
      </div>
    );
}

export default observer(StatusBar);
