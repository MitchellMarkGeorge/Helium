import { observer } from "mobx-react-lite";
import "./TopBar.scss";
import IconButton from "renderer/components/ui/IconButton/IconButton";
import { ArrowLeft, ArrowRepeat, ArrowRight } from "react-bootstrap-icons";
import Text from "renderer/components/ui/Text";

interface Props {
  url: string;
  goBack: () => void;
  goForward: () => void;
  reload: () => void;
}

function TopBar({ goBack, goForward, reload, url }: Props) {
  return (
    <div className="theme-preview-top-bar">
      <IconButton icon={ArrowLeft} onClick={goBack} />
      <IconButton icon={ArrowRight} onClick={goForward}/>
      <IconButton icon={ArrowRepeat} onClick={reload}/>
      <div className="theme-preview-top-bar-url">
        <Text size="xs" className="theme-preview-top-bar-url-text">
          {url}
        </Text>
      </div>
    </div>
  );
}

export default observer(TopBar);
