import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Progress } from './index.js';

describe('Progress value', () => {
	it('exposes the percent as a progressbar value', () => {
		render(<Progress percent={40} />);
		expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '40');
	});

	it('defaults to zero', () => {
		render(<Progress />);
		expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '0');
	});

	it('clamps a percent below zero', () => {
		render(<Progress percent={-25} />);
		expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '0');
	});

	it('clamps a percent above one hundred', () => {
		render(<Progress percent={140} />);
		expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '100');
	});
});

describe('Progress info label', () => {
	it('is hidden by default', () => {
		render(<Progress percent={40} />);
		expect(screen.queryByText('40%')).not.toBeInTheDocument();
	});

	it('renders the clamped percent when showInfo is set', () => {
		render(<Progress percent={140} showInfo />);
		expect(screen.getByText('100%')).toBeInTheDocument();
	});
});

describe('Progress steps', () => {
	it('renders no dividers without steps', () => {
		render(<Progress percent={50} testId="p" />);
		expect(screen.getByTestId('p').querySelectorAll('[aria-hidden="true"]')).toHaveLength(0);
	});

	it('renders one fewer divider than the step count', () => {
		render(<Progress percent={50} steps={4} testId="p" />);

		const dividerGroup = screen.getByTestId('p').querySelector('[aria-hidden="true"]');
		expect(dividerGroup).not.toBeNull();
		expect(dividerGroup?.children).toHaveLength(3);
	});

	it('renders no dividers for a single step', () => {
		render(<Progress percent={50} steps={1} testId="p" />);
		expect(screen.getByTestId('p').querySelector('[aria-hidden="true"]')).toBeNull();
	});
});

describe('Progress prop forwarding', () => {
	it('puts testId, id and style on the wrapper, keeping the bar inside it', () => {
		render(
			<Progress percent={40} testId="ingest" id="ingest-progress" style={{ width: '200px' }} />,
		);

		const wrapper = screen.getByTestId('ingest');
		expect(wrapper).toHaveAttribute('id', 'ingest-progress');
		expect(wrapper).toHaveStyle({ width: '200px' });
		expect(wrapper).toContainElement(screen.getByRole('progressbar'));
	});

	it('exposes size and linecap as styling hooks on the bar', () => {
		render(<Progress percent={40} size="small" strokeLinecap="round" />);

		const bar = screen.getByRole('progressbar');
		expect(bar).toHaveAttribute('data-size', 'small');
		expect(bar).toHaveAttribute('data-linecap', 'round');
	});
});
