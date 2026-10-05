import { type Slider, SliderColor } from '@signozhq/ui';
import type { Meta } from '@storybook/react-vite';

export const VOLUME_MARKS = { 0: '1 GB', 25: '10 GB', 50: '100 GB', 75: '1 TB', 100: '10 TB' };

export const sliderParameters: Meta<typeof Slider>['parameters'] = {
	layout: 'fullscreen',
	docs: {
		description: {
			component:
				'Picks one number, or a range of two, from a continuous scale: a setting with a known range, an estimate where the exact number does not matter, or a numeric filter with a lower and an upper bound.',
		},
	},
};

/**
 * The `Slider` props. `Slider.Range` takes them too, so `slider-components.stories.tsx` shares
 * them with `slider.stories.tsx`.
 */
export const sliderArgTypes: Meta<typeof Slider>['argTypes'] = {
	value: {
		control: false,
		description:
			'The controlled value. A value that is not a finite number renders the thumb at `min`, and one outside the scale at the nearest end. The slider never calls `onChange` to correct it.',
		table: { category: 'Content', type: { summary: 'number' } },
	},
	defaultValue: {
		control: 'number',
		description:
			'The initial value when `value` is not set. Without both, the thumb starts at `min`.',
		table: { category: 'Content', type: { summary: 'number' } },
	},
	min: {
		control: 'number',
		description: 'The start of the scale. A `max` that is not above `min` is a bug.',
		table: { category: 'Content', type: { summary: 'number' }, defaultValue: { summary: '0' } },
	},
	max: {
		control: 'number',
		description: 'The end of the scale.',
		table: { category: 'Content', type: { summary: 'number' }, defaultValue: { summary: '100' } },
	},
	step: {
		control: 'number',
		description:
			'The distance between two values a thumb can stop at. `PageUp`, `PageDown` and `Shift` with an arrow move 10% of the scale, rounded to a multiple of `step`, and at least one `step`.',
		table: { category: 'Content', type: { summary: 'number' }, defaultValue: { summary: '1' } },
	},
	color: {
		control: 'select',
		options: Object.values(SliderColor),
		description:
			'The color of the fill, the thumb border and the mark dots, from the same hues as Badge. The track and the dots outside the fill are tints of it. Required, with no default.',
		table: { category: 'Appearance', type: { summary: 'SliderColorType' } },
	},
	marks: {
		control: 'object',
		description:
			'Labels under the track, keyed by the value they point at. Each mark also draws a dot on the track. A click on a label or its dot moves the closest thumb to the mark value. Marks outside the scale are not rendered. Each label has the room up to halfway to the mark on each side.',
		table: { category: 'Content', type: { summary: 'Record<number, string>' } },
	},
	textOverflow: {
		control: 'inline-radio',
		options: ['ellipsis', 'wrap'],
		description:
			'What a mark label longer than its room does. `ellipsis` truncates it and shows the full label in a tooltip on hover, `wrap` breaks it into lines.',
		table: {
			category: 'Content',
			type: { summary: "'ellipsis' | 'wrap'" },
			defaultValue: { summary: "'ellipsis'" },
		},
	},
	tooltip: {
		control: 'boolean',
		description:
			'Shows the value of each thumb in a tooltip above it, on hover, press and keyboard focus, and while the thumb drags. Never opens while `disabled`, nor while `readOnly` with a `readOnlyTooltip`.',
		table: {
			category: 'Behavior',
			type: { summary: 'boolean' },
			defaultValue: { summary: 'false' },
		},
	},
	formatValue: {
		control: false,
		description:
			'Formats a value for the tooltip and for `aria-valuetext`, so a screen reader reads `1,000 GB` and not `50`. Without it, both use the raw number.',
		table: { category: 'Behavior', type: { summary: '(value: number) => string' } },
	},
	disabled: {
		control: 'boolean',
		description:
			'Blocks drag, a click on the track or on a mark, and the keys. The whole slider fades, the thumbs leave the tab order, and the slider is left out of the form submit. Requires `disabledTooltip`. Ignored while `readOnly`.',
		table: { category: 'State', type: { summary: 'boolean' }, defaultValue: { summary: 'false' } },
	},
	disabledTooltip: {
		control: 'text',
		description:
			'Why the slider cannot be used, shown on hover while `disabled`. Empty content renders no tooltip. Only allowed alongside `disabled`, pass `undefined` when there is no reason to give.',
		table: { category: 'State', type: { summary: 'ReactNode' } },
	},
	readOnly: {
		control: 'boolean',
		description:
			'Locks the value: nothing changes and no callback runs. The thumbs stay in the tab order with `aria-readonly`, and the slider is still submitted. Requires `readOnlyTooltip`. Outranks `disabled`.',
		table: { category: 'State', type: { summary: 'boolean' }, defaultValue: { summary: 'false' } },
	},
	readOnlyTooltip: {
		control: 'text',
		description:
			'Why the value is locked, shown on hover and on keyboard focus while `readOnly`. Takes the place of the value tooltip. Only allowed alongside `readOnly`, pass `undefined` when there is no reason to give.',
		table: { category: 'State', type: { summary: 'ReactNode' } },
	},
	name: {
		control: 'text',
		description:
			'Identifies the field when the owning form is submitted. `Slider.Range` submits two values under it, the lower bound first.',
		table: { category: 'Behavior', type: { summary: 'string' } },
	},
	form: {
		control: 'text',
		description: 'The id of the owning form, for a slider rendered outside the `<form>` element.',
		table: { category: 'Behavior', type: { summary: 'string' } },
	},
	required: {
		control: 'boolean',
		description:
			'Accepted so a form can pass the same field props to every control. It has no effect: a slider always holds a value.',
		table: {
			category: 'Behavior',
			type: { summary: 'boolean' },
			defaultValue: { summary: 'false' },
		},
	},
	width: {
		control: 'text',
		description:
			'The width of the slider. Without it the slider fills its parent. Numbers are written as `px`.',
		table: { category: 'Appearance', type: { summary: 'CSSProperties["width"]' } },
	},
	maxWidth: {
		control: 'text',
		description: 'The max-width of the slider. Numbers are written as `px`.',
		table: {
			category: 'Appearance',
			type: { summary: 'CSSProperties["maxWidth"]' },
			defaultValue: { summary: '100%' },
		},
	},
	onChange: {
		control: false,
		description:
			'Called on every change: while the thumb drags, on a click on the track or a mark, and on each key press.',
		table: { category: 'Events', type: { summary: '(value: number) => void' } },
	},
	onAfterChange: {
		control: false,
		description:
			'Called once when a change ends: on pointer release, on each key press, and on a click on a mark.',
		table: { category: 'Events', type: { summary: '(value: number) => void' } },
	},
	'aria-label': {
		control: 'text',
		description:
			'The name of the slider, on the thumb input, when there is no visible label. A `<label htmlFor>` does not work, the input id is internal.',
		table: { category: 'Accessibility', type: { summary: 'string' } },
	},
	'aria-labelledby': {
		control: 'text',
		description: 'The id of the visible label that names the slider, in place of `aria-label`.',
		table: { category: 'Accessibility', type: { summary: 'string' } },
	},
	id: {
		control: 'text',
		description: 'Forwarded to the root.',
		table: { category: 'Accessibility', type: { summary: 'string' } },
	},
	testId: {
		control: 'text',
		description:
			'Forwarded to the root as `data-testid`, and the prefix of the parts: `${testId}-track`, `${testId}-indicator`, `${testId}-thumb-${index}` and `${testId}-mark-${value}`.',
		table: { category: 'Testing', type: { summary: 'string' } },
	},
};
