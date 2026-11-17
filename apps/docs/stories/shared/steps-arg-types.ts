import type { Steps, StepsItem, StepsListItem } from '@signozhq/ui';
import type { Meta } from '@storybook/react-vite';

/**
 * The setup flow of the onboarding: the choice made in the first step and the organization of the
 * second show as descriptions, the last step has none yet.
 */
export const ONBOARDING_ITEMS: StepsItem[] = [
	{ label: 'Select data source', description: 'Kubernetes' },
	{ label: 'Configure', description: 'Acme Inc.' },
	{ label: 'Send data' },
];

/**
 * The steps of a trace funnel, each one the spans a trace has to reach. The content is plain text,
 * so the Controls panel can edit it.
 */
export const FUNNEL_ITEMS: StepsListItem[] = [
	{ label: 'Add to cart', children: 'Spans named POST /cart in the cart service.' },
	{ label: 'Checkout', children: 'Spans named POST /checkout in the checkout service.' },
	{ label: 'Payment', children: 'Spans named charge in the payment service.' },
];

export const stepsParameters: Meta<typeof Steps>['parameters'] = {
	layout: 'fullscreen',
};

/**
 * The `Steps` props. `Steps.List` takes the boilerplate ones too, so `steps-components.stories.tsx`
 * shares them with `steps.stories.tsx`.
 */
export const stepsArgTypes: Meta<typeof Steps>['argTypes'] = {
	items: {
		control: 'object',
		description:
			'Required. The steps, in the order of the flow. The first one is step 1. `label` names the step and is one line: text that does not fit is cut with `…`, and a tooltip shows it in full. An empty `label`, or one with only spaces, shows `<No label>`, so the numbers of the steps after it do not move. `description` is one line under the label, such as the choice the user made in that step, and is cut the same way. An empty array renders nothing.',
		table: { category: 'Content', type: { summary: 'StepsItem[]' } },
	},
	current: {
		control: { type: 'number', min: 0, step: 1 },
		description:
			'Required. The number of the current step, starting at 1, the same number the marker shows. The steps before it are done and the steps after it are waiting. A number above the count of steps marks every step done, and no step is current. A number below 1, or one that is not an integer, renders as `1` and warns on the console.',
		table: { category: 'State', type: { summary: 'number' } },
	},
	'aria-label': {
		control: 'text',
		description:
			'The name of the list. It has none of its own, so a screen with two lists of steps passes its own to each, such as `Setup progress`.',
		table: { category: 'Accessibility', type: { summary: 'string' } },
	},
	id: {
		control: 'text',
		description: 'Forwarded to the `ol`.',
		table: { category: 'Accessibility', type: { summary: 'string' } },
	},
	testId: {
		control: 'text',
		description:
			'Forwarded as `data-testid`. The steps derive theirs from it: `-item-{n}`, and on each step `-marker`, `-label` and `-description`. In `Steps.List` the last part is `-content` in place of `-description`, its `ol` adds `-items`, and a footer adds `-footer`, `-footer-marker` and `-footer-content`.',
		table: { category: 'Testing', type: { summary: 'string' } },
	},
};
