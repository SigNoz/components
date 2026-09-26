import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeAll, describe, expect, it } from 'vitest';
import {
	mockLabelMeasurement,
	resetLabelMeasurement,
	truncate,
} from '../../__tests__/test-utils.js';
import { ButtonGroup } from '../button-group.js';
import { BASE, noop } from './button-group.test-utils.js';

const GROUP_REASON = 'This dashboard is locked';
const ITEM_REASON = 'Monthly views need a paid plan';

beforeAll(() => mockLabelMeasurement('button-group-item-label'));
afterEach(resetLabelMeasurement);

describe('ButtonGroup tooltips', () => {
	it('shows the group reason on a disabled member', async () => {
		const user = userEvent.setup();
		render(
			<ButtonGroup
				{...BASE}
				disabled
				disabledTooltip={GROUP_REASON}
				items={[{ value: 'day', label: 'Day', onClick: noop }]}
			/>,
		);

		await user.hover(screen.getByRole('button', { name: 'Day' }));

		expect(await screen.findByRole('tooltip')).toHaveTextContent(GROUP_REASON);
	});

	it('stacks the group reason above the member reason', async () => {
		const user = userEvent.setup();
		render(
			<ButtonGroup
				{...BASE}
				disabled
				disabledTooltip={GROUP_REASON}
				items={[
					{
						value: 'month',
						label: 'Month',
						onClick: noop,
						disabled: true,
						disabledTooltip: ITEM_REASON,
					},
				]}
			/>,
		);

		await user.hover(screen.getByRole('button', { name: 'Month' }));

		const tooltip = await screen.findByRole('tooltip');
		expect(tooltip.textContent).toBe(`${GROUP_REASON}${ITEM_REASON}`);
	});

	it('shows the loading reason and hides the disabled one while loading', async () => {
		const user = userEvent.setup();
		render(
			<ButtonGroup
				{...BASE}
				loading
				loadingTooltip="Saving your changes"
				items={[
					{
						value: 'month',
						label: 'Month',
						onClick: noop,
						disabled: true,
						disabledTooltip: ITEM_REASON,
					},
				]}
			/>,
		);

		await user.hover(screen.getByRole('button', { name: 'Month' }));

		const tooltip = await screen.findByRole('tooltip');
		expect(tooltip).toHaveTextContent('Saving your changes');
		expect(tooltip).not.toHaveTextContent(ITEM_REASON);
	});

	it('says nothing for a plain member', async () => {
		const user = userEvent.setup();
		render(<ButtonGroup {...BASE} items={[{ value: 'day', label: 'Day', onClick: noop }]} />);

		await user.hover(screen.getByRole('button', { name: 'Day' }));

		await waitFor(() => expect(screen.queryByRole('tooltip')).not.toBeInTheDocument());
	});

	it('shows the full text of a truncated label, and marks it', async () => {
		const user = userEvent.setup();
		truncate();

		render(
			<ButtonGroup
				{...BASE}
				items={[{ value: 'long', label: 'Everything in the last day', onClick: noop }]}
			/>,
		);

		const button = screen.getByRole('button', { name: 'Everything in the last day' });
		expect(button).toHaveAttribute('data-truncated', 'true');

		await user.hover(button);
		expect(await screen.findByRole('tooltip')).toHaveTextContent('Everything in the last day');
	});

	it('does not measure the label with textOverflow="hidden"', () => {
		truncate();

		render(
			<ButtonGroup
				{...BASE}
				textOverflow="hidden"
				items={[{ value: 'long', label: 'Everything in the last day', onClick: noop }]}
			/>,
		);

		expect(screen.getByRole('button')).not.toHaveAttribute('data-truncated');
	});

	it('opens the next member tooltip at once, as one provider does', async () => {
		const user = userEvent.setup();

		render(
			<ButtonGroup
				{...BASE}
				items={[
					{
						value: 'day',
						label: 'Day',
						onClick: noop,
						disabled: true,
						disabledTooltip: 'Day is locked',
					},
					{
						value: 'week',
						label: 'Week',
						onClick: noop,
						disabled: true,
						disabledTooltip: 'Week is locked',
					},
				]}
			/>,
		);

		await user.hover(screen.getByRole('button', { name: 'Day' }));
		expect(await screen.findByRole('tooltip')).toHaveTextContent('Day is locked');

		await user.hover(screen.getByRole('button', { name: 'Week' }));

		// The provider delay is 300ms, and a shared provider skips it for the next tooltip.
		const reason = await screen.findByText('Week is locked', {}, { timeout: 150 });
		expect(reason.closest('[role="tooltip"]')).not.toBeNull();
	});
});
