import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import {
	ControlledPicker,
	getAlpha,
	getAlphaField,
	getBlue,
	getFormatButton,
	getGreen,
	getHexField,
	getRed,
	getSaturation,
	getTrigger,
	MID_RED,
	MID_RED_HALF,
	openPicker,
	selectFormat,
	typeInto,
} from './color-picker.test-utils.js';

/**
 * `''` is no color. `ControlledPicker` has no other way to hand it a color that is not there, since
 * an `undefined` falls back to the default of its destructuring.
 */
const NO_COLOR = '';

type Setup = {
	initial?: string;
	format?: 'Hex' | 'RGB';
	opaque?: boolean;
	allowClear?: boolean;
};

async function openWith({ initial = MID_RED, format = 'Hex', opaque, allowClear }: Setup = {}) {
	const onChange = vi.fn();
	const onAfterChange = vi.fn();
	render(
		<ControlledPicker
			initial={initial}
			opaque={opaque}
			allowClear={allowClear}
			onChange={onChange}
			onAfterChange={onAfterChange}
		/>,
	);
	await openPicker();

	if (format === 'RGB') {
		await selectFormat('RGB');
	}

	return { onChange, onAfterChange };
}

function queryField(name: string): HTMLElement | null {
	return screen.queryByRole('textbox', { name });
}

describe('ColorPicker format switch', () => {
	it('opens in hex, with the hex field and no channel fields', async () => {
		await openWith();

		expect(getFormatButton('Hex')).toHaveAttribute('aria-pressed', 'true');
		expect(getFormatButton('RGB')).toHaveAttribute('aria-pressed', 'false');
		expect(getHexField()).toHaveValue('804040');
		expect(queryField('Red')).not.toBeInTheDocument();
		expect(queryField('Green')).not.toBeInTheDocument();
		expect(queryField('Blue')).not.toBeInTheDocument();
	});

	it('shows the channels in RGB, in place of the hex field, with nothing reported', async () => {
		const { onChange, onAfterChange } = await openWith();

		await selectFormat('RGB');

		expect(getFormatButton('RGB')).toHaveAttribute('aria-pressed', 'true');
		expect(getFormatButton('Hex')).toHaveAttribute('aria-pressed', 'false');
		expect(getRed()).toHaveValue('128');
		expect(getGreen()).toHaveValue('64');
		expect(getBlue()).toHaveValue('64');
		expect(queryField('Hex color')).not.toBeInTheDocument();
		expect(screen.getByRole('dialog')).toBeInTheDocument();
		expect(onChange).not.toHaveBeenCalled();
		expect(onAfterChange).not.toHaveBeenCalled();
	});

	it('goes back to hex', async () => {
		await openWith({ format: 'RGB' });

		await selectFormat('Hex');

		expect(getHexField()).toHaveValue('804040');
		expect(queryField('Red')).not.toBeInTheDocument();
	});

	it('keeps pressed the format that is pressed again', async () => {
		await openWith();

		await userEvent.click(getFormatButton('Hex'));

		expect(getFormatButton('Hex')).toHaveAttribute('aria-pressed', 'true');
		expect(getHexField()).toBeInTheDocument();
	});

	it('keeps the alpha field in both formats', async () => {
		await openWith({ initial: MID_RED_HALF });
		expect(getAlphaField()).toHaveValue('50');

		await selectFormat('RGB');

		expect(getAlphaField()).toHaveValue('50');
	});

	it('opens in the format that was picked last', async () => {
		await openWith();
		await selectFormat('RGB');
		await userEvent.keyboard('{Escape}');
		await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());

		await openPicker();

		expect(getFormatButton('RGB')).toHaveAttribute('aria-pressed', 'true');
		expect(getRed()).toHaveValue('128');
		expect(queryField('Hex color')).not.toBeInTheDocument();

		await selectFormat('Hex');
		await userEvent.keyboard('{Escape}');
		await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());

		await openPicker();

		expect(getHexField()).toHaveValue('804040');
	});

	it('commits the text of the field it replaces', async () => {
		const { onAfterChange } = await openWith();
		await typeInto(getHexField(), '00ff00');

		await selectFormat('RGB');

		expect(onAfterChange).toHaveBeenCalledTimes(1);
		expect(onAfterChange).toHaveBeenCalledWith('#00ff00');
		expect(getRed()).toHaveValue('0');
		expect(getGreen()).toHaveValue('255');
		expect(getBlue()).toHaveValue('0');
	});

	it('switches on Enter and on Space', async () => {
		await openWith();

		getFormatButton('RGB').focus();
		await userEvent.keyboard('{Enter}');
		expect(getFormatButton('RGB')).toHaveAttribute('aria-pressed', 'true');
		expect(getRed()).toBeInTheDocument();

		getFormatButton('Hex').focus();
		await userEvent.keyboard(' ');
		expect(getFormatButton('Hex')).toHaveAttribute('aria-pressed', 'true');
		expect(getHexField()).toBeInTheDocument();
	});

	it('is one tab stop, and the next one is the first field', async () => {
		await openWith({ format: 'RGB' });

		expect(getFormatButton('RGB')).toHaveFocus();
		expect(getFormatButton('Hex')).toHaveAttribute('tabindex', '-1');

		await userEvent.tab();

		expect(getRed()).toHaveFocus();
	});

	it('does not submit the form it sits in', async () => {
		const onSubmit = vi.fn((event: { preventDefault: () => void }) => event.preventDefault());
		render(
			<form onSubmit={onSubmit}>
				<ControlledPicker initial={MID_RED} />
			</form>,
		);
		await openPicker();

		await selectFormat('RGB');

		expect(onSubmit).not.toHaveBeenCalled();
	});
});

describe('ColorPicker hex field and alpha', () => {
	it.each<[typed: string, initial: string, hex: string, digits: string, alphaPercent: string]>([
		['3a2a63', MID_RED, '#3a2a63', '3a2a63', '100'],
		['3a2a63', MID_RED_HALF, '#3a2a6380', '3a2a63', '50'],
		['#3A2A63', MID_RED_HALF, '#3a2a6380', '3a2a63', '50'],
		['abc', MID_RED_HALF, '#aabbcc80', 'aabbcc', '50'],
		['3a2a6340', MID_RED, '#3a2a6340', '3a2a63', '25'],
		['#3A2A6340', MID_RED_HALF, '#3a2a6340', '3a2a63', '25'],
		['abcd', MID_RED, '#aabbccdd', 'aabbcc', '87'],
		['abcd', MID_RED_HALF, '#aabbccdd', 'aabbcc', '87'],
		['3a2a6300', MID_RED, '#3a2a6300', '3a2a63', '0'],
		['3a2a63ff', MID_RED_HALF, '#3a2a63', '3a2a63', '100'],
		['abcf', MID_RED_HALF, '#aabbcc', 'aabbcc', '100'],
	])(
		'reads %j over %s as %s, six digits and an alpha of %s percent in the panel',
		async (typed, initial, hex, digits, alphaPercent) => {
			const { onChange, onAfterChange } = await openWith({ initial });

			await typeInto(getHexField(), `${typed}{Enter}`);

			expect(onChange).toHaveBeenCalledTimes(1);
			expect(onChange).toHaveBeenCalledWith(hex);
			expect(onAfterChange).toHaveBeenCalledTimes(1);
			expect(onAfterChange).toHaveBeenCalledWith(hex);
			expect(getHexField()).toHaveValue(digits);
			expect(getAlphaField()).toHaveValue(alphaPercent);
			expect(getAlpha()).toHaveValue(alphaPercent);
		},
	);

	it('reads a pasted #rrggbbaa', async () => {
		const { onAfterChange } = await openWith();
		await userEvent.click(getHexField());
		await userEvent.clear(getHexField());

		await userEvent.paste('#3A2A6380');
		await userEvent.keyboard('{Enter}');

		expect(onAfterChange).toHaveBeenCalledWith('#3a2a6380');
	});

	it.each([
		['804040', MID_RED_HALF],
		['80404080', MID_RED_HALF],
		['804040ff', MID_RED],
	])('calls nothing for %s over %s, the color it already holds', async (typed, initial) => {
		const { onChange, onAfterChange } = await openWith({ initial });

		await typeInto(getHexField(), `${typed}{Enter}`);

		expect(onChange).not.toHaveBeenCalled();
		expect(onAfterChange).not.toHaveBeenCalled();
	});

	it('takes three and six digits alone with opaque, and flags four', async () => {
		const { onAfterChange } = await openWith({ opaque: true });

		await typeInto(getHexField(), 'abcd{Enter}');

		expect(getHexField()).toHaveAttribute('aria-invalid', 'true');
		expect(onAfterChange).not.toHaveBeenCalled();

		await userEvent.clear(getHexField());
		await userEvent.type(getHexField(), 'abc{Enter}');

		expect(getHexField()).not.toHaveAttribute('aria-invalid');
		expect(onAfterChange).toHaveBeenCalledWith('#aabbcc');
	});
});

describe('ColorPicker RGB fields', () => {
	it('shows the channels of the color as whole numbers', async () => {
		await openWith({ initial: '#3a2a6380', format: 'RGB' });

		expect(getRed()).toHaveValue('58');
		expect(getGreen()).toHaveValue('42');
		expect(getBlue()).toHaveValue('99');
	});

	it('shows empty fields, none of them invalid, while there is no color', async () => {
		await openWith({ initial: NO_COLOR, format: 'RGB' });

		for (const field of [getRed(), getGreen(), getBlue()]) {
			expect(field).toHaveValue('');
			expect(field).not.toHaveAttribute('aria-invalid');
		}
	});

	it('calls nothing while typing, and commits on Enter with the popup and the focus kept', async () => {
		const { onChange, onAfterChange } = await openWith({ format: 'RGB' });

		await typeInto(getRed(), '255');
		expect(onChange).not.toHaveBeenCalled();
		expect(getSaturation()).toHaveValue('50');

		await userEvent.keyboard('{Enter}');

		expect(onChange).toHaveBeenCalledTimes(1);
		expect(onChange).toHaveBeenCalledWith('#ff4040');
		expect(onAfterChange).toHaveBeenCalledTimes(1);
		expect(onAfterChange).toHaveBeenCalledWith('#ff4040');
		expect(screen.getByRole('dialog')).toBeInTheDocument();
		expect(getRed()).toHaveFocus();
		expect(getRed()).toHaveValue('255');
	});

	it.each([
		['red', getRed, '255', '#ff4040'],
		['green', getGreen, '0', '#800040'],
		['blue', getBlue, '255', '#8040ff'],
		['red', getRed, '0', '#004040'],
	])('commits %s alone, and keeps the other two channels', async (_, getField, typed, hex) => {
		const { onAfterChange } = await openWith({ format: 'RGB' });

		await typeInto(getField(), `${typed}{Enter}`);

		expect(onAfterChange).toHaveBeenCalledTimes(1);
		expect(onAfterChange).toHaveBeenCalledWith(hex);
	});

	it.each([
		['red', getRed, '255', '#ff404080'],
		['green', getGreen, '0', '#80004080'],
		['blue', getBlue, '255', '#8040ff80'],
	])('keeps the alpha when %s changes', async (_, getField, typed, hex) => {
		const { onAfterChange } = await openWith({ initial: MID_RED_HALF, format: 'RGB' });

		await typeInto(getField(), `${typed}{Enter}`);

		expect(onAfterChange).toHaveBeenCalledWith(hex);
		expect(getAlphaField()).toHaveValue('50');
	});

	it('moves the area and the hex field to the color it commits', async () => {
		await openWith({ format: 'RGB' });

		await typeInto(getGreen(), '255{Enter}');
		await selectFormat('Hex');

		expect(getHexField()).toHaveValue('80ff40');
		expect(getSaturation()).toHaveValue('75');
	});

	it('commits on blur, and the focus moves on to the next channel', async () => {
		const { onAfterChange } = await openWith({ format: 'RGB' });

		await typeInto(getRed(), '255');
		await userEvent.tab();

		expect(onAfterChange).toHaveBeenCalledTimes(1);
		expect(onAfterChange).toHaveBeenCalledWith('#ff4040');
		expect(getGreen()).toHaveFocus();
		expect(getGreen()).toHaveValue('64');
	});

	it('reads 007 as 7, and shows 7 once it commits', async () => {
		const { onAfterChange } = await openWith({ format: 'RGB' });

		await typeInto(getRed(), '007{Enter}');

		expect(onAfterChange).toHaveBeenCalledWith('#074040');
		expect(getRed()).toHaveValue('7');
	});

	it.each(['256', '999', '-1', '1.5', 'abc', '1e2'])(
		'flags %s, keeps it on Enter and puts the color back on blur',
		async (typed) => {
			const { onChange } = await openWith({ format: 'RGB' });

			await typeInto(getRed(), `${typed}{Enter}`);

			expect(getRed()).toHaveValue(typed);
			expect(getRed()).toHaveAttribute('aria-invalid', 'true');
			expect(getRed()).toHaveAttribute('data-invalid');
			expect(getGreen()).not.toHaveAttribute('aria-invalid');

			await userEvent.tab();

			expect(getRed()).toHaveValue('128');
			expect(getRed()).not.toHaveAttribute('aria-invalid');
			expect(getRed()).not.toHaveAttribute('data-invalid');
			expect(onChange).not.toHaveBeenCalled();
		},
	);

	it('does not flag an empty channel, and puts the color back on blur', async () => {
		const { onChange } = await openWith({ format: 'RGB' });
		await userEvent.click(getRed());

		await userEvent.clear(getRed());

		expect(getRed()).toHaveValue('');
		expect(getRed()).not.toHaveAttribute('aria-invalid');

		await userEvent.keyboard('{Enter}');
		await userEvent.tab();

		expect(getRed()).toHaveValue('128');
		expect(onChange).not.toHaveBeenCalled();
	});

	it('calls nothing for the channel it already holds', async () => {
		const { onChange, onAfterChange } = await openWith({ format: 'RGB' });

		await typeInto(getRed(), '128{Enter}');
		await typeInto(getBlue(), '064');
		await userEvent.tab();

		expect(onChange).not.toHaveBeenCalled();
		expect(onAfterChange).not.toHaveBeenCalled();
	});

	it('drops the text on Escape, closes the popup and returns the focus to the trigger', async () => {
		const { onChange } = await openWith({ format: 'RGB' });

		await typeInto(getRed(), '255{Escape}');

		await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
		expect(getTrigger()).toHaveFocus();
		expect(onChange).not.toHaveBeenCalled();
	});

	it('follows the area while it does not have the focus, and keeps the alpha', async () => {
		await openWith({ initial: MID_RED_HALF, format: 'RGB' });

		getSaturation().focus();
		await userEvent.keyboard('{End}');

		expect(getRed()).toHaveValue('128');
		expect(getGreen()).toHaveValue('0');
		expect(getBlue()).toHaveValue('0');
		expect(getAlphaField()).toHaveValue('50');
	});

	it('starts from black when there is no color', async () => {
		const { onAfterChange } = await openWith({ initial: NO_COLOR, format: 'RGB' });

		await typeInto(getRed(), '255{Enter}');

		expect(onAfterChange).toHaveBeenCalledWith('#ff0000');
		expect(getRed()).toHaveValue('255');
		expect(getGreen()).toHaveValue('0');
		expect(getBlue()).toHaveValue('0');
	});

	it('has the clear button after the blue field, and the alpha field after it', async () => {
		await openWith({ format: 'RGB', allowClear: true });

		await userEvent.tab();
		expect(getRed()).toHaveFocus();
		await userEvent.tab();
		expect(getGreen()).toHaveFocus();
		await userEvent.tab();
		expect(getBlue()).toHaveFocus();
		await userEvent.tab();
		expect(screen.getByRole('button', { name: 'Clear color' })).toHaveFocus();
		await userEvent.tab();
		expect(getAlphaField()).toHaveFocus();
	});

	it('clears from the RGB fields, closes the popup and returns the focus to the trigger', async () => {
		const { onChange, onAfterChange } = await openWith({ format: 'RGB', allowClear: true });

		await userEvent.click(screen.getByRole('button', { name: 'Clear color' }));

		expect(onChange).toHaveBeenCalledWith(undefined);
		expect(onAfterChange).toHaveBeenCalledWith(undefined);
		await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
		expect(getTrigger()).toHaveFocus();
	});
});

describe('ColorPicker alpha field', () => {
	it.each([
		[MID_RED, '100'],
		[MID_RED_HALF, '50'],
		['#80404000', '0'],
		['#80404001', '0'],
		['#804040fe', '100'],
	])('shows %s as %s percent', async (initial, percent) => {
		await openWith({ initial });

		expect(getAlphaField()).toHaveValue(percent);
	});

	it.each([
		['0', '#80404000'],
		['10', '#8040401a'],
		['25', '#80404040'],
		['50', '#80404080'],
	])('commits %s percent as %s on Enter, with the popup and the focus kept', async (typed, hex) => {
		const { onChange, onAfterChange } = await openWith();

		await typeInto(getAlphaField(), `${typed}{Enter}`);

		expect(onChange).toHaveBeenCalledTimes(1);
		expect(onChange).toHaveBeenCalledWith(hex);
		expect(onAfterChange).toHaveBeenCalledTimes(1);
		expect(onAfterChange).toHaveBeenCalledWith(hex);
		expect(screen.getByRole('dialog')).toBeInTheDocument();
		expect(getAlphaField()).toHaveFocus();
		expect(getAlpha()).toHaveValue(typed);
	});

	it('commits 100 percent over a translucent color as #rrggbb', async () => {
		const { onAfterChange } = await openWith({ initial: MID_RED_HALF });

		await typeInto(getAlphaField(), '100{Enter}');

		expect(onAfterChange).toHaveBeenCalledTimes(1);
		expect(onAfterChange).toHaveBeenCalledWith(MID_RED);
		expect(getAlpha()).toHaveValue('100');
	});

	it('keeps the color under it, in both formats', async () => {
		await openWith();

		await typeInto(getAlphaField(), '50{Enter}');

		expect(getHexField()).toHaveValue('804040');

		await selectFormat('RGB');

		expect(getRed()).toHaveValue('128');
		expect(getGreen()).toHaveValue('64');
		expect(getBlue()).toHaveValue('64');
	});

	it('commits on blur', async () => {
		const { onAfterChange } = await openWith();

		await typeInto(getAlphaField(), '25');
		await userEvent.tab({ shift: true });

		expect(onAfterChange).toHaveBeenCalledTimes(1);
		expect(onAfterChange).toHaveBeenCalledWith('#80404040');
		expect(getAlphaField()).toHaveValue('25');
	});

	it.each(['101', '150', '5.5', 'abc', '-1', '1e1'])(
		'flags %s, keeps it on Enter and puts the alpha back on blur',
		async (typed) => {
			const { onChange } = await openWith({ initial: MID_RED_HALF });

			await typeInto(getAlphaField(), `${typed}{Enter}`);

			expect(getAlphaField()).toHaveValue(typed);
			expect(getAlphaField()).toHaveAttribute('aria-invalid', 'true');
			expect(getAlphaField()).toHaveAttribute('data-invalid');

			await userEvent.tab({ shift: true });

			expect(getAlphaField()).toHaveValue('50');
			expect(getAlphaField()).not.toHaveAttribute('aria-invalid');
			expect(onChange).not.toHaveBeenCalled();
		},
	);

	it.each([
		[MID_RED, '100'],
		[MID_RED_HALF, '50'],
	])('calls nothing for the alpha of %s it already holds', async (initial, typed) => {
		const { onChange, onAfterChange } = await openWith({ initial });

		await typeInto(getAlphaField(), `${typed}{Enter}`);

		expect(onChange).not.toHaveBeenCalled();
		expect(onAfterChange).not.toHaveBeenCalled();
	});

	it('drops the text on Escape, closes the popup and returns the focus to the trigger', async () => {
		const { onChange } = await openWith();

		await typeInto(getAlphaField(), '25{Escape}');

		await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
		expect(getTrigger()).toHaveFocus();
		expect(onChange).not.toHaveBeenCalled();
	});

	it('follows the alpha strip while it does not have the focus', async () => {
		await openWith({ initial: MID_RED_HALF });

		await userEvent.tab();
		await userEvent.tab();
		await userEvent.keyboard('{ArrowLeft}');

		expect(getAlphaField()).toHaveValue('49');
	});

	it('leaves the alpha strip and the alpha field out with opaque', async () => {
		await openWith({ initial: MID_RED_HALF, opaque: true });

		expect(queryField('Alpha percentage')).not.toBeInTheDocument();
		expect(screen.queryByRole('slider', { name: 'Alpha' })).not.toBeInTheDocument();
		expect(screen.queryByTestId('picker-alpha')).not.toBeInTheDocument();
		expect(screen.queryByTestId('picker-alpha-thumb')).not.toBeInTheDocument();
	});

	it('drops an alpha draft when opaque turns on before the close commits it', async () => {
		const onChange = vi.fn();
		const { rerender } = render(<ControlledPicker initial="#804040" onChange={onChange} />);
		await openPicker();

		await typeInto(getAlphaField(), '25');
		rerender(<ControlledPicker initial="#804040" onChange={onChange} opaque />);
		await userEvent.click(screen.getByRole('button', { name: 'Outside' }));

		await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
		expect(onChange).not.toHaveBeenCalled();
	});

	it('leaves the alpha field out of the RGB format with opaque too', async () => {
		await openWith({ initial: MID_RED_HALF, opaque: true, format: 'RGB' });

		expect(getRed()).toHaveValue('128');
		expect(queryField('Alpha percentage')).not.toBeInTheDocument();
	});
});

describe('ColorPicker one draft at a time', () => {
	it('commits a hex draft when the alpha field takes the focus, and the alpha starts from it', async () => {
		const { onAfterChange } = await openWith();
		await typeInto(getHexField(), '00ff00');

		await userEvent.click(getAlphaField());
		expect(onAfterChange).toHaveBeenCalledTimes(1);
		expect(onAfterChange).toHaveBeenLastCalledWith('#00ff00');

		await typeInto(getAlphaField(), '50{Enter}');

		expect(onAfterChange).toHaveBeenCalledTimes(2);
		expect(onAfterChange).toHaveBeenLastCalledWith('#00ff0080');
	});

	it('puts an invalid hex draft back when the alpha field takes the focus', async () => {
		const { onChange } = await openWith();
		await typeInto(getHexField(), 'zz{Enter}');
		expect(getHexField()).toHaveAttribute('aria-invalid', 'true');

		await userEvent.click(getAlphaField());

		expect(getHexField()).toHaveValue('804040');
		expect(getHexField()).not.toHaveAttribute('aria-invalid');
		expect(onChange).not.toHaveBeenCalled();
	});

	it('commits a channel when the next one takes the focus, and the next starts from it', async () => {
		const { onAfterChange } = await openWith({ format: 'RGB' });
		await typeInto(getRed(), '255');

		await typeInto(getBlue(), '0{Enter}');

		expect(onAfterChange).toHaveBeenCalledTimes(2);
		expect(onAfterChange).toHaveBeenNthCalledWith(1, '#ff4040');
		expect(onAfterChange).toHaveBeenNthCalledWith(2, '#ff4000');
	});
});
