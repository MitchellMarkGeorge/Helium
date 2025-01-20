import Text from "renderer/components/ui/Text";
import { useFileIcon } from "renderer/hooks/useFileIcon";
import { EditorFile } from "renderer/models/editor/types";
import pathe from "pathe";
import { useWorkspace } from "renderer/hooks/useWorkspace";
import IconButton from "renderer/components/ui/IconButton/IconButton";
import { XLg } from "react-bootstrap-icons";
import { useState } from "react";
import UnsavedDot from "renderer/components/ui/UnsavedIcon";
import { observer } from "mobx-react-lite";

interface Props {
  file: EditorFile;
}

function OpenFile({ file }: Props) {
  const fileIcon = useFileIcon(file.fileType);
  const workspace = useWorkspace();
  const [hoverActive, setHoverActive] = useState(false);

  const getIndicator = () => {
    if (file.isUnsaved && !hoverActive) {
      return <UnsavedDot/>
    } else if (hoverActive) {
      return (
        <IconButton
          icon={XLg}
          onClick={(e) => {
            e.stopPropagation();
            workspace.editor.closeFile(file.path);
          }}
        />
      )
    }
    return null;
  }

  return (
    <div
      className="open-file-item"
      onMouseEnter={() => setHoverActive(true)}
      onMouseLeave={() => setHoverActive(false)}
      onClick={() => workspace.editor.openFile(file)}
    >
      <div className="open-file-item-icon">{fileIcon}</div>
      <Text size="xs" className="open-file-item-text">
        {file.basename || pathe.basename(file.path)}
      </Text>
      {/*  hide this using dispay: none? */}
      {getIndicator()}
    </div>
  );
}

export default observer(OpenFile);
