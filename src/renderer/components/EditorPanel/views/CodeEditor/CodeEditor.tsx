import { useEffect, useRef } from "react";
import monaco from "monaco-editor";
import "./CodeEditor.scss";
import { useWorkspace } from "renderer/hooks/useWorkspace";

export default function CodeEditor() {
  const containerElement = useRef<HTMLDivElement | null>(null);
  const editor = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
  const workspace = useWorkspace();

  const liquid = `{{ 'quick-order-list.css' | asset_url | stylesheet_tag }}

<script src="{{ 'quick-order-list.js' | asset_url }}" defer="defer"></script>

{% render 'quick-order-list', product: product, show_image: true, show_sku: true, is_modal: true %}

{% schema %}
{
  "name": "t:sections.quick-order-list.name",
  "limit": 1,
  "enabled_on": {
    "templates": ["product"]
  }
}
{% endschema %}`

  useEffect(() => {
    if (containerElement.current) {
      editor.current = monaco.editor.create(containerElement.current, {
        automaticLayout: true,
        value: liquid,
        fontSize: 12,
        theme: "helium-default",
        language: "liquid",
        // language: "javascript",
      });
      // editor.current.
    }
  }, []);

  return <div className="CodeEditor" ref={containerElement} />;
}
