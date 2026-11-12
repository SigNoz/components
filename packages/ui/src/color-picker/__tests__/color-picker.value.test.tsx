import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, type MockInstance, vi } from 'vitest';
import { ForceOpenProvider } from '../../testing/index.js';
import { ColorPicker } from '../index.js';
import {
	ControlledPicker,
	click,
	declareSpacingTokens,
	getAlpha,
	getAlphaField,
	getBrightness,
	getHexField,
	getHue,
	getSaturation,
	MID_RED,
	MID_RED_HALF,
	moveTo,
	openPicker,
	pointIn,
	press,
	release,
	resetPointer,
	typeInto,
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
	opaque,
	footer,
}: {
	value: string | undefined;
	onChange?: (value: string | undefined) => void;
	opaque?: boolean;
	footer?: (color: string) => string;
}) {
	return (
		<ForceOpenProvider>
			<ColorPicker
				nativeButton
				side="bottom"
				align="start"
				testId="picker"
				value={value}
				opaque={opaque}
				footer={footer}
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
		['#3a2a63', '3a2a63', '100'],
		['#3A2A63', '3a2a63', '100'],
		['#abc', 'aabbcc', '100'],
		['#ABC', 'aabbcc', '100'],
		['#abcd', 'aabbcc', '87'],
		['#3a2a6380', '3a2a63', '50'],
		['#3A2A6380', '3a2a63', '50'],
		['#3a2a6300', '3a2a63', '0'],
		['#3a2a63ff', '3a2a63', '100'],
		['#3A2A63FF', '3a2a63', '100'],
		['#abcf', 'aabbcc', '100'],
	])('reads %s as the digits %s at an alpha of %s percent', (value, digits, alpha) => {
		const onChange = vi.fn();
		render(<OpenPicker value={value} onChange={onChange} />);

		expect(getHexField()).toHaveValue(digits);
		expect(getAlphaField()).toHaveValue(alpha);
		expect(getAlpha()).toHaveValue(alpha);
		expect(screen.getByTestId('picker-preview')).not.toHaveAttribute('data-empty');
		expect(warn).not.toHaveBeenCalled();
		expect(onChange).not.toHaveBeenCalled();
	});

	it('writes #rrggbb in lower case, from an opaque value in upper case', async () => {
		const onChange = vi.fn();
		render(<ControlledPicker initial="#3A2A63" onChange={onChange} />);
		await openPicker();

		await userEvent.keyboard('{ArrowRight}');

		expect(onChange).toHaveBeenCalledTimes(1);
		expect(onChange.mock.calls[0][0]).toMatch(/^#[\da-f]{6}$/);
	});

	it('writes #rrggbbaa in lower case, from a translucent value in upper case', async () => {
		const onChange = vi.fn();
		render(<ControlledPicker initial="#3A2A6380" onChange={onChange} />);
		await openPicker();

		await userEvent.keyboard('{ArrowRight}');

		expect(onChange).toHaveBeenCalledTimes(1);
		expect(onChange.mock.calls[0][0]).toMatch(/^#[\da-f]{6}80$/);
	});

	it.each(['#3A2A63', '#3A2A6380', '#3A2A63FF', '#ABCD'])(
		'writes nothing for %s that it has not changed',
		async (initial) => {
			const onChange = vi.fn();
			render(<ControlledPicker initial={initial} onChange={onChange} onAfterChange={onChange} />);
			await openPicker();

			await userEvent.click(getHexField());
			await userEvent.tab({ shift: true });

			expect(onChange).not.toHaveBeenCalled();
		},
	);
});

describe('ColorPicker alpha value', () => {
	it('reads the alpha into the strip, the alpha field and the value texts', () => {
		render(<OpenPicker value="#3a2a6380" />);

		expect(getAlpha()).toHaveValue('50');
		expect(getAlpha()).toHaveAttribute('aria-valuetext', '50%, #3a2a6380');
		expect(getAlphaField()).toHaveValue('50');
		expect(getSaturation()).toHaveAttribute('aria-valuetext', '58%, #3a2a6380');
		expect(getHue()).toHaveAttribute('aria-valuetext', '257 degrees, #3a2a6380');
	});

	it('names an opaque value without the alpha in the value texts', () => {
		render(<OpenPicker value="#3a2a63ff" />);

		expect(getAlpha()).toHaveAttribute('aria-valuetext', '100%, #3a2a63');
	});

	it('passes the color to the footer in the shape onChange reports it', () => {
		const { rerender } = render(
			<OpenPicker value="#3a2a6380" footer={(color) => `Footer ${color}`} />,
		);
		expect(screen.getByTestId('picker-footer')).toHaveTextContent('Footer #3a2a6380');

		rerender(<OpenPicker value="#3A2A63FF" footer={(color) => `Footer ${color}`} />);
		expect(screen.getByTestId('picker-footer')).toHaveTextContent('Footer #3a2a63');
	});

	it('keeps the alpha when the area moves', async () => {
		const onAfterChange = vi.fn();
		render(<ControlledPicker initial={MID_RED_HALF} onAfterChange={onAfterChange} />);
		await openPicker();

		await userEvent.keyboard('{End}');
		expect(onAfterChange).toHaveBeenLastCalledWith('#80000080');

		await userEvent.keyboard('{Home}');
		expect(onAfterChange).toHaveBeenLastCalledWith('#80808080');
		expect(getAlphaField()).toHaveValue('50');
	});

	it('keeps the alpha when the hue moves', async () => {
		const onAfterChange = vi.fn();
		render(<ControlledPicker initial={MID_RED_HALF} onAfterChange={onAfterChange} />);
		await openPicker();

		await userEvent.tab();
		await userEvent.keyboard('{PageUp}');

		expect(onAfterChange).toHaveBeenCalledTimes(1);
		expect(onAfterChange.mock.lastCall?.[0]).toMatch(/^#[\da-f]{6}80$/);
		expect(onAfterChange.mock.lastCall?.[0]).not.toBe(MID_RED_HALF);
	});

	it('writes #rrggbb once the alpha is back to full, and #rrggbbaa for any less', async () => {
		const onAfterChange = vi.fn();
		render(<ControlledPicker initial={MID_RED_HALF} onAfterChange={onAfterChange} />);
		await openPicker();
		await userEvent.tab();
		await userEvent.tab();
		expect(getAlpha()).toHaveFocus();

		await userEvent.keyboard('{End}');
		expect(onAfterChange).toHaveBeenLastCalledWith(MID_RED);
		expect(screen.getByTestId('value')).toHaveTextContent(MID_RED);

		await userEvent.keyboard('{ArrowLeft}');
		expect(onAfterChange).toHaveBeenLastCalledWith('#804040fc');
	});

	it('follows an alpha that changes from outside', () => {
		const { rerender } = render(<OpenPicker value="#80404080" />);

		rerender(<OpenPicker value="#80404040" />);
		expect(getAlphaField()).toHaveValue('25');
		expect(getAlpha()).toHaveValue('25');

		rerender(<OpenPicker value="#804040" />);
		expect(getAlphaField()).toHaveValue('100');
	});

	it('writes nothing for a value that only gains an opaque alpha', () => {
		const onChange = vi.fn();
		const { rerender } = render(<OpenPicker value="#804040" onChange={onChange} />);

		rerender(<OpenPicker value="#804040ff" onChange={onChange} />);

		expect(onChange).not.toHaveBeenCalled();
		expect(getAlphaField()).toHaveValue('100');
	});
});

describe('ColorPicker opaque', () => {
	it.each([
		['#3a2a63', '3a2a63'],
		['#abc', 'aabbcc'],
		['#abcd', 'aabbcc'],
		['#3a2a6380', '3a2a63'],
		['#3A2A6300', '3a2a63'],
	])('reads %s as the digits %s, with the alpha dropped', (value, digits) => {
		const onChange = vi.fn();
		render(<OpenPicker value={value} opaque onChange={onChange} />);

		expect(getHexField()).toHaveValue(digits);
		expect(screen.getByTestId('picker-preview')).not.toHaveAttribute('data-empty');
		expect(warn).not.toHaveBeenCalled();
		expect(onChange).not.toHaveBeenCalled();
	});

	it('writes #rrggbb for a value that had an alpha', async () => {
		const onAfterChange = vi.fn();
		render(<ControlledPicker initial={MID_RED_HALF} opaque onAfterChange={onAfterChange} />);
		await openPicker();

		await userEvent.keyboard('{End}');

		expect(onAfterChange).toHaveBeenCalledTimes(1);
		expect(onAfterChange).toHaveBeenCalledWith('#800000');
	});

	it('passes #rrggbb to the footer', () => {
		render(<OpenPicker value="#3a2a6380" opaque footer={(color) => `Footer ${color}`} />);

		expect(screen.getByTestId('picker-footer')).toHaveTextContent('Footer #3a2a63');
	});

	it('writes nothing for a value that only changes its alpha', () => {
		const onChange = vi.fn();
		const { rerender } = render(<OpenPicker value="#80404080" opaque onChange={onChange} />);

		rerender(<OpenPicker value="#80404040" opaque onChange={onChange} />);

		expect(getHexField()).toHaveValue('804040');
		expect(onChange).not.toHaveBeenCalled();
	});

	it('writes nothing for the digits of a value whose alpha it drops', async () => {
		const onChange = vi.fn();
		render(
			<ControlledPicker
				initial={MID_RED_HALF}
				opaque
				onChange={onChange}
				onAfterChange={onChange}
			/>,
		);
		await openPicker();

		await typeInto(getHexField(), '804040');
		await userEvent.tab({ shift: true });

		expect(onChange).not.toHaveBeenCalled();
	});

	it('drops the alpha when opaque turns on, and reads it back when it turns off, without onChange', () => {
		const onChange = vi.fn();
		const ui = (opaque: boolean) => (
			<OpenPicker value="#80404080" opaque={opaque} onChange={onChange} />
		);
		const { rerender } = render(ui(false));
		expect(getAlphaField()).toHaveValue('50');

		rerender(ui(true));
		expect(screen.queryByRole('slider', { name: 'Alpha' })).not.toBeInTheDocument();
		expect(getHexField()).toHaveValue('804040');

		rerender(ui(false));
		expect(getAlphaField()).toHaveValue('50');
		expect(onChange).not.toHaveBeenCalled();
	});

	it('is not opaque unless asked', () => {
		render(<OpenPicker value="#3a2a6380" />);

		expect(screen.getByTestId('picker-popup')).not.toHaveAttribute('data-opaque');
		expect(getAlphaField()).toHaveValue('50');
	});

	it('flags an invalid value the same way', () => {
		render(<OpenPicker value="#12345" opaque />);

		expect(getHexField()).toHaveValue('');
		expect(warn).toHaveBeenCalledTimes(1);
	});
});

describe('ColorPicker invalid value', () => {
	it.each([
		'red',
		'rgb(58, 42, 99)',
		'#12345',
		'#3a2a6',
		'#3a2a63800',
		'3a2a63',
		'#ggg',
		' #3a2a63',
	])('opens %s at #000000 with an empty field, warns once and never calls onChange', (value) => {
		const onChange = vi.fn();
		render(<OpenPicker value={value} onChange={onChange} />);

		expect(getHexField()).toHaveValue('');
		expect(getBrightness()).toHaveValue('0');
		expect(screen.getByTestId('picker-preview')).toHaveAttribute('data-empty');
		expect(warn).toHaveBeenCalledTimes(1);
		expect(warn.mock.calls[0][0]).toContain(JSON.stringify(value));
		expect(onChange).not.toHaveBeenCalled();
	});

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
		['undefined, controlled', undefined],
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

	it('shows an empty alpha field next to a full alpha strip', () => {
		render(<OpenPicker value={undefined} />);

		expect(getAlphaField()).toHaveValue('');
		expect(getAlpha()).toHaveValue('100');
		expect(getAlpha()).toHaveAttribute('aria-valuetext', '100%, no color');
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

	it('stays controlled with value={undefined}, so the panel goes back to no color', async () => {
		const onChange = vi.fn();
		render(
			<ColorPicker nativeButton side="bottom" align="start" value={undefined} onChange={onChange}>
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
