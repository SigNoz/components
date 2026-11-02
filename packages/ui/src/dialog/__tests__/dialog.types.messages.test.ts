/**
 * Message assertions for the type tests in `dialog.types.test-d.tsx`. See
 * `src/__tests__/type-error-messages.ts` for what this checks and why.
 */
import { describeTypeErrorMessages } from '../../__tests__/type-error-messages.js';

describeTypeErrorMessages({
	component: 'Dialog',
	testFile: import.meta.url,
	fixture: 'dialog.types.test-d.tsx',
});
