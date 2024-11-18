import { useEffect, useRef } from "react";
import monaco from "monaco-editor";
import "./CodeEditor.scss";
import { useWorkspace } from "renderer/hooks/useWorkspace";
import { XCircleFill } from "react-bootstrap-icons";
import Text from "renderer/components/ui/Text";
import { autorun, toJS } from "mobx";
import { observer } from "mobx-react-lite";

function CodeEditor() {
  const containerElement = useRef<HTMLDivElement | null>(null);
  const editor = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
  const textChangeEventRef = useRef<monaco.IDisposable | null>(null);
  const cursorPositionChangeEvenRef = useRef<monaco.IDisposable | null>(null);
  const workspace = useWorkspace();

  // const currentFile = workspace.editor.getCurrentFile();
  // console.log("This is the current file", toJS(currentFile)?.path);
  // const currentEditorModel = workspace.editor.currentEditorModel;

  // if (!currentFile || !workspace.editor.currentEditorModel) {
  if (!workspace.editor.hasCurrentFile || !workspace.editor.currentEditorModel) {
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

      // split these up into seperate effects

      workspace.editor.setMonacoEditor(editor.current);

      return () => {
        console.log("dispose");
        editor.current?.dispose(); // think about this
        cursorPositionChangeEvenRef.current?.dispose();
        textChangeEventRef.current?.dispose();
      };
    }
  }, []);

  useEffect(() => {
    cursorPositionChangeEvenRef.current?.dispose();
    if (editor.current) {
      cursorPositionChangeEvenRef.current =
        editor.current.onDidChangeCursorPosition((event) => {
          workspace.editor.updateCurorPosition({
            line: event.position.lineNumber,
            column: event.position.column,
          });
        });
    }
  }, []);

  // because of the use of the `currentFile` object, should this use a reaction instead (eg. autorun)?
  // the value of the `currentFile` object is not up to date
  useEffect(() => {
    return autorun(() => {
      textChangeEventRef.current?.dispose();
      const currentFile = workspace.editor.getCurrentFile();
      if (editor.current && currentFile) {
        textChangeEventRef.current = editor.current.onDidChangeModelContent(
          () => {
            if (editor.current) {
              const savedViewId = workspace.editor.getCurrentFileVersionId();
              const currentModel = editor.current.getModel();
              const { path } = currentFile; 
              console.log(currentModel);
              console.log(toJS(currentFile));
              if (savedViewId && currentModel) {
                const currentViewId = currentModel.getAlternativeVersionId();
                if (savedViewId !== currentViewId) {
                  console.log("dirty");
                  workspace.editor.markAsUnsaved(path);
                  // } else {
                  //   console.log('clean');
                  // }
                } else {
                  console.log("clean");
                  workspace.editor.markAsClean(path);
                }
              }
            }
          }
        );
      }
    });
  }, []);

  useEffect(() => {
    return autorun(() => {
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

export default observer(CodeEditor);
