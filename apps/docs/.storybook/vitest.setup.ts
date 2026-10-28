import { setProjectAnnotations } from '@storybook/react-vite';
import { hostFontGuard } from './hostFontGuard.js';
import * as previewAnnotations from './preview.js';

export const annotations = setProjectAnnotations([
	previewAnnotations,
	{ afterEach: hostFontGuard },
]);
