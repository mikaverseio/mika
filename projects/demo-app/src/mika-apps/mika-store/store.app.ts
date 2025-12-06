import { MikaAppConfig, MikaAppConfigAsyncOptions, MikaEntityConfig, resolveMikaAppAsyncConfig } from "@mikaverse/core";
import { bookConfig } from "./book.config";
import { orderConfig } from "./order.config";

export const storeEntities: Record<string, MikaEntityConfig | Function> = {
    'books': bookConfig,
    'orders': orderConfig
};

export function makeMikaStoreApp(): MikaAppConfig {
    return {
        appId: 'mika-store',
        baseUrls: {
            apiBaseUrl: 'http://localhost:3001', // Different Port for Tenant B
            publicSiteUrl: 'https://store.mikaverse.io',
        },
        auth: {
            endpoints: {
                login: 'login',
                logout: 'auth/logout'
            },
            // Using default identifierKey: 'username' since json-server uses that
            requestMap: {
                identifierKey: 'username',
                passwordKey: 'password'
            }
        },
        i18n: {
            defaultLang: 'en',
            fallbackLang: 'en',
            i18nPath: '/assets/i18n/'
        },
        settings: {
            siteName: 'Mika Store',
            logo: '/assets/logo-store.png', // Ensure this exists or use text fallback
            actions: {
                notifications: true,
                messages: false
            },
        },
        entities: storeEntities
    };
}


/**
 * Simulates fetching MikaAppConfig from a slow network endpoint.
 */
export async function makeMikaStoreAppAsync() {
    return resolveMikaAppAsyncConfig(makeMikaStoreApp());
}
