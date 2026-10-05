import { Slider } from '@signozhq/ui';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { sliderArgTypes, sliderParameters } from './shared/slider-arg-types.js';

/**
 * The static members of `Slider`, grouped under `Slider/Components` in the sidebar. They are
 * documented on the `Slider` page, `slider.mdx`, so this file has no docs page of its own.
 */
const meta: Meta<typeof Slider> = {
	title: 'Primitive Components/Slider/Components',
	component: Slider,
	tags: ['!autodocs'],
	parameters: sliderParameters,
	argTypes: sliderArgTypes,
};

export default meta;

/**
 * `Slider.Range` takes every prop of `Slider`. The value and its callbacks hold a pair, and the
 * `aria-*` go to the root group.
 */
export const Range: StoryObj<typeof Slider.Range> = {
	parameters: {
		chromatic: { disableSnapshot: true },
	},
	decorators: [
		(Story) => (
			<div className="story-container">
				<Story />
			</div>
		),
	],
	args: {
		color: 'primary',
		defaultValue: [20, 70],
		tooltip: true,
		'aria-label': 'Duration',
		onChange: fn(),
		onAfterChange: fn(),
	},
	argTypes: {
		value: {
			control: false,
			description:
				'The controlled value, the lower bound first. Each value renders the way it does on `Slider`. A pair with the first value above the second is a bug.',
			table: { category: 'Content', type: { summary: '[number, number]' } },
		},
		defaultValue: {
			control: 'object',
			description:
				'The initial value when `value` is not set. Without both, the thumbs start at `min` and `max`.',
			table: { category: 'Content', type: { summary: '[number, number]' } },
		},
		onChange: {
			control: false,
			description: 'Called on every change, the same as on `Slider`, with both values.',
			table: { category: 'Events', type: { summary: '(value: [number, number]) => void' } },
		},
		onAfterChange: {
			control: false,
			description: 'Called once when a change ends, the same as on `Slider`, with both values.',
			table: { category: 'Events', type: { summary: '(value: [number, number]) => void' } },
		},
		'aria-label': {
			control: 'text',
			description:
				'The name of the range, on the root `role="group"`. The thumbs are named `Minimum` and `Maximum`.',
			table: { category: 'Accessibility', type: { summary: 'string' } },
		},
		'aria-labelledby': {
			control: 'text',
			description: 'The id of the visible label that names the group, in place of `aria-label`.',
			table: { category: 'Accessibility', type: { summary: 'string' } },
		},
	},
	// Remounts on a new `defaultValue`, since the value is uncontrolled.
	render: (args) => <Slider.Range key={String(args.defaultValue)} {...args} />,
};
