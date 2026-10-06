import { describeTypeErrorMessages } from '../../__tests__/type-error-messages';

describeTypeErrorMessages({
	component: 'Divider',
	testFile: import.meta.url,
	fixture: 'divider.types.test-d.tsx',
});
