export default {
	'*.{js,jsx,ts,tsx}': [() => 'pnpm run type-check', 'oxlint --fix', 'oxfmt'],
	'*.json': ['oxfmt'],
	'packages/ui/**/*.{css,scss}': [() => 'pnpm -F @signozhq/ui tokens:check'],
};
