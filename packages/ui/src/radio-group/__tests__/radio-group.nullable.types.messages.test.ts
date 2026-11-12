/**
 * Message assertions for the type tests in `radio-group.nullable.types.test-d.tsx`. See
 * `src/__tests__/type-error-messages.ts` for what this checks and why.
 */
import { describeTypeErrorMessages } from '../../__tests__/type-error-messages';

describeTypeErrorMessages({
	component: 'RadioGroup nullable',
	testFile: import.meta.url,
	fixture: 'radio-group.nullable.types.test-d.tsx',
});
