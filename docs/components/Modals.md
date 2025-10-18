# Modals

- `MessageModal` — confirm/info modal
- `InputModal` — form modal for simple inputs
- `ModalContainer` — layout wrapper

## MessageModal
Source: `src/renderer/components/ui/Modals/MessageModal/index.tsx`

Props: `{ options: MessageModalOptions }`

Usage is managed by `Workspace.notifications.showMessageModal(options)`.

## InputModal
Source: `src/renderer/components/ui/Modals/InputModal/index.tsx`

Generic typed input modal.

Props: `{ options: InputModalOptions<T> }`

Shown via `Workspace.notifications.showInputModal(options)` or `showPathInputModal(options)`.

## Example
```tsx
workspace.notifications.showMessageModal({
  type: "warning",
  message: "Delete file?",
  primaryButtonText: "Delete",
  secondaryButtonText: "Cancel",
});
```