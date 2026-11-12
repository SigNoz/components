/**
 * Message assertions for the type tests in `input.field.types.test-d.tsx`. See
 * `src/__tests__/type-error-messages.ts` for what this checks and why.
 */
import { describeTypeErrorMessages } from '../../__tests__/type-error-messages';

describeTypeErrorMessages({
	component: 'InputField',
	testFile: import.meta.url,
	fixture: 'input.field.types.test-d.tsx',
});
