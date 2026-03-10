export default {
	'*.{js,jsx,ts,tsx}': [
		() => 'pnpm run type-check',
		'biome check --write --no-errors-on-unmatched',
	],
	'*.{json,html,css}': ['biome format --write --no-errors-on-unmatched'],
};
