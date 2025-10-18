# Text

Source: `src/renderer/components/ui/Text/index.tsx`

Utility component to set text size via class names.

## Props
- **size?**: `"xs" | "sm" | "base" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "5xl"`
- **className?**: `string`
- Children are rendered inside a `div`.

## Example
```tsx
import Text from "renderer/components/ui/Text";

<Text size="sm">Small text</Text>
<Text size="xl" className="muted">Title</Text>
```