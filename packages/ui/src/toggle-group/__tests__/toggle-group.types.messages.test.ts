/**
 * Message assertions for the type tests in `toggle-group.types.test-d.tsx`. See
 * `src/__tests__/type-error-messages.ts` for what this checks and why.
 */
import { describeTypeErrorMessages } from '../../__tests__/type-error-messages';

describeTypeErrorMessages({
	component: 'ToggleGroup',
	testFile: import.meta.url,
	fixture: 'toggle-group.types.test-d.tsx',
});
