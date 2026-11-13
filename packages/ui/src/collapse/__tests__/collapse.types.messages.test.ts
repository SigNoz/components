/**
 * Message assertions for the type tests in `collapse.types.test-d.tsx`. See
 * `src/__tests__/type-error-messages.ts` for what this checks and why.
 */
import { describeTypeErrorMessages } from '../../__tests__/type-error-messages.js';

describeTypeErrorMessages({
	component: 'Collapse',
	testFile: import.meta.url,
	fixture: 'collapse.types.test-d.tsx',
});
