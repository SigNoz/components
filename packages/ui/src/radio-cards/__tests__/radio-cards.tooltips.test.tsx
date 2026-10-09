import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { RadioCards } from '../radio-cards.js';
import type { RadioCardsItemType } from '../types.js';
import { ITEMS } from './radio-cards.test-utils.js';

const GROUP_REASON = 'Ask an admin to unlock this question';
const READ_ONLY_REASON = 'Saving your answers';
const CARD_REASON = 'Traces are not set up yet';
const LONG_LABEL = 'Grafana, Prometheus and every exporter that feeds them';

const ITEMS_WITH_A_DISABLED_ONE: RadioCardsItemType[] = [
	{ label: 'Logs', value: 'logs' },
	{ label: 'Traces', value: 'traces', disabled: true, disabledTooltip: CARD_REASON },
];

describe('RadioCards group reasons', () => {
	it('shows disabledTooltip on hover, tied to the root', async () => {
		const user = userEvent.setup();
		render(
			<RadioCards
				aria-label="Signal"
				items={ITEMS}
				disabled
				disabledTooltip={GROUP_REASON}
				testId="signal"
			/>,
		);
		const root = screen.getByTestId('signal');

		await user.hover(root);

		const tooltip = await screen.findByRole('tooltip');
		expect(tooltip).toHaveTextContent(GROUP_REASON);
		expect(root).toHaveAttribute('aria-describedby', tooltip.id);
	});

	it('shows readOnlyTooltip on keyboard focus', async () => {
		const user = userEvent.setup();
		render(
			<RadioCards aria-label="Signal" items={ITEMS} readOnly readOnlyTooltip={READ_ONLY_REASON} />,
		);

		await user.tab();

		expect(await screen.findByRole('tooltip')).toHaveTextContent(READ_ONLY_REASON);
	});

	it('shows only readOnlyTooltip while both are set', async () => {
		const user = userEvent.setup();
		render(
			<RadioCards
				aria-label="Signal"
				items={ITEMS}
				disabled
				disabledTooltip={GROUP_REASON}
				readOnly
				readOnlyTooltip={READ_ONLY_REASON}
				testId="signal"
			/>,
		);

		await user.hover(screen.getByTestId('signal'));

		const tooltip = await screen.findByRole('tooltip');
		expect(tooltip).toHaveTextContent(READ_ONLY_REASON);
		expect(tooltip).not.toHaveTextContent(GROUP_REASON);
	});

	it('takes the place of a card reason while it shows', async () => {
		const user = userEvent.setup();
		render(
			<RadioCards
				aria-label="Signal"
				items={ITEMS_WITH_A_DISABLED_ONE}
				disabled
				disabledTooltip={GROUP_REASON}
			/>,
		);

		await user.hover(screen.getByRole('radio', { name: 'Traces' }));

		const tooltip = await screen.findByRole('tooltip');
		expect(tooltip).toHaveTextContent(GROUP_REASON);
		expect(tooltip).not.toHaveTextContent(CARD_REASON);
	});

	it('says nothing while the group is usable', async () => {
		const user = userEvent.setup();
		render(
			<RadioCards
				aria-label="Signal"
				items={ITEMS}
				disabled={false}
				disabledTooltip={GROUP_REASON}
				testId="signal"
			/>,
		);

		await user.hover(screen.getByTestId('signal'));

		expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
	});

	it('keeps the same root as the reason is mounted and unmounted', () => {
		const { rerender } = render(
			<RadioCards
				aria-label="Signal"
				items={ITEMS}
				disabled={false}
				disabledTooltip={GROUP_REASON}
				testId="signal"
			/>,
		);
		const root = screen.getByTestId('signal');

		rerender(
			<RadioCards
				aria-label="Signal"
				items={ITEMS}
				disabled
				disabledTooltip={GROUP_REASON}
				testId="signal"
			/>,
		);

		expect(screen.getByTestId('signal')).toBe(root);
	});

	it('shows the Multiple group reason on hover', async () => {
		const user = userEvent.setup();
		render(
			<RadioCards.Multiple
				aria-label="Tools"
				items={ITEMS}
				disabled
				disabledTooltip={GROUP_REASON}
				testId="tools"
			/>,
		);

		await user.hover(screen.getByTestId('tools'));

		expect(await screen.findByRole('tooltip')).toHaveTextContent(GROUP_REASON);
	});

	it('shows the Multiple group reason on keyboard focus of its one tab stop', async () => {
		const user = userEvent.setup();
		render(
			<RadioCards.Multiple
				aria-label="Tools"
				items={ITEMS}
				disabled
				disabledTooltip={GROUP_REASON}
			/>,
		);

		await user.tab();

		expect(screen.getByRole('checkbox', { name: 'Logs' })).toHaveFocus();
		expect(await screen.findByRole('tooltip')).toHaveTextContent(GROUP_REASON);
	});

	it('shows the Multiple readOnlyTooltip on hover', async () => {
		const user = userEvent.setup();
		render(
			<RadioCards.Multiple
				aria-label="Tools"
				items={ITEMS}
				readOnly
				readOnlyTooltip={READ_ONLY_REASON}
				testId="tools"
			/>,
		);
		const root = screen.getByTestId('tools');

		await user.hover(root);

		const tooltip = await screen.findByRole('tooltip');
		expect(tooltip).toHaveTextContent(READ_ONLY_REASON);
		expect(root).toHaveAttribute('aria-describedby', tooltip.id);
	});

	it('shows the Multiple readOnlyTooltip on keyboard focus of a card', async () => {
		const user = userEvent.setup();
		render(
			<RadioCards.Multiple
				aria-label="Tools"
				items={ITEMS}
				readOnly
				readOnlyTooltip={READ_ONLY_REASON}
			/>,
		);

		await user.tab();

		expect(screen.getByRole('checkbox', { name: 'Logs' })).toHaveFocus();
		expect(await screen.findByRole('tooltip')).toHaveTextContent(READ_ONLY_REASON);
	});
});

describe('RadioCards root description', () => {
	it.each(['RadioCards', 'RadioCards.Multiple'] as const)(
		'keeps the aria-describedby and id of %s next to the group reason',
		async (component) => {
			const user = userEvent.setup();
			const Group = component === 'RadioCards' ? RadioCards : RadioCards.Multiple;
			render(
				<>
					<p id="signal-hint">Pick the signal to alert on</p>
					<Group
						aria-label="Signal"
						aria-describedby="signal-hint"
						id="signal-group"
						items={ITEMS}
						disabled
						disabledTooltip={GROUP_REASON}
						testId="signal"
					/>
				</>,
			);
			const root = screen.getByTestId('signal');

			await user.hover(root);

			const tooltip = await screen.findByRole('tooltip');
			expect(root).toHaveAttribute('id', 'signal-group');
			expect(root).toHaveAttribute('aria-describedby', `${tooltip.id} signal-hint`);
			expect(root).toHaveAttribute('data-popup-open');
		},
	);

	it('keeps the aria-describedby of the root while no reason shows', () => {
		render(
			<RadioCards
				aria-label="Signal"
				aria-describedby="signal-hint"
				items={ITEMS}
				disabled={false}
				disabledTooltip={GROUP_REASON}
				testId="signal"
			/>,
		);

		expect(screen.getByTestId('signal')).toHaveAttribute('aria-describedby', 'signal-hint');
	});
});

describe('RadioCards card reasons', () => {
	it.each([
		['RadioCards', 'radio'],
		['RadioCards.Multiple', 'checkbox'],
	] as const)(
		'opens a card reason on the card, while %s has an unused group reason',
		async (component, role) => {
			const user = userEvent.setup();
			const Group = component === 'RadioCards' ? RadioCards : RadioCards.Multiple;
			render(
				<Group
					aria-label="Signal"
					items={ITEMS_WITH_A_DISABLED_ONE}
					disabled={false}
					disabledTooltip={GROUP_REASON}
					testId="signal"
				/>,
			);

			await user.hover(screen.getByRole(role, { name: 'Logs' }));
			expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();

			const traces = screen.getByRole(role, { name: 'Traces' });
			await user.hover(traces);

			expect(await screen.findByRole('tooltip')).toHaveTextContent(CARD_REASON);
			expect(traces).toHaveAccessibleDescription(CARD_REASON);
			expect(screen.getByTestId('signal')).not.toHaveAttribute('aria-describedby');
		},
	);

	it('shows a disabled card reason on hover', async () => {
		const user = userEvent.setup();
		render(<RadioCards aria-label="Signal" items={ITEMS_WITH_A_DISABLED_ONE} />);

		await user.hover(screen.getByRole('radio', { name: 'Traces' }));

		expect(await screen.findByRole('tooltip')).toHaveTextContent(CARD_REASON);
	});

	it('shows a disabled card reason on hover in a Multiple group', async () => {
		const user = userEvent.setup();
		render(
			<RadioCards.Multiple
				aria-label="Tools"
				items={[
					{ label: 'Logs', value: 'logs' },
					{ label: 'Traces', value: 'traces', disabled: true, disabledTooltip: CARD_REASON },
				]}
			/>,
		);

		await user.hover(screen.getByRole('checkbox', { name: 'Traces' }));

		expect(await screen.findByRole('tooltip')).toHaveTextContent(CARD_REASON);
	});

	it('hides the card reason when the pointer leaves', async () => {
		const user = userEvent.setup();
		render(<RadioCards aria-label="Signal" items={ITEMS_WITH_A_DISABLED_ONE} />);
		const traces = screen.getByRole('radio', { name: 'Traces' });

		await user.hover(traces);
		expect(await screen.findByRole('tooltip')).toBeInTheDocument();

		await user.unhover(traces);

		await waitFor(() => expect(screen.queryByRole('tooltip')).not.toBeInTheDocument());
	});
});

describe('RadioCards truncated labels', () => {
	it('marks a label that does not fit and shows it in full on hover', async () => {
		const user = userEvent.setup();
		render(
			<div style={{ width: 180 }}>
				<RadioCards aria-label="Tool" items={[{ label: LONG_LABEL, value: 'grafana' }]} />
			</div>,
		);
		const label = screen.getByText(LONG_LABEL);

		await waitFor(() => expect(label).toHaveAttribute('data-truncated'));

		await user.hover(label);

		expect(await screen.findByRole('tooltip')).toHaveTextContent(LONG_LABEL);
	});

	it('puts the card reason first, then the full label', async () => {
		const user = userEvent.setup();
		render(
			<div style={{ width: 180 }}>
				<RadioCards
					aria-label="Tool"
					items={[
						{ label: LONG_LABEL, value: 'grafana', disabled: true, disabledTooltip: CARD_REASON },
					]}
				/>
			</div>,
		);
		const label = screen.getByText(LONG_LABEL);
		await waitFor(() => expect(label).toHaveAttribute('data-truncated'));

		await user.hover(label);

		const tooltip = await screen.findByRole('tooltip');
		expect(tooltip.textContent?.indexOf(CARD_REASON)).toBeLessThan(
			tooltip.textContent?.indexOf(LONG_LABEL) ?? -1,
		);
	});

	it('describes the card with its reason alone, not with the label that names it', async () => {
		const user = userEvent.setup();
		render(
			<div style={{ width: 180 }}>
				<RadioCards
					aria-label="Tool"
					items={[
						{ label: LONG_LABEL, value: 'grafana', disabled: true, disabledTooltip: CARD_REASON },
					]}
				/>
			</div>,
		);
		const label = screen.getByText(LONG_LABEL);
		await waitFor(() => expect(label).toHaveAttribute('data-truncated'));

		await user.hover(label);

		expect(await screen.findByRole('tooltip')).toHaveTextContent(LONG_LABEL);
		expect(screen.getByRole('radio', { name: LONG_LABEL })).toHaveAccessibleDescription(
			CARD_REASON,
		);
	});

	it('leaves a card with only its truncated label in the tooltip undescribed', async () => {
		const user = userEvent.setup();
		render(
			<div style={{ width: 180 }}>
				<RadioCards aria-label="Tool" items={[{ label: LONG_LABEL, value: 'grafana' }]} />
			</div>,
		);
		const label = screen.getByText(LONG_LABEL);
		await waitFor(() => expect(label).toHaveAttribute('data-truncated'));

		await user.hover(label);

		expect(await screen.findByRole('tooltip')).toHaveTextContent(LONG_LABEL);
		expect(screen.getByRole('radio', { name: LONG_LABEL })).not.toHaveAttribute('aria-describedby');
	});

	it('leaves a label that fits unmarked and shows no tooltip', async () => {
		const user = userEvent.setup();
		render(
			<div style={{ width: 400 }}>
				<RadioCards aria-label="Tool" items={[{ label: 'Logs', value: 'logs' }]} />
			</div>,
		);

		await user.hover(screen.getByText('Logs'));

		expect(screen.getByText('Logs')).not.toHaveAttribute('data-truncated');
		expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
	});

	it('wraps the label and shows no tooltip with textOverflow="wrap"', async () => {
		const user = userEvent.setup();
		render(
			<div style={{ width: 180 }}>
				<RadioCards
					aria-label="Tool"
					textOverflow="wrap"
					items={[{ label: LONG_LABEL, value: 'grafana' }]}
				/>
			</div>,
		);

		await user.hover(screen.getByText(LONG_LABEL));

		expect(screen.getByText(LONG_LABEL)).not.toHaveAttribute('data-truncated');
		expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
	});
});
