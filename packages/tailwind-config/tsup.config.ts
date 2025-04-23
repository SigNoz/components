import { defineConfig } from 'tsup';

export default defineConfig({
	entry: ['./tailwind.config.js', './global.css'], // Include both JS config and CSS
	format: ['esm', 'cjs'], // Output formats for the JS config
	dts: false, // No need for declaration files for the config
	splitting: false,
	sourcemap: false, // Sourcemaps likely not needed for this config
	clean: true, // Clean the dist directory before building
	// tsup will automatically copy the global.css to the dist folder
	// because it's listed as an entry point.
});
