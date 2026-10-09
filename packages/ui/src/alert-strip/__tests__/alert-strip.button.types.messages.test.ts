/**
 * Message assertions for the type tests in `alert-strip.button.types.test-d.tsx`. See
 * `src/__tests__/type-error-messages.ts` for what this checks and why.
 */
import { describeTypeErrorMessages } from '../../__tests__/type-error-messages';

describeTypeErrorMessages({
	component: 'AlertStrip.Button',
	testFile: import.meta.url,
	fixture: 'alert-strip.button.types.test-d.tsx',
});
