/**
 * Message assertions for the type tests in `form.types.test-d.tsx`. See
 * `src/__tests__/type-error-messages.ts` for what this checks and why.
 */
import { describeTypeErrorMessages } from '../../__tests__/type-error-messages';

describeTypeErrorMessages({
	component: 'Form',
	testFile: import.meta.url,
	fixture: 'form.types.test-d.tsx',
});
