import { describeTypeErrorMessages } from '../../__tests__/type-error-messages';

describeTypeErrorMessages({
	component: 'Skeleton',
	testFile: import.meta.url,
	fixture: 'skeleton.types.test-d.tsx',
});
