import { defineConfig } from 'tsdown';
import tsdownExtend from '@repo/typescript-config/tsdown.config.extend.ts';
import { injectCssPlugin } from '@bosh-code/tsdown-plugin-inject-css';
import { tailwindPlugin } from '@bosh-code/tsdown-plugin-tailwindcss';

export default defineConfig({
	entry: ['./src/tailwind.config.js', './src/global.css'],
	...tsdownExtend,
	dts: false,
	sourcemap: false,
	clean: true,
	noExternal: ['tailwindcss-animate', '@signozhq/design-tokens'],
	plugins: [
		injectCssPlugin(),
		tailwindPlugin(),
	]
});
