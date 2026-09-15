import type { ReactCompilerOptions } from '@vitejs/plugin-react';

/**
 * Shared React Compiler settings for the build and the test runner, so tests
 * exercise the same compiled output that gets published.
 *
 * `target: '18'` makes the compiler emit imports from `react-compiler-runtime`
 * instead of `react/compiler-runtime`, which only exists on React 19+. This
 * package pins its React peer range to 18, so 18 is the only valid target.
 */
export const reactCompilerOptions: ReactCompilerOptions = {
	target: '18',
};
