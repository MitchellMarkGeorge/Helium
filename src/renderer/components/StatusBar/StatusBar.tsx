import { observer } from "mobx-react-lite";
import { useWorkspace } from "renderer/hooks/useWorkspace";

import "./StatusBar.scss";
import Text from "../ui/Text";
import PreviewStatus from "./components/PreviewStatus";
import StatusBarErrors from "./components/StatusBarErrors";
import ConnectedStore from "./components/ConnectedStore";
import HelpButton from "./components/HelpButton";
import CursorPosition from "./components/CursorPosition/CursorPosition";
import { PreviewState } from "common/types";

function StatusBar() {
  const workspace = useWorkspace();
  const previewState = workspace.themePreview.getPreviewState();

  const currentFile = workspace.editor.getCurrentFile();
  const cursorPosition = workspace.editor.getCursorPosition();

  const onPrevewStatusClick = () => {

    if (!workspace.isStoreConnected) {
      workspace.connectStore()
      return;
    }

    if (workspace.themePreview.isRunning) {
      workspace.themePreview.stop();
    } else {
      workspace.themePreview.start();
    }
  } 

  const cliUnavalibleMarkup =
    previewState === PreviewState.UNAVALIBLE ? (
      <Text size="xs" className="cli-unavailable">
        Shopify CLI Unavailable
      </Text>
    ) : null;

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
            onClick={onPrevewStatusClick}
            previewState={previewState}
            isStoreConnected={workspace.isStoreConnected}
          />
          <StatusBarErrors errors={0} warnings={0} />
          {cliUnavalibleMarkup}
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
