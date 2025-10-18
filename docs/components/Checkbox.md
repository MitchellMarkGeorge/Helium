# Checkbox

Source: `src/renderer/components/ui/Checkbox/index.tsx`

Headless UI checkbox with optional label.

## Props
- Inherits `ComponentPropsWithoutRef<typeof HeadlessCheckbox>`
- **label?**: `string`

## Example
```tsx
import Checkbox from "renderer/components/ui/Checkbox";

<Checkbox checked={value} onChange={setValue} label="Remember me" />
```