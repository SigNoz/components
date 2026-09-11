import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeAll, describe, expect, it } from 'vitest';

import { Pill } from '../pill.js';
import {
	mockLabelMeasurement,
	resetLabelMeasurement,
	resize,
	truncate,
} from '../../__tests__/test-utils.js';

const LABEL = 'checkout-service-production-east-us-2';

beforeAll(() => mockLabelMeasurement('pill-label'));
afterEach(resetLabelMeasurement);

describe('Pill overflow tooltip', () => {
	it('shows the full content on hover once it is truncated', async () => {
		const user = userEvent.setup();
		truncate();
		render(
			<Pill variant="outlined" color="primary">
				{LABEL}
			</Pill>,
		);

		await user.hover(screen.getByRole('button'));

		expect(await screen.findByRole('tooltip')).toHaveTextContent(LABEL);
	});

	it('shows the full content on keyboard focus too', async () => {
		const user = userEvent.setup();
		truncate();
		render(
			<Pill variant="outlined" color="primary">
				{LABEL}
			</Pill>,
		);

		await user.tab();

		expect(await screen.findByRole('tooltip')).toHaveTextContent(LABEL);
	});

	it('ties the pill to the popup with aria-describedby', async () => {
		const user = userEvent.setup();
		truncate();
		render(
			<Pill variant="outlined" color="primary">
				{LABEL}
			</Pill>,
		);
		const pill = screen.getByRole('button');

		await user.hover(pill);

		const tooltip = await screen.findByRole('tooltip');
		expect(pill).toHaveAttribute('aria-describedby', tooltip.id);
	});

	it('marks the pill as truncated', () => {
		truncate();
		render(
			<Pill variant="outlined" color="primary" testId="pill">
				{LABEL}
			</Pill>,
		);

		expect(screen.getByTestId('pill')).toHaveAttribute('data-truncated', 'true');
	});

	it('closes again on blur', async () => {
		const user = userEvent.setup();
		truncate();
		render(
			<>
				<Pill variant="outlined" color="primary">
					{LABEL}
				</Pill>
				<input data-testid="input" />
			</>,
		);

		await user.tab();
		expect(await screen.findByRole('tooltip')).toBeInTheDocument();

		await user.tab();

		await waitFor(() => expect(screen.queryByRole('tooltip')).not.toBeInTheDocument());
	});
});

describe('Pill overflow tooltip while the content fits', () => {
	it('puts nothing in the DOM at all', async () => {
		const user = userEvent.setup();
		render(
			<Pill variant="outlined" color="primary">
				Short
			</Pill>,
		);

		await user.hover(screen.getByRole('button'));

		expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
		expect(document.querySelector('[data-slot="tooltip-content"]')).toBeNull();
		expect(screen.getByRole('button')).not.toHaveAttribute('aria-describedby');
	});

	it('does not mark itself truncated', () => {
		render(
			<Pill variant="outlined" color="primary" testId="pill">
				Short
			</Pill>,
		);

		expect(screen.getByTestId('pill')).not.toHaveAttribute('data-truncated');
	});

	it('closes an open popup when a resize makes the content fit', async () => {
		const user = userEvent.setup();
		truncate();
		render(
			<Pill variant="outlined" color="primary">
				{LABEL}
			</Pill>,
		);

		await user.hover(screen.getByRole('button'));
		expect(await screen.findByRole('tooltip')).toBeInTheDocument();

		resize(300, 300);

		expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
	});

	it('stops opening on later hovers', async () => {
		const user = userEvent.setup();
		truncate();
		render(
			<Pill variant="outlined" color="primary">
				{LABEL}
			</Pill>,
		);
		const pill = screen.getByRole('button');

		await user.hover(pill);
		expect(await screen.findByRole('tooltip')).toBeInTheDocument();
		await user.unhover(pill);

		resize(300, 300);
		await user.hover(pill);

		expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
	});
});

describe('Pill overflow tooltip opt-outs', () => {
	it('is never mounted for textOverflow="none"', async () => {
		const user = userEvent.setup();
		truncate();
		render(
			<Pill variant="outlined" color="primary" textOverflow="none">
				{LABEL}
			</Pill>,
		);

		await user.hover(screen.getByRole('button'));

		expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
	});

	it('does not even make the pill a trigger for textOverflow="none"', () => {
		truncate();
		render(
			<Pill variant="outlined" color="primary" textOverflow="none">
				{LABEL}
			</Pill>,
		);

		expect(screen.getByRole('button')).not.toHaveAttribute('data-slot', 'tooltip-trigger');
	});
});

describe('Pill overflow tooltip element identity', () => {
	it('keeps the same element, and its focus, across a truncation flip', () => {
		render(
			<Pill variant="outlined" color="primary" testId="pill">
				{LABEL}
			</Pill>,
		);
		const pill = screen.getByTestId('pill');
		pill.focus();

		resize(300, 100);
		expect(screen.getByTestId('pill')).toBe(pill);
		expect(pill).toHaveFocus();

		resize(300, 300);
		expect(screen.getByTestId('pill')).toBe(pill);
		expect(pill).toHaveFocus();
	});

	it('keeps rendering a native button through the tooltip trigger', () => {
		render(
			<Pill variant="outlined" color="primary" testId="pill">
				Label
			</Pill>,
		);

		expect(screen.getByTestId('pill').tagName).toBe('BUTTON');
	});
});
