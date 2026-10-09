import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { ProgressColor } from '../constants.js';
import { Progress } from '../progress.js';

describe('Progress rendering', () => {
	it('stamps the slots and the test ids of every part', () => {
		render(<Progress color="primary" percent={40} showInfo testId="cpu" />);

		expect(screen.getByTestId('cpu')).toHaveAttribute('data-slot', 'progress');
		expect(screen.getByTestId('cpu-track')).toHaveAttribute('data-slot', 'progress-track');
		expect(screen.getByTestId('cpu-indicator')).toHaveAttribute('data-slot', 'progress-indicator');
		expect(screen.getByTestId('cpu-value')).toHaveAttribute('data-slot', 'progress-value');
	});

	it('nests the indicator in the track', () => {
		render(<Progress color="primary" percent={40} testId="cpu" />);

		expect(screen.getByTestId('cpu-track')).toContainElement(screen.getByTestId('cpu-indicator'));
	});

	it('renders no value without showInfo', () => {
		render(<Progress color="primary" percent={40} testId="cpu" />);

		expect(screen.queryByTestId('cpu-value')).toBeNull();
		expect(screen.getByTestId('cpu')).not.toHaveTextContent('40%');
	});

	it.each(Object.values(ProgressColor))('mirrors color %s on the root', (color) => {
		render(<Progress percent={40} color={color} testId="cpu" />);

		expect(screen.getByTestId('cpu')).toHaveAttribute('data-color', color);
	});

	it('marks active only while it is set', () => {
		const { rerender } = render(<Progress color="primary" percent={40} testId="task" />);

		expect(screen.getByTestId('task')).not.toHaveAttribute('data-active');

		rerender(<Progress color="primary" percent={40} active testId="task" />);

		expect(screen.getByTestId('task')).toHaveAttribute('data-active');
	});

	it('marks the indicator complete at 100', () => {
		const { rerender } = render(<Progress color="primary" percent={99} testId="task" />);

		expect(screen.getByTestId('task-indicator')).not.toHaveAttribute('data-complete');

		rerender(<Progress color="primary" percent={100} testId="task" />);

		expect(screen.getByTestId('task-indicator')).toHaveAttribute('data-complete');
	});

	it('drops className and style that get past the types', () => {
		render(
			<Progress
				color="primary"
				percent={40}
				steps={4}
				testId="cpu"
				{...({ className: 'cell', style: { marginLeft: '4px' } } as object)}
			/>,
		);
		const root = screen.getByTestId('cpu');

		expect(root).not.toHaveClass('cell');
		expect(root.style.marginLeft).toBe('');
		expect(root.style.getPropertyValue('--progress-internal-steps')).toBe('4');
	});

	it('writes width and maxWidth as internal custom properties, numbers as px', () => {
		render(<Progress color="primary" percent={40} width={160} maxWidth="50%" testId="cpu" />);
		const root = screen.getByTestId('cpu');

		expect(root.style.getPropertyValue('--progress-internal-width')).toBe('160px');
		expect(root.style.getPropertyValue('--progress-internal-max-width')).toBe('50%');
	});

	it('writes no size custom property without width and maxWidth', () => {
		render(<Progress color="primary" percent={40} testId="cpu" />);
		const root = screen.getByTestId('cpu');

		expect(root.style.getPropertyValue('--progress-internal-width')).toBe('');
		expect(root.style.getPropertyValue('--progress-internal-max-width')).toBe('');
		expect(root.style.getPropertyValue('--progress-internal-value-min-inline-size')).toBe('');
	});

	it('writes infoWidth as an internal custom property, numbers as px', () => {
		render(<Progress color="primary" percent={40} showInfo infoWidth={48} testId="cpu" />);

		expect(
			screen.getByTestId('cpu').style.getPropertyValue('--progress-internal-value-min-inline-size'),
		).toBe('48px');
	});

	it('forwards data and aria attributes and the id to the root', () => {
		render(
			<Progress
				color="primary"
				percent={40}
				id="cpu-bar"
				data-row="host-1"
				aria-label="CPU usage"
			/>,
		);
		const root = screen.getByRole('progressbar', { name: 'CPU usage' });

		expect(root).toHaveAttribute('id', 'cpu-bar');
		expect(root).toHaveAttribute('data-row', 'host-1');
	});
});

describe('Progress fill', () => {
	it('fills the track to percent', () => {
		render(<Progress color="primary" percent={37.5} testId="cpu" />);

		expect(screen.getByTestId('cpu-indicator').style.width).toBe('37.5%');
	});

	it('clamps the fill to the track', () => {
		const { rerender } = render(<Progress color="primary" percent={140} testId="cpu" />);

		expect(screen.getByTestId('cpu-indicator').style.width).toBe('100%');

		rerender(<Progress color="primary" percent={-20} testId="cpu" />);

		expect(screen.getByTestId('cpu-indicator').style.width).toBe('0%');
	});

	it.each([Number.NaN, Number.POSITIVE_INFINITY])('leaves the track empty for %s', (percent) => {
		render(<Progress color="primary" percent={percent} testId="cpu" />);

		expect(screen.getByTestId('cpu-indicator').style.width).toBe('0%');
	});
});

describe('Progress value text', () => {
	it.each([
		[5, '5%'],
		[33.333, '33.33%'],
		[12.5, '12.5%'],
		[66.666, '66.67%'],
		[0, '0%'],
	])('shows %s as %s', (percent, text) => {
		render(<Progress color="primary" percent={percent} showInfo testId="cpu" />);

		expect(screen.getByTestId('cpu-value')).toHaveTextContent(text);
	});

	it('keeps the text of a call site that already rounds', () => {
		render(
			<Progress color="primary" percent={Number((41.2345).toFixed(1))} showInfo testId="cpu" />,
		);

		expect(screen.getByTestId('cpu-value')).toHaveTextContent('41.2%');
	});

	it('shows the real percent past the ends, while the fill clamps', () => {
		const { rerender } = render(<Progress color="primary" percent={140} showInfo testId="cpu" />);

		expect(screen.getByTestId('cpu-value')).toHaveTextContent('140%');

		rerender(<Progress color="primary" percent={-5} showInfo testId="cpu" />);

		expect(screen.getByTestId('cpu-value')).toHaveTextContent('-5%');
	});

	it.each([Number.NaN, Number.NEGATIVE_INFINITY])('shows a dash for %s', (percent) => {
		render(<Progress color="primary" percent={percent} showInfo testId="cpu" />);

		expect(screen.getByTestId('cpu-value')).toHaveTextContent(/^-$/);
	});

	it('draws tabular digits with a slashed zero', () => {
		render(<Progress color="primary" percent={40} showInfo testId="cpu" />);
		const { fontVariantNumeric } = getComputedStyle(screen.getByTestId('cpu-value'));

		expect(fontVariantNumeric).toContain('tabular-nums');
		expect(fontVariantNumeric).toContain('slashed-zero');
	});

	it('keeps the bar length while the number grows, given an infoWidth', () => {
		render(
			<>
				<Progress color="primary" percent={5} showInfo infoWidth={60} width={300} testId="low" />
				<Progress color="primary" percent={100} showInfo infoWidth={60} width={300} testId="full" />
			</>,
		);
		const low = screen.getByTestId('low-value').getBoundingClientRect();
		const full = screen.getByTestId('full-value').getBoundingClientRect();

		expect(low.width).toBe(60);
		expect(full.width).toBe(60);
		expect(screen.getByTestId('low-track').getBoundingClientRect().width).toBe(
			screen.getByTestId('full-track').getBoundingClientRect().width,
		);
		expect(getComputedStyle(screen.getByTestId('low-value')).textAlign).toBe('end');
	});

	it('lets a text longer than infoWidth show whole', () => {
		render(
			<Progress color="primary" percent={100} showInfo infoWidth={4} width={300} testId="cpu" />,
		);
		const value = screen.getByTestId('cpu-value');

		expect(value.getBoundingClientRect().width).toBeGreaterThan(4);
		expect(value.scrollWidth).toBe(value.clientWidth);
	});

	it('hides the text from the accessibility tree', () => {
		render(<Progress color="primary" percent={40} showInfo testId="cpu" />);

		expect(screen.getByTestId('cpu-value')).toHaveAttribute('aria-hidden', 'true');
	});
});

describe('Progress steps', () => {
	it('marks the number of segments on the root', () => {
		render(<Progress color="primary" percent={50} steps={5} testId="checklist" />);

		expect(screen.getByTestId('checklist')).toHaveAttribute('data-steps', '5');
	});

	it.each([0, 1])('renders the continuous bar for %s steps', (steps) => {
		render(<Progress color="primary" percent={50} steps={steps} testId="checklist" />);

		expect(screen.getByTestId('checklist')).not.toHaveAttribute('data-steps');
	});

	it('renders the continuous bar and warns for steps that are not an integer', () => {
		const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});

		render(<Progress color="primary" percent={50} steps={2.5} testId="checklist" />);

		expect(screen.getByTestId('checklist')).not.toHaveAttribute('data-steps');
		expect(warn).toHaveBeenCalledWith(
			'Progress: `steps` must be an integer, showing the continuous bar.',
		);

		warn.mockRestore();
	});

	it('does not warn for integer steps', () => {
		const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});

		render(<Progress color="primary" percent={50} steps={3} />);

		expect(warn).not.toHaveBeenCalled();

		warn.mockRestore();
	});

	it('keeps the fill continuous across the segments', () => {
		render(<Progress color="primary" percent={50} steps={5} testId="checklist" />);

		expect(screen.getByTestId('checklist-indicator').style.width).toBe('50%');
	});
});
