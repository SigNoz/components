import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { ForceOpenProvider } from '../../testing/index.js';
import { ColorPicker } from '../index.js';
import {
	ControlledPicker,
	getBrightness,
	getHexField,
	getHue,
	getSaturation,
	getTrigger,
	openPicker,
} from './color-picker.test-utils.js';

function renderOpen(value: string | undefined = '#3a2a63') {
	return render(
		<ForceOpenProvider>
			<ColorPicker
				nativeButton
				side="bottom"
				align="start"
				testId="picker"
				value={value}
				allowClear
			>
				<button type="button" aria-label={`Series color for cpu.user, ${value}`} />
			</ColorPicker>
		</ForceOpenProvider>,
	);
}

describe('ColorPicker trigger', () => {
	it('says it opens a dialog, whether it is open, and which popup it controls', async () => {
		render(<ControlledPicker initial="#3a2a63" />);
		const trigger = getTrigger();

		expect(trigger).toHaveAttribute('aria-haspopup', 'dialog');
		expect(trigger).toHaveAttribute('aria-expanded', 'false');
		expect(trigger).not.toHaveAttribute('aria-controls');

		const popup = await openPicker();

		expect(trigger).toHaveAttribute('aria-expanded', 'true');
		expect(trigger).toHaveAttribute('aria-controls', popup.id);

		await userEvent.keyboard('{Escape}');

		await waitFor(() => expect(trigger).toHaveAttribute('aria-expanded', 'false'));
		expect(trigger).not.toHaveAttribute('aria-controls');
	});

	it('keeps the name the consumer gives it', () => {
		renderOpen();

		expect(
			screen.getByRole('button', { name: 'Series color for cpu.user, #3a2a63' }),
		).toHaveAttribute('data-slot', 'color-picker-trigger');
	});

	it('forwards the aria the picker does not own', () => {
		render(
			<>
				<span id="hint">Applies to every panel</span>
				<ColorPicker
					nativeButton
					side="bottom"
					align="start"
					value="#3a2a63"
					aria-label="Background color"
					aria-describedby="hint"
				>
					{/* eslint-disable-next-line jsx-a11y/control-has-associated-label -- the picker forwards its aria-label to the trigger */}
					<button type="button" />
				</ColorPicker>
			</>,
		);

		expect(screen.getByRole('button', { name: 'Background color' })).toHaveAccessibleDescription(
			'Applies to every panel',
		);
	});
});

describe('ColorPicker popup', () => {
	it('is a non-modal dialog named by the trigger', () => {
		renderOpen();

		const dialog = screen.getByRole('dialog', { name: 'Series color for cpu.user, #3a2a63' });

		expect(dialog).toHaveAttribute(
			'aria-labelledby',
			getTrigger('Series color for cpu.user, #3a2a63').id,
		);
		expect(dialog).not.toHaveAttribute('aria-modal', 'true');
	});

	it('takes the id the consumer passes', async () => {
		render(
			<ColorPicker nativeButton side="bottom" align="start" value="#3a2a63" id="series-color">
				<button type="button">Color</button>
			</ColorPicker>,
		);

		const popup = await openPicker();

		expect(popup).toHaveAttribute('id', 'series-color');
		expect(getTrigger()).toHaveAttribute('aria-controls', 'series-color');
		expect(getTrigger()).not.toHaveAttribute('id', 'series-color');
	});

	it('keeps its own popup state over the one the trigger element has', async () => {
		render(
			<ColorPicker nativeButton side="bottom" align="start" value="#3a2a63">
				<button type="button" aria-haspopup="menu" aria-expanded={false} aria-controls="elsewhere">
					Color
				</button>
			</ColorPicker>,
		);
		const trigger = getTrigger();

		expect(trigger).toHaveAttribute('aria-haspopup', 'dialog');
		expect(trigger).not.toHaveAttribute('aria-controls');

		const popup = await openPicker();

		expect(trigger).toHaveAttribute('aria-expanded', 'true');
		expect(trigger).toHaveAttribute('aria-controls', popup.id);
	});

	it('is named by the id the trigger element already has', () => {
		render(
			<ForceOpenProvider>
				<ColorPicker nativeButton side="bottom" align="start" value="#3a2a63">
					<button type="button" id="legend-row-1">
						cpu.user
					</button>
				</ColorPicker>
			</ForceOpenProvider>,
		);

		expect(screen.getByRole('dialog')).toHaveAttribute('aria-labelledby', 'legend-row-1');
		expect(screen.getByRole('dialog', { name: 'cpu.user' })).toBeInTheDocument();
	});

	it('leaves the page behind it readable and scrollable', async () => {
		render(<ControlledPicker initial="#3a2a63" />);
		await openPicker();

		expect(screen.getByRole('button', { name: 'Outside' })).not.toHaveAttribute('aria-hidden');
		expect(screen.getByRole('button', { name: 'Outside' }).closest('[inert]')).toBeNull();
		expect(getComputedStyle(document.documentElement).overflow).not.toBe('hidden');
		expect(getComputedStyle(document.body).overflow).not.toBe('hidden');
	});
});

describe('ColorPicker area and hue strip', () => {
	it('names each axis of the area as a 2D slider, with its percent and the hex', () => {
		renderOpen();

		for (const [input, name, percent] of [
			[getSaturation(), 'Saturation', '58'],
			[getBrightness(), 'Brightness', '39'],
		] as const) {
			expect(input).toHaveAccessibleName(name);
			expect(input).toHaveAttribute('type', 'range');
			expect(input).toHaveAttribute('aria-roledescription', '2D slider');
			expect(input).toHaveAttribute('min', '0');
			expect(input).toHaveAttribute('max', '100');
			expect(input).toHaveValue(percent);
			expect(input).toHaveAttribute('aria-valuetext', `${percent}%, #3a2a63`);
		}
	});

	it('names the hue strip, from 0 to 359, with its degrees and the hex', () => {
		renderOpen();

		expect(getHue()).toHaveAttribute('type', 'range');
		expect(getHue()).toHaveAttribute('min', '0');
		expect(getHue()).toHaveAttribute('max', '359');
		expect(getHue()).toHaveAttribute('aria-valuetext', '257 degrees, #3a2a63');
	});

	it('updates the value texts as the color moves', async () => {
		render(<ControlledPicker initial="#3a2a63" />);
		await openPicker();

		await userEvent.keyboard('{End}');

		expect(getSaturation()).toHaveAttribute('aria-valuetext', expect.stringMatching(/^100%, #/));
		expect(getHue()).toHaveAttribute('aria-valuetext', `257 degrees, #${getHexField().value}`);
	});

	it('keeps the area to one tab stop', () => {
		renderOpen();

		const tabStops = [getSaturation(), getBrightness()].filter((input) => input.tabIndex >= 0);

		expect(tabStops).toHaveLength(1);
	});
});

describe('ColorPicker hex field, clear button and preview', () => {
	it('names the hex field and leaves aria-invalid off a valid color', () => {
		renderOpen();

		expect(getHexField()).toHaveValue('3a2a63');
		expect(getHexField()).not.toHaveAttribute('aria-invalid');
	});

	it('names the clear button', () => {
		renderOpen();

		expect(screen.getByRole('button', { name: 'Clear color' })).toHaveAttribute(
			'data-slot',
			'color-picker-clear',
		);
	});

	it('hides the preview and the thumbs from screen readers', () => {
		renderOpen();

		expect(screen.getByTestId('picker-preview')).toHaveAttribute('aria-hidden', 'true');
		expect(screen.getByTestId('picker-area-thumb')).toHaveAttribute('aria-hidden', 'true');
		expect(screen.getByTestId('picker-hue-thumb')).toHaveAttribute('aria-hidden', 'true');
	});
});
