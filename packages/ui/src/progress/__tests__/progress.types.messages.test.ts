import { describeTypeErrorMessages } from '../../__tests__/type-error-messages';

describeTypeErrorMessages({
	component: 'Progress',
	testFile: import.meta.url,
	fixture: 'progress.types.test-d.tsx',
});
