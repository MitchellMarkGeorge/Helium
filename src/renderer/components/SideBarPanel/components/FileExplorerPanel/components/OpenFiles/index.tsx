import { observer } from "mobx-react-lite";
import { EditorFile } from "renderer/models/editor/types"
import "./OpenFiles.scss";
import OpenFile from "./components/OpenFile";

interface Props {
  openFiles: EditorFile[];
}

function OpenFiles({ openFiles }: Props) {
  return (
    <div className="open-files">
      {openFiles.map((file) => <OpenFile file={file} key={file.path}/>)}
    </div>
  )
}

export default observer(OpenFiles);
