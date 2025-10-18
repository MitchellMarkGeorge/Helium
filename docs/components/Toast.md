# Toast

Source: `src/renderer/components/ui/Toast/Toast.tsx`

Notification UI. Controlled via `Workspace.notifications`.

## Props
- **options**: `NotificationOptions`
- **close**: `() => void`

## Example
```tsx
import Toast from "renderer/components/ui/Toast/Toast";
import type { NotificationOptions } from "renderer/models/notification/types";

const opts: NotificationOptions = { type: "success", message: "Saved" };
<Toast options={opts} close={() => { /* ... */ }} />
```