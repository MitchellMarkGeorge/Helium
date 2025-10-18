# Shopify API

Global: `window.helium.shopify`

## Methods
- **openTheme(path: string) => Promise<OpenThemeResult>**
- **startThemePreview(options?: { host: string; port: string }) => Promise<string | null | undefined>**
- **stopThemePreview() => Promise<void>**
- **pullTheme(themeId: string) => Promise<void>**
- **pushTheme() => Promise<void>**
- **connectStore(options: { storeName: string; storeUrl: string; password: string }) => Promise<void>**
- **disconnectStore() => Promise<void>**
- **getConnectedStore() => Promise<StoreInfo>**

## Events
- **onThemeInfoChange(cb: (info: ThemeInfo) => void) => void**
- **onPreviewStateChange(cb: (state: PreviewState) => void) => void**
- **onStoreChange(cb: (store: StoreInfo) => void) => void**

## Examples
```ts
// Open a theme at a folder
const { themeInfo, files } = await window.helium.shopify.openTheme(themeFolder);

// Start preview
await window.helium.shopify.startThemePreview({ host: "127.0.0.1", port: "9292" });

// Listen to preview state changes
window.helium.shopify.onPreviewStateChange((state) => {
  console.log("Preview:", state);
});
```
