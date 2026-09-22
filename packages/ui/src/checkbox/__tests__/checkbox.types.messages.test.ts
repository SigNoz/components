/**
 * Message assertions for the type tests in `checkbox.types.test-d.tsx`. See
 * `src/__tests__/type-error-messages.ts` for what this checks and why.
 */
import { describeTypeErrorMessages } from '../../__tests__/type-error-messages';

describeTypeErrorMessages({
	component: 'Checkbox',
	testFile: import.meta.url,
	fixture: 'checkbox.types.test-d.tsx',
});
