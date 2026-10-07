import { describeTypeErrorMessages } from '../../__tests__/type-error-messages';

describeTypeErrorMessages({
	component: 'Resizable',
	testFile: import.meta.url,
	fixture: 'resizable.types.test-d.tsx',
});
