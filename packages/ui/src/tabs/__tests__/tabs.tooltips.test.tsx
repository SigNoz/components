import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeAll, describe, expect, it } from 'vitest';
import {
	mockLabelMeasurement,
	resetLabelMeasurement,
	resize,
	truncate,
} from '../../__tests__/test-utils.js';
import { Tabs } from '../tabs.js';
import type { TabsItemProps } from '../types.js';

const ITEM_REASON = 'Ask an admin for access';
const LONG_LABEL = 'Production, the one every customer is looking at right now';

const ITEMS: TabsItemProps[] = [
	{ key: 'overview', label: 'Overview', children: 'Overview content' },
	{
		key: 'billing',
		label: 'Billing',
		children: 'Billing content',
		disabled: true,
		disabledTooltip: ITEM_REASON,
	},
];

beforeAll(() => mockLabelMeasurement('tabs-label'));
afterEach(resetLabelMeasurement);

describe('Tabs disabledTooltip', () => {
	it('shows the reason on hover', async () => {
		const user = userEvent.setup();
		render(<Tabs variant="primary" orientation="horizontal" alignment="start" items={ITEMS} />);

		await user.hover(screen.getByRole('tab', { name: 'Billing' }));

		expect(await screen.findByRole('tooltip')).toHaveTextContent(ITEM_REASON);
	});

	it('says nothing for a tab that is usable', async () => {
		const user = userEvent.setup();
		render(<Tabs variant="primary" orientation="horizontal" alignment="start" items={ITEMS} />);

		await user.hover(screen.getByRole('tab', { name: 'Overview' }));

		expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
	});

	it('hides the reason again when the pointer leaves', async () => {
		const user = userEvent.setup();
		render(<Tabs variant="primary" orientation="horizontal" alignment="start" items={ITEMS} />);
		const billing = screen.getByRole('tab', { name: 'Billing' });

		await user.hover(billing);
		expect(await screen.findByRole('tooltip')).toBeInTheDocument();

		await user.unhover(billing);

		await waitFor(() => expect(screen.queryByRole('tooltip')).not.toBeInTheDocument());
	});

	it('is reachable by keyboard focus, since the tab stays focusable while disabled', async () => {
		const user = userEvent.setup();
		render(<Tabs variant="primary" orientation="horizontal" alignment="start" items={ITEMS} />);

		await user.tab();
		await user.keyboard('{ArrowRight}');

		expect(screen.getByRole('tab', { name: 'Billing' })).toHaveFocus();
		expect(await screen.findByRole('tooltip')).toHaveTextContent(ITEM_REASON);
	});
});

describe('Tabs truncation', () => {
	const LONG_ITEMS: TabsItemProps[] = [
		{ key: 'production', label: LONG_LABEL, children: 'Production content' },
	];

	it('marks the label truncated once it does not fit', () => {
		truncate();
		render(
			<Tabs variant="primary" orientation="horizontal" alignment="start" items={LONG_ITEMS} />,
		);

		expect(screen.getByText(LONG_LABEL)).toHaveAttribute('data-truncated');
	});

	it('shows the full label on hover', async () => {
		const user = userEvent.setup();
		truncate();
		render(
			<Tabs variant="primary" orientation="horizontal" alignment="start" items={LONG_ITEMS} />,
		);

		await user.hover(screen.getByText(LONG_LABEL));

		expect(await screen.findByRole('tooltip')).toHaveTextContent(LONG_LABEL);
	});

	it('says nothing while the label fits', async () => {
		const user = userEvent.setup();
		render(
			<Tabs variant="primary" orientation="horizontal" alignment="start" items={LONG_ITEMS} />,
		);

		await user.hover(screen.getByText(LONG_LABEL));

		expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
	});

	it('stacks the disabled reason above the truncated label, reason first', async () => {
		const user = userEvent.setup();
		truncate();
		render(
			<Tabs
				variant="primary"
				orientation="horizontal"
				alignment="start"
				items={[
					{
						key: 'production',
						label: LONG_LABEL,
						children: 'Production content',
						disabled: true,
						disabledTooltip: ITEM_REASON,
					},
				]}
			/>,
		);

		await user.hover(screen.getByText(LONG_LABEL));

		const tooltip = await screen.findByRole('tooltip');
		expect(tooltip.textContent?.indexOf(ITEM_REASON)).toBeLessThan(
			tooltip.textContent?.indexOf(LONG_LABEL) ?? -1,
		);
	});

	it('closes an open popup when a resize makes the label fit', async () => {
		const user = userEvent.setup();
		truncate();
		render(
			<Tabs variant="primary" orientation="horizontal" alignment="start" items={LONG_ITEMS} />,
		);

		await user.hover(screen.getByText(LONG_LABEL));
		expect(await screen.findByRole('tooltip')).toBeInTheDocument();

		resize(300, 300);

		expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
	});
});
