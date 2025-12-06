import { MikaAuthConfig, MikaUser } from "../interfaces";
import { getValueByPath } from "../utils";

// 📤 Request Normalizer (Input)
export function normalizeMikaAuthRequest(authConfig: MikaAuthConfig, credentials: { email: string, password: string }): any {
    if (!authConfig) return credentials;

	const mapped = {
		[authConfig.requestMap?.identifierKey || 'email']: credentials.email,
        [authConfig.requestMap?.passwordKey || 'password']: credentials.password
	};

    return mapped
}

// 📥 Response Normalizer (Output)
export function normalizeMikaAuthResponse(
    authConfig: MikaAuthConfig,
    body: any
): { token: string | null; refreshToken: string | null; user: MikaUser | null } {

    if (!authConfig || !body) {
        return { token: null, refreshToken: null, user: null };
    }

    // 1. Extract Top-Level Data
    const token = getValueByPath(body, authConfig.responseMap?.tokenPath || 'token');
    const refreshToken = getValueByPath(body, authConfig.responseMap?.refreshTokenPath || 'refreshToken');
    const rawUser = getValueByPath(body, authConfig.responseMap?.userPath || 'user');

    // 2. Normalize User Identity (Crucial Step!)
    let user: MikaUser | null = null;

    if (rawUser) {
        const map = authConfig.userIdentityMap || {};
        user = {
            id: getValueByPath(rawUser, map.id || 'id'),
            name: getValueByPath(rawUser, map.name || 'name'),
            email: getValueByPath(rawUser, map.email || 'email'),
            role: getValueByPath(rawUser, map.role || 'role'),
            permissions: getValueByPath(rawUser, map.permissions || 'permissions') || [],
            avatar: getValueByPath(rawUser, map.avatar || 'avatar'),
        };
    }

    return { token, refreshToken, user };
}
