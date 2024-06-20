import { ViewType } from "renderer/models/editor/types";
import Logo from "../ui/Logo";
import { observer } from "mobx-react-lite";

interface Props {
  view: ViewType;
}
function EditorPanel(props: Props) {
  const getView = (view: ViewType) => {
    switch (view) {
      default:
        return <Logo full size="9rem" />;
    }
  };
  return getView(props.view);
}

export default observer(EditorPanel);
