import { MikaActionKey } from "../../types/mika-app.type";

export interface MikaEntityPermissionsConfig {
	/**
     * Optional: If true, assume default permissions (e.g., 'products:read', 'products:create').
     */
	autoGenerateKeys?: boolean;
	/**
     * Map of Mika's internal actions (e.g., DELETE) to the exact permission string
     * required in the user's JWT or permissions list.
     * * Key: The internal action (EMikaAction.DELETE).
     * Value: The external permission claim (e.g., 'inventory:delete_record').
     */
    requiredClaims?: {
        [key in MikaActionKey]?: string;
    };
}
