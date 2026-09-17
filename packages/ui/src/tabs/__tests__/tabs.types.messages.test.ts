/**
 * Message assertions for the type tests in `tabs.types.test-d.tsx`. See
 * `src/__tests__/type-error-messages.ts` for what this checks and why.
 */
import { describeTypeErrorMessages } from '../../__tests__/type-error-messages';

describeTypeErrorMessages({
	component: 'Tabs',
	testFile: import.meta.url,
	fixture: 'tabs.types.test-d.tsx',
});
