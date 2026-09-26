/**
 * Message assertions for the type tests in `button-group.types.test-d.tsx`. See
 * `src/__tests__/type-error-messages.ts` for what this checks and why.
 */
import { describeTypeErrorMessages } from '../../__tests__/type-error-messages';

describeTypeErrorMessages({
	component: 'ButtonGroup',
	testFile: import.meta.url,
	fixture: 'button-group.types.test-d.tsx',
});
