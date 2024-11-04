import { FileEntry } from "renderer/models/fileexplorer/types";
import { useFileIcon } from "renderer/hooks/useFileIcon";
import { XLg } from "react-bootstrap-icons";
import IconButton from "renderer/components/ui/IconButton/IconButton";
import classNames from "classnames";
import "./Tab.scss";
import { EditorFile } from "renderer/models/editor/types";
import { useWorkspace } from "renderer/hooks/useWorkspace";
import { useEffect, useRef } from "react";
import Text from "renderer/components/ui/Text";
import pathe from "pathe";
import { action } from "mobx";
import { observer } from "mobx-react-lite";
import { editor } from "monaco-editor";

interface Props {
  file: EditorFile;
  isSelected: boolean;
}

function Tab({ file, isSelected }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const workspace = useWorkspace();
  const fileIcon = useFileIcon(file.fileType);
  const tabClasses = classNames("tab", {
    selected: isSelected,
  });

  useEffect(() => {
    // if the item becomes selected, scroll to it
    if (isSelected) {
      ref.current?.scrollIntoView({
        block: "nearest",
      });
    }
  }, [isSelected]);

  return (
    <div
      ref={ref}
      className={tabClasses}
      onClick={() => {
        workspace.editor.selectFile(file.path);
      }}
    >
      {fileIcon}
      <Text size="xs" className="tab-title">
        {file.basename || pathe.basename(file.path)}
      </Text>
      <IconButton
        icon={XLg}
        onClick={action((e) => {
          e.stopPropagation();
          // file.hasTab = false
          workspace.editor.closeTab(file.path);
          // workspace.editor.closeFile(file.path);
        })}
      />
    </div>
  );
}

export default observer(Tab);