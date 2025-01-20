import { observer } from "mobx-react-lite";
import TopBar from "../TopBar";
import { useRef } from "react";
import "./ThemePreview.scss";
import { WebviewTag } from "electron";

interface Props {
  livePreviewUrl: string;
}

function ThemePreview({ livePreviewUrl }: Props) {
  const iframeRef = useRef<WebviewTag | null>(null);

  const goBack = () => {
    iframeRef.current?.goBack();
  };

  const goForward = () => {
    iframeRef.current?.goForward();
  };

  const reload = () => {
    iframeRef.current?.reload();
  };

  return (
    <div className="theme-preview">
      <TopBar
        url={livePreviewUrl}
        goBack={goBack}
        goForward={goForward}
        reload={reload}
      />
      <webview
        className="theme-preview-frame"
        src={livePreviewUrl}
        ref={iframeRef}
      />
    </div>
  );
}

export default observer(ThemePreview);
