/**
 * Message assertions for the type tests in `dropdown.types.test-d.tsx`. See
 * `src/__tests__/type-error-messages.ts` for what this checks and why.
 */
import { describeTypeErrorMessages } from '../../__tests__/type-error-messages';

describeTypeErrorMessages({
	component: 'Dropdown',
	testFile: import.meta.url,
	fixture: 'dropdown.types.test-d.tsx',
});
