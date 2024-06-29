import { observer } from "mobx-react-lite";
import { Entry } from "renderer/models/fileexplorer/types";
import "./FileExplorer.scss";
import FileExplorerItem from "../FileExplorerItem";
import { OpenFileOptions } from "renderer/models/editor/types";

interface Props {
  entries: Entry[];
}

function FileExplorer({ entries }: Props) {
  return (
    <div className="file-explorer">
      {entries.map((entry) => (
        <FileExplorerItem entry={entry} key={entry.path} />
      ))}
    </div>
  );
}

export default observer(FileExplorer);
