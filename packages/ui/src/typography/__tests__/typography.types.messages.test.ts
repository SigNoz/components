import { describeTypeErrorMessages } from '../../__tests__/type-error-messages';

describeTypeErrorMessages({
	component: 'Typography',
	testFile: import.meta.url,
	fixture: 'typography.types.test-d.tsx',
});
