# Button

Source: `src/renderer/components/ui/Button/index.tsx`

Headless UI-based button with variants and loading state.

## Props
- **variant?**: `"primary" | "secondary" | "destructive"` (default: `"primary"`)
- **fullWidth?**: `boolean` — stretches to container width
- **loading?**: `boolean` — shows a spinner instead of children
- All native `button` attributes

## Example
```tsx
import Button from "renderer/components/ui/Button";

<Button onClick={save}>Save</Button>
<Button variant="secondary">Cancel</Button>
<Button variant="destructive" loading>Delete</Button>
<Button fullWidth>Full width</Button>
```
