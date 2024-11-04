import { useEffect, useRef } from "react";
import monaco from "monaco-editor";
import "./CodeEditor.scss";
import { useWorkspace } from "renderer/hooks/useWorkspace";
import { XCircleFill } from "react-bootstrap-icons";
import Text from "renderer/components/ui/Text";
import { autorun } from "mobx";

export default function CodeEditor() {
  const containerElement = useRef<HTMLDivElement | null>(null);
  const editor = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
  const workspace = useWorkspace();

  const currentFile = workspace.editor.getCurrentFile();
  // const currentEditorModel = workspace.editor.currentEditorModel;

  if (!currentFile || !workspace.editor.currentEditorModel) {
    return (
      <div className="code-editor-error">
        <div className="code-editor-error-container">
          <XCircleFill size="5rem" color="#DC2626" />
          <Text>Unable to open the code editor.</Text>
        </div>
      </div>
    );
  }

  useEffect(() => {
    if (containerElement.current) {
      editor.current = monaco.editor.create(containerElement.current, {
        automaticLayout: true,
        fontSize: 12,
        theme: "helium-default",
        padding: {
          top: 10,
        },
      });

      editor.current.onDidChangeCursorPosition((event) => {
        workspace.editor.updateCurorPosition({
          line: event.position.lineNumber,
          column: event.position.column,
        });
      });

      workspace.editor.setMonacoEditor(editor.current);
    }
  }, []);

  useEffect(() => {
    autorun(() => {
      // should only be called when the the currentEditorModel changes
      // whenever the current editor model changes, update monaco code editor
      // and view state
      if (editor.current && workspace.editor.currentEditorModel) {
        console.log("changed model");
        editor.current.setModel(workspace.editor.currentEditorModel);
        const viewState = workspace.editor.getSavedViewState();
        if (viewState) {
          editor.current.restoreViewState(viewState);
        }
        editor.current.focus();
        // get cursor position and set it
        const position = editor.current.getPosition();
        if (position) {
          workspace.editor.updateCurorPosition({
            line: position.lineNumber,
            column: position.column,
          });
        }
      }
    });
  }, []);

  return <div className="code-editor" ref={containerElement} />;
}
