import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { RadioGroup } from '../radio-group.js';
import type { RadioGroupItemType } from '../types.js';

const DISABLED_REASON = 'Ask an admin to unlock this group';
const READ_ONLY_REASON = 'Saving your changes';
const ITEM_REASON = 'Your plan does not include production';

const ITEMS: RadioGroupItemType[] = [
	{ label: 'Staging', value: 'staging' },
	{ label: 'Production', value: 'production' },
];

const ITEMS_WITH_A_DISABLED_ONE: RadioGroupItemType[] = [
	{ label: 'Staging', value: 'staging' },
	{ label: 'Production', value: 'production', disabled: true, disabledTooltip: ITEM_REASON },
];

describe('RadioGroup disabledTooltip', () => {
	it('shows the reason on hover', async () => {
		const user = userEvent.setup();
		render(
			<RadioGroup
				color="primary"
				items={ITEMS}
				disabled
				disabledTooltip={DISABLED_REASON}
				testId="group"
			/>,
		);

		await user.hover(screen.getByTestId('group'));

		expect(await screen.findByRole('tooltip')).toHaveTextContent(DISABLED_REASON);
	});

	it('ties the group to the popup with aria-describedby', async () => {
		const user = userEvent.setup();
		render(
			<RadioGroup
				color="primary"
				items={ITEMS}
				disabled
				disabledTooltip={DISABLED_REASON}
				testId="group"
			/>,
		);
		const group = screen.getByTestId('group');

		await user.hover(group);

		const tooltip = await screen.findByRole('tooltip');
		expect(group).toHaveAttribute('aria-describedby', tooltip.id);
	});

	it('hides the reason again when the pointer leaves', async () => {
		const user = userEvent.setup();
		render(
			<RadioGroup
				color="primary"
				items={ITEMS}
				disabled
				disabledTooltip={DISABLED_REASON}
				testId="group"
			/>,
		);
		const group = screen.getByTestId('group');

		await user.hover(group);
		expect(await screen.findByRole('tooltip')).toBeInTheDocument();

		await user.unhover(group);

		await waitFor(() => expect(screen.queryByRole('tooltip')).not.toBeInTheDocument());
	});

	it('renders a rich reason, not only text', async () => {
		const user = userEvent.setup();
		render(
			<RadioGroup
				color="primary"
				items={ITEMS}
				disabled
				disabledTooltip={<span data-testid="reason">Ask an admin</span>}
				testId="group"
			/>,
		);

		await user.hover(screen.getByTestId('group'));

		expect(await screen.findByTestId('reason')).toBeInTheDocument();
	});

	it('says nothing while the group is usable', async () => {
		const user = userEvent.setup();
		render(
			<RadioGroup
				color="primary"
				items={ITEMS}
				disabled={false}
				disabledTooltip={DISABLED_REASON}
				testId="group"
			/>,
		);
		const group = screen.getByTestId('group');

		await user.hover(group);

		expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
		expect(group).not.toHaveAttribute('aria-describedby');
	});

	it('mounts nothing at all when there is no reason to give', async () => {
		const user = userEvent.setup();
		render(<RadioGroup color="primary" items={ITEMS} testId="group" />);

		await user.hover(screen.getByTestId('group'));

		expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
		expect(document.querySelector('[data-slot="tooltip-content"]')).toBeNull();
	});

	it('keeps the same element as the reason is mounted and unmounted', () => {
		const { rerender } = render(
			<RadioGroup
				color="primary"
				items={ITEMS}
				disabled={false}
				disabledTooltip={DISABLED_REASON}
				testId="group"
			/>,
		);
		const group = screen.getByTestId('group');

		rerender(
			<RadioGroup
				color="primary"
				items={ITEMS}
				disabled
				disabledTooltip={DISABLED_REASON}
				testId="group"
			/>,
		);

		expect(screen.getByTestId('group')).toBe(group);
	});

	it('keeps forwarding testId and data attributes through the tooltip trigger', () => {
		render(
			<RadioGroup
				color="primary"
				items={ITEMS}
				disabled
				disabledTooltip={DISABLED_REASON}
				testId="group"
				data-analytics="env-picker"
			/>,
		);

		expect(screen.getByTestId('group')).toHaveAttribute('data-analytics', 'env-picker');
	});
});

describe('RadioGroup readOnlyTooltip', () => {
	it('shows the reason on hover', async () => {
		const user = userEvent.setup();
		render(
			<RadioGroup
				color="primary"
				items={ITEMS}
				readOnly
				readOnlyTooltip={READ_ONLY_REASON}
				testId="group"
			/>,
		);

		await user.hover(screen.getByTestId('group'));

		expect(await screen.findByRole('tooltip')).toHaveTextContent(READ_ONLY_REASON);
	});

	it('says nothing while the group is writable', async () => {
		const user = userEvent.setup();
		render(
			<RadioGroup
				color="primary"
				items={ITEMS}
				readOnly={false}
				readOnlyTooltip={READ_ONLY_REASON}
				testId="group"
			/>,
		);

		await user.hover(screen.getByTestId('group'));

		expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
	});

	it('outranks disabled, and speaks instead of it', async () => {
		const user = userEvent.setup();
		render(
			<RadioGroup
				color="primary"
				items={ITEMS}
				disabled
				disabledTooltip={DISABLED_REASON}
				readOnly
				readOnlyTooltip={READ_ONLY_REASON}
				testId="group"
			/>,
		);

		await user.hover(screen.getByTestId('group'));

		const tooltip = await screen.findByRole('tooltip');
		expect(tooltip).toHaveTextContent(READ_ONLY_REASON);
		expect(tooltip).not.toHaveTextContent(DISABLED_REASON);
	});
});

describe('RadioGroup item disabledTooltip', () => {
	it('shows that item reason on hover', async () => {
		const user = userEvent.setup();
		render(<RadioGroup color="primary" items={ITEMS_WITH_A_DISABLED_ONE} />);

		await user.hover(screen.getByText('Production'));

		expect(await screen.findByRole('tooltip')).toHaveTextContent(ITEM_REASON);
	});

	it('says nothing for the items that are usable', async () => {
		const user = userEvent.setup();
		render(<RadioGroup color="primary" items={ITEMS_WITH_A_DISABLED_ONE} />);

		await user.hover(screen.getByText('Staging'));

		expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
	});

	it('stops saying it the moment the item becomes usable', async () => {
		const user = userEvent.setup();
		const { rerender } = render(<RadioGroup color="primary" items={ITEMS_WITH_A_DISABLED_ONE} />);

		await user.hover(screen.getByText('Production'));
		expect(await screen.findByRole('tooltip')).toBeInTheDocument();

		rerender(
			<RadioGroup
				color="primary"
				items={[
					{ label: 'Staging', value: 'staging' },
					{
						label: 'Production',
						value: 'production',
						disabled: false,
						disabledTooltip: ITEM_REASON,
					},
				]}
			/>,
		);

		await waitFor(() => expect(screen.queryByRole('tooltip')).not.toBeInTheDocument());
	});

	it('gives way to the group reason, which speaks for every row', async () => {
		const user = userEvent.setup();
		render(
			<RadioGroup
				color="primary"
				items={ITEMS_WITH_A_DISABLED_ONE}
				disabled
				disabledTooltip={DISABLED_REASON}
			/>,
		);

		await user.hover(screen.getByText('Production'));

		const tooltip = await screen.findByRole('tooltip');
		expect(tooltip).toHaveTextContent(DISABLED_REASON);
		expect(tooltip).not.toHaveTextContent(ITEM_REASON);
	});
});
