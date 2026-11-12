import { ColorPickerField, type ColorPickerFieldProps } from '@signozhq/ui';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { type CSSProperties, type ReactElement, type RefAttributes, useState } from 'react';
import { expect, fn, userEvent, waitFor, within } from 'storybook/test';
import styles from './color-picker-field.stories.module.css';
import { colorPickerArgTypes } from './shared/color-picker-arg-types.js';
import { fieldLabelArgTypes, fieldParameters } from './shared/field-arg-types.js';
import { waitForEffects } from './shared/play.js';

// The field owns `required`, which marks the label and is not the picker's native one.
const { required: _required, ...colorPickerControlArgTypes } = colorPickerArgTypes ?? {};

/**
 * The props of a swatch trigger, spread onto a plain `<button>`: the picker merges its own props
 * into the element it is given, so the trigger has to be the element itself, not a component that
 * drops them.
 */
function swatchProps(color: string | null | undefined): {
	className: string;
	style: CSSProperties | undefined;
	'data-empty': '' | undefined;
} {
	return {
		className: styles.swatch,
		style: color ? ({ '--swatch': color } as CSSProperties) : undefined,
		'data-empty': color ? undefined : '',
	};
}

// The stories write the picker without `nullable`, so their args take the props it has then.
type PlainColorPickerField = (
	props: Extract<ColorPickerFieldProps, { nullable?: never }> & RefAttributes<HTMLElement>,
) => ReactElement;

/**
 * `ColorPickerField` is `ColorPicker` inside a `Field`, in one element. It is documented on the
 * `ColorPicker` page, `color-picker.mdx`, so this file has no docs page of its own.
 */
const meta: Meta<PlainColorPickerField> = {
	title: 'Primitive Components/Field/ColorPickerField',
	component: ColorPickerField as PlainColorPickerField,
	tags: ['!autodocs'],
	parameters: fieldParameters,
	argTypes: {
		...colorPickerControlArgTypes,
		...fieldLabelArgTypes,
		id: {
			control: 'text',
			description:
				"Lands on the popup, as on `ColorPicker`. The trigger takes the field's control id, or the `id` of the element you pass, and the label points at it.",
			table: { category: 'Accessibility', type: { summary: 'string' } },
		},
		testId: {
			control: 'text',
			description:
				'Forwarded to the trigger as `data-testid`, and names every part of the popup. The field parts take it as their prefix: `${testId}-label`, `${testId}-label-tooltip`, `${testId}-description` and `${testId}-message`. The field root gets no `data-testid`.',
			table: { category: 'Testing', type: { summary: 'string' } },
		},
	},
	args: {
		label: 'Series color',
		description: 'The line color on the chart.',
		nativeButton: true,
		side: 'bottom',
		align: 'start',
		defaultValue: '#4e74f8',
		onChange: fn(),
		onAfterChange: fn(),
		onBlur: fn(),
	},
};

export default meta;

type Story = StoryObj<PlainColorPickerField>;

type DefaultViewProps = Parameters<NonNullable<Story['render']>>[0];

/**
 * Keeps the color the swatch shows, while the picker keeps its own from `defaultValue`.
 */
function DefaultView({ onChange, ...args }: DefaultViewProps): ReactElement {
	const [color, setColor] = useState(args.defaultValue);

	return (
		<ColorPickerField
			{...args}
			onChange={(next) => {
				setColor(next);
				onChange?.(next);
			}}
		>
			<button type="button" {...swatchProps(color)} />
		</ColorPickerField>
	);
}

export const Default: Story = {
	decorators: [
		(Story) => (
			<div className="story-container">
				<Story />
			</div>
		),
	],
	parameters: {
		// `States` holds the states of the field, and `Field` covers how they look.
		chromatic: { disableSnapshot: true },
	},
	render: (args) => <DefaultView {...args} />,
};

/**
 * The marker, the description and the status of the field, each wired to the trigger. The message
 * takes the place of the description in the same row, and only `danger` sets `aria-invalid` and
 * `data-invalid`, which the swatch reads for its border. `required` marks the label and sets no
 * `aria-required`, which a button does not take.
 */
export const States: Story = {
	parameters: {
		chromatic: { disableSnapshot: true },
		controls: { disable: true },
	},
	render: () => (
		<div className={`story-container-lg ${styles.stack}`}>
			<ColorPickerField
				label="Series color"
				required
				description="The line color on the chart."
				nativeButton
				side="bottom"
				align="start"
				defaultValue="#4e74f8"
			>
				<button type="button" {...swatchProps('#4e74f8')} />
			</ColorPickerField>
			<ColorPickerField
				label="Threshold color"
				labelTooltip="Drawn as a dashed line."
				description="The color of the threshold line."
				nativeButton
				side="bottom"
				align="start"
				defaultValue="#e5484d"
			>
				<button type="button" {...swatchProps('#e5484d')} />
			</ColorPickerField>
			<ColorPickerField
				label="Background"
				status="warning"
				message="Low contrast with the series colors."
				nativeButton
				side="bottom"
				align="start"
				defaultValue="#1d1d1f"
			>
				<button type="button" {...swatchProps('#1d1d1f')} />
			</ColorPickerField>
			<ColorPickerField
				label="Highlight color"
				required
				error="Pick a color for the highlight."
				nativeButton
				side="bottom"
				align="start"
			>
				<button type="button" {...swatchProps(undefined)} />
			</ColorPickerField>
		</div>
	),
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);

		await waitForEffects();

		const series = canvas.getByRole('button', { name: 'Series color' });

		await expect(series).not.toHaveAttribute('aria-required');
		await expect(series).not.toHaveAttribute('aria-invalid');
		await expect(series).toHaveAccessibleDescription('The line color on the chart.');

		await expect(
			canvas.getByRole('button', { name: 'Threshold color' }),
		).toHaveAccessibleDescription('The color of the threshold line. Drawn as a dashed line.');

		const background = canvas.getByRole('button', { name: 'Background' });

		await expect(background).toHaveAccessibleDescription('Low contrast with the series colors.');
		await expect(background).not.toHaveAttribute('aria-invalid');

		const highlight = canvas.getByRole('button', { name: 'Highlight color' });

		await expect(highlight).toHaveAttribute('aria-invalid', 'true');
		await expect(highlight).toHaveAttribute('data-invalid');
		await expect(highlight).toHaveAccessibleDescription('Pick a color for the highlight.');
	},
};

/**
 * A click on the label focuses the trigger and leaves the popup closed. Opening and closing the
 * popup does not call `onBlur`, and leaving the trigger does, once.
 */
export const LabelAndBlur: Story = {
	args: {
		description: undefined,
	},
	decorators: [
		(Story) => (
			<div className="story-container">
				<Story />
				<button type="button">After</button>
			</div>
		),
	],
	parameters: {
		chromatic: { disableSnapshot: true },
		controls: { disable: true },
	},
	render: (args) => <DefaultView {...args} />,
	play: async ({ canvasElement, args }) => {
		const canvas = within(canvasElement);

		await waitForEffects();

		const trigger = canvas.getByRole('button', { name: 'Series color' });

		await userEvent.click(canvas.getByText('Series color'));

		await expect(trigger).toHaveFocus();
		await expect(within(document.body).queryByRole('dialog')).toBeNull();

		await userEvent.keyboard('{Enter}');
		await within(document.body).findByRole('dialog');
		await userEvent.keyboard('{Escape}');
		await waitFor(() => expect(trigger).toHaveFocus());

		await expect(args.onBlur).not.toHaveBeenCalled();

		await userEvent.tab();

		await waitFor(() => expect(args.onBlur).toHaveBeenCalledTimes(1));
	},
};
