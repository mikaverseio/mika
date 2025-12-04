
export interface MikaAuthUser {
	id: string;
	name: string;
	email: string;
	role: string;
	permissions: string[];
	appId: string;
	token: string;
}
