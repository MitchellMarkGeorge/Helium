# useFileIcon

Source: `src/renderer/hooks/useFileIcon.tsx`

Maps a `FileType` to a small icon React element.

## Signature
```ts
function useFileIcon(fileType: FileType | null): React.ReactElement | null
```

## Example
```tsx
import { FileTypeEnum } from "common/types";
import { useFileIcon } from "renderer/hooks/useFileIcon";

function FileRow({ fileType }) {
  const IconEl = useFileIcon(fileType);
  return <div className="file-row">{IconEl} README.md</div>;
}
```
