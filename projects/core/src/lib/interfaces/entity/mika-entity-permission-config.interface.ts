import { MikaActionKey } from "../../types/mika-app.type";

export interface MikaEntityPermissionsConfig {
	autoGenerateKeys?: boolean;
	keys?: {
		[custom: MikaActionKey]: string;
	};
}
