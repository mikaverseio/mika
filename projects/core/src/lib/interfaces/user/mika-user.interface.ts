
/**
 * 1. The User Profile (Who they are)
 * This comes directly from the API response.
 */

export interface MikaUser {
	id: string;
	appId?: string;
    name: string;
    email: string;
    role: string;
    permissions: string[];
    avatar?: string; // Nice to have
}

/**
 * 2. The Auth Context (The active session state)
 * This is what gets saved to LocalStorage/Memory.
 * It combines the User Profile with the Token and Tenant Context.
 */
export interface MikaAuthContext extends MikaUser {
    /** The JWT or API Access Token */
    token: string;

    /** The specific App/Tenant ID this session belongs to */
    appId: string;

    /** Optional: Refresh token for long-lived sessions */
    refreshToken?: string | null;
}
