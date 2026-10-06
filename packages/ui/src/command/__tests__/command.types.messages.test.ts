/**
 * Message assertions for the type tests in `command.types.test-d.tsx`. See
 * `src/__tests__/type-error-messages.ts` for what this checks and why.
 */
import { describeTypeErrorMessages } from '../../__tests__/type-error-messages';

describeTypeErrorMessages({
	component: 'Command',
	testFile: import.meta.url,
	fixture: 'command.types.test-d.tsx',
});
