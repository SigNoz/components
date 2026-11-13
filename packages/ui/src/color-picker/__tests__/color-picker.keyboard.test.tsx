import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { userEvent as browserUserEvent } from 'vitest/browser';
import { ColorPicker } from '../index.js';
import {
	ControlledPicker,
	getAlpha,
	getAlphaField,
	getBrightness,
	getFormatButton,
	getHexField,
	getHue,
	getSaturation,
	getTrigger,
	MID_RED,
	MID_RED_HALF,
	openPicker,
} from './color-picker.test-utils.js';

type Case = [keys: string, saturation: string, brightness: string];

describe('ColorPicker area keys', () => {
	it.each<Case>([
		['{ArrowRight}', '51', '50'],
		['{ArrowLeft}', '49', '50'],
		['{ArrowUp}', '50', '51'],
		['{ArrowDown}', '50', '49'],
		['{Shift>}{ArrowRight}{/Shift}', '60', '50'],
		['{Shift>}{ArrowLeft}{/Shift}', '40', '50'],
		['{Shift>}{ArrowUp}{/Shift}', '50', '60'],
		['{Shift>}{ArrowDown}{/Shift}', '50', '40'],
		['{PageUp}', '50', '60'],
		['{PageDown}', '50', '40'],
		['{Home}', '0', '50'],
		['{End}', '100', '50'],
	])(
		'%s moves the area to saturation %s and brightness %s',
		async (keys, saturation, brightness) => {
			const onChange = vi.fn();
			const onAfterChange = vi.fn();
			render(
				<ControlledPicker initial={MID_RED} onChange={onChange} onAfterChange={onAfterChange} />,
			);
			await openPicker();

			await userEvent.keyboard(keys);

			expect(getSaturation()).toHaveValue(saturation);
			expect(getBrightness()).toHaveValue(brightness);
			expect(onChange).toHaveBeenCalledTimes(1);
			expect(onAfterChange).toHaveBeenCalledTimes(1);
			expect(onAfterChange).toHaveBeenCalledWith(onChange.mock.calls[0][0]);
		},
	);

	it('writes the color each key reaches', async () => {
		const onAfterChange = vi.fn();
		render(<ControlledPicker initial={MID_RED} onAfterChange={onAfterChange} />);
		await openPicker();

		await userEvent.keyboard('{End}');
		expect(onAfterChange).toHaveBeenLastCalledWith('#800000');

		await userEvent.keyboard('{Home}');
		expect(onAfterChange).toHaveBeenLastCalledWith('#808080');
	});

	it('stops at the ends and calls nothing for a key that changes no color', async () => {
		const onChange = vi.fn();
		render(<ControlledPicker initial="#ffffff" onChange={onChange} />);
		await openPicker();

		await userEvent.keyboard('{Home}{PageUp}{ArrowUp}');

		expect(getSaturation()).toHaveValue('0');
		expect(getBrightness()).toHaveValue('100');
		expect(onChange).not.toHaveBeenCalled();
	});

	it('calls nothing for a key at the end of the area on a hue past the last step of the strip', async () => {
		const onChange = vi.fn();
		render(<ControlledPicker initial="#ff0001" onChange={onChange} />);
		await openPicker();

		await userEvent.keyboard('{ArrowRight}{ArrowUp}');

		expect(onChange).not.toHaveBeenCalled();
		expect(getHue()).toHaveValue('359');
	});

	it('moves the focus to the input of the axis a key changes', async () => {
		render(<ControlledPicker initial={MID_RED} />);
		await openPicker();

		await userEvent.keyboard('{ArrowUp}');
		expect(getBrightness()).toHaveFocus();

		await userEvent.keyboard('{ArrowLeft}');
		expect(getSaturation()).toHaveFocus();

		await userEvent.keyboard('{PageDown}');
		expect(getBrightness()).toHaveFocus();

		await userEvent.keyboard('{End}');
		expect(getSaturation()).toHaveFocus();
	});

	it('keeps the area one tab stop, on the axis that moved last', async () => {
		render(<ControlledPicker initial={MID_RED} />);
		await openPicker();

		await userEvent.keyboard('{ArrowDown}');
		await userEvent.tab();
		expect(getHue()).toHaveFocus();

		await userEvent.tab({ shift: true });
		expect(getBrightness()).toHaveFocus();
	});
});

describe('ColorPicker hue keys', () => {
	async function focusHue(initial = MID_RED) {
		const onChange = vi.fn();
		const onAfterChange = vi.fn();
		render(
			<ControlledPicker initial={initial} onChange={onChange} onAfterChange={onAfterChange} />,
		);
		await openPicker();
		await userEvent.tab();
		expect(getHue()).toHaveFocus();

		return { onChange, onAfterChange };
	}

	it.each<[keys: string, hue: string]>([
		['{ArrowRight}', '1'],
		['{ArrowUp}', '1'],
		['{PageUp}', '36'],
		['{Shift>}{ArrowRight}{/Shift}', '36'],
		['{Shift>}{ArrowUp}{/Shift}', '36'],
		['{End}', '359'],
	])('%s moves the hue from 0 to %s', async (keys, hue) => {
		const { onChange, onAfterChange } = await focusHue();

		await userEvent.keyboard(keys);

		expect(getHue()).toHaveValue(hue);
		expect(onChange).toHaveBeenCalledTimes(1);
		expect(onAfterChange).toHaveBeenCalledTimes(1);
	});

	it.each<[keys: string, hue: string]>([
		['{ArrowLeft}', '358'],
		['{ArrowDown}', '358'],
		['{PageDown}', '323'],
		['{Shift>}{ArrowLeft}{/Shift}', '323'],
		['{Shift>}{ArrowDown}{/Shift}', '323'],
		['{Home}', '0'],
	])('%s moves the hue from 359 to %s', async (keys, hue) => {
		const { onAfterChange } = await focusHue();
		await userEvent.keyboard('{End}');
		onAfterChange.mockClear();

		await userEvent.keyboard(keys);

		expect(getHue()).toHaveValue(hue);
		expect(onAfterChange).toHaveBeenCalledTimes(1);
	});

	it('stops at 0 and 359', async () => {
		const { onChange } = await focusHue();

		await userEvent.keyboard('{ArrowLeft}{PageDown}');
		expect(getHue()).toHaveValue('0');

		await userEvent.keyboard('{End}{ArrowRight}{PageUp}');
		expect(getHue()).toHaveValue('359');
		expect(onChange).toHaveBeenCalledTimes(1);
	});

	it('moves the hue of a grey without calling anything, since the hex stays the same', async () => {
		const { onChange, onAfterChange } = await focusHue('#808080');

		await userEvent.keyboard('{PageUp}');

		expect(getHue()).toHaveValue('36');
		expect(getHexField()).toHaveValue('808080');
		expect(onChange).not.toHaveBeenCalled();
		expect(onAfterChange).not.toHaveBeenCalled();
	});
});

describe('ColorPicker alpha keys', () => {
	async function focusAlpha(initial = MID_RED_HALF) {
		const onChange = vi.fn();
		const onAfterChange = vi.fn();
		render(
			<ControlledPicker initial={initial} onChange={onChange} onAfterChange={onAfterChange} />,
		);
		await openPicker();
		await userEvent.tab();
		await userEvent.tab();
		expect(getAlpha()).toHaveFocus();

		return { onChange, onAfterChange };
	}

	it.each<[keys: string, alpha: string, hex: string]>([
		['{ArrowRight}', '51', '#80404082'],
		['{ArrowUp}', '51', '#80404082'],
		['{ArrowLeft}', '49', '#8040407d'],
		['{ArrowDown}', '49', '#8040407d'],
		['{PageUp}', '60', '#80404099'],
		['{PageDown}', '40', '#80404066'],
		['{Shift>}{ArrowRight}{/Shift}', '60', '#80404099'],
		['{Shift>}{ArrowUp}{/Shift}', '60', '#80404099'],
		['{Shift>}{ArrowLeft}{/Shift}', '40', '#80404066'],
		['{Shift>}{ArrowDown}{/Shift}', '40', '#80404066'],
		['{Home}', '0', '#80404000'],
		['{End}', '100', MID_RED],
	])('%s moves the alpha from 50 to %s, and writes %s', async (keys, alpha, hex) => {
		const { onChange, onAfterChange } = await focusAlpha();

		await userEvent.keyboard(keys);

		expect(getAlpha()).toHaveValue(alpha);
		expect(getAlphaField()).toHaveValue(alpha);
		expect(onChange).toHaveBeenCalledTimes(1);
		expect(onChange).toHaveBeenCalledWith(hex);
		expect(onAfterChange).toHaveBeenCalledTimes(1);
		expect(onAfterChange).toHaveBeenCalledWith(hex);
	});

	it('keeps the color under the alpha, and the focus on the strip', async () => {
		await focusAlpha();

		await userEvent.keyboard('{ArrowLeft}');

		expect(getHexField()).toHaveValue('804040');
		expect(getAlpha()).toHaveFocus();
		expect(getAlpha()).toHaveAttribute('aria-valuetext', '49%, #8040407d');
	});

	it('stops at 0 and 100', async () => {
		const { onChange } = await focusAlpha();

		await userEvent.keyboard('{Home}{ArrowLeft}{PageDown}');
		expect(getAlpha()).toHaveValue('0');

		await userEvent.keyboard('{End}{ArrowRight}{PageUp}');
		expect(getAlpha()).toHaveValue('100');
		expect(onChange).toHaveBeenCalledTimes(2);
	});

	it('moves an opaque color to a translucent one, and writes #rrggbbaa', async () => {
		const { onAfterChange } = await focusAlpha(MID_RED);

		await userEvent.keyboard('{ArrowLeft}');

		expect(getAlpha()).toHaveValue('99');
		expect(onAfterChange).toHaveBeenCalledWith('#804040fc');
	});

	it('calls nothing for a key that cannot move an alpha just under full', async () => {
		const { onChange, onAfterChange } = await focusAlpha('#804040fe');

		await userEvent.keyboard('{ArrowRight}{ArrowUp}');

		expect(getAlpha()).toHaveValue('100');
		expect(onChange).not.toHaveBeenCalled();
		expect(onAfterChange).not.toHaveBeenCalled();
	});

	it('ignores the keys it does not take', async () => {
		const { onChange } = await focusAlpha();

		await userEvent.keyboard('{Enter}a');

		expect(getAlpha()).toHaveValue('50');
		expect(onChange).not.toHaveBeenCalled();
	});
});

describe('ColorPicker tab order', () => {
	it('goes area, hue, alpha, format switch, hex field, clear button, alpha field, then the footer', async () => {
		render(
			<ControlledPicker
				initial={MID_RED}
				allowClear
				footer={() => <button type="button">Footer action</button>}
			/>,
		);
		await openPicker();

		await userEvent.tab();
		expect(getHue()).toHaveFocus();
		await userEvent.tab();
		expect(getAlpha()).toHaveFocus();
		await userEvent.tab();
		expect(getFormatButton('Hex')).toHaveFocus();
		await userEvent.tab();
		expect(getHexField()).toHaveFocus();
		await userEvent.tab();
		expect(screen.getByRole('button', { name: 'Clear color' })).toHaveFocus();
		await userEvent.tab();
		expect(getAlphaField()).toHaveFocus();
		await userEvent.tab();
		expect(screen.getByRole('button', { name: 'Footer action' })).toHaveFocus();
	});

	it('leaves out the alpha strip and the alpha field with opaque', async () => {
		render(
			<ControlledPicker
				initial={MID_RED}
				opaque
				allowClear
				footer={() => <button type="button">Footer action</button>}
			/>,
		);
		await openPicker();

		await userEvent.tab();
		expect(getHue()).toHaveFocus();
		await userEvent.tab();
		expect(getFormatButton('Hex')).toHaveFocus();
		await userEvent.tab();
		expect(getHexField()).toHaveFocus();
		await userEvent.tab();
		expect(screen.getByRole('button', { name: 'Clear color' })).toHaveFocus();
		await userEvent.tab();
		expect(screen.getByRole('button', { name: 'Footer action' })).toHaveFocus();
	});

	it('closes when Tab leaves the last element, and moves on', async () => {
		render(
			<>
				<ControlledPicker initial={MID_RED} />
				<button type="button">After</button>
			</>,
		);
		await openPicker();

		for (let stop = 0; stop < 5; stop += 1) {
			await browserUserEvent.tab();
		}
		expect(getAlphaField()).toHaveFocus();
		await browserUserEvent.tab();

		await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
		expect(screen.getByRole('button', { name: 'Outside' })).toHaveFocus();
	});

	it('closes on Escape anywhere in the popup and returns the focus to the trigger', async () => {
		render(<ControlledPicker initial={MID_RED} />);
		await openPicker();
		await userEvent.tab();
		expect(getHue()).toHaveFocus();

		await userEvent.keyboard('{Escape}');

		await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
		expect(getTrigger()).toHaveFocus();
	});
});

describe('ColorPicker trigger keys', () => {
	it('opens on Enter and on Space', async () => {
		render(<ControlledPicker initial={MID_RED} />);
		getTrigger().focus();

		await userEvent.keyboard('{Enter}');
		expect(await screen.findByRole('dialog')).toBeInTheDocument();

		await userEvent.keyboard('{Escape}');
		await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
		expect(getTrigger()).toHaveFocus();

		await userEvent.keyboard(' ');
		expect(await screen.findByRole('dialog')).toBeInTheDocument();
	});

	it.each(['{Delete}', '{Backspace}'])('%s clears the color with allowClear', async (key) => {
		const onChange = vi.fn();
		const onAfterChange = vi.fn();
		render(
			<ControlledPicker
				initial={MID_RED}
				allowClear
				onChange={onChange}
				onAfterChange={onAfterChange}
			/>,
		);
		getTrigger().focus();

		await userEvent.keyboard(key);

		expect(onChange).toHaveBeenCalledTimes(1);
		expect(onChange).toHaveBeenCalledWith(undefined);
		expect(onAfterChange).toHaveBeenCalledTimes(1);
		expect(onAfterChange).toHaveBeenCalledWith(undefined);
		expect(getTrigger()).toHaveFocus();
		expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
	});

	it('clears an uncontrolled picker', async () => {
		render(
			<ColorPicker nativeButton side="bottom" align="start" defaultValue={MID_RED} allowClear>
				<button type="button">Color</button>
			</ColorPicker>,
		);
		getTrigger().focus();

		await userEvent.keyboard('{Delete}');
		await openPicker();

		expect(getHexField()).toHaveValue('');
	});

	it('does nothing without allowClear, or without a color', async () => {
		const onChange = vi.fn();
		const { unmount } = render(<ControlledPicker initial={MID_RED} onChange={onChange} />);
		getTrigger().focus();
		await userEvent.keyboard('{Delete}{Backspace}');
		unmount();

		render(<ControlledPicker allowClear onChange={onChange} />);
		getTrigger().focus();
		await userEvent.keyboard('{Delete}{Backspace}');

		expect(onChange).not.toHaveBeenCalled();
	});
});

describe('ColorPicker hex field', () => {
	it('follows a value that changes while it has the focus, and writes nothing back on blur', async () => {
		const onChange = vi.fn();
		const picker = (value: string) => (
			<ColorPicker nativeButton side="bottom" align="start" value={value} onChange={onChange}>
				<button type="button">Color</button>
			</ColorPicker>
		);
		const { rerender } = render(picker(MID_RED));
		await openPicker();
		await userEvent.click(getHexField());

		rerender(picker('#00ff00'));
		expect(getHexField()).toHaveValue('00ff00');

		getHexField().blur();

		expect(onChange).not.toHaveBeenCalled();
	});

	it('follows a value that changes after Enter committed the text', async () => {
		const onChange = vi.fn();
		const picker = (value: string) => (
			<ColorPicker nativeButton side="bottom" align="start" value={value} onChange={onChange}>
				<button type="button">Color</button>
			</ColorPicker>
		);
		const { rerender } = render(picker(MID_RED));
		await openPicker();
		await userEvent.click(getHexField());
		await userEvent.clear(getHexField());
		await userEvent.type(getHexField(), '3a2a63{Enter}');
		expect(onChange).toHaveBeenCalledTimes(1);

		rerender(picker('#00ff00'));
		expect(getHexField()).toHaveValue('00ff00');

		getHexField().blur();

		expect(onChange).toHaveBeenCalledTimes(1);
	});

	async function editHex(initial = MID_RED) {
		const onChange = vi.fn();
		const onAfterChange = vi.fn();
		render(
			<ControlledPicker initial={initial} onChange={onChange} onAfterChange={onAfterChange} />,
		);
		await openPicker();
		await userEvent.click(getHexField());
		await userEvent.clear(getHexField());

		return { onChange, onAfterChange };
	}

	it('calls nothing while typing, and commits on Enter with the popup kept open', async () => {
		const { onChange, onAfterChange } = await editHex();

		await userEvent.type(getHexField(), '3a2a63');
		expect(onChange).not.toHaveBeenCalled();
		expect(getSaturation()).toHaveValue('50');

		await userEvent.keyboard('{Enter}');

		expect(onChange).toHaveBeenCalledTimes(1);
		expect(onChange).toHaveBeenCalledWith('#3a2a63');
		expect(onAfterChange).toHaveBeenCalledTimes(1);
		expect(onAfterChange).toHaveBeenCalledWith('#3a2a63');
		expect(screen.getByRole('dialog')).toBeInTheDocument();
		expect(getHexField()).toHaveFocus();
		expect(getHue()).toHaveValue('257');
	});

	it.each([
		['#3A2A63', '#3a2a63', '3a2a63'],
		['3A2A63', '#3a2a63', '3a2a63'],
		['#ABC', '#aabbcc', 'aabbcc'],
		['abc', '#aabbcc', 'aabbcc'],
	])('reads %s as %s', async (typed, color, digits) => {
		const { onAfterChange } = await editHex();

		await userEvent.type(getHexField(), `${typed}{Enter}`);

		expect(onAfterChange).toHaveBeenCalledWith(color);
		expect(getHexField()).toHaveValue(digits);
	});

	it('reads a pasted value with its #', async () => {
		const { onAfterChange } = await editHex();

		await userEvent.paste('#3A2A63');
		await userEvent.keyboard('{Enter}');

		expect(onAfterChange).toHaveBeenCalledWith('#3a2a63');
	});

	it('takes at most nine characters, a # and eight digits', async () => {
		await editHex();

		await userEvent.type(getHexField(), '#3a2a638012');

		expect(getHexField()).toHaveValue('#3a2a6380');
	});

	it('takes at most seven characters with opaque', async () => {
		render(<ControlledPicker initial={MID_RED} opaque />);
		await openPicker();
		await userEvent.click(getHexField());
		await userEvent.clear(getHexField());

		await userEvent.type(getHexField(), '#3a2a6380');

		expect(getHexField()).toHaveValue('#3a2a63');
	});

	it('commits on blur', async () => {
		const { onAfterChange } = await editHex();

		await userEvent.type(getHexField(), '00ff00');
		await userEvent.tab({ shift: true });

		expect(onAfterChange).toHaveBeenCalledTimes(1);
		expect(onAfterChange).toHaveBeenCalledWith('#00ff00');
		expect(getHexField()).toHaveValue('00ff00');
	});

	it('marks an invalid text, keeps it on Enter, and puts the color back on blur', async () => {
		const { onChange } = await editHex();

		await userEvent.type(getHexField(), 'zz{Enter}');

		expect(getHexField()).toHaveValue('zz');
		expect(getHexField()).toHaveAttribute('aria-invalid', 'true');
		expect(getHexField()).toHaveAttribute('data-invalid');

		await userEvent.tab({ shift: true });

		expect(getHexField()).toHaveValue('804040');
		expect(getHexField()).not.toHaveAttribute('aria-invalid');
		expect(getHexField()).not.toHaveAttribute('data-invalid');
		expect(onChange).not.toHaveBeenCalled();
	});

	it.each(['12345', '1234567', '#12', 'ggg'])('does not commit %s', async (typed) => {
		const { onChange } = await editHex();

		await userEvent.type(getHexField(), `${typed}{Enter}`);

		expect(getHexField()).toHaveAttribute('aria-invalid', 'true');
		expect(onChange).not.toHaveBeenCalled();
	});

	it('calls nothing for a commit of the color it already holds', async () => {
		const { onChange, onAfterChange } = await editHex();

		await userEvent.type(getHexField(), '804040{Enter}');
		await userEvent.type(getHexField(), '{Backspace}{Backspace}{Backspace}040');
		await userEvent.tab({ shift: true });

		expect(onChange).not.toHaveBeenCalled();
		expect(onAfterChange).not.toHaveBeenCalled();
	});

	it('drops the text on Escape, closes the popup and returns the focus to the trigger', async () => {
		const { onChange } = await editHex();

		await userEvent.type(getHexField(), '00ff00{Escape}');

		await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
		expect(getTrigger()).toHaveFocus();
		expect(onChange).not.toHaveBeenCalled();
	});

	it('does not submit the form it sits in on Enter', async () => {
		const onSubmit = vi.fn((event: { preventDefault: () => void }) => event.preventDefault());
		render(
			<form onSubmit={onSubmit}>
				<ColorPicker nativeButton side="bottom" align="start" defaultValue={MID_RED}>
					<button type="button">Color</button>
				</ColorPicker>
			</form>,
		);
		await openPicker();
		await userEvent.click(getHexField());

		await userEvent.keyboard('{Enter}');

		expect(onSubmit).not.toHaveBeenCalled();
	});

	it('follows the area and the hue strip while it does not have the focus', async () => {
		render(<ControlledPicker initial={MID_RED} />);
		await openPicker();

		await userEvent.keyboard('{End}');
		expect(getHexField()).toHaveValue('800000');

		await userEvent.tab();
		await userEvent.keyboard('{PageUp}');
		expect(getHexField()).not.toHaveValue('800000');
	});

	it('keeps the text being typed when value changes from outside', async () => {
		const ui = (value: string) => (
			<ColorPicker nativeButton side="bottom" align="start" value={value}>
				<button type="button">Color</button>
			</ColorPicker>
		);
		const { rerender } = render(ui(MID_RED));
		await openPicker();
		await userEvent.click(getHexField());
		await userEvent.clear(getHexField());
		await userEvent.type(getHexField(), '00f');

		rerender(ui('#ff0000'));

		expect(getHexField()).toHaveValue('00f');
	});
});
