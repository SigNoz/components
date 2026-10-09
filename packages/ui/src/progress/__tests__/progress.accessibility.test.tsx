import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Progress } from '../progress.js';

describe('Progress accessibility', () => {
	it('is a progressbar from 0 to 100', () => {
		render(<Progress color="primary" percent={40} aria-label="CPU usage" />);
		const bar = screen.getByRole('progressbar', { name: 'CPU usage' });

		expect(bar).toHaveAttribute('aria-valuemin', '0');
		expect(bar).toHaveAttribute('aria-valuemax', '100');
		expect(bar).toHaveAttribute('aria-valuenow', '40');
		expect(bar).toHaveAttribute('aria-valuetext', '40%');
	});

	it('announces the value text, not the clamped value', () => {
		render(<Progress color="primary" percent={140} aria-label="CPU request" />);
		const bar = screen.getByRole('progressbar');

		expect(bar).toHaveAttribute('aria-valuenow', '100');
		expect(bar).toHaveAttribute('aria-valuetext', '140%');
	});

	it('announces the rounded value text', () => {
		render(<Progress color="primary" percent={33.333} />);

		expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuetext', '33.33%');
	});

	it('announces no data for a percent that is not a finite number', () => {
		render(<Progress color="primary" percent={Number.NaN} />);
		const bar = screen.getByRole('progressbar');

		expect(bar).toHaveAttribute('aria-valuenow', '0');
		expect(bar).toHaveAttribute('aria-valuetext', 'No data');
	});

	it('takes its name from aria-labelledby', () => {
		render(
			<>
				<span id="memory-label">Memory usage</span>
				<Progress color="primary" percent={40} aria-labelledby="memory-label" />
			</>,
		);

		expect(screen.getByRole('progressbar', { name: 'Memory usage' })).toBeInTheDocument();
	});

	it('is not focusable', () => {
		render(<Progress color="primary" percent={40} />);
		const bar = screen.getByRole('progressbar');

		expect(bar).not.toHaveAttribute('tabindex');
		bar.focus();
		expect(bar).not.toHaveFocus();
	});

	it('writes its own aria-valuetext over the caller one', () => {
		render(<Progress color="primary" percent={40} aria-valuetext="forty" />);

		expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuetext', '40%');
	});

	it('keeps its own range when min and max get past the types', () => {
		render(<Progress color="primary" percent={50} {...({ min: 0, max: 200 } as object)} />);
		const bar = screen.getByRole('progressbar');

		expect(bar).toHaveAttribute('aria-valuemax', '100');
		expect(bar.querySelector<HTMLElement>('[data-slot="progress-indicator"]')?.style.width).toBe(
			'50%',
		);
	});

	it('ignores a `value` that gets past the types', () => {
		render(<Progress color="primary" percent={20} {...({ value: 80 } as object)} />);

		expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '20');
	});
});
