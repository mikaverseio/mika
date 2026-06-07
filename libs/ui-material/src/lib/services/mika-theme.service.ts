import { inject, Injectable, signal, WritableSignal, effect } from '@angular/core';
import { MikaStorageService, MikaKeys } from '@mikaverse/core';

export type ThemeMode = 'light' | 'dark' | 'system';

@Injectable({
    providedIn: 'root',
})
export class MikaThemeService {

    private storage = inject(MikaStorageService);

    // Flag to ensure we don't write the default theme back to storage
    // before the actual preference has been loaded.
    private isInitialized = false;

    // Writable Signal to store and update the active mode for UI control
    public activeMode: WritableSignal<ThemeMode> = signal<ThemeMode>('system');

    constructor() {
        // 1. Initialize the theme (READ from storage)
        this.initializeUserPreferances();

        // 2. Setup the effect for theme change (WRITE to storage and apply CSS)
        effect(() => {
            const mode = this.activeMode();

            // ONLY write to storage and apply the theme IF we have initialized
            // the signal with the value read from storage.
            if (this.isInitialized) {
                // Apply theme first (UI feedback)
                this.applyTheme(mode);

                // Write to storage (persistence) - run asynchronously
                this.storage.set(MikaKeys.ActiveTheme, mode);
            }
        });

        this.listenForSystemChanges();
    }

    // --- Initializing and Applying Theme ---

    async initializeUserPreferances() {
        const pref = await this.storage.get(MikaKeys.ActiveTheme);
        const initialMode: ThemeMode = (pref as ThemeMode) || 'system';

        // 1. Update the signal with the initial value read from storage.
        this.activeMode.set(pref);

        // 2. Manually apply theme on the first run (since effect is skipped initially)
        this.applyTheme(pref);

        // 3. Mark as initialized *after* the signal is set and theme is applied.
        this.isInitialized = true;
    }

    // ... (prefersDark, resolveTheme, applyTheme, listenForSystemChanges methods remain the same)
    private prefersDark(): boolean {
        return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }

    private resolveTheme(mode: ThemeMode): boolean {
        if (mode === 'dark') {
            return true;
        }
        if (mode === 'system') {
            return this.prefersDark();
        }
        return false;
    }

    private applyTheme(mode: ThemeMode): void {
        const shouldAddDark = this.resolveTheme(mode);
        document.documentElement.classList.toggle('ion-palette-dark', shouldAddDark);
    }

    // --- Public Toggle Method ---

    // This method is still simple, as it handles a user-initiated change.
    toggleChange(mode: ThemeMode): void {
        // This set() will trigger the effect, which is now safe to run.
        this.activeMode.set(mode);
    }

    private listenForSystemChanges() {
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
            if (this.activeMode() === 'system') {
                // When 'system' changes, we must force-apply the theme,
                // but we should NOT update storage.
                this.applyTheme('system');
            }
        });
    }
}
