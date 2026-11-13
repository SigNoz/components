import { describeTypeErrorMessages } from '../../__tests__/type-error-messages.js';

describeTypeErrorMessages({
	component: 'Card',
	testFile: import.meta.url,
	fixture: 'card.types.test-d.tsx',
});
