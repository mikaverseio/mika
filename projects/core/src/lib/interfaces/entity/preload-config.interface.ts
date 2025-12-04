export interface MikaPreloadConfig {
	/**
	 * Unique key to access this preloaded data later.
	 */
	key: string;

	/**
	 * Optional static data (no request made if this is provided).
	 */
	staticData?: any[];

	/**
	 * API endpoint to fetch the data.
	 */
	endpoint?: string;

	/**
	 * Optional HTTP method ('GET' by default).
	 */
	method?: 'GET' | 'POST';

	/**
	 * Optional query/body parameters.
	 */
	params?: Record<string, any>;

	/**
	 * Optional headers to include in the request.
	 */
	headers?: Record<string, string>;

	/**
	 * Optional transformation function to normalize the result.
	 */
	transform?: (res: any) => any[];
}
