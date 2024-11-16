import { action } from "mobx";
import { observer } from "mobx-react-lite";
import Button from "renderer/components/ui/Button";
import Text from "renderer/components/ui/Text";
import { useWorkspace } from "renderer/hooks/useWorkspace";
import FileExplorer from "./components/FileExplorer";
import "./FileExplorerPanel.scss";
import FileExplorerSection from "./components/FileExplorerSection";
import OpenFiles from "./components/OpenFiles";

function FileExplorerPanel() {
  const workspace = useWorkspace();
  const entryArray = workspace.fileExplorer.asEntryArray;
  const hasOpenFiles = workspace.editor.hasOpenFiles;
  const openFiles = workspace.editor.getOpenFiles();

  const openTheme = action(() => {
    workspace.openThemeFromDialog();
  });

  const getExplorerPanelMarkup = () => {
    if (workspace.hasTheme) {
      if (entryArray.length === 0) {
        return (
          <div className="empty-panel-body">
            <Text size="xs" className="empty-panel-text">
              No files in this directory.
            </Text>
            <Button variant="primary" fullWidth>
              Create New File
            </Button>
          </div>
        );
      }
      return <FileExplorer entries={entryArray} />;
    } else {
      return (
        <div className="empty-panel-body">
          <Text size="xs" className="empty-panel-text">
            No theme opened.
          </Text>
          <Button variant="primary" fullWidth onClick={openTheme}>
            Open Theme
          </Button>
        </div>
      );
    }
  };

  // const editorsPanel = (
  //   <Disclosure as="div" className="file-explorer-panel-section">
  //     {({ open }) => (
  //       <>
  //         <DisclosureButton className="file-explorer-panel-section-trigger">
  //           <Text size="xs" className="file-explorer-panel-section-title">
  //             Editors
  //           </Text>
  //           {open ? (
  //             <ChevronDown className="file-explorer-panel-section-icon" />
  //           ) : (
  //             <ChevronRight className="file-explorer-panel-section-icon" />
  //           )}
  //         </DisclosureButton>
  //         <DisclosurePanel className="file-explorer-panel-section-panel">
  //           {hasOpenFiles ? (
  //             "hello"
  //           ) : (
  //             <div className="empty-panel-body">
  //               <Text size="xs" className="empty-panel-text">
  //                 No open files.
  //               </Text>
  //             </div>
  //           )}
  //         </DisclosurePanel>
  //       </>
  //     )}
  //   </Disclosure>
  // );

  const editorsPanel = (
    <FileExplorerSection title="Editors">
      {hasOpenFiles ? (
        <OpenFiles openFiles={openFiles}/>
      ) : (
        <div className="empty-panel-body">
          <Text size="xs" className="empty-panel-text">
            No open files.
          </Text>
        </div>
      )}
    </FileExplorerSection>
  );

  const explorerPanel = (
    <FileExplorerSection title={workspace.theme?.name || "Explorer"} fullHeight>
      {getExplorerPanelMarkup()}
    </FileExplorerSection>
  );

  // const explorerPanel = (
  //   <Disclosure as="div" className="file-explorer-panel-section">
  //     {({ open }) => (
  //       <>
  //         <DisclosureButton className="file-explorer-panel-section-trigger">
  //           <Text size="xs" className="file-explorer-panel-section-title">
  //             {workspace.theme?.name || "Explorer"}
  //           </Text>
  //           {open ? (
  //             <ChevronDown className="file-explorer-panel-section-icon" />
  //           ) : (
  //             <ChevronRight className="file-explorer-panel-section-icon" />
  //           )}
  //         </DisclosureButton>
  //         <DisclosurePanel className="file-explorer-panel-section-panel">
  //           {/* <FileExplorer entries={entryArray} /> */}
  //           {getExplorerPanel()}
  //         </DisclosurePanel>
  //       </>
  //     )}
  //   </Disclosure>
  // );

  return (
    <div className="file-explorer-panel">
      {editorsPanel}
      {explorerPanel}
    </div>
  );
}

export default observer(FileExplorerPanel);
