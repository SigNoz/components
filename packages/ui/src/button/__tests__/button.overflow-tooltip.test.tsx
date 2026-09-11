import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeAll, describe, expect, it } from 'vitest';
import { Button } from '../button.js';
import { mockLabelMeasurement, resetLabelMeasurement, resize, truncate } from './test-utils.js';

const LABEL = 'A very long destructive label';

beforeAll(mockLabelMeasurement);
afterEach(resetLabelMeasurement);

describe('Button overflow tooltip', () => {
	it('shows the full label on hover once the text is ellipsed', async () => {
		const user = userEvent.setup();
		truncate();
		render(
			<Button size="md" variant="solid" color="primary">
				{LABEL}
			</Button>,
		);

		await user.hover(screen.getByRole('button'));

		expect(await screen.findByRole('tooltip')).toHaveTextContent(LABEL);
	});

	it('shows the full label on keyboard focus too', async () => {
		const user = userEvent.setup();
		truncate();
		render(
			<Button size="md" variant="solid" color="primary">
				{LABEL}
			</Button>,
		);

		await user.tab();

		expect(await screen.findByRole('tooltip')).toHaveTextContent(LABEL);
	});

	it('ties the button to the popup with aria-describedby', async () => {
		const user = userEvent.setup();
		truncate();
		render(
			<Button size="md" variant="solid" color="primary">
				{LABEL}
			</Button>,
		);
		const button = screen.getByRole('button');

		await user.hover(button);

		const tooltip = await screen.findByRole('tooltip');
		expect(button).toHaveAttribute('aria-describedby', tooltip.id);
	});

	it('closes again on blur', async () => {
		const user = userEvent.setup();
		truncate();
		render(
			<>
				<Button size="md" variant="solid" color="primary">
					{LABEL}
				</Button>
				<input data-testid="input" />
			</>,
		);

		await user.tab();
		expect(await screen.findByRole('tooltip')).toBeInTheDocument();

		await user.tab();

		await waitFor(() => expect(screen.queryByRole('tooltip')).not.toBeInTheDocument());
	});
});

describe('Button overflow tooltip while the label fits', () => {
	it('puts nothing in the DOM at all', async () => {
		const user = userEvent.setup();
		render(
			<Button size="md" variant="solid" color="primary">
				Short
			</Button>,
		);

		await user.hover(screen.getByRole('button'));

		expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
		expect(document.querySelector('[data-slot="tooltip-content"]')).toBeNull();
		expect(screen.getByRole('button')).not.toHaveAttribute('aria-describedby');
	});

	it('closes an open popup when a resize makes the label fit', async () => {
		const user = userEvent.setup();
		truncate();
		render(
			<Button size="md" variant="solid" color="primary">
				{LABEL}
			</Button>,
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
			<Button size="md" variant="solid" color="primary">
				{LABEL}
			</Button>,
		);
		const button = screen.getByRole('button');

		await user.hover(button);
		expect(await screen.findByRole('tooltip')).toBeInTheDocument();
		await user.unhover(button);

		resize(300, 300);
		await user.hover(button);

		expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
	});
});

describe('Button overflow tooltip opt-outs', () => {
	it('is never mounted for textOverflow=none', async () => {
		const user = userEvent.setup();
		truncate();
		render(
			<Button size="md" variant="solid" color="primary" textOverflow="none">
				{LABEL}
			</Button>,
		);

		await user.hover(screen.getByRole('button'));

		expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
	});

	it('does not even make the button a trigger for textOverflow=none', () => {
		truncate();
		render(
			<Button size="md" variant="solid" color="primary" textOverflow="none">
				{LABEL}
			</Button>,
		);

		expect(screen.getByRole('button')).not.toHaveAttribute('data-slot', 'tooltip-trigger');
	});

	it('is never mounted for an icon button', async () => {
		const user = userEvent.setup();
		truncate();
		render(
			<Button size="md" variant="solid" color="primary" icon aria-label="Star">
				<span data-testid="icon" />
			</Button>,
		);

		await user.hover(screen.getByRole('button'));

		expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
	});
});

describe('Button overflow tooltip element identity', () => {
	it('keeps the same element, and its focus, across a truncation flip', () => {
		render(
			<Button size="md" variant="solid" color="primary" testId="btn">
				{LABEL}
			</Button>,
		);
		const button = screen.getByTestId('btn');
		button.focus();

		resize(300, 100);
		expect(screen.getByTestId('btn')).toBe(button);
		expect(button).toHaveFocus();

		resize(300, 300);
		expect(screen.getByTestId('btn')).toBe(button);
		expect(button).toHaveFocus();
	});

	it('leaves focus where it was when the button was not focused', () => {
		render(
			<>
				<Button size="md" variant="solid" color="primary" testId="btn">
					{LABEL}
				</Button>
				<input data-testid="input" />
			</>,
		);
		const input = screen.getByTestId('input');
		input.focus();

		resize(300, 100);

		expect(input).toHaveFocus();
	});

	it('keeps rendering a native button through the tooltip trigger', () => {
		render(
			<Button size="md" variant="solid" color="primary" testId="btn">
				Label
			</Button>,
		);

		expect(screen.getByTestId('btn').tagName).toBe('BUTTON');
	});
});
