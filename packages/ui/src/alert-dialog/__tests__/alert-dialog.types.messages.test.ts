/**
 * Message assertions for the type tests in `alert-dialog.types.test-d.tsx`. See
 * `src/__tests__/type-error-messages.ts` for what this checks and why.
 */
import { describeTypeErrorMessages } from '../../__tests__/type-error-messages.js';

describeTypeErrorMessages({
	component: 'AlertDialog',
	testFile: import.meta.url,
	fixture: 'alert-dialog.types.test-d.tsx',
});
