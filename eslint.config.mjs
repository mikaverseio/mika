import nx from '@nx/eslint-plugin';

export default [
	...nx.configs['flat/base'],
	...nx.configs['flat/typescript'],
	...nx.configs['flat/javascript'],
	{
		ignores: [
			'**/dist',
			'**/vite.config.*.timestamp*',
			'**/vitest.config.*.timestamp*',
		],
	},
	{
		files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
		rules: {
			'@nx/enforce-module-boundaries': [
				'error',
				{
					enforceBuildableLibDependency: true,
					allow: ['^.*/eslint(\\.base)?\\.config\\.[cm]?[jt]s$'],
					depConstraints: [
						// --- Shared: no outward dependencies ---
						{
							sourceTag: 'scope:shared',
							onlyDependOnLibsWithTags: ['scope:shared'],
						},
						// --- Mika engine: must stay headless (no UI deps) ---
						{
							sourceTag: 'scope:mika',
							onlyDependOnLibsWithTags: ['scope:mika', 'scope:shared'],
						},
						{
							sourceTag: 'type:engine',
							onlyDependOnLibsWithTags: ['type:engine', 'scope:shared'],
						},
						// --- Mika UI: cannot cross UI frameworks ---
						{
							sourceTag: 'ui:material',
							onlyDependOnLibsWithTags: ['ui:material', 'type:engine', 'scope:shared', 'ui:i18n'],
						},
						{
							sourceTag: 'ui:ionic',
							onlyDependOnLibsWithTags: ['ui:ionic', 'type:engine', 'scope:shared', 'ui:i18n'],
						},
						// --- Demo apps: can use mika engine/ui and shared ---
						{
							sourceTag: 'scope:demo',
							onlyDependOnLibsWithTags: ['scope:mika', 'scope:shared', 'scope:demo'],
						},
						// --- Shop: bounded to its own scope + shared ---
						{
							sourceTag: 'scope:shop',
							onlyDependOnLibsWithTags: [
								'scope:shop',
								'scope:shared',
							],
						},
						// --- API: bounded to its own scope + shared ---
						{
							sourceTag: 'scope:api',
							onlyDependOnLibsWithTags: [
								'scope:api',
								'scope:shared',
							],
						},
						// --- Data libs: no feature/UI deps ---
						{
							sourceTag: 'type:data',
							onlyDependOnLibsWithTags: ['type:data'],
						},
					],
				},
			],
		},
	},
	{
		files: [
			'**/*.ts',
			'**/*.tsx',
			'**/*.cts',
			'**/*.mts',
			'**/*.js',
			'**/*.jsx',
			'**/*.cjs',
			'**/*.mjs',
		],
		// Override or add rules here
		rules: {},
	},
];
