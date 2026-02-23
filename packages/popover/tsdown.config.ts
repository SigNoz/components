import { defineConfig } from 'tsdown';
import tsdownExtend from '@repo/typescript-config/tsdown.config.extend.ts';

export default defineConfig({
	entry: ['src/popover.tsx'],
	...tsdownExtend,
});
