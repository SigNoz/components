import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Drawer } from '../../drawer/index.js';
import { ForceOpenProvider } from '../../testing/index.js';
import { ColorPicker } from '../index.js';
import { getTrigger, openPicker } from './color-picker.test-utils.js';

const PARTS = ['area', 'area-thumb', 'hue', 'hue-thumb', 'preview', 'hex', 'clear', 'footer'];

function noop(): void {}

describe('ColorPicker rendering', () => {
	it('renders the trigger as the element it was given, closed', () => {
		render(
			<ColorPicker nativeButton side="bottom" align="start" testId="picker" value="#3a2a63">
				<button type="button">Series color</button>
			</ColorPicker>,
		);

		const trigger = screen.getByRole('button', { name: 'Series color' });
		expect(trigger).toBe(screen.getByTestId('picker'));
		expect(trigger).toHaveAttribute('data-slot', 'color-picker-trigger');
		expect(trigger).toHaveAttribute('aria-haspopup', 'dialog');
		expect(trigger).toHaveAttribute('aria-expanded', 'false');
		expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
	});

	it('opens under ForceOpenProvider with every part named from the testId', () => {
		render(
			<ForceOpenProvider>
				<ColorPicker
					nativeButton
					side="bottom"
					align="start"
					testId="picker"
					value="#3a2a63"
					allowClear
					footer={(color) => `Contrast for ${color}`}
				>
					<button type="button">Series color</button>
				</ColorPicker>
			</ForceOpenProvider>,
		);

		const popup = screen.getByRole('dialog');
		expect(popup).toBe(screen.getByTestId('picker-popup'));
		expect(popup).toHaveAttribute('data-slot', 'color-picker-popup');
		expect(popup).toHaveAttribute('aria-labelledby', screen.getByTestId('picker').id);

		for (const part of PARTS) {
			expect(screen.getByTestId(`picker-${part}`)).toHaveAttribute(
				'data-slot',
				`color-picker-${part}`,
			);
		}

		expect(screen.getByRole('slider', { name: 'Saturation' })).toBeInTheDocument();
		expect(screen.getByRole('slider', { name: 'Brightness' })).toBeInTheDocument();
		expect(screen.getByRole('slider', { name: 'Hue' })).toHaveAttribute(
			'aria-valuetext',
			'257 degrees, #3a2a63',
		);
		expect(screen.getByRole('textbox', { name: 'Hex color' })).toHaveValue('3a2a63');
		expect(screen.getByRole('button', { name: 'Clear color' })).toBeInTheDocument();
		expect(screen.getByTestId('picker-footer')).toHaveTextContent('Contrast for #3a2a63');
	});

	it('writes no data-testid on any part without a testId, and keeps the slots', () => {
		render(
			<ForceOpenProvider>
				<ColorPicker
					nativeButton
					side="bottom"
					align="start"
					value="#3a2a63"
					allowClear
					footer={() => 'Note'}
				>
					<button type="button">Color</button>
				</ColorPicker>
			</ForceOpenProvider>,
		);

		// The icon mock stamps its own data-testid, so only the picker's parts are counted.
		expect(document.querySelectorAll('[data-slot^="color-picker"][data-testid]')).toHaveLength(0);

		for (const part of ['trigger', 'popup', ...PARTS]) {
			expect(document.querySelector(`[data-slot="color-picker-${part}"]`)).not.toBeNull();
		}
	});

	it('puts the testId over a data-testid the trigger element has', () => {
		render(
			<ColorPicker nativeButton side="bottom" align="start" testId="picker">
				<button type="button" data-testid="own">
					Color
				</button>
			</ColorPicker>,
		);

		expect(getTrigger()).toHaveAttribute('data-testid', 'picker');
	});

	it('keeps a data-testid the trigger element has when there is no testId', () => {
		render(
			<ColorPicker nativeButton side="bottom" align="start">
				<button type="button" data-testid="own">
					Color
				</button>
			</ColorPicker>,
		);

		expect(getTrigger()).toHaveAttribute('data-testid', 'own');
	});

	it('forwards aria-* and data-* to the trigger and not to the popup', async () => {
		render(
			<ColorPicker
				nativeButton
				side="bottom"
				align="start"
				value="#3a2a63"
				aria-label="Series color for cpu.user, #3a2a63"
				data-series="cpu.user"
			>
				{/* eslint-disable-next-line jsx-a11y/control-has-associated-label -- the picker forwards its aria-label to the trigger */}
				<button type="button" />
			</ColorPicker>,
		);

		const trigger = getTrigger('Series color for cpu.user, #3a2a63');
		expect(trigger).toHaveAttribute('data-series', 'cpu.user');

		const popup = await openPicker('Series color for cpu.user, #3a2a63');
		expect(popup).not.toHaveAttribute('data-series');
		expect(popup).not.toHaveAttribute('aria-label');
	});

	it('keeps its own data-slot over the one the caller or the element passes', () => {
		render(
			<>
				<ColorPicker nativeButton side="bottom" align="start" data-slot="mine">
					<button type="button">From the picker</button>
				</ColorPicker>
				<ColorPicker nativeButton side="bottom" align="start">
					<button type="button" data-slot="mine">
						From the element
					</button>
				</ColorPicker>
			</>,
		);

		expect(getTrigger('From the picker')).toHaveAttribute('data-slot', 'color-picker-trigger');
		expect(getTrigger('From the element')).toHaveAttribute('data-slot', 'color-picker-trigger');
	});

	it('keeps its own state attributes over the ones the caller passes', () => {
		render(
			<>
				<ColorPicker nativeButton side="bottom" align="start" data-popup-open data-disabled>
					<button type="button">From the picker</button>
				</ColorPicker>
				<ColorPicker nativeButton side="bottom" align="start">
					<button type="button" data-popup-open data-readonly>
						From the element
					</button>
				</ColorPicker>
			</>,
		);

		for (const trigger of [getTrigger('From the picker'), getTrigger('From the element')]) {
			expect(trigger).not.toHaveAttribute('data-popup-open');
			expect(trigger).not.toHaveAttribute('data-disabled');
			expect(trigger).not.toHaveAttribute('data-readonly');
		}
	});

	it('keeps the props of the trigger element', () => {
		render(
			<ColorPicker nativeButton side="bottom" align="start">
				<button type="button" title="Pick a color" aria-label="Color">
					<span>swatch</span>
				</button>
			</ColorPicker>,
		);

		expect(getTrigger()).toHaveAttribute('title', 'Pick a color');
		expect(getTrigger()).toHaveTextContent('swatch');
	});

	it('adds no element around the trigger, with or without a reason', () => {
		const { container } = render(
			<div data-testid="row">
				<ColorPicker nativeButton side="bottom" align="start">
					<button type="button">Plain</button>
				</ColorPicker>
				<ColorPicker
					nativeButton
					side="bottom"
					align="start"
					disabled
					disabledTooltip="Ask an admin"
				>
					<button type="button">With a reason</button>
				</ColorPicker>
			</div>,
		);

		const row = screen.getByTestId('row');
		expect(getTrigger('Plain').parentElement).toBe(row);
		expect(getTrigger('With a reason').parentElement).toBe(row);
		expect(container.querySelectorAll('[data-testid="row"] > *')).toHaveLength(2);
	});

	it('renders a trigger that is not a native button as a button', () => {
		render(
			<ColorPicker nativeButton={false} side="bottom" align="start" value="#3a2a63">
				<div>Legend row</div>
			</ColorPicker>,
		);

		expect(screen.getByRole('button', { name: 'Legend row' })).toHaveAttribute('tabindex', '0');
	});

	it('renders the popup only while it is open', async () => {
		render(
			<ColorPicker nativeButton side="bottom" align="start" testId="picker" value="#3a2a63">
				<button type="button">Color</button>
			</ColorPicker>,
		);

		expect(screen.queryByTestId('picker-popup')).not.toBeInTheDocument();
		expect(document.querySelector('[data-slot="color-picker-positioner"]')).toBeNull();

		await openPicker();

		expect(screen.getByTestId('picker-popup')).toBeInTheDocument();
	});

	it('places the popup on the side and align it is given', () => {
		render(
			<ForceOpenProvider>
				<div style={{ paddingTop: 400 }}>
					<ColorPicker nativeButton side="top" align="end" value="#3a2a63">
						<button type="button">Color</button>
					</ColorPicker>
				</div>
			</ForceOpenProvider>,
		);

		const positioner = document.querySelector('[data-slot="color-picker-positioner"]');
		expect(positioner).toHaveAttribute('data-side', 'top');
		expect(positioner).toHaveAttribute('data-align', 'end');
	});

	it('marks the preview empty only while there is no color', () => {
		const ui = (value: string | undefined) => (
			<ForceOpenProvider>
				<ColorPicker nativeButton side="bottom" align="start" testId="picker" value={value}>
					<button type="button">Color</button>
				</ColorPicker>
			</ForceOpenProvider>
		);
		const { rerender } = render(ui(undefined));

		expect(screen.getByTestId('picker-preview')).toHaveAttribute('data-empty');

		rerender(ui('#3a2a63'));

		expect(screen.getByTestId('picker-preview')).not.toHaveAttribute('data-empty');
	});

	it('renders no footer and no clear button unless asked', () => {
		render(
			<ForceOpenProvider>
				<ColorPicker nativeButton side="bottom" align="start" testId="picker" value="#3a2a63">
					<button type="button">Color</button>
				</ColorPicker>
			</ForceOpenProvider>,
		);

		expect(screen.queryByTestId('picker-footer')).not.toBeInTheDocument();
		expect(screen.queryByTestId('picker-clear')).not.toBeInTheDocument();
	});

	it('keeps the popup width with a long footer, which wraps', () => {
		const ui = (footer?: (color: string) => string) => (
			<ForceOpenProvider>
				<ColorPicker
					nativeButton
					side="bottom"
					align="start"
					testId="picker"
					value="#3a2a63"
					footer={footer}
				>
					<button type="button">Color</button>
				</ColorPicker>
			</ForceOpenProvider>
		);
		const { rerender } = render(ui());
		const { width, height } = screen.getByTestId('picker-popup').getBoundingClientRect();

		rerender(ui(() => 'Contrast against the text color is 2.1:1, below the 4.5:1 WCAG asks for'));
		const popup = screen.getByTestId('picker-popup').getBoundingClientRect();
		const footer = screen.getByTestId('picker-footer');

		expect(popup.width).toBe(width);
		expect(popup.height).toBeGreaterThan(height);
		expect(footer.scrollWidth).toBeLessThanOrEqual(footer.clientWidth);
	});

	it('portals the popup into the container it is given', () => {
		const container = document.createElement('div');
		document.body.append(container);

		render(
			<ForceOpenProvider>
				<ColorPicker nativeButton side="bottom" align="start" value="#3a2a63" container={container}>
					<button type="button">Color</button>
				</ColorPicker>
			</ForceOpenProvider>,
		);

		expect(container.contains(screen.getByRole('dialog'))).toBe(true);
		container.remove();
	});

	it('portals into the panel of a drawer by default', () => {
		render(
			<ForceOpenProvider>
				<Drawer type="task" stack="overlay" open onClose={noop} title="Settings">
					<div>
						<ColorPicker nativeButton side="bottom" align="start" value="#3a2a63">
							<button type="button">Color</button>
						</ColorPicker>
					</div>
				</Drawer>
			</ForceOpenProvider>,
		);

		const panel = document.querySelector('[data-slot="drawer-popup"]');
		expect(panel?.contains(screen.getByRole('dialog', { name: 'Color' }))).toBe(true);
	});

	it('keeps the thumbs on the physical side of the gradients on a right-to-left page', () => {
		document.documentElement.dir = 'rtl';

		try {
			render(
				<ForceOpenProvider>
					<ColorPicker nativeButton side="bottom" align="start" testId="picker" value="#ff0000">
						<button type="button">Color</button>
					</ColorPicker>
				</ForceOpenProvider>,
			);
			const center = (testId: string) => {
				const rect = screen.getByTestId(testId).getBoundingClientRect();

				return rect.left + rect.width / 2;
			};
			const area = screen.getByTestId('picker-area').getBoundingClientRect();
			const hue = screen.getByTestId('picker-hue').getBoundingClientRect();

			expect(Math.abs(center('picker-area-thumb') - area.right)).toBeLessThan(2);
			expect(Math.abs(center('picker-hue-thumb') - hue.left)).toBeLessThan(2);
		} finally {
			document.documentElement.dir = '';
		}
	});
});
