import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, type MockInstance, vi } from 'vitest';
import { ForceOpenProvider } from '../../testing/index.js';
import { ColorPicker } from '../index.js';
import {
	ControlledPicker,
	click,
	declareSpacingTokens,
	getBrightness,
	getHexField,
	getHue,
	getSaturation,
	moveTo,
	openPicker,
	pointIn,
	press,
	release,
	resetPointer,
} from './color-picker.test-utils.js';

let warn: MockInstance<typeof console.warn>;

beforeEach(() => {
	warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
});

afterEach(() => {
	warn.mockRestore();
});

function OpenPicker({
	value,
	onChange,
}: {
	value: string | undefined;
	onChange?: (value: string | undefined) => void;
}) {
	return (
		<ForceOpenProvider>
			<ColorPicker
				nativeButton
				side="bottom"
				align="start"
				testId="picker"
				value={value}
				onChange={onChange}
				onAfterChange={onChange}
			>
				<button type="button">Color</button>
			</ColorPicker>
		</ForceOpenProvider>
	);
}

describe('ColorPicker value format', () => {
	it.each([
		['#3a2a63', '3a2a63'],
		['#3A2A63', '3a2a63'],
		['#abc', 'aabbcc'],
		['#ABC', 'aabbcc'],
		['#abcd', 'aabbcc'],
		['#3a2a6380', '3a2a63'],
		['#3A2A6380', '3a2a63'],
	])('reads %s as %s, with the alpha dropped', (value, digits) => {
		const onChange = vi.fn();
		render(<OpenPicker value={value} onChange={onChange} />);

		expect(getHexField()).toHaveValue(digits);
		expect(screen.getByTestId('picker-preview')).not.toHaveAttribute('data-empty');
		expect(warn).not.toHaveBeenCalled();
		expect(onChange).not.toHaveBeenCalled();
	});

	it('writes #rrggbb in lower case, from a value in upper case', async () => {
		const onChange = vi.fn();
		render(<ControlledPicker initial="#3A2A63" onChange={onChange} />);
		await openPicker();

		await userEvent.keyboard('{ArrowRight}');

		expect(onChange).toHaveBeenCalledTimes(1);
		expect(onChange.mock.calls[0][0]).toMatch(/^#[\da-f]{6}$/);
	});

	it('writes nothing for a value in upper case that it has not changed', async () => {
		const onChange = vi.fn();
		render(<ControlledPicker initial="#3A2A63" onChange={onChange} onAfterChange={onChange} />);
		await openPicker();

		await userEvent.click(getHexField());
		await userEvent.tab({ shift: true });

		expect(onChange).not.toHaveBeenCalled();
	});
});

describe('ColorPicker invalid value', () => {
	it.each(['red', 'rgb(58, 42, 99)', '#12345', '#3a2a6', '3a2a63', '#ggg', ' #3a2a63'])(
		'opens %s at #000000 with an empty field, warns once and never calls onChange',
		(value) => {
			const onChange = vi.fn();
			render(<OpenPicker value={value} onChange={onChange} />);

			expect(getHexField()).toHaveValue('');
			expect(getBrightness()).toHaveValue('0');
			expect(screen.getByTestId('picker-preview')).toHaveAttribute('data-empty');
			expect(warn).toHaveBeenCalledTimes(1);
			expect(warn.mock.calls[0][0]).toContain(JSON.stringify(value));
			expect(onChange).not.toHaveBeenCalled();
		},
	);

	it('warns again for a new invalid value, and stops once the value is valid', () => {
		const { rerender } = render(<OpenPicker value="red" />);
		rerender(<OpenPicker value="red" />);
		expect(warn).toHaveBeenCalledTimes(1);

		rerender(<OpenPicker value="blue" />);
		expect(warn).toHaveBeenCalledTimes(2);

		rerender(<OpenPicker value="#0000ff" />);
		expect(warn).toHaveBeenCalledTimes(2);
		expect(getHexField()).toHaveValue('0000ff');
	});

	it('warns for an invalid defaultValue too', () => {
		render(
			<ColorPicker nativeButton side="bottom" align="start" defaultValue="tomato">
				<button type="button">Color</button>
			</ColorPicker>,
		);

		expect(warn).toHaveBeenCalledTimes(1);
	});
});

describe('ColorPicker empty value', () => {
	it.each([
		['undefined', undefined],
		['an empty string', ''],
	])('reads %s as no color, without a warning', (_, value) => {
		const onChange = vi.fn();
		render(<OpenPicker value={value} onChange={onChange} />);

		expect(getHexField()).toHaveValue('');
		expect(getBrightness()).toHaveValue('0');
		expect(screen.getByTestId('picker-preview')).toHaveAttribute('data-empty');
		expect(getSaturation()).toHaveAttribute('aria-valuetext', '0%, no color');
		expect(warn).not.toHaveBeenCalled();
		expect(onChange).not.toHaveBeenCalled();
	});

	it('holds no color when uncontrolled with no defaultValue', () => {
		render(
			<ForceOpenProvider>
				<ColorPicker nativeButton side="bottom" align="start" testId="picker">
					<button type="button">Color</button>
				</ColorPicker>
			</ForceOpenProvider>,
		);

		expect(getHexField()).toHaveValue('');
		expect(screen.getByTestId('picker-preview')).toHaveAttribute('data-empty');
	});

	it('stays controlled with an empty string, so the panel goes back to no color', async () => {
		const onChange = vi.fn();
		render(
			<ColorPicker nativeButton side="bottom" align="start" value="" onChange={onChange}>
				<button type="button">Color</button>
			</ColorPicker>,
		);
		await openPicker();

		await userEvent.keyboard('{ArrowUp}');

		expect(onChange).toHaveBeenCalledWith('#030303');
		expect(getHexField()).toHaveValue('');
	});

	it('passes #000000 to the footer while there is no color', () => {
		render(
			<ForceOpenProvider>
				<ColorPicker
					nativeButton
					side="bottom"
					align="start"
					testId="picker"
					footer={(color) => `Footer ${color}`}
				>
					<button type="button">Color</button>
				</ColorPicker>
			</ForceOpenProvider>,
		);

		expect(screen.getByTestId('picker-footer')).toHaveTextContent('Footer #000000');
	});

	it('never writes an empty string', async () => {
		const onChange = vi.fn();
		render(<ControlledPicker initial="" onChange={onChange} onAfterChange={onChange} allowClear />);
		await openPicker();

		await userEvent.keyboard('{ArrowUp}');
		await userEvent.click(screen.getByRole('button', { name: 'Clear color' }));

		expect(onChange.mock.calls.map(([value]) => value)).toEqual([
			'#030303',
			'#030303',
			undefined,
			undefined,
		]);
	});
});

describe('ColorPicker hue on a grey', () => {
	afterEach(async () => {
		await resetPointer();
	});

	it('keeps the hue when the area reaches no saturation and comes back', async () => {
		const onAfterChange = vi.fn();
		render(<ControlledPicker initial="#3a2a63" onAfterChange={onAfterChange} />);
		await openPicker();

		await userEvent.keyboard('{Home}');
		expect(onAfterChange).toHaveBeenLastCalledWith('#636363');
		expect(getHue()).toHaveValue('257');

		await userEvent.keyboard('{End}');
		expect(getHue()).toHaveValue('257');
		expect(onAfterChange.mock.lastCall?.[0]).not.toMatch(/^#(..)\1\1$/);
	});

	it('keeps the hue when a drag reaches black and comes back', async () => {
		declareSpacingTokens();
		render(<ControlledPicker initial="#3a2a63" />);
		await openPicker();

		await press(pointIn('picker-area', 0.5, 0.5));
		await moveTo(pointIn('picker-area', 0.5, 1.5));
		await release();
		expect(screen.getByTestId('value')).toHaveTextContent('#000000');

		await click(pointIn('picker-area', 0.9, 0.1));
		expect(getHue()).toHaveValue('257');
	});

	it('keeps the hue when value changes from outside to a grey', () => {
		const { rerender } = render(<OpenPicker value="#3a2a63" />);

		rerender(<OpenPicker value="#808080" />);

		expect(getHexField()).toHaveValue('808080');
		expect(getHue()).toHaveValue('257');
	});

	it('reads the hue of a new value that has one', () => {
		const { rerender } = render(<OpenPicker value="#3a2a63" />);

		rerender(<OpenPicker value="#00ff00" />);

		expect(getHue()).toHaveValue('120');
	});

	it('keeps the hue across no color', () => {
		const { rerender } = render(<OpenPicker value="#3a2a63" />);

		rerender(<OpenPicker value={undefined} />);

		expect(getHue()).toHaveValue('257');
	});
});
