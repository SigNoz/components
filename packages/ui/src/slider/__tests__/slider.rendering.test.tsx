import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import type { CSSProperties } from 'react';
import { SliderColor } from '../constants.js';
import { Slider } from '../slider.js';
import { renderSlider } from './slider.test-utils.js';

const MARKS = { 0: '1 GB', 50: '100 GB', 100: '10,000 GB' };

const LONG_MARKS = {
	0: 'No retention at all',
	25: 'One week of hot storage',
	50: 'One month of hot storage',
	75: 'Six months in cold storage',
	100: 'Forever, archived to cold storage',
};

function getBox(element: Element): DOMRect {
	return element.getBoundingClientRect();
}

describe('Slider rendering', () => {
	it('stamps the slots and the test ids of every part', async () => {
		await renderSlider(
			<Slider color="primary" defaultValue={50} marks={MARKS} testId="volume" aria-label="V" />,
		);
		const root = screen.getByTestId('volume');

		expect(root).toHaveAttribute('data-slot', 'slider');
		expect(root.querySelector('[data-slot="slider-control"]')).not.toBeNull();
		expect(screen.getByTestId('volume-track')).toHaveAttribute('data-slot', 'slider-track');
		expect(screen.getByTestId('volume-indicator')).toHaveAttribute('data-slot', 'slider-indicator');
		expect(screen.getByTestId('volume-thumb-0')).toHaveAttribute('data-slot', 'slider-thumb');
		expect(screen.getByTestId('volume-thumb-0')).toHaveAttribute('data-index', '0');
		expect(root.querySelector('[data-slot="slider-marks"]')).not.toBeNull();
		expect(screen.getByTestId('volume-mark-50')).toHaveAttribute('data-slot', 'slider-mark');
		expect(root.querySelectorAll('[data-slot="slider-mark-dot"]')).toHaveLength(3);
	});

	it('nests the indicator in the track', async () => {
		await renderSlider(<Slider color="primary" defaultValue={50} testId="volume" aria-label="V" />);

		expect(screen.getByTestId('volume-track')).toContainElement(
			screen.getByTestId('volume-indicator'),
		);
	});

	it('renders two thumbs and data-range on Slider.Range', async () => {
		await renderSlider(
			<Slider.Range color="primary" defaultValue={[20, 80]} testId="duration" aria-label="D" />,
		);

		expect(screen.getByTestId('duration')).toHaveAttribute('data-range');
		expect(screen.getByTestId('duration-thumb-0')).toHaveAttribute('data-index', '0');
		expect(screen.getByTestId('duration-thumb-1')).toHaveAttribute('data-index', '1');
	});

	it('renders no marks row and no dots without marks', async () => {
		await renderSlider(<Slider color="primary" defaultValue={50} testId="volume" aria-label="V" />);
		const root = screen.getByTestId('volume');

		expect(root.querySelector('[data-slot="slider-marks"]')).toBeNull();
		expect(root.querySelector('[data-slot="slider-mark-dot"]')).toBeNull();
		expect(root).not.toHaveAttribute('data-range');
	});

	it('drops the marks outside min and max', async () => {
		await renderSlider(
			<Slider
				color="primary"
				defaultValue={50}
				min={10}
				max={90}
				marks={{ 0: 'below', 10: 'min', 90: 'max', 95: 'above' }}
				testId="volume"
				aria-label="V"
			/>,
		);

		expect(screen.queryByTestId('volume-mark-0')).toBeNull();
		expect(screen.queryByTestId('volume-mark-95')).toBeNull();
		expect(screen.getByTestId('volume-mark-10')).toHaveTextContent('min');
		expect(screen.getByTestId('volume-mark-90')).toHaveTextContent('max');
	});

	it.each(Object.values(SliderColor))('mirrors color %s on the root', async (color) => {
		await renderSlider(<Slider color={color} defaultValue={50} testId="volume" aria-label="V" />);

		expect(screen.getByTestId('volume')).toHaveAttribute('data-color', color);
	});

	it('paints the fill, the thumb border and the active dots with its color, the rest with tints', async () => {
		await renderSlider(
			<div style={{ '--slider-danger-indicator': 'rgb(200, 0, 0)' } as CSSProperties}>
				<Slider
					color="danger"
					defaultValue={50}
					marks={{ 0: '0', 100: '100' }}
					testId="volume"
					aria-label="V"
				/>
			</div>,
		);
		const [activeDot, otherDot] = screen
			.getByTestId('volume')
			.querySelectorAll('[data-slot="slider-mark-dot"]');
		const track = getComputedStyle(screen.getByTestId('volume-track')).backgroundColor;
		const dot = getComputedStyle(otherDot as Element).borderColor;

		expect(getComputedStyle(screen.getByTestId('volume-indicator')).backgroundColor).toBe(
			'rgb(200, 0, 0)',
		);
		expect(getComputedStyle(screen.getByTestId('volume-thumb-0')).borderColor).toBe(
			'rgb(200, 0, 0)',
		);
		expect(getComputedStyle(activeDot).borderColor).toBe('rgb(200, 0, 0)');
		expect(track).toBe('color(srgb 0.784314 0 0 / 0.1)');
		expect(dot).toBe('color(srgb 0.784314 0 0 / 0.3)');
	});

	it('forwards id and data-* to the root', async () => {
		await renderSlider(
			<Slider
				color="primary"
				defaultValue={50}
				id="volume-slider"
				data-row="host"
				testId="volume"
				aria-label="V"
			/>,
		);

		expect(screen.getByTestId('volume')).toHaveAttribute('id', 'volume-slider');
		expect(screen.getByTestId('volume')).toHaveAttribute('data-row', 'host');
	});

	it('drops className, style and props that get past the types', async () => {
		await renderSlider(
			<Slider
				color="primary"
				defaultValue={50}
				testId="volume"
				aria-label="V"
				{...({
					className: 'stray',
					style: { color: 'rgb(255, 0, 0)' },
					orientation: 'vertical',
					styles: { track: { color: 'rgb(255, 0, 0)' } },
				} as object)}
			/>,
		);
		const root = screen.getByTestId('volume');

		expect(root).not.toHaveClass('stray');
		expect(root.style.color).toBe('');
		expect(root).toHaveAttribute('data-orientation', 'horizontal');
		expect(screen.getByTestId('volume-track').style.color).toBe('');
	});
});

describe('Slider layout', () => {
	it('fills its parent, with the track from edge to edge', async () => {
		await renderSlider(<Slider color="primary" defaultValue={50} testId="volume" aria-label="V" />);

		expect(getBox(screen.getByTestId('volume')).width).toBe(300);
		expect(getBox(screen.getByTestId('volume-track')).width).toBe(300);
	});

	it('takes width and maxWidth, numbers as px', async () => {
		await renderSlider(
			<Slider
				color="primary"
				defaultValue={50}
				width={500}
				maxWidth={200}
				testId="volume"
				aria-label="V"
			/>,
		);

		expect(getBox(screen.getByTestId('volume')).width).toBe(200);
	});

	it('keeps the thumbs, the dots and the labels inside the root', async () => {
		await renderSlider(
			<Slider.Range
				color="primary"
				defaultValue={[0, 100]}
				marks={MARKS}
				testId="duration"
				aria-label="D"
			/>,
		);
		const root = getBox(screen.getByTestId('duration'));
		const parts = screen
			.getByTestId('duration')
			.querySelectorAll('[data-slot="slider-thumb"], [data-slot^="slider-mark"]');

		for (const part of parts) {
			const box = getBox(part);
			expect(box.left).toBeGreaterThanOrEqual(root.left);
			expect(box.right).toBeLessThanOrEqual(root.right);
			expect(box.bottom).toBeLessThanOrEqual(root.bottom);
		}
	});

	it('puts the label row under the track, and the root grows to hold it', async () => {
		await renderSlider(<Slider color="primary" defaultValue={50} testId="bare" aria-label="V" />);
		const bare = getBox(screen.getByTestId('bare')).height;

		await renderSlider(
			<Slider color="primary" defaultValue={50} marks={MARKS} testId="marked" aria-label="V" />,
		);
		const marks = screen.getByTestId('marked').querySelector('[data-slot="slider-marks"]');

		expect(getBox(screen.getByTestId('marked')).height).toBeGreaterThan(bare);
		expect(getBox(marks as Element).top).toBeGreaterThanOrEqual(
			getBox(screen.getByTestId('marked-track')).bottom,
		);
	});

	it('aligns the end labels with the track ends, and centres the others on their value', async () => {
		await renderSlider(
			<Slider color="primary" defaultValue={50} marks={MARKS} testId="volume" aria-label="V" />,
		);
		const track = getBox(screen.getByTestId('volume-track'));
		const middle = getBox(screen.getByTestId('volume-mark-50'));

		expect(getBox(screen.getByTestId('volume-mark-0')).left).toBeCloseTo(track.left, 0);
		expect(getBox(screen.getByTestId('volume-mark-100')).right).toBeCloseTo(track.right, 0);
		expect(middle.left + middle.width / 2).toBeCloseTo(track.left + track.width / 2, 0);
	});

	it('draws each dot under the centre of a thumb holding its value', async () => {
		await renderSlider(
			<Slider.Range
				color="primary"
				defaultValue={[0, 100]}
				marks={MARKS}
				testId="duration"
				aria-label="D"
			/>,
		);
		const dots = screen.getByTestId('duration').querySelectorAll('[data-slot="slider-mark-dot"]');
		const centerX = (element: Element): number => getBox(element).left + getBox(element).width / 2;

		expect(centerX(dots[0])).toBeCloseTo(centerX(screen.getByTestId('duration-thumb-0')), 0);
		expect(centerX(dots[2])).toBeCloseTo(centerX(screen.getByTestId('duration-thumb-1')), 0);
	});

	it('runs the fill from the start of the track to the thumb', async () => {
		await renderSlider(<Slider color="primary" defaultValue={50} testId="volume" aria-label="V" />);
		const indicator = getBox(screen.getByTestId('volume-indicator'));

		expect(indicator.left).toBe(getBox(screen.getByTestId('volume-track')).left);
		expect(indicator.width).toBeCloseTo(150, 0);
	});

	it('runs the fill between the two thumbs of a range', async () => {
		await renderSlider(
			<Slider.Range color="primary" defaultValue={[25, 75]} testId="duration" aria-label="D" />,
		);
		const indicator = getBox(screen.getByTestId('duration-indicator'));
		const centerX = (testId: string): number => {
			const box = getBox(screen.getByTestId(testId));
			return box.left + box.width / 2;
		};

		expect(indicator.left).toBeCloseTo(centerX('duration-thumb-0'), 0);
		expect(indicator.right).toBeCloseTo(centerX('duration-thumb-1'), 0);
	});
});

describe('Slider mark labels', () => {
	function getLabels(testId: string): HTMLElement[] {
		return [
			...screen.getByTestId(testId).querySelectorAll<HTMLElement>('[data-slot="slider-mark"]'),
		];
	}

	it('gives each label the room up to halfway to the next mark, so no two overlap', async () => {
		await renderSlider(
			<Slider color="primary" defaultValue={40} marks={LONG_MARKS} testId="ret" aria-label="R" />,
		);
		const root = getBox(screen.getByTestId('ret'));
		const labels = getLabels('ret').map(getBox);

		for (const [index, label] of labels.entries()) {
			expect(label.left).toBeGreaterThanOrEqual(root.left);
			expect(label.right).toBeLessThanOrEqual(root.right);
			expect(label.right).toBeLessThan(labels[index + 1]?.left ?? Number.POSITIVE_INFINITY);
		}
	});

	it('keeps a truncated label centred on its value', async () => {
		await renderSlider(
			<Slider color="primary" defaultValue={40} marks={LONG_MARKS} testId="ret" aria-label="R" />,
		);
		const track = getBox(screen.getByTestId('ret-track'));
		const middle = getBox(screen.getByTestId('ret-mark-50'));

		expect(middle.left + middle.width / 2).toBeCloseTo(track.left + track.width / 2, 0);
	});

	it('marks a truncated label with data-truncated, and only that one', async () => {
		await renderSlider(
			<Slider
				color="primary"
				defaultValue={40}
				marks={{ 0: '0', 50: LONG_MARKS[50] }}
				testId="ret"
				aria-label="R"
			/>,
		);

		expect(screen.getByTestId('ret')).toHaveAttribute('data-text-overflow', 'ellipsis');
		expect(screen.getByTestId('ret-mark-0')).not.toHaveAttribute('data-truncated');

		await renderSlider(
			<Slider color="primary" defaultValue={40} marks={LONG_MARKS} testId="long" aria-label="L" />,
		);

		await expect.poll(() => screen.getByTestId('long-mark-50').dataset.truncated).toBe('true');
	});

	it('keeps a label inside the slider when its value sits near an end', async () => {
		await renderSlider(
			<Slider
				color="primary"
				defaultValue={40}
				marks={{ 5: LONG_MARKS[50], 95: LONG_MARKS[75] }}
				testId="near"
				aria-label="N"
			/>,
		);
		const root = getBox(screen.getByTestId('near'));

		expect(getBox(screen.getByTestId('near-mark-5')).left).toBeGreaterThanOrEqual(root.left);
		expect(getBox(screen.getByTestId('near-mark-95')).right).toBeLessThanOrEqual(root.right);
	});

	it('breaks a long label into lines inside its room with textOverflow wrap', async () => {
		await renderSlider(
			<Slider
				color="primary"
				defaultValue={40}
				marks={LONG_MARKS}
				textOverflow="wrap"
				testId="ret"
				aria-label="R"
			/>,
		);
		const labels = getLabels('ret').map(getBox);

		expect(screen.getByTestId('ret-mark-50')).not.toHaveAttribute('data-truncated');
		expect(getBox(screen.getByTestId('ret-mark-50')).height).toBeGreaterThan(16);

		for (const [index, label] of labels.entries()) {
			expect(label.right).toBeLessThan(labels[index + 1]?.left ?? Number.POSITIVE_INFINITY);
		}
	});

	it('is never narrower than two thumbs, even in a parent of no width', async () => {
		render(
			<div style={{ width: 0 }}>
				<Slider.Range
					color="primary"
					defaultValue={[20, 70]}
					marks={MARKS}
					testId="tiny"
					aria-label="T"
				/>
			</div>,
		);
		await screen.findAllByRole('slider');
		const thumb = getBox(screen.getByTestId('tiny-thumb-0'));
		const root = getBox(screen.getByTestId('tiny'));

		expect(root.width).toBeCloseTo(thumb.width * 2, 0);
		expect(getBox(screen.getByTestId('tiny-thumb-1')).right).toBeLessThanOrEqual(root.right);
	});
});
