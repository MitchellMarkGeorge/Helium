# IPC Layer

Helium wraps Electron IPC with typed helpers.

- **Renderer helper**: `src/main/services/ipc/renderer.ts`
  - `invoke<A,R>(eventName)` -> `(arg: A) => Promise<R>`
  - `emit<A>(eventName)` -> `(arg: A) => void`
  - `listen<A>(eventName)` -> `(cb: (arg: A) => void) => void`
  - `on<E extends string>()` -> `<T>(eventName: E, cb: (arg: T) => void) => void`

- **Main helper**: `src/main/services/ipc/main.ts`
  - `handle<A,R>(eventName, (win, args) => R)`
  - `listen<A,R>(eventName, (win, args) => R)`
  - `emitEventFromWindow(win, eventName, args?)`
  - `triggerEvent(webContents, eventName, args)`

Events are consumed by preload APIs (`src/main/preload/*.ts`) and exposed as `window.helium`.
