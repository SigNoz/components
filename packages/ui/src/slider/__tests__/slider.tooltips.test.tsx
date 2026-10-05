import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { userEvent as browserUserEvent } from 'vitest/browser';
import { afterEach, describe, expect, it } from 'vitest';
import { Slider } from '../slider.js';
import {
	dragThumb,
	getCenter,
	getThumbInput,
	getTrackPoint,
	moveTo,
	press,
	release,
	renderSlider,
	resetPointer,
} from './slider.test-utils.js';

const DISABLED_REASON = 'Pick a source first';
const READ_ONLY_REASON = 'Set by the workspace admin';

function formatGb(value: number): string {
	return `${value} GB`;
}

async function hoverThumb(index = 0): Promise<void> {
	await moveTo(getCenter(screen.getAllByTestId(/-thumb-\d$/)[index]));
}

afterEach(async () => {
	await resetPointer();
});

describe('Slider value tooltip', () => {
	it('shows the formatted value on hover over the thumb, and hides it on leave', async () => {
		await renderSlider(
			<Slider
				color="primary"
				defaultValue={40}
				tooltip
				formatValue={formatGb}
				testId="volume"
				aria-label="V"
			/>,
		);

		await hoverThumb();
		expect(await screen.findByRole('tooltip')).toHaveTextContent('40 GB');

		await resetPointer();
		await waitFor(() => expect(screen.queryByRole('tooltip')).toBeNull());
	});

	it('shows the raw number without formatValue', async () => {
		await renderSlider(
			<Slider color="primary" defaultValue={40} tooltip testId="volume" aria-label="V" />,
		);

		await hoverThumb();

		expect(await screen.findByRole('tooltip')).toHaveTextContent('40');
	});

	it('renders no tooltip without tooltip', async () => {
		await renderSlider(<Slider color="primary" defaultValue={40} testId="volume" aria-label="V" />);

		await hoverThumb();

		await expect(screen.findByRole('tooltip', {}, { timeout: 400 })).rejects.toThrow();
	});

	it('opens on keyboard focus and closes on blur', async () => {
		const user = userEvent.setup();
		await renderSlider(
			<>
				<Slider
					color="primary"
					defaultValue={40}
					tooltip
					formatValue={formatGb}
					aria-label="V"
					testId="volume"
				/>
				<button type="button">After</button>
			</>,
		);

		await browserUserEvent.tab();
		expect(await screen.findByRole('tooltip')).toHaveTextContent('40 GB');

		await user.keyboard('{ArrowRight}');
		expect(screen.getByRole('tooltip')).toHaveTextContent('41 GB');

		await user.tab();
		await waitFor(() => expect(screen.queryByRole('tooltip')).toBeNull());
	});

	it('stays open while the thumb drags off it, and closes on release outside', async () => {
		await renderSlider(
			<Slider
				color="primary"
				defaultValue={20}
				tooltip
				formatValue={formatGb}
				testId="volume"
				aria-label="V"
			/>,
		);

		await dragThumb('volume', 0, [0.5, 0.9], { release: false });
		await moveTo({ ...getTrackPoint('volume', 0.9), y: getTrackPoint('volume', 0.9).y + 60 });

		expect(await screen.findByRole('tooltip')).toHaveTextContent('90 GB');

		await release();
		await waitFor(() => expect(screen.queryByRole('tooltip')).toBeNull());
	});

	it('sits above the thumb, and follows it while it drags', async () => {
		// Room above the slider, or the tooltip flips under it at the top of the page.
		await renderSlider(
			<div style={{ paddingTop: 80 }}>
				<Slider color="primary" defaultValue={20} tooltip testId="volume" aria-label="V" />
			</div>,
		);
		const centerX = (element: Element): number => getCenter(element).x;

		await dragThumb('volume', 0, [0.8], { release: false });
		const tooltip = await screen.findByRole('tooltip');
		const thumb = screen.getByTestId('volume-thumb-0');

		await waitFor(() => expect(centerX(tooltip)).toBeCloseTo(centerX(thumb), 0));
		expect(tooltip.getBoundingClientRect().bottom).toBeLessThanOrEqual(
			thumb.getBoundingClientRect().top,
		);
	});

	it('opens on a press on the track, on the thumb that moved', async () => {
		await renderSlider(
			<Slider.Range
				color="primary"
				defaultValue={[20, 60]}
				tooltip
				formatValue={formatGb}
				testId="duration"
				aria-label="D"
			/>,
		);

		const point = getTrackPoint('duration', 0.8);
		await press(point);
		await moveTo({ x: point.x, y: point.y + 60 });

		const tooltips = await screen.findAllByRole('tooltip');
		expect(tooltips).toHaveLength(1);
		expect(tooltips[0]).toHaveTextContent('80 GB');
	});

	it('names no input with the value, which aria-valuetext already reads', async () => {
		await renderSlider(
			<Slider color="primary" defaultValue={40} tooltip aria-label="V" testId="volume" />,
		);

		await hoverThumb();
		await screen.findByRole('tooltip');

		expect(getThumbInput()).not.toHaveAttribute('aria-describedby');
	});

	it('never opens while disabled', async () => {
		await renderSlider(
			<Slider
				color="primary"
				defaultValue={40}
				tooltip
				disabled
				disabledTooltip={undefined}
				testId="volume"
				aria-label="V"
			/>,
		);

		await hoverThumb();

		await expect(screen.findByRole('tooltip', {}, { timeout: 400 })).rejects.toThrow();
	});

	it('opens while readOnly when there is no readOnlyTooltip', async () => {
		await renderSlider(
			<Slider
				color="primary"
				defaultValue={40}
				tooltip
				readOnly
				readOnlyTooltip={undefined}
				formatValue={formatGb}
				testId="volume"
				aria-label="V"
			/>,
		);

		await hoverThumb();

		expect(await screen.findByRole('tooltip')).toHaveTextContent('40 GB');
	});

	// A modal from another library, such as antd's, has no panel to portal into. The tooltip goes to
	// the body and has to stack above the layer the thumb sits in.
	it('stacks the value tooltip above a layer from another library', async () => {
		await renderSlider(
			<div style={{ position: 'fixed', inset: 0, zIndex: 1000 }}>
				<Slider color="primary" defaultValue={40} tooltip testId="volume" aria-label="V" />
			</div>,
		);

		await hoverThumb();
		const tooltip = await screen.findByRole('tooltip');
		const { x, y } = getCenter(tooltip);

		expect(tooltip.contains(document.elementFromPoint(x, y))).toBe(true);
	});
});

describe('Slider disabledTooltip and readOnlyTooltip', () => {
	it('shows disabledTooltip on hover over the slider', async () => {
		await renderSlider(
			<Slider
				color="primary"
				defaultValue={40}
				tooltip
				disabled
				disabledTooltip={DISABLED_REASON}
				testId="volume"
				aria-label="V"
			/>,
		);

		await moveTo(getTrackPoint('volume', 0.9));

		const tooltips = await screen.findAllByRole('tooltip');
		expect(tooltips).toHaveLength(1);
		expect(tooltips[0]).toHaveTextContent(DISABLED_REASON);
	});

	it('shows readOnlyTooltip in place of the value tooltip, on hover and on keyboard focus', async () => {
		await renderSlider(
			<Slider
				color="primary"
				defaultValue={40}
				tooltip
				readOnly
				readOnlyTooltip={READ_ONLY_REASON}
				testId="volume"
				aria-label="V"
			/>,
		);

		await hoverThumb();
		let tooltips = await screen.findAllByRole('tooltip');
		expect(tooltips).toHaveLength(1);
		expect(tooltips[0]).toHaveTextContent(READ_ONLY_REASON);

		await resetPointer();
		await waitFor(() => expect(screen.queryByRole('tooltip')).toBeNull());

		await browserUserEvent.tab();
		tooltips = await screen.findAllByRole('tooltip');
		expect(tooltips).toHaveLength(1);
		expect(tooltips[0]).toHaveTextContent(READ_ONLY_REASON);
	});

	it('shows readOnlyTooltip when both disabled and readOnly are set', async () => {
		await renderSlider(
			<Slider
				color="primary"
				defaultValue={40}
				disabled
				disabledTooltip={DISABLED_REASON}
				readOnly
				readOnlyTooltip={READ_ONLY_REASON}
				testId="volume"
				aria-label="V"
			/>,
		);

		await hoverThumb();

		expect(await screen.findByRole('tooltip')).toHaveTextContent(READ_ONLY_REASON);
		expect(screen.queryByText(DISABLED_REASON)).toBeNull();
	});

	it('keeps the value tooltip alone while the reasons are passed but not in force', async () => {
		await renderSlider(
			<Slider
				color="primary"
				defaultValue={40}
				tooltip
				formatValue={formatGb}
				disabled={false}
				disabledTooltip={DISABLED_REASON}
				readOnly={false}
				readOnlyTooltip={READ_ONLY_REASON}
				testId="volume"
				aria-label="V"
			/>,
		);

		await hoverThumb();

		const tooltips = await screen.findAllByRole('tooltip');
		expect(tooltips).toHaveLength(1);
		expect(tooltips[0]).toHaveTextContent('40 GB');
	});

	it('keeps the focused thumb when readOnly turns on', async () => {
		const user = userEvent.setup();
		const { rerender } = await renderSlider(
			<Slider
				color="primary"
				defaultValue={40}
				readOnly={false}
				readOnlyTooltip={READ_ONLY_REASON}
				aria-label="V"
			/>,
		);

		await user.tab();
		const input = getThumbInput();

		rerender(
			<Slider
				color="primary"
				defaultValue={40}
				readOnly
				readOnlyTooltip={READ_ONLY_REASON}
				aria-label="V"
			/>,
		);

		expect(getThumbInput()).toBe(input);
		expect(input).toHaveFocus();
	});

	it('renders no tooltip for an empty reason', async () => {
		await renderSlider(
			<Slider
				color="primary"
				defaultValue={40}
				disabled
				disabledTooltip=""
				testId="volume"
				aria-label="V"
			/>,
		);

		await moveTo(getTrackPoint('volume', 0.5));

		await expect(screen.findByRole('tooltip', {}, { timeout: 600 })).rejects.toThrow();
	});
});

describe('Slider reason over a thumb', () => {
	it('shows disabledTooltip on hover over a thumb with tooltip set', async () => {
		await renderSlider(
			<Slider
				color="primary"
				defaultValue={40}
				tooltip
				disabled
				disabledTooltip={DISABLED_REASON}
				testId="volume"
				aria-label="V"
			/>,
		);

		await hoverThumb();

		const tooltips = await screen.findAllByRole('tooltip');
		expect(tooltips).toHaveLength(1);
		expect(tooltips[0]).toHaveTextContent(DISABLED_REASON);
	});
});

describe('Slider mark label tooltip', () => {
	const LONG_LABEL = 'Six months of hot storage, then archived';
	const MARKS = { 0: '0', 50: LONG_LABEL, 100: '100' };

	it('shows a truncated label in full on hover, below the label', async () => {
		// Room above, so a tooltip placed there would not flip below on its own.
		await renderSlider(
			<div style={{ paddingTop: 200 }}>
				<Slider color="primary" defaultValue={40} marks={MARKS} testId="ret" aria-label="R" />
			</div>,
		);
		const label = screen.getByTestId('ret-mark-50');
		await expect.poll(() => label.dataset.truncated).toBe('true');

		await moveTo(getCenter(label));

		const tooltip = await screen.findByRole('tooltip');
		expect(tooltip).toHaveTextContent(LONG_LABEL);
		// Below the label, so it covers neither the track nor the thumb.
		expect(tooltip.getBoundingClientRect().top).toBeGreaterThanOrEqual(
			label.getBoundingClientRect().bottom,
		);
	});

	it('opens nothing on a label that fits', async () => {
		await renderSlider(
			<Slider color="primary" defaultValue={40} marks={MARKS} testId="ret" aria-label="R" />,
		);

		await moveTo(getCenter(screen.getByTestId('ret-mark-0')));

		await expect(screen.findByRole('tooltip', {}, { timeout: 400 })).rejects.toThrow();
	});

	it('opens nothing with textOverflow wrap', async () => {
		await renderSlider(
			<Slider
				color="primary"
				defaultValue={40}
				marks={MARKS}
				textOverflow="wrap"
				testId="ret"
				aria-label="R"
			/>,
		);

		await moveTo(getCenter(screen.getByTestId('ret-mark-50')));

		await expect(screen.findByRole('tooltip', {}, { timeout: 400 })).rejects.toThrow();
	});

	it('stacks the reason above a truncated label, in one tooltip', async () => {
		await renderSlider(
			<Slider
				color="primary"
				defaultValue={40}
				marks={MARKS}
				readOnly
				readOnlyTooltip={READ_ONLY_REASON}
				testId="ret"
				aria-label="R"
			/>,
		);
		const label = screen.getByTestId('ret-mark-50');
		await expect.poll(() => label.dataset.truncated).toBe('true');

		await moveTo(getCenter(label));

		const tooltips = await screen.findAllByRole('tooltip');
		expect(tooltips).toHaveLength(1);
		expect(tooltips[0]).toHaveTextContent(READ_ONLY_REASON);
		expect(tooltips[0]).toHaveTextContent(LONG_LABEL);
	});

	it('shows the reason alone over a label that fits', async () => {
		await renderSlider(
			<Slider
				color="primary"
				defaultValue={40}
				marks={MARKS}
				disabled
				disabledTooltip={DISABLED_REASON}
				testId="ret"
				aria-label="R"
			/>,
		);

		await moveTo(getCenter(screen.getByTestId('ret-mark-0')));

		const tooltips = await screen.findAllByRole('tooltip');
		expect(tooltips).toHaveLength(1);
		expect(tooltips[0]).toHaveTextContent(DISABLED_REASON);
		expect(tooltips[0]).not.toHaveTextContent(LONG_LABEL);
	});
});
