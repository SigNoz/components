/**
 * Message assertions for the type tests in `date-picker.types.test-d.tsx`. See
 * `src/__tests__/type-error-messages.ts` for what this checks and why.
 */
import { describeTypeErrorMessages } from '../../__tests__/type-error-messages.js';

describeTypeErrorMessages({
	component: 'DatePicker',
	testFile: import.meta.url,
	fixture: 'date-picker.types.test-d.tsx',
});
