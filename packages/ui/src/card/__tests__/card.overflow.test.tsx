import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeAll, describe, expect, it } from 'vitest';
import {
	mockLabelMeasurement,
	queryOpenTooltip,
	resetLabelMeasurement,
	resize,
	truncate,
} from '../../__tests__/test-utils.js';
import { Card } from '../card.js';

const TITLE = 'checkout-service-production-east-us-2-deployment';

beforeAll(() => {
	mockLabelMeasurement('card-title');
});

afterEach(resetLabelMeasurement);

describe('Card title with textOverflow="ellipsis"', () => {
	it('is the default', () => {
		render(<Card testId="card" title={TITLE} />);

		expect(screen.getByTestId('card')).toHaveAttribute('data-text-overflow', 'ellipsis');
	});

	it('flags a title that is cut and shows the whole title on hover', async () => {
		const user = userEvent.setup();
		truncate();
		render(<Card testId="card" title={TITLE} />);

		const title = screen.getByTestId('card-title');

		expect(title).toHaveAttribute('data-truncated');

		await user.hover(title);

		expect(await screen.findByRole('tooltip')).toHaveTextContent(TITLE);
	});

	it('flags nothing and opens no tooltip for a title that fits', async () => {
		const user = userEvent.setup();
		render(<Card testId="card" title="Short" />);

		const title = screen.getByTestId('card-title');

		expect(title).not.toHaveAttribute('data-truncated');

		await user.hover(title);

		expect(queryOpenTooltip()).toBeNull();
	});

	it('measures the rendered width again when the size changes', () => {
		render(<Card testId="card" title={TITLE} />);

		const title = screen.getByTestId('card-title');

		expect(title).not.toHaveAttribute('data-truncated');

		resize(300, 100);

		expect(title).toHaveAttribute('data-truncated');

		resize(100, 100);

		expect(title).not.toHaveAttribute('data-truncated');
	});

	it('keeps the data-slot and the test id on the title while the tooltip is attached', () => {
		truncate();
		render(<Card testId="card" title={TITLE} />);

		expect(screen.getByTestId('card-title')).toHaveAttribute('data-slot', 'card-title');
	});
});

describe('Card title with textOverflow="wrap"', () => {
	it('mirrors the prop on the root', () => {
		render(<Card testId="card" title={TITLE} textOverflow="wrap" />);

		expect(screen.getByTestId('card')).toHaveAttribute('data-text-overflow', 'wrap');
	});

	it('never flags the title and never opens a tooltip', async () => {
		const user = userEvent.setup();
		truncate();
		render(<Card testId="card" title={TITLE} textOverflow="wrap" />);

		const title = screen.getByTestId('card-title');

		expect(title).not.toHaveAttribute('data-truncated');

		await user.hover(title);

		expect(queryOpenTooltip()).toBeNull();
	});
});

describe('Card description', () => {
	it('is never cut: it has no truncation flag and opens no tooltip', async () => {
		const user = userEvent.setup();
		truncate();
		render(<Card testId="card" title="Title" description={TITLE} />);

		const description = screen.getByTestId('card-description');

		expect(description).not.toHaveAttribute('data-truncated');

		await user.hover(description);

		expect(queryOpenTooltip()).toBeNull();
	});
});
