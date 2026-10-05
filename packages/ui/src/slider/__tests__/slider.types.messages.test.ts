import { describeTypeErrorMessages } from '../../__tests__/type-error-messages';

describeTypeErrorMessages({
	component: 'Slider',
	testFile: import.meta.url,
	fixture: 'slider.types.test-d.tsx',
});
