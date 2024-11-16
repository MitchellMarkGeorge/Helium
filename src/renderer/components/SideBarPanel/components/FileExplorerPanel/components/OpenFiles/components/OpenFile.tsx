import Text from "renderer/components/ui/Text";
import { useFileIcon } from "renderer/hooks/useFileIcon";
import { EditorFile } from "renderer/models/editor/types";
import pathe from "pathe";
import { useWorkspace } from "renderer/hooks/useWorkspace";
import IconButton from "renderer/components/ui/IconButton/IconButton";
import { XLg } from "react-bootstrap-icons";
import { useState } from "react";

interface Props {
  file: EditorFile;
}

export default function OpenFile({ file }: Props) {
  const fileIcon = useFileIcon(file.fileType);
  const workspace = useWorkspace();
  const [hoverActive, setHoverActive] = useState(false);
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
      {hoverActive && (
        <IconButton
          icon={XLg}
          onClick={(e) => {
            e.stopPropagation();
            workspace.editor.closeFile(file.path);
          }}
        />
      )}
    </div>
  );
}
