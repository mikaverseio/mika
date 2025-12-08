/**
 * Global enum for all persistent storage keys, tokens, and prefixes used by the Mika Engine.
 * This ensures consistency and prevents naming conflicts (ghost sessions).
 */
export enum MikaKeys {
    // --- Global App/Tenant State ---
    /** Storage key for the currently active App/Tenant ID. */
    ActiveAppId = 'mika.active.app.id',

    /** Default identifier for the primary app in a multi-tenant setup. */
    DefaultAppId = '__default__',

    // --- Authentication & Session Storage ---
    /** Prefix for storing a user session (e.g., mika.session.mika-blog). */
    SessionPrefix = 'mika.session.',

    // --- Runtime/System Metadata ---
    /** Storage key for the total number of registered apps (used for mode checking). */
    AppCount = 'mika.apps.count',

    // --- UI/Component Identifiers ---
    /** Prefix used for generated component IDs (e.g., mika.form.products-edit.123). */
    FormIdPrefix = 'mika.form.',

	EnvPrefix = 'mika.env.',

	ActiveTheme = 'mika.theme',
}
