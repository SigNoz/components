import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { Field } from '../../field/field.js';
import { ColorPicker } from '../color-picker.js';
import { ColorPickerField } from '../presets/color-picker-field.js';
import { MID_RED, openPicker } from './color-picker.test-utils.js';

function label(): HTMLLabelElement {
	const element = screen.getByText('Series color').closest('label');

	if (element === null) {
		throw new Error('The field label is missing');
	}

	return element;
}

describe('ColorPicker inside a Field', () => {
	it('is named by the field label, which points at the trigger', () => {
		render(
			<Field label="Series color">
				<ColorPicker nativeButton side="bottom" align="start" testId="picker">
					<button type="button">Pick</button>
				</ColorPicker>
			</Field>,
		);

		const trigger = screen.getByTestId('picker');

		expect(screen.getByRole('button', { name: 'Series color' })).toBe(trigger);
		expect(label().htmlFor).toBe(trigger.id);
		expect(trigger.id).not.toBe('');
	});

	it('keeps the id the trigger has, and points the label at it', () => {
		render(
			<Field label="Series color">
				<ColorPicker nativeButton side="bottom" align="start">
					<button type="button" id="series-color">
						Pick
					</button>
				</ColorPicker>
			</Field>,
		);

		expect(label().htmlFor).toBe('series-color');
		expect(screen.getByRole('button', { name: 'Series color' })).toHaveAttribute(
			'id',
			'series-color',
		);
	});

	it('names a trigger that is not a button with the label id', () => {
		render(
			<Field label="Series color">
				<ColorPicker nativeButton={false} side="bottom" align="start" testId="picker">
					<span />
				</ColorPicker>
			</Field>,
		);

		expect(screen.getByRole('button', { name: 'Series color' })).toBe(screen.getByTestId('picker'));
		expect(screen.getByTestId('picker')).toHaveAttribute('aria-labelledby', label().id);
	});

	it('lets its own aria-label name the trigger', () => {
		render(
			<Field label="Series color">
				<ColorPicker nativeButton={false} side="bottom" align="start" testId="picker">
					<span aria-label={`Series color, ${MID_RED}`} />
				</ColorPicker>
			</Field>,
		);

		expect(screen.getByTestId('picker')).toHaveAccessibleName(`Series color, ${MID_RED}`);
		expect(screen.getByTestId('picker')).not.toHaveAttribute('aria-labelledby');
	});

	it('focuses the trigger on a click on the label, and leaves the popup closed', async () => {
		render(
			<Field label="Series color">
				<ColorPicker nativeButton side="bottom" align="start" testId="picker">
					<button type="button">Pick</button>
				</ColorPicker>
			</Field>,
		);

		await userEvent.click(screen.getByText('Series color'));

		expect(screen.getByTestId('picker')).toHaveFocus();
		expect(screen.queryByRole('dialog')).toBeNull();
	});

	it('is described by the description, and by the message in its place', () => {
		const { rerender } = render(
			<Field label="Series color" description="The line color on the chart.">
				<ColorPicker nativeButton side="bottom" align="start" testId="picker">
					<button type="button">Pick</button>
				</ColorPicker>
			</Field>,
		);

		expect(screen.getByTestId('picker')).toHaveAccessibleDescription(
			'The line color on the chart.',
		);

		rerender(
			<Field label="Series color" description="The line color on the chart." error="Pick a color.">
				<ColorPicker nativeButton side="bottom" align="start" testId="picker">
					<button type="button">Pick</button>
				</ColorPicker>
			</Field>,
		);

		expect(screen.getByTestId('picker')).toHaveAccessibleDescription('Pick a color.');
	});

	it('adds the field description to its own aria-describedby', () => {
		render(
			<>
				<p id="hint">Shown on the legend too.</p>
				<Field label="Series color" description="The line color on the chart.">
					<ColorPicker
						nativeButton
						side="bottom"
						align="start"
						testId="picker"
						aria-describedby="hint"
					>
						<button type="button">Pick</button>
					</ColorPicker>
				</Field>
			</>,
		);

		expect(screen.getByTestId('picker')).toHaveAccessibleDescription(
			'Shown on the legend too. The line color on the chart.',
		);
	});

	it('is invalid while the field is in danger, and marks the trigger for its own styles', () => {
		const { rerender } = render(
			<Field label="Series color" error="Pick a color.">
				<ColorPicker nativeButton side="bottom" align="start" testId="picker">
					<button type="button">Pick</button>
				</ColorPicker>
			</Field>,
		);

		expect(screen.getByTestId('picker')).toHaveAttribute('aria-invalid', 'true');
		expect(screen.getByTestId('picker')).toHaveAttribute('data-invalid');

		rerender(
			<Field label="Series color" status="warning" message="Low contrast.">
				<ColorPicker nativeButton side="bottom" align="start" testId="picker">
					<button type="button">Pick</button>
				</ColorPicker>
			</Field>,
		);

		expect(screen.getByTestId('picker')).not.toHaveAttribute('aria-invalid');
		expect(screen.getByTestId('picker')).not.toHaveAttribute('data-invalid');
	});

	it('keeps its own aria-invalid over the field status', () => {
		render(
			<Field label="Series color" error="Pick a color.">
				<ColorPicker nativeButton side="bottom" align="start" testId="picker" aria-invalid={false}>
					<button type="button">Pick</button>
				</ColorPicker>
			</Field>,
		);

		expect(screen.getByTestId('picker')).toHaveAttribute('aria-invalid', 'false');
	});

	it('sets no aria-required on the button, and no native required', () => {
		render(
			<Field label="Series color" required>
				<ColorPicker nativeButton side="bottom" align="start" testId="picker" name="color">
					<button type="button">Pick</button>
				</ColorPicker>
			</Field>,
		);

		expect(screen.getByTestId('picker')).not.toHaveAttribute('aria-required');
		expect(document.querySelector('input[name="color"]')).not.toBeRequired();
	});

	it('leaves a picker outside a field as it was', () => {
		render(
			<ColorPicker nativeButton side="bottom" align="start" testId="picker">
				<button type="button">Color</button>
			</ColorPicker>,
		);

		const trigger = screen.getByTestId('picker');

		expect(trigger).not.toHaveAttribute('aria-describedby');
		expect(trigger).not.toHaveAttribute('aria-invalid');
		expect(trigger).not.toHaveAttribute('data-invalid');
		expect(trigger).not.toHaveAttribute('aria-labelledby');
	});
});

describe('ColorPickerField', () => {
	it('renders the label, the description and the message, wired to the trigger', () => {
		render(
			<ColorPickerField
				label="Series color"
				description="The line color on the chart."
				error="Pick a color."
				nativeButton
				side="bottom"
				align="start"
				testId="series"
			>
				<button type="button">Pick</button>
			</ColorPickerField>,
		);

		const trigger = screen.getByRole('button', { name: 'Series color' });

		expect(trigger).toBe(screen.getByTestId('series'));
		expect(trigger).toHaveAccessibleDescription('Pick a color.');
		expect(trigger).toHaveAttribute('aria-invalid', 'true');
		expect(screen.getByTestId('series-label')).toHaveTextContent('Series color');
		expect(screen.getByTestId('series-message')).toHaveTextContent('Pick a color.');
	});

	it('hands the color to onChange and submits it under name', async () => {
		const onChange = vi.fn();
		render(
			<form data-testid="form">
				<ColorPickerField
					label="Color"
					nativeButton
					side="bottom"
					align="start"
					name="color"
					defaultValue={MID_RED}
					onChange={onChange}
				>
					<button type="button">Pick</button>
				</ColorPickerField>
			</form>,
		);

		await openPicker();
		await userEvent.keyboard('{ArrowUp}');

		const next = onChange.mock.lastCall?.[0] as string;
		const form = screen.getByTestId('form') as HTMLFormElement;

		expect(next).not.toBe(MID_RED);
		expect(new FormData(form).get('color')).toBe(next);
	});

	it('takes the object a react-hook-form Controller hands over, null value included', async () => {
		const onChange = vi.fn();
		const onBlur = vi.fn();
		const ref = createRef<HTMLElement>();
		const field = { value: null, onChange, onBlur, name: 'color', ref };

		render(
			<div>
				<ColorPickerField
					label="Color"
					nativeButton
					side="bottom"
					align="start"
					allowClear
					nullable
					{...field}
				>
					<button type="button">Pick</button>
				</ColorPickerField>
				<button type="button">After</button>
			</div>,
		);

		expect(ref.current).toBe(screen.getByRole('button', { name: 'Color' }));

		const dialog = await openPicker();
		await userEvent.keyboard('{ArrowUp}');

		expect(onChange).toHaveBeenLastCalledWith('#030303');
		expect(within(dialog).getByRole('textbox', { name: 'Hex color' })).toHaveValue('');
	});
});
