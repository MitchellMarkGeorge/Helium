# IconButton

Source: `src/renderer/components/ui/IconButton/IconButton.tsx`

Button that renders a `react-bootstrap-icons` icon.

## Props
- Inherits `React.ButtonHTMLAttributes<HTMLButtonElement>`
- **icon**: `Icon` (from `react-bootstrap-icons`)

## Example
```tsx
import { XLg } from "react-bootstrap-icons";
import IconButton from "renderer/components/ui/IconButton/IconButton";

<IconButton icon={XLg} aria-label="Close" onClick={onClose} />
```