/**
 * Message assertions for the type tests in `select.types.test-d.tsx`. See
 * `src/__tests__/type-error-messages.ts` for what this checks and why.
 */
import { describeTypeErrorMessages } from '../../__tests__/type-error-messages';

describeTypeErrorMessages({
	component: 'Select',
	testFile: import.meta.url,
	fixture: 'select.types.test-d.tsx',
});
