import type { getAppApi } from "main/preload/app";
export type HeliumId = `helium-${string}`;

export interface ThemeInfo {
    shopifyId?: number;
    heliumId: HeliumId;
    path: string;
    name: string;
    verson: string;
    author: string;
}

export interface StoreInfo {
    heliumId: HeliumId;
    themeAccessPassword: string
    url: string;
}

// HeliumAPI, HeliumGlobal???
export interface Helium {
    app: ReturnType<typeof getAppApi>
}
