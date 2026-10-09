import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { RadioCards } from '../radio-cards.js';
import type { RadioCardsItemType } from '../types.js';
import { ITEMS } from './radio-cards.test-utils.js';

const ICON_ITEMS: RadioCardsItemType[] = [
	{
		label: 'Logs',
		value: 'logs',
		prefix: <svg data-icon="logs" />,
	},
	{ label: 'Traces', value: 'traces', testId: 'traces-card', prefix: <svg data-icon="traces" /> },
];

afterEach(() => {
	vi.restoreAllMocks();
});

describe('RadioCards rendering', () => {
	it('renders a named radiogroup with one radio per item, named by its label', () => {
		render(<RadioCards aria-label="Signal" items={ITEMS} />);

		const group = screen.getByRole('radiogroup', { name: 'Signal' });
		expect(within(group).getAllByRole('radio')).toHaveLength(3);
		expect(screen.getByRole('radio', { name: 'Traces' })).toHaveAttribute(
			'data-slot',
			'radio-cards-item',
		);
	});

	it('marks the root with its slot, columns and text overflow', () => {
		render(<RadioCards aria-label="Signal" items={ITEMS} columns={2} testId="signal" />);

		const root = screen.getByTestId('signal');
		expect(root).toHaveAttribute('data-slot', 'radio-cards');
		expect(root).toHaveAttribute('data-columns', '2');
		expect(root).toHaveAttribute('data-text-overflow', 'ellipsis');
		expect(root).not.toHaveAttribute('data-multiple');
	});

	it('leaves data-columns off without columns', () => {
		render(<RadioCards aria-label="Signal" items={ITEMS} testId="signal" />);

		expect(screen.getByTestId('signal')).not.toHaveAttribute('data-columns');
	});

	it('warns and drops a columns that is not a whole number from 1 up', () => {
		const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
		render(<RadioCards aria-label="Signal" items={ITEMS} columns={0} testId="signal" />);

		const root = screen.getByTestId('signal');
		expect(root).not.toHaveAttribute('data-columns');
		expect(root.style.getPropertyValue('--radio-cards-internal-columns')).toBe('');
		expect(warn).toHaveBeenCalledWith(
			'RadioCards: `columns` is 0, not a whole number from 1 up. Ignoring it.',
		);
	});

	it('names every card and its icon from the group testId', () => {
		render(<RadioCards aria-label="Signal" items={ICON_ITEMS} testId="signal" />);

		const logs = screen.getByTestId('signal-item-logs');
		expect(logs).toHaveAttribute('role', 'radio');
		expect(screen.getByTestId('signal-item-logs-prefix')).toHaveAttribute(
			'data-slot',
			'radio-cards-item-prefix',
		);
	});

	it('lets a card name itself and its icon', () => {
		render(<RadioCards aria-label="Signal" items={ICON_ITEMS} testId="signal" />);

		expect(screen.getByTestId('traces-card')).toHaveAccessibleName('Traces');
		expect(screen.getByTestId('traces-card-prefix')).toBeInTheDocument();
		expect(screen.queryByTestId('signal-item-traces')).not.toBeInTheDocument();
	});

	it('hides the icons from screen readers and leaves them out of the name', () => {
		render(
			<RadioCards aria-label="Signal" items={ICON_ITEMS} testId="signal" defaultValue="logs" />,
		);

		const logs = screen.getByTestId('signal-item-logs');
		expect(screen.getByTestId('signal-item-logs-prefix')).toHaveAttribute('aria-hidden', 'true');
		expect(logs.querySelector('[data-slot="radio-cards-item-indicator"]')).toHaveAttribute(
			'aria-hidden',
			'true',
		);
		expect(logs).toHaveAccessibleName('Logs');
	});

	it('puts the check after the label of every card, marked checked on the checked one', () => {
		render(<RadioCards aria-label="Signal" items={ITEMS} defaultValue="logs" testId="signal" />);

		const check = (value: string): Element | null =>
			screen
				.getByTestId(`signal-item-${value}`)
				.querySelector('[data-slot="radio-cards-item-indicator"]');
		expect(check('logs')?.previousElementSibling).toHaveAttribute(
			'data-slot',
			'radio-cards-item-label',
		);
		expect(check('logs')).toHaveAttribute('data-checked');
		expect(check('traces')).toHaveAttribute('data-unchecked');
	});

	it('moves the checked mark with the value', () => {
		const { rerender } = render(
			<RadioCards aria-label="Signal" items={ITEMS} value="logs" testId="signal" />,
		);

		rerender(<RadioCards aria-label="Signal" items={ITEMS} value="traces" testId="signal" />);

		const checked = document.querySelectorAll(
			'[data-slot="radio-cards-item-indicator"][data-checked]',
		);
		expect(checked).toHaveLength(1);
		expect(screen.getByTestId('signal-item-traces')).toContainElement(checked[0] as HTMLElement);
	});

	it('marks the checked card and its peers', () => {
		render(<RadioCards aria-label="Signal" items={ITEMS} defaultValue="traces" />);

		expect(screen.getByRole('radio', { name: 'Traces' })).toHaveAttribute('data-checked');
		expect(screen.getByRole('radio', { name: 'Traces' })).toHaveAttribute('aria-checked', 'true');
		expect(screen.getByRole('radio', { name: 'Logs' })).toHaveAttribute('data-unchecked');
	});

	it('falls back to <No label> for a label that renders nothing', () => {
		render(
			<RadioCards
				aria-label="Signal"
				items={[
					{ label: '', value: 'empty' },
					{ label: 'Logs', value: 'logs' },
				]}
				testId="signal"
			/>,
		);

		const card = screen.getByTestId('signal-item-empty');
		expect(card).toHaveAccessibleName('<No label>');
		const label = card.querySelector('[data-slot="radio-cards-item-label"]');
		expect(label).toHaveAttribute('data-empty-label');
	});

	it('warns and renders no card for an empty items', () => {
		const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
		render(<RadioCards aria-label="Signal" items={[]} />);

		expect(screen.queryAllByRole('radio')).toHaveLength(0);
		expect(warn).toHaveBeenCalledWith('RadioCards: `items` is empty, rendering no card.');
	});

	it.each([
		['RadioCards', 'radio'],
		['RadioCards.Multiple', 'checkbox'],
	] as const)(
		'renders the first of two items with one value on %s, and warns',
		(component, role) => {
			const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
			const Group = component === 'RadioCards' ? RadioCards : RadioCards.Multiple;
			render(
				<Group
					aria-label="Signal"
					items={[
						{ label: 'Logs', value: 'logs' },
						{ label: 'Also logs', value: 'logs' },
						{ label: 'Traces', value: 'traces' },
					]}
					testId="signal"
				/>,
			);

			expect(screen.getAllByRole(role)).toHaveLength(2);
			expect(screen.getByRole(role, { name: 'Logs' })).toHaveAttribute(
				'data-testid',
				'signal-item-logs',
			);
			expect(screen.queryByRole(role, { name: 'Also logs' })).not.toBeInTheDocument();
			expect(warn).toHaveBeenCalledWith(
				`${component}: two items share a \`value\`, so only the first of them renders.`,
			);
		},
	);

	it('keeps one tab stop, on the checked card', () => {
		render(<RadioCards aria-label="Signal" items={ITEMS} defaultValue="metrics" />);

		expect(screen.getByRole('radio', { name: 'Metrics' })).toHaveAttribute('tabindex', '0');
		expect(screen.getByRole('radio', { name: 'Logs' })).toHaveAttribute('tabindex', '-1');
	});

	it('puts the tab stop on the first card that is not disabled when none is checked', () => {
		render(
			<RadioCards
				aria-label="Signal"
				items={[
					{ label: 'Logs', value: 'logs', disabled: true, disabledTooltip: 'No logs yet' },
					{ label: 'Traces', value: 'traces' },
				]}
			/>,
		);

		expect(screen.getByRole('radio', { name: 'Traces' })).toHaveAttribute('tabindex', '0');
		expect(screen.getByRole('radio', { name: 'Logs' })).toHaveAttribute('tabindex', '-1');
	});

	it('marks a disabled card without touching its peers', () => {
		render(
			<RadioCards
				aria-label="Signal"
				items={[
					{ label: 'Logs', value: 'logs', disabled: true, disabledTooltip: 'No logs yet' },
					{ label: 'Traces', value: 'traces' },
				]}
			/>,
		);

		const logs = screen.getByRole('radio', { name: 'Logs' });
		expect(logs).toHaveAttribute('aria-disabled', 'true');
		expect(logs).toHaveAttribute('data-disabled');
		expect(screen.getByRole('radio', { name: 'Traces' })).not.toHaveAttribute('data-disabled');
	});

	it('announces a disabled group and keeps it in the tab order', () => {
		render(
			<RadioCards
				aria-label="Signal"
				items={ITEMS}
				disabled
				disabledTooltip="Ask an admin"
				testId="signal"
			/>,
		);

		const root = screen.getByTestId('signal');
		expect(root).toHaveAttribute('aria-disabled', 'true');
		expect(root).toHaveAttribute('data-disabled');

		const logs = screen.getByRole('radio', { name: 'Logs' });
		expect(logs).not.toHaveAttribute('disabled');
		expect(logs).toHaveAttribute('aria-disabled', 'true');
		expect(screen.getAllByRole('radio').filter((radio) => radio.tabIndex === 0)).toHaveLength(1);
	});

	it('announces a read-only group', () => {
		render(
			<RadioCards
				aria-label="Signal"
				items={ITEMS}
				readOnly
				readOnlyTooltip="Saving"
				testId="signal"
			/>,
		);

		const root = screen.getByTestId('signal');
		expect(root).toHaveAttribute('aria-readonly', 'true');
		expect(root).toHaveAttribute('data-readonly');
		expect(screen.getByRole('radio', { name: 'Logs' })).toHaveAttribute('data-readonly');
	});

	it('treats disabled and readOnly together as readOnly', () => {
		render(
			<RadioCards
				aria-label="Signal"
				items={ITEMS}
				disabled
				disabledTooltip="Ask an admin"
				readOnly
				readOnlyTooltip="Saving"
				testId="signal"
			/>,
		);

		const root = screen.getByTestId('signal');
		expect(root).toHaveAttribute('data-readonly');
		expect(root).not.toHaveAttribute('data-disabled');
		expect(root).not.toHaveAttribute('aria-disabled');
	});

	it('announces required on the root', () => {
		render(<RadioCards aria-label="Signal" items={ITEMS} required testId="signal" />);

		expect(screen.getByTestId('signal')).toHaveAttribute('aria-required', 'true');
	});

	it('forwards aria and data attributes to the root', () => {
		render(
			<RadioCards
				aria-labelledby="question"
				aria-describedby="hint"
				data-analytics="signal-picker"
				id="signal-group"
				items={ITEMS}
				testId="signal"
			/>,
		);

		const root = screen.getByTestId('signal');
		expect(root).toHaveAttribute('aria-labelledby', 'question');
		expect(root).toHaveAttribute('aria-describedby', 'hint');
		expect(root).toHaveAttribute('data-analytics', 'signal-picker');
		expect(root).toHaveAttribute('id', 'signal-group');
	});

	it('drops a className or a style that gets past the types', () => {
		const props = { className: 'custom', style: { color: 'red' } } as object;
		render(<RadioCards aria-label="Signal" items={ITEMS} testId="signal" {...props} />);

		const root = screen.getByTestId('signal');
		expect(root).not.toHaveClass('custom');
		expect(root.style.color).toBe('');
	});
});

describe('RadioCards.Multiple rendering', () => {
	it('renders a named group with one checkbox per item', () => {
		render(<RadioCards.Multiple aria-label="Tools" items={ITEMS} testId="tools" />);

		const group = screen.getByRole('group', { name: 'Tools' });
		expect(group).toHaveAttribute('data-slot', 'radio-cards');
		expect(group).toHaveAttribute('data-multiple');
		expect(within(group).getAllByRole('checkbox')).toHaveLength(3);
		expect(screen.getByTestId('tools-item-logs')).toHaveAttribute('role', 'checkbox');
	});

	it('marks the check of the checked cards only', () => {
		render(
			<RadioCards.Multiple
				aria-label="Tools"
				items={ITEMS}
				defaultValue={['traces']}
				testId="tools"
			/>,
		);

		const traces = screen.getByTestId('tools-item-traces');
		expect(traces).toHaveAttribute('aria-checked', 'true');
		const check = traces.querySelector('[data-slot="radio-cards-item-indicator"]');
		expect(check).toHaveAttribute('aria-hidden', 'true');
		expect(check).toHaveAttribute('data-checked');
		expect(
			screen
				.getByTestId('tools-item-logs')
				.querySelector('[data-slot="radio-cards-item-indicator"]'),
		).toHaveAttribute('data-unchecked');
	});

	it('makes every card its own tab stop, except a disabled card', () => {
		render(
			<RadioCards.Multiple
				aria-label="Tools"
				items={[
					...ITEMS,
					{ label: 'Profiles', value: 'profiles', disabled: true, disabledTooltip: 'Soon' },
				]}
			/>,
		);

		expect(screen.getByRole('checkbox', { name: 'Logs' })).toHaveAttribute('tabindex', '0');
		expect(screen.getByRole('checkbox', { name: 'Traces' })).toHaveAttribute('tabindex', '0');
		expect(screen.getByRole('checkbox', { name: 'Profiles' })).toHaveAttribute('tabindex', '-1');
	});

	it('announces a disabled group on the root', () => {
		render(
			<RadioCards.Multiple
				aria-label="Tools"
				items={ITEMS}
				disabled
				disabledTooltip="Ask an admin"
				testId="tools"
			/>,
		);

		const root = screen.getByTestId('tools');
		expect(root).toHaveAttribute('aria-disabled', 'true');
		expect(root).toHaveAttribute('data-disabled');
	});

	it('announces required on every card while none is checked, never on the root', async () => {
		const user = userEvent.setup();
		render(<RadioCards.Multiple aria-label="Tools" items={ITEMS} required testId="tools" />);

		expect(screen.getByTestId('tools')).not.toHaveAttribute('aria-required');
		for (const card of screen.getAllByRole('checkbox')) {
			expect(card).toHaveAttribute('aria-required', 'true');
		}

		await user.click(screen.getByRole('checkbox', { name: 'Traces' }));

		for (const card of screen.getAllByRole('checkbox')) {
			expect(card).not.toHaveAttribute('aria-required');
		}
	});

	it.each([
		['with a reason', 'Ask an admin'],
		['without a reason', undefined],
	])('keeps the first card of a disabled group as its one tab stop, %s', (_, reason) => {
		render(
			<RadioCards.Multiple aria-label="Tools" items={ITEMS} disabled disabledTooltip={reason} />,
		);

		const [logs, ...rest] = screen.getAllByRole('checkbox');
		expect(logs).toHaveAttribute('tabindex', '0');
		for (const card of rest) {
			expect(card).toHaveAttribute('tabindex', '-1');
		}
		for (const card of screen.getAllByRole('checkbox')) {
			expect(card).toHaveAttribute('aria-disabled', 'true');
		}
	});

	it('announces a read-only group on every card, never on the root', () => {
		render(
			<RadioCards.Multiple
				aria-label="Tools"
				items={ITEMS}
				readOnly
				readOnlyTooltip="Saving"
				testId="tools"
			/>,
		);

		const root = screen.getByTestId('tools');
		expect(root).not.toHaveAttribute('aria-readonly');
		expect(root).toHaveAttribute('data-readonly');
		for (const card of screen.getAllByRole('checkbox')) {
			expect(card).toHaveAttribute('aria-readonly', 'true');
			expect(card).toHaveAttribute('data-readonly');
		}
	});

	it('warns and renders no card for an empty items', () => {
		const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
		render(<RadioCards.Multiple aria-label="Tools" items={[]} />);

		expect(screen.queryAllByRole('checkbox')).toHaveLength(0);
		expect(warn).toHaveBeenCalledWith('RadioCards.Multiple: `items` is empty, rendering no card.');
	});
});
