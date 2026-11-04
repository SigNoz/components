/**
 * Message assertions for the type tests in `avatar.types.test-d.tsx`. See
 * `src/__tests__/type-error-messages.ts` for what this checks and why.
 */
import { describeTypeErrorMessages } from '../../__tests__/type-error-messages.js';

describeTypeErrorMessages({
	component: 'Avatar',
	testFile: import.meta.url,
	fixture: 'avatar.types.test-d.tsx',
});
