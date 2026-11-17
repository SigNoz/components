/**
 * Message assertions for the type tests in `color-picker.types.test-d.tsx`. See
 * `src/__tests__/type-error-messages.ts` for what this checks and why.
 */
import { describeTypeErrorMessages } from '../../__tests__/type-error-messages.js';

describeTypeErrorMessages({
	component: 'ColorPicker',
	testFile: import.meta.url,
	fixture: 'color-picker.types.test-d.tsx',
});
