/**
 * Message assertions for the type tests in `radio-cards.types.test-d.tsx`. See
 * `src/__tests__/type-error-messages.ts` for what this checks and why.
 */
import { describeTypeErrorMessages } from '../../__tests__/type-error-messages';

describeTypeErrorMessages({
	component: 'RadioCards',
	testFile: import.meta.url,
	fixture: 'radio-cards.types.test-d.tsx',
});
