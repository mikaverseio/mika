import { HttpClient, HttpHeaders } from '@angular/common/http';
import { computed, Injectable, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { MikaContextService } from '../engine/mika-context.service';
import { MikaStorageService } from '../infra/mika-storage.service';
import { MikaAppConfig, MikaAuthContext, MikaUser, MikaKeys } from '../../schema';
import { MikaUrlHelper } from '../../helpers/mika-endpoint.helper';
import { normalizeMikaAuthRequest, normalizeMikaAuthResponse } from '../../normalizers';
import { MikaLoggerService } from '../infra/mika-logger.service';
import { Router } from '@angular/router';

// Standardize keys to ensure login() and setUser() use the same storage
const SESSION_PREFIX = MikaKeys.SessionPrefix;
const ACTIVE_APP_KEY = MikaKeys.ActiveAppId;

@Injectable({
    providedIn: 'root'
})
export class MikaAuthService {
    // 1. State Signals
    private _users = signal<Record<string, MikaAuthContext>>({});
    private _activeAppId = signal<string | null>(null);

    // 2. Computed Selectors (The "Reactive Brain")
    /** The core session object for the active tenant */
    session = computed(() => {
        const appId = this._activeAppId();
        return appId ? this._users()[appId] || null : null;
    });

    /** * Legacy Alias for 'session'.
     * Kept for compatibility with your existing code.
     */
    user = computed(() => this.session());

    isLoggedIn = computed(() => {
		const logged = !!this.session()?.token;
		return logged;
	});
    token = computed(() => this.session()?.token ?? null);
    role = computed(() => this.session()?.role ?? null);
    permissions = computed(() => this.session()?.permissions ?? []);

    /** * ✅ KEPT: Required by your external services.
     * Returns the App ID of the currently logged-in user.
     */
    userApp = computed(() => this.session()?.appId ?? null);

    constructor(
        private http: HttpClient,
        private router: Router,
        private context: MikaContextService,
        private storage: MikaStorageService,
		private logger: MikaLoggerService
    ) {}

    // ============================================================
    // ⬇️ LEGACY METHODS (Kept for Compatibility)
    // ============================================================

    /**
     * ✅ KEPT: Imperative getter for current user.
     * Updated to return the cleaner MikaAuthContext type.
     */
    getUser(): MikaAuthContext | null {
        return this.session();
    }

    /**
     * ✅ KEPT: Checks storage for a user state.
     * Updated to use the standard SESSION_PREFIX key.
     */
    async checkUserState(): Promise<MikaAuthContext | null> {
        const appId = this._activeAppId();
        if (!appId) return null;

        const storageKey = `${SESSION_PREFIX}${appId}`;
        try {
            return await this.storage.get(storageKey);
        } catch (error) {
            console.error('[MikaAuth] Failed to check user state', error);
            return null;
        }
    }

    /**
     * ✅ KEPT: Manually sets a user (e.g. from a custom flow).
     * Refactored to ensure it updates the Signals and Storage correctly.
     */
    async setUser(userData: any, app?: MikaAppConfig): Promise<void> {
        if (!app?.appId) {
            console.error('[MikaAuth] Cannot set user: Missing App ID');
            return;
        }

        // Construct a proper session object
        const session: MikaAuthContext = {
            ...userData,
            token: userData.token,
            appId: app.appId,
            permissions: userData.permissions ?? [],
        };

        // Reuse the robust session logic
        await this.setSession({ token: session.token, user: session }, app);
    }

    // ============================================================
    // ⬇️ CORE ENGINE METHODS (Enhanced)
    // ============================================================

    get activeAppId(): string | null {
        return this._activeAppId();
    }

    async setActiveAppId(appId: string | null): Promise<void> {

		// if (this._activeAppId() === appId) {
        //     return; // <-- ADDED GUARD
        // }

        this._activeAppId.set(appId);
        try {
            if (appId) {
                await this.storage.set(ACTIVE_APP_KEY, appId);
            } else {
                await this.storage.remove(ACTIVE_APP_KEY);
            }
        } catch (error) {
            console.error('[MikaAuth] Failed to persist active App ID', error);
        }
    }

    async initialize(): Promise<void> {
        try {
			// Get user default app id
            const storedActiveId = await this.storage.get(MikaKeys.ActiveAppId);
			// Get default app id
            const defaultAppId = this.context.getDefaultAppId();
			// Determine which app id
            const appId = storedActiveId ?? defaultAppId;
            // Load all sessions first
            await this.initializeAll();
            // Then activate the correct one
            if (appId) await this.setActiveAppId(appId);
        } catch (error) {
            console.error('[MikaAuth] Initialization error:', error);
        }
    }

    async initializeAll(): Promise<boolean> {
		// Get all registered apps
        const apps = this.context.getAllApps();
		// Restore sessions
        const restoredSessions = await this.restoreSessions(apps);
		// Set restored sessions
        if (Object.keys(restoredSessions).length > 0) {
            this._users.set(restoredSessions);
            return true;
        }

        return false;
    }

	async restoreSessions(apps: MikaAppConfig[]): Promise<Record<string, MikaAuthContext>> {
		const restoredSessions: Record<string, MikaAuthContext> = {};
		 await Promise.all(apps.map(async (app) => {
            try {
                // Use the standardized key
                const session = await this.storage.get(`${MikaKeys.SessionPrefix}${app.appId}`);
                if (session && session.token) {
                    restoredSessions[app.appId] = session;
                }
            } catch (err) {
                console.warn('[MikaAuth] Failed to restore session for', app.appId, err);
            }
        }));

		return restoredSessions;
	}

    async login(credentials: { email: string, password: string }, app: MikaAppConfig): Promise<any> {
        const authConfig = app.auth;
        const mappedCredentials = normalizeMikaAuthRequest(authConfig!, credentials);
        const baseUrl = MikaUrlHelper.ensureBase(app.baseUrls?.apiBaseUrl || '');
        const loginUrl = `${baseUrl}${authConfig?.endpoints.login}`;

        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'X-Tenant-ID': app.appId
        });

        try {
            const response = await firstValueFrom(
                this.http.post(loginUrl, mappedCredentials, { headers, observe: 'response' })
            );

            // Use the Utility to parse the generic response
            const { token, user } = normalizeMikaAuthResponse(authConfig!, response.body);

            if (token && user) {
                await this.setSession({ token, user }, app);
                return { success: true, user };
            } else {
                console.warn('[MikaAuth] API returned 200 but token/user mapping failed');
                return { success: false, error: 'Invalid response format' };
            }

        } catch (error: any) {
            console.error('[MikaAuth] Login error:', error);
            const status = error.status;
            let msg = 'Login failed';

            if (status === 401) msg = 'Invalid credentials';
            else if (status === 403) msg = 'Access denied';
            else if (status === 0) msg = 'Network error';

            return { success: false, error: msg, originalError: error };
        }
    }

    /**
     * Unified Logic to update State + Storage
     */
    async setSession(
        authResult: { token: string; user: MikaUser },
        app: MikaAppConfig
    ): Promise<void> {
        if (!app?.appId) return;

        const session: MikaAuthContext = {
            ...authResult.user,
            token: authResult.token,
            appId: app.appId
        };

        this.setActiveAppId(app.appId);

        // Update Signal
        this._users.update(current => ({
            ...current,
            [app.appId]: session
        }));

        // Persist
        const storageKey = `${SESSION_PREFIX}${app.appId}`;
        try {
            await this.storage.set(storageKey, session);
        } catch (e) {
            console.error('[MikaAuth] Storage Write Failed', e);
        }
    }

    async logout(app?: MikaAppConfig): Promise<any> {
        if (!app) {
            return await this.logoutFromAllTenants();
        } else {
            return await this.logoutFromTenant(app);
        }
    }

    private async logoutFromTenant(app: MikaAppConfig): Promise<any> {
        const appId = app.appId;

		this.logger.info('MikaAuthService', `Log the user our from ${app.appId}`);

        // 1. Backend Call
        try { await this.callLogoutApi(app); } catch (e) { console.warn(e); }

        // 2. Clear Storage
        await this.storage.remove(`${SESSION_PREFIX}${appId}`);

        // 3. Update Signal
        this._users.update(current => {
            const updated = { ...current };
            delete updated[appId];
            return updated;
        });

        // 4. Navigate
        if (this._activeAppId() === appId) {
            const remaining = Object.keys(this._users());

            if (remaining.length > 0) {
				const nextAppId = remaining[0];
                this.setActiveAppId(nextAppId);
				// this.context.activateApp(nextAppId);

                this.router.navigateByUrl('/dashboard', { replaceUrl: true });
            } else {
                this.setActiveAppId(null);
                this.router.navigateByUrl('/login', { replaceUrl: true });
            }
        }
    }

    private async logoutFromAllTenants(): Promise<any> {
        const apps = this.context.getAllApps();
		const activeApps = Object.keys(this._users());


		const logoutTasks = apps.map(async app => {
			const appId = app.appId;
            // Get the full config needed for the API URL
            if (!activeApps.includes(appId)) return;

			// A. Call Backend Logout (Fire and Forget)
			try { await this.callLogoutApi(app); } catch (e) { console.warn(e); }

			// B. Clear Persistent Session Storage
			await this.storage.remove(`${MikaKeys.SessionPrefix}${appId}`);
        });

       	await Promise.allSettled(logoutTasks);

		await this.storage.remove(ACTIVE_APP_KEY);

        this._users.set({});
        this.setActiveAppId(null);
        this.router.navigateByUrl('/login', { replaceUrl: true });
    }

    private async callLogoutApi(app: MikaAppConfig) {
        if (!app.auth?.endpoints.logout) return;
		const baseUrl = MikaUrlHelper.ensureBase(app.baseUrls?.apiBaseUrl || '');
		const url = `${baseUrl}${app.auth.endpoints.logout}`;
		return firstValueFrom(this.http.post(url, {}));
    }

    /**
     * Returns true if the user has the required permission, or if no permission is required.
     * Set `requiredClaims` on entity configs to enable per-action enforcement.
     */
    hasPermission(permission?: string): boolean {
        if (!permission) return true;
        const perms = this.permissions();
        return perms ? perms.includes(permission) : true;
    }

    isLoggedInToTenant(appId: string): boolean {
        return !!this._users()[appId];
    }

	getRemainingUsers() {
		return Object.keys(this._users());
	}
}
