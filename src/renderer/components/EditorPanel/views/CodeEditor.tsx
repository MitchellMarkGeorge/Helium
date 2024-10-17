import { useEffect, useRef } from "react"
import monaco from "monaco-editor";
import "./CodeEditor.scss";

export default function CodeEditor() {
  const containerElement = useRef<HTMLDivElement | null>(null);
  const editor = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);

  useEffect(() => {
    if (containerElement.current) {
      editor.current = monaco.editor.create(containerElement.current, {
        automaticLayout: true,
        value: "CodeEditor",
        fontSize: 14,
        theme: "vs-dark",
        language: "javascript",
      });
    }
  }, [])

  return (
    <div className="CodeEditor" ref={containerElement}/>
  )
}
