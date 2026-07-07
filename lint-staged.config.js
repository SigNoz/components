export default {
	'*.{js,jsx,ts,tsx}': [() => 'pnpm run type-check', 'pnpm oxlint --fix', 'pnpm oxfmt'],
	'*.json': ['pnpm oxfmt'],
	'packages/ui/**/*.{css,scss}': [() => 'pnpm -F @signozhq/ui tokens:check'],
};
