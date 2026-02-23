import { defineConfig } from 'tsdown';
import tsdownExtend from '@repo/typescript-config/tsdown.config.extend.ts';

export default defineConfig({
	entry: ['./tailwind.config.js', './global.css'],
	...tsdownExtend,
	dts: false,
	sourcemap: false,
	clean: false,
	target: false,
});
