import { HttpClient, HttpHeaders } from '@angular/common/http';
import { computed, Injectable, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { NavController } from '@ionic/angular';
import { MikaAuthUser } from '../../interfaces/user/mika-auth-user.interface';
import { MikaAppService } from '../engine/mika-app.service';
import { Mika } from '../../helpers/mika-app.helper';
import { MikaStorageService } from '../infra/mika-storage.service';
import { MikaAppConfig, MikaAuthConfig } from '../../interfaces/core/mika-app-config.interface';
import { MikaKey } from '../../enum/mika-key.enum';
import { MikaUrlHelper } from '../../helpers/mika-endpoint.helper';

@Injectable({
	providedIn: 'root'
})
export class MikaAuthService {
	private _users = signal<Record<string, MikaAuthUser>>({});
	private _activeAppId = signal<string | null>(null);
	isLoggedIn = computed(() => !!this.token());
	user: any = computed(() => this.getUser());
	token = computed(() => this.user()?.token ?? null);
	userApp = computed(() => this.user()?.appId ?? null);
	role = computed(() => this.user()?.role ?? null);
	permissions = computed(() => this.user()?.permissions ?? []);

	constructor(
		private http: HttpClient,
		private router: NavController,
		private app: MikaAppService,
		private preferences: MikaStorageService
	) {

	}

	getUser() {
		const allUsers = this._users();
		const activeAppId = this._activeAppId();
		return activeAppId && allUsers[activeAppId] ? allUsers[activeAppId] : null;
	}

	/**
	 * Initializes the user's state, typically called on application startup.
	 * Check for the user session in storage.
	 */
	async initialize(): Promise<void> {
		try {
			const storedactiveAppId = await this.preferences.get(MikaKey.ActiveAppId);
			const appId = storedactiveAppId ?? this.app.getDefaultAppId();
			this.setActiveAppId(appId);
			const storedUser = await this.preferences.get(`${MikaKey.UserPrefix}${appId}`);
			if (storedUser) {
				this._users.set({ ...this._users(), [appId]: storedUser });
			}

			await this.initializeAll();
		} catch (error) {
			console.error('Initialization error:', error);
            // this._event$.next({ name: 'initializationError', data: error }); // Use Subject
		}

	}

	/**
     * Initializes all users from storage.
     */
	async initializeAll(): Promise<boolean> {
		const apps = this.app.getAllApps();
		const restoredUsers: Record<string, MikaAuthUser> = {};
		let firstValidappId: string | null = null;
		// Load all users in parallel
		await Promise.all(apps.map(async (app) => {
			try {
				const user = await this.preferences.get(`${MikaKey.UserPrefix}${app.appId}`);
				if (user) {
					restoredUsers[app.appId] = user;
					if (!firstValidappId) {
						firstValidappId = app.appId;
					}
				}
			} catch (err) {
				console.warn('Failed to restore tenant', app.appId, err);
			}
		}));

		if (Object.keys(restoredUsers).length) {
			this._users.set(restoredUsers);
			return true;
		}

		return false;
	}

	/**
	 * Gets the active tenant ID.
	 * @returns The active tenant ID or null if not set.
	 */
	get activeAppId(): string | null {
		return this._activeAppId();
	}


	/**
	* Sets the active tenant ID.
	* @param appId The tenant ID to set.
	*/
	async setActiveAppId(appId: string | null): Promise<void> {
		this._activeAppId.set(appId);
        try {
            await this.preferences.set('mikaactiveAppId', appId);
        } catch (error) {
            console.error('Failed to set active tenant ID in storage', error);
            // this._event$.next({ name: 'setactiveAppIdError', data: error }); // Use Subject
        }
	}

	/**
     * Checks the user's state in storage for the active tenant.
     * @returns  The user data from storage or null if not found.
     */
	async checkUserState(): Promise<MikaAuthUser | null> {
		const storageKey = `mikaUser_${this._activeAppId()}`;
        try {
            return await this.preferences.get(storageKey);
        } catch (error) {
            console.error('Failed to check user state', error);
            // this._event$.next({ name: 'checkUserStateError', data: error }); // Use Subject
            return null; // Consider how you want to handle this.
        }
	}

	/**
	* Performs the login operation.
	* @param credentials The user's email and password.
	* @param tenant The tenant configuration.
	* @returns A promise that resolves with the login response or rejects with an error.
	*/
	async login(credentials: { email: string, password: string }, app: MikaAppConfig): Promise<any> {

		const authConfig = this.app.auth();

		const mappedCredentials = {
			[authConfig?.propMap?.identifier || 'email']: credentials.email,
			[authConfig?.propMap?.password || 'password']: credentials.password
		};

		const headers = new HttpHeaders({
			'Content-Type': 'application/json',
			'X-Tenant-ID': app.appId
		});

		const loginUrl = `${MikaUrlHelper.ensureBase(app.baseUrls.apiBaseUrl)}${authConfig?.endpoints.login}`;

		try {
			const loginResponse = await firstValueFrom(this.http.post(loginUrl, mappedCredentials, { headers }));
            await this.setUser(loginResponse, app);
            // this._event$.next({ name: 'userLoginSuccess', data: loginResponse });  // Use Subject
            return loginResponse;
		} catch(error) {
			// Handle HTTP errors here
			console.error('Login error:', error);
			// this._event$.next({ name: 'loginError', data: error }); // Use Subject
			return Promise.reject(error); // Re-throw as a rejected promise
		}
	}


	/**
	 * Sets the current user and updates the user state.
	 * @param userData The user data.
	 * @param tenant The tenant configuration.
	 */
	async setUser(userData: any, app?: MikaAppConfig): Promise<void> {

		if (!app) {
			throw new Error('[MikaAuthService] Cannot set user without tenant ID.');
		}

		const appId = app?.appId;
		const user: MikaAuthUser = {
			...userData,
			token: userData.token,
			appId: appId,
			permissions: userData.permissions ?? [],
		};

		// this._activeAppId.set(appId);
		this.setActiveAppId(appId);
		this._users.set({ ...this._users(), [appId]: user });

		// Persist user data
		const storageKey = `mikaUser_${appId}`;
		try {
			await this.preferences.set(storageKey, user);
		} catch (e) {
			console.error("Error saving user data", e);
			//  this.events.publish('userSaveError', e);
		}

	}

	/**
     * Logs the user out.
     * @param tenant - The tenant to log out from.  If not provided, logs out from all tenants.
     * @returns A promise that resolves with a boolean indicating success.
     */
	async logout(app?: MikaAppConfig): Promise<boolean> {
		if (!app) {
			return await this.logoutFromAllTenants();
		}

		return await this.logoutFromTenant(app);
	}

	/**
     * Logs the user out from all tenants.
     */
	private async logoutFromAllTenants(): Promise<boolean> {
		const allApps = this.app.getAllApps();

		try {

		} catch (error) {

		}
		const logoutTasks = allApps.map(async (_app) => {
			const appId = _app.appId;
			const authConfig = _app.auth as MikaAuthConfig;
			if (authConfig?.endpoints.logout) {
				const logoutUrl = `${Mika.apiBase}${authConfig?.endpoints.logout}`;
				await firstValueFrom(this.http.post(logoutUrl, {})).catch(() => { });
			}
			await this.preferences.remove(`mikaUser_${appId}`);
		});

		await Promise.allSettled(logoutTasks);

		this._users.set({});
		this._activeAppId.set(this.app.getDefaultAppId());
		this.app.activateApp(this.app.getDefaultAppId());
		await this.preferences.remove('mikaactiveAppId');

		this.router.navigateRoot('/login');
		return false;
	}

	/**
	 * Logs the user out from a specific tenant.
	 * @param tenant The tenant configuration.
	 * @returns A promise that resolves with a boolean indicating success.
	 */
	private async logoutFromTenant(app: MikaAppConfig): Promise<boolean> {
		const appId = app.appId;
		const authConfig = app.auth;

		try {
			// Logout from the tenant's backend (if supported)
			if (authConfig?.endpoints.logout) {
				const logoutUrl = `${Mika.apiBase}${authConfig?.endpoints.logout}`;
				await firstValueFrom(this.http.post(logoutUrl, {})).catch(() => { });
			}

			// Remove the user's data for the tenant
			await this.preferences.remove(`mikaUser_${appId}`);

			// Update the user state
			const updatedUsers = { ...this._users() };
			delete updatedUsers[appId];
			this._users.set(updatedUsers);

			// If the active tenant is being logged out, determine the next active tenant
			if (this._activeAppId() === appId) {
				const remainingappIds = Object.keys(updatedUsers);

				if (remainingappIds.length) {
					const newActive = remainingappIds[0];
					this._activeAppId.set(newActive);
					this.app.activateApp(newActive);
					return true;
				} else {
					this._activeAppId.set(this.app.getDefaultAppId());
					this.app.activateApp(this.app.getDefaultAppId());
					this.router.navigateRoot('/login');
					return false;
				}
			}

			return true;
		} catch (error) {
			console.error(`Logout from app ${appId} failed:`, error);
			// this.events.publish('logoutTenantError', { appId, error }); // Emit an event
			return false; // Indicate failure
		}

	}

	/**
	 * Checks if a user is logged in to a specific tenant.
	 * @param appId The ID of the tenant to check.
	 * @returns True if the user is logged in to the tenant, false otherwise.
	 */
	isLoggedInToTenant(appId: string): boolean {
		return !!this._users()[appId];
	}


	hasPermission(permission: any) {
		return false;
	}


}
