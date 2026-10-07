import { RadioCards } from '@signozhq/ui';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import { allModes } from '../.storybook/modes.js';
import { waitForEffects } from './shared/play.js';
import { radioCardsArgTypes, radioCardsParameters } from './shared/radio-cards-arg-types.js';

/**
 * The static members of `RadioCards`, grouped under `RadioCards/Components` in the sidebar. They are
 * documented on the `RadioCards` page, `radio-cards.mdx`, so this file has no docs page of its own.
 */
const meta: Meta<typeof RadioCards> = {
	title: 'Primitive Components/RadioCards/Components',
	component: RadioCards,
	tags: ['!autodocs'],
	parameters: radioCardsParameters,
	argTypes: radioCardsArgTypes,
};

export default meta;

/**
 * `RadioCards.Multiple` takes every prop of `RadioCards`. The value and `onChange` hold a list, and
 * a checked card shows a check after its label.
 */
export const Multiple: StoryObj<typeof RadioCards.Multiple> = {
	parameters: {
		chromatic: { disableSnapshot: false, modes: allModes },
	},
	decorators: [
		(Story) => (
			<div className="story-container-lg">
				<Story />
			</div>
		),
	],
	args: {
		'aria-label': 'Observability tools',
		columns: 2,
		defaultValue: ['datadog', 'grafana'],
		allowClear: false,
		items: [
			{ label: 'Datadog', value: 'datadog' },
			{ label: 'Grafana / Prometheus', value: 'grafana' },
			{ label: 'New Relic', value: 'newrelic' },
			{ label: 'Elastic', value: 'elastic' },
			{ label: 'Honeycomb', value: 'honeycomb' },
			{
				label: 'Dynatrace',
				value: 'dynatrace',
				disabled: true,
				disabledTooltip: 'Import from Dynatrace is not supported yet',
			},
		],
		onChange: fn(),
	},
	argTypes: {
		items: {
			control: false,
			description: 'The cards, as on `RadioCards`.',
			table: { category: 'Content', type: { summary: 'RadioCardsItemType[]' } },
		},
		value: {
			control: false,
			description:
				'The controlled value, the `value` of every checked card. `[]` is the group with no card checked, which the group reaches on its own only with `allowClear`. Use with `onChange`.',
			table: { category: 'State', type: { summary: 'string[]' } },
		},
		defaultValue: {
			control: 'object',
			description: 'The values checked on the first render, for a group that keeps its own state.',
			table: { category: 'State', type: { summary: 'string[]' } },
		},
		required: {
			control: 'boolean',
			description:
				'The owning form cannot be submitted while no card is checked. The group checks it, so one checked card is enough.',
			table: {
				category: 'Behavior',
				type: { summary: 'boolean' },
				defaultValue: { summary: 'false' },
			},
		},
		allowClear: {
			control: 'boolean',
			description:
				'Whether the last checked card can be unchecked. Off by default: once a card is checked the group keeps one.',
			table: {
				category: 'Behavior',
				type: { summary: 'boolean' },
				defaultValue: { summary: 'false' },
			},
		},
		onChange: {
			control: false,
			description:
				'Called with the new list of checked values, on a click and on `Space`. Reaching the empty list takes `allowClear`. Never called while `disabled` or `readOnly`.',
			table: { category: 'Events', type: { summary: '(value: string[]) => void' } },
		},
	},
	// Remounts on a new `defaultValue`, since the value is uncontrolled.
	render: (args) => <RadioCards.Multiple key={String(args.defaultValue)} {...args} />,
};

/**
 * Without `allowClear`, a `RadioCards.Multiple` that has a checked card keeps one: the click that
 * would uncheck the last card is cancelled, and `onChange` is not called.
 */
export const MultipleKeepsOne: StoryObj<typeof RadioCards.Multiple> = {
	decorators: [
		(Story) => (
			<div className="story-container-lg">
				<Story />
			</div>
		),
	],
	args: {
		'aria-label': 'Observability tools',
		columns: 3,
		defaultValue: ['datadog'],
		allowClear: false,
		items: [
			{ label: 'Datadog', value: 'datadog' },
			{ label: 'Grafana / Prometheus', value: 'grafana' },
			{ label: 'New Relic', value: 'newrelic' },
		],
		onChange: fn(),
	},
	play: async ({ canvasElement, args }) => {
		const canvas = within(canvasElement);
		const datadog = canvas.getByRole('checkbox', { name: 'Datadog' });
		const grafana = canvas.getByRole('checkbox', { name: 'Grafana / Prometheus' });

		await waitForEffects();

		await userEvent.click(grafana);
		await expect(grafana).toHaveAttribute('aria-checked', 'true');
		await expect(args.onChange).toHaveBeenLastCalledWith(['datadog', 'grafana']);

		await userEvent.click(grafana);
		await expect(args.onChange).toHaveBeenLastCalledWith(['datadog']);

		await userEvent.click(datadog);
		await expect(datadog).toHaveAttribute('aria-checked', 'true');
		await expect(args.onChange).toHaveBeenCalledTimes(2);
	},
	render: (args) => <RadioCards.Multiple {...args} />,
};
