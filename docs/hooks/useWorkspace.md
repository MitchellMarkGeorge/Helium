# useWorkspace

Source: `src/renderer/hooks/useWorkspace.ts`

Returns the current `Workspace` instance from React context.

## Signature
```ts
const workspace = useWorkspace(): Workspace
```

Throws if used outside `WorkspaceContext.Provider`.

## Example
```tsx
import { WorkspaceContext } from "renderer/contexts/Workspace";
import { useWorkspace } from "renderer/hooks/useWorkspace";

function SaveButton() {
  const workspace = useWorkspace();
  return (
    <button onClick={() => workspace.saveCurrentFile()}>Save</button>
  );
}
```
