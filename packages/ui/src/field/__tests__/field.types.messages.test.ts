/**
 * Message assertions for the type tests in `field.types.test-d.tsx`. See
 * `src/__tests__/type-error-messages.ts` for what this checks and why.
 */
import { describeTypeErrorMessages } from '../../__tests__/type-error-messages';

describeTypeErrorMessages({
	component: 'Field',
	testFile: import.meta.url,
	fixture: 'field.types.test-d.tsx',
});
