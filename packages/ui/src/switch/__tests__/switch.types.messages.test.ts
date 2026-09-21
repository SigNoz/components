/**
 * Message assertions for the type tests in `switch.types.test-d.tsx`. See
 * `src/__tests__/type-error-messages.ts` for what this checks and why.
 */
import { describeTypeErrorMessages } from '../../__tests__/type-error-messages';

describeTypeErrorMessages({
	component: 'Switch',
	testFile: import.meta.url,
	fixture: 'switch.types.test-d.tsx',
});
