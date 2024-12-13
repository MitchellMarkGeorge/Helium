import { observer } from "mobx-react-lite";
import { XCircleFill } from "react-bootstrap-icons";
import { useWorkspace } from "renderer/hooks/useWorkspace";
import Text from "../ui/Text";
import ThemePreview from "./components/ThemePreview";
import "./ThemePreviewPanel.scss";

function ThemePreviewPanel() {
  const workspace = useWorkspace();
  const isPreviewRunning = workspace.themePreview.isRunning;
  const livePreviewUrl = workspace.themePreview.getLivePreviewUrl();

  if (!isPreviewRunning || !livePreviewUrl) {
    return (
      <div className="theme-preview-error">
        <div className="theme-preview-error-container">
          <XCircleFill size="5rem" color="#DC2626" />
          <Text>Unable to open the Theme Preview.</Text>
        </div>
      </div>
    )
  }

  return <ThemePreview livePreviewUrl={livePreviewUrl}/>
}

export default observer(ThemePreviewPanel);
