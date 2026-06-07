
import { MikaAuthConfig, MikaGlobalConfig } from "../schema";

export const mikaDefaultConfig: MikaGlobalConfig = {
	siteName: 'Mika',
}

export const mikaDefaultAuthConfig: MikaAuthConfig = {
	endpoints: {
		login: 'auth/login'
	}
}
