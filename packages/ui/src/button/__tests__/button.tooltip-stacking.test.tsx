import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeAll, describe, expect, it } from 'vitest';
import { Button } from '../button.js';
import { Tooltip } from '../../tooltip/index.js';
import {
	mockLabelMeasurement,
	resetLabelMeasurement,
	resize,
	truncate,
} from '../../__tests__/test-utils.js';

const REASON = 'You need write access to edit alerts';
const LABEL = 'A very long destructive label';

beforeAll(() => mockLabelMeasurement('button-label'));
afterEach(resetLabelMeasurement);

describe('Button reason stacked over the truncated label', () => {
	it('shows both, reason first, separated by a divider', async () => {
		const user = userEvent.setup();
		truncate();
		render(
			<Button size="md" variant="solid" color="primary" disabled disabledTooltip={REASON}>
				{LABEL}
			</Button>,
		);

		await user.hover(screen.getByRole('button'));

		const tooltip = await screen.findByRole('tooltip');
		expect(tooltip).toHaveTextContent(`${REASON}${LABEL}`);
		expect(tooltip.querySelector('[data-slot="tooltip-divider"]')).toBeInTheDocument();
	});

	it('shows the reason alone when the label is not truncated', async () => {
		const user = userEvent.setup();
		render(
			<Button size="md" variant="solid" color="primary" disabled disabledTooltip={REASON}>
				Delete
			</Button>,
		);

		await user.hover(screen.getByRole('button'));

		const tooltip = await screen.findByRole('tooltip');
		expect(tooltip).toHaveTextContent(REASON);
		expect(tooltip.querySelector('[data-slot="tooltip-divider"]')).toBeNull();
	});

	it('hands the popup back to the label once the button is usable', async () => {
		const user = userEvent.setup();
		truncate();
		const { rerender } = render(
			<Button size="md" variant="solid" color="primary" disabled disabledTooltip={REASON}>
				{LABEL}
			</Button>,
		);

		rerender(
			<Button size="md" variant="solid" color="primary" disabled={false} disabledTooltip={REASON}>
				{LABEL}
			</Button>,
		);

		await user.hover(screen.getByRole('button'));

		const tooltip = await screen.findByRole('tooltip');
		expect(tooltip).toHaveTextContent(LABEL);
		expect(tooltip).not.toHaveTextContent(REASON);
	});

	it('shows the reason for textOverflow=none, which has no label popup of its own', async () => {
		const user = userEvent.setup();
		truncate();
		render(
			<Button
				size="md"
				variant="solid"
				color="primary"
				disabled
				disabledTooltip={REASON}
				textOverflow="none"
			>
				{LABEL}
			</Button>,
		);

		await user.hover(screen.getByRole('button'));

		expect(await screen.findByRole('tooltip')).toHaveTextContent(REASON);
	});

	it('shows the reason for an icon button, which has no label popup either', async () => {
		const user = userEvent.setup();
		render(
			<Button
				size="md"
				variant="solid"
				color="primary"
				icon
				disabled
				disabledTooltip={REASON}
				aria-label="Delete"
			>
				<span data-testid="icon" />
			</Button>,
		);

		await user.hover(screen.getByRole('button'));

		expect(await screen.findByRole('tooltip')).toHaveTextContent(REASON);
	});

	it('keeps the same element across a truncation flip', () => {
		render(
			<Button
				size="md"
				variant="solid"
				color="primary"
				disabled
				disabledTooltip={REASON}
				testId="btn"
			>
				{LABEL}
			</Button>,
		);
		const button = screen.getByTestId('btn');

		resize(300, 100);

		expect(screen.getByTestId('btn')).toBe(button);
	});
});

describe('Button inside another tooltip', () => {
	it('adds the truncated label to the wrapping popup instead of opening a second one', async () => {
		const user = userEvent.setup();
		truncate();
		render(
			<Tooltip title="Outer reason">
				<Button size="md" variant="solid" color="primary">
					{LABEL}
				</Button>
			</Tooltip>,
		);

		await user.hover(screen.getByRole('button'));

		const tooltips = await screen.findAllByRole('tooltip');
		expect(tooltips).toHaveLength(1);
		expect(tooltips[0]).toHaveTextContent(`Outer reason${LABEL}`);
	});

	it('adds the disabled reason under the outer title', async () => {
		const user = userEvent.setup();
		render(
			<Tooltip title="Outer reason">
				<Button size="md" variant="solid" color="primary" disabled disabledTooltip={REASON}>
					Delete alert
				</Button>
			</Tooltip>,
		);

		await user.hover(screen.getByRole('button'));

		const tooltips = await screen.findAllByRole('tooltip');
		expect(tooltips).toHaveLength(1);
		expect(tooltips[0]).toHaveTextContent(`Outer reason${REASON}`);
	});

	it('shows the disabled reason when the wrapping tooltip has no title of its own', async () => {
		const user = userEvent.setup();
		render(
			<Tooltip title={undefined}>
				<Button size="md" variant="solid" color="primary" disabled disabledTooltip={REASON}>
					Delete alert
				</Button>
			</Tooltip>,
		);

		await user.hover(screen.getByRole('button'));

		const tooltips = await screen.findAllByRole('tooltip');
		expect(tooltips).toHaveLength(1);
		expect(tooltips[0]).toHaveTextContent(REASON);
	});

	it('does not become a trigger of its own', () => {
		truncate();
		render(
			<Tooltip title="Outer reason">
				<Button size="md" variant="solid" color="primary" testId="btn">
					{LABEL}
				</Button>
			</Tooltip>,
		);

		expect(document.querySelectorAll('[data-slot="tooltip-trigger"]')).toHaveLength(1);
		expect(screen.getByTestId('btn')).toHaveAttribute('data-truncated');
	});

	it('keeps its own testId, which the cloning trigger would otherwise drop', () => {
		render(
			<Tooltip title="Outer reason">
				<Button size="md" variant="solid" color="primary" testId="btn">
					Delete alert
				</Button>
			</Tooltip>,
		);

		expect(screen.getByTestId('btn')).toBeInTheDocument();
	});

	it('stays hoverable while disabled, so the wrapping tooltip still opens', async () => {
		const user = userEvent.setup();
		render(
			<Tooltip title="Outer reason">
				<Button size="md" variant="solid" color="primary" disabled disabledTooltip={REASON}>
					Delete alert
				</Button>
			</Tooltip>,
		);

		await user.hover(screen.getByRole('button'));

		expect(await screen.findByRole('tooltip')).toHaveTextContent('Outer reason');
	});
});
