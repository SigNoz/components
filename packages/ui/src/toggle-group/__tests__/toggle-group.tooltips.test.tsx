import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeAll, describe, expect, it } from 'vitest';
import {
	mockLabelMeasurement,
	resetLabelMeasurement,
	truncate,
} from '../../__tests__/test-utils.js';
import { ToggleGroup } from '../toggle-group.js';
import type { ToggleGroupItemProps } from '../types.js';

const ITEM_REASON = 'Profiling is not enabled for this workspace';
const GROUP_REASON = 'This workspace is read only';
const READ_ONLY_REASON = 'Saving your changes';
const LONG_LABEL = 'Everything that happened in the last twenty four hours';

const ITEMS: ToggleGroupItemProps[] = [
	{ value: 'logs', label: 'Logs' },
	{
		value: 'profiles',
		label: 'Profiles',
		disabled: true,
		disabledTooltip: ITEM_REASON,
	},
];

beforeAll(() => mockLabelMeasurement('toggle-group-label'));
afterEach(resetLabelMeasurement);

describe('ToggleGroup tooltips', () => {
	it('shows the reason a button cannot be used, on hover', async () => {
		const user = userEvent.setup();
		render(
			<ToggleGroup type="single" variant="outlined" color="secondary" size="md" items={ITEMS} />,
		);

		await user.hover(screen.getByRole('button', { name: 'Profiles' }));

		expect(await screen.findByRole('tooltip')).toHaveTextContent(ITEM_REASON);
	});

	it('says nothing for a button that is usable', async () => {
		const user = userEvent.setup();
		render(
			<ToggleGroup type="single" variant="outlined" color="secondary" size="md" items={ITEMS} />,
		);

		await user.hover(screen.getByRole('button', { name: 'Logs' }));

		await waitFor(() => expect(screen.queryByRole('tooltip')).not.toBeInTheDocument());
	});

	it('shows the full text of a truncated label, and marks it', async () => {
		const user = userEvent.setup();
		truncate();

		render(
			<ToggleGroup
				type="single"
				variant="outlined"
				color="secondary"
				size="md"
				testId="range"
				items={[
					{ value: 'day', label: LONG_LABEL },
					{ value: 'week', label: 'Week' },
				]}
			/>,
		);

		const button = screen.getByTestId('range-button-day');

		await waitFor(() =>
			expect(button.querySelector('[data-slot="toggle-group-label"]')).toHaveAttribute(
				'data-truncated',
			),
		);

		await user.hover(button);

		expect(await screen.findByRole('tooltip')).toHaveTextContent(LONG_LABEL);
	});

	it('shows the reason the whole bar is off, on every button', async () => {
		const user = userEvent.setup();
		render(
			<ToggleGroup
				type="single"
				variant="outlined"
				color="secondary"
				size="md"
				items={ITEMS}
				disabled
				disabledTooltip={GROUP_REASON}
			/>,
		);

		await user.hover(screen.getByRole('button', { name: 'Logs' }));

		expect(await screen.findByRole('tooltip')).toHaveTextContent(GROUP_REASON);
	});

	it('stacks the bar reason above the item reason when both apply', async () => {
		const user = userEvent.setup();
		render(
			<ToggleGroup
				type="single"
				variant="outlined"
				color="secondary"
				size="md"
				items={ITEMS}
				disabled
				disabledTooltip={GROUP_REASON}
			/>,
		);

		await user.hover(screen.getByRole('button', { name: 'Profiles' }));

		const tooltip = await screen.findByRole('tooltip');

		expect(tooltip).toHaveTextContent(GROUP_REASON);
		expect(tooltip).toHaveTextContent(ITEM_REASON);
	});

	it('stacks the reason above the full label when both apply', async () => {
		const user = userEvent.setup();
		truncate();

		render(
			<ToggleGroup
				type="single"
				variant="outlined"
				color="secondary"
				size="md"
				testId="range"
				items={[
					{
						value: 'day',
						label: LONG_LABEL,
						disabled: true,
						disabledTooltip: ITEM_REASON,
					},
				]}
			/>,
		);

		await user.hover(screen.getByTestId('range-button-day'));

		const tooltip = await screen.findByRole('tooltip');

		expect(tooltip).toHaveTextContent(ITEM_REASON);
		expect(tooltip).toHaveTextContent(LONG_LABEL);
	});
});

describe('ToggleGroup readOnlyTooltip', () => {
	it('shows the reason on every button of a locked bar', async () => {
		const user = userEvent.setup();
		render(
			<ToggleGroup
				type="single"
				variant="outlined"
				color="secondary"
				size="md"
				items={ITEMS}
				readOnly
				readOnlyTooltip={READ_ONLY_REASON}
			/>,
		);

		await user.hover(screen.getByRole('button', { name: 'Logs' }));

		expect(await screen.findByRole('tooltip')).toHaveTextContent(READ_ONLY_REASON);
	});

	it('says nothing while the bar is writable', async () => {
		const user = userEvent.setup();
		render(
			<ToggleGroup
				type="single"
				variant="outlined"
				color="secondary"
				size="md"
				items={[{ value: 'logs', label: 'Logs' }]}
				readOnly={false}
				readOnlyTooltip={READ_ONLY_REASON}
			/>,
		);

		await user.hover(screen.getByRole('button', { name: 'Logs' }));

		await waitFor(() => expect(screen.queryByRole('tooltip')).not.toBeInTheDocument());
	});

	it('outranks the bar reason, and speaks instead of it', async () => {
		const user = userEvent.setup();
		render(
			<ToggleGroup
				type="single"
				variant="outlined"
				color="secondary"
				size="md"
				items={ITEMS}
				disabled
				disabledTooltip={GROUP_REASON}
				readOnly
				readOnlyTooltip={READ_ONLY_REASON}
			/>,
		);

		await user.hover(screen.getByRole('button', { name: 'Logs' }));

		const tooltip = await screen.findByRole('tooltip');

		expect(tooltip).toHaveTextContent(READ_ONLY_REASON);
		expect(tooltip).not.toHaveTextContent(GROUP_REASON);
	});

	it('suppresses an item reason: a locked bar has one reason, not one per button', async () => {
		const user = userEvent.setup();
		render(
			<ToggleGroup
				type="single"
				variant="outlined"
				color="secondary"
				size="md"
				items={ITEMS}
				readOnly
				readOnlyTooltip={READ_ONLY_REASON}
			/>,
		);

		await user.hover(screen.getByRole('button', { name: 'Profiles' }));

		const tooltip = await screen.findByRole('tooltip');

		expect(tooltip).toHaveTextContent(READ_ONLY_REASON);
		expect(tooltip).not.toHaveTextContent(ITEM_REASON);
	});

	it('stacks the lock reason above the full label', async () => {
		const user = userEvent.setup();
		truncate();

		render(
			<ToggleGroup
				type="single"
				variant="outlined"
				color="secondary"
				size="md"
				testId="range"
				items={[{ value: 'day', label: LONG_LABEL }]}
				readOnly
				readOnlyTooltip={READ_ONLY_REASON}
			/>,
		);

		await user.hover(screen.getByTestId('range-button-day'));

		const tooltip = await screen.findByRole('tooltip');

		expect(tooltip).toHaveTextContent(READ_ONLY_REASON);
		expect(tooltip).toHaveTextContent(LONG_LABEL);
	});
});
