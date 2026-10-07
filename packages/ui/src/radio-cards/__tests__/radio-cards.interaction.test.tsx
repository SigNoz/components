import { fireEvent, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { RadioCards } from '../radio-cards.js';
import type { RadioCardsItemType } from '../types.js';
import { ITEMS } from './radio-cards.test-utils.js';

const ITEMS_WITH_A_DISABLED_ONE: RadioCardsItemType[] = [
	{ label: 'Logs', value: 'logs' },
	{ label: 'Traces', value: 'traces', disabled: true, disabledTooltip: 'No traces yet' },
	{ label: 'Metrics', value: 'metrics' },
];

afterEach(() => {
	vi.restoreAllMocks();
});

describe('RadioCards interaction', () => {
	it('checks a card on click and reports its value', async () => {
		const user = userEvent.setup();
		const onChange = vi.fn();
		render(<RadioCards aria-label="Signal" items={ITEMS} onChange={onChange} />);

		await user.click(screen.getByRole('radio', { name: 'Traces' }));

		expect(onChange).toHaveBeenCalledWith('traces');
		expect(screen.getByRole('radio', { name: 'Traces' })).toBeChecked();
	});

	it('checks the card from a click on its label or its icon', async () => {
		const user = userEvent.setup();
		const onChange = vi.fn();
		render(
			<RadioCards
				aria-label="Signal"
				items={[
					{ label: 'Logs', value: 'logs', prefix: <svg data-testid="logs-icon" /> },
					{ label: 'Traces', value: 'traces' },
				]}
				onChange={onChange}
			/>,
		);

		await user.click(screen.getByText('Traces'));
		expect(onChange).toHaveBeenLastCalledWith('traces');

		await user.click(screen.getByTestId('logs-icon'));
		expect(onChange).toHaveBeenLastCalledWith('logs');
	});

	it('changes nothing on a click on the checked card', async () => {
		const user = userEvent.setup();
		const onChange = vi.fn();
		render(
			<RadioCards aria-label="Signal" items={ITEMS} defaultValue="logs" onChange={onChange} />,
		);

		await user.click(screen.getByRole('radio', { name: 'Logs' }));

		expect(onChange).not.toHaveBeenCalled();
		expect(screen.getByRole('radio', { name: 'Logs' })).toBeChecked();
	});

	it('moves the focus and the check with the arrow keys, in the order of items', async () => {
		const user = userEvent.setup();
		const onChange = vi.fn();
		render(
			<RadioCards
				aria-label="Signal"
				items={ITEMS}
				columns={2}
				defaultValue="logs"
				onChange={onChange}
			/>,
		);

		await user.tab();
		await user.keyboard('{ArrowDown}');

		expect(onChange).toHaveBeenLastCalledWith('traces');
		expect(screen.getByRole('radio', { name: 'Traces' })).toHaveFocus();

		await user.keyboard('{ArrowRight}');
		expect(onChange).toHaveBeenLastCalledWith('metrics');

		await user.keyboard('{ArrowLeft}');
		expect(onChange).toHaveBeenLastCalledWith('traces');

		await user.keyboard('{ArrowUp}');
		expect(onChange).toHaveBeenLastCalledWith('logs');
	});

	it('wraps at both ends', async () => {
		const user = userEvent.setup();
		const onChange = vi.fn();
		render(
			<RadioCards aria-label="Signal" items={ITEMS} defaultValue="metrics" onChange={onChange} />,
		);

		await user.tab();
		await user.keyboard('{ArrowDown}');
		expect(onChange).toHaveBeenLastCalledWith('logs');

		await user.keyboard('{ArrowUp}');
		expect(onChange).toHaveBeenLastCalledWith('metrics');
	});

	it('skips a disabled card', async () => {
		const user = userEvent.setup();
		const onChange = vi.fn();
		render(
			<RadioCards
				aria-label="Signal"
				items={ITEMS_WITH_A_DISABLED_ONE}
				defaultValue="logs"
				onChange={onChange}
			/>,
		);

		await user.tab();
		await user.keyboard('{ArrowDown}');

		expect(onChange).toHaveBeenLastCalledWith('metrics');
		expect(screen.getByRole('radio', { name: 'Metrics' })).toHaveFocus();
	});

	it('does not check a disabled card on click', async () => {
		const user = userEvent.setup();
		const onChange = vi.fn();
		render(
			<RadioCards aria-label="Signal" items={ITEMS_WITH_A_DISABLED_ONE} onChange={onChange} />,
		);

		await user.click(screen.getByRole('radio', { name: 'Traces' }));

		expect(onChange).not.toHaveBeenCalled();
	});

	it('checks the focused card on Space when none is checked', async () => {
		const user = userEvent.setup();
		const onChange = vi.fn();
		render(<RadioCards aria-label="Signal" items={ITEMS} onChange={onChange} />);

		await user.tab();
		expect(screen.getByRole('radio', { name: 'Logs' })).toHaveFocus();

		await user.keyboard(' ');

		expect(onChange).toHaveBeenCalledWith('logs');
	});

	it('does nothing on Enter, and does not submit the owning form', async () => {
		const user = userEvent.setup();
		const onChange = vi.fn();
		const onSubmit = vi.fn((event: SubmitEvent) => event.preventDefault());
		render(
			<form
				onSubmit={(event) => onSubmit(event.nativeEvent as SubmitEvent)}
				aria-label="Signal form"
			>
				<RadioCards aria-label="Signal" items={ITEMS} onChange={onChange} />
				<button type="submit">Next</button>
			</form>,
		);

		await user.tab();
		await user.keyboard('{Enter}');

		expect(onChange).not.toHaveBeenCalled();
		expect(onSubmit).not.toHaveBeenCalled();
	});

	it('does nothing on Home and End', async () => {
		const user = userEvent.setup();
		const onChange = vi.fn();
		render(
			<RadioCards aria-label="Signal" items={ITEMS} defaultValue="traces" onChange={onChange} />,
		);

		await user.tab();
		await user.keyboard('{Home}{End}');

		expect(onChange).not.toHaveBeenCalled();
		expect(screen.getByRole('radio', { name: 'Traces' })).toHaveFocus();
	});

	it('leaves the group with Tab', async () => {
		const user = userEvent.setup();
		render(
			<>
				<RadioCards aria-label="Signal" items={ITEMS} />
				<button type="button">Next</button>
			</>,
		);

		await user.tab();
		await user.tab();

		expect(screen.getByRole('button', { name: 'Next' })).toHaveFocus();
	});

	it('keeps the arrow keys moving the focus while read-only, and changes nothing', async () => {
		const user = userEvent.setup();
		const onChange = vi.fn();
		render(
			<RadioCards
				aria-label="Signal"
				items={ITEMS}
				defaultValue="logs"
				readOnly
				readOnlyTooltip="Saving"
				onChange={onChange}
			/>,
		);

		await user.tab();
		await user.keyboard('{ArrowDown}');

		expect(screen.getByRole('radio', { name: 'Traces' })).toHaveFocus();
		expect(screen.getByRole('radio', { name: 'Logs' })).toBeChecked();
		expect(onChange).not.toHaveBeenCalled();

		await user.click(screen.getByRole('radio', { name: 'Metrics' }));
		expect(onChange).not.toHaveBeenCalled();
	});

	it('changes nothing while disabled', async () => {
		const user = userEvent.setup();
		const onChange = vi.fn();
		render(
			<RadioCards
				aria-label="Signal"
				items={ITEMS}
				defaultValue="logs"
				disabled
				disabledTooltip="Ask an admin"
				onChange={onChange}
			/>,
		);

		await user.click(screen.getByRole('radio', { name: 'Traces' }));
		await user.tab();
		await user.keyboard('{ArrowDown} ');

		expect(onChange).not.toHaveBeenCalled();
		expect(screen.getByRole('radio', { name: 'Logs' })).toBeChecked();
	});

	it('follows a controlled value, and clears with null', async () => {
		const user = userEvent.setup();

		function Controlled(): JSX.Element {
			const [value, setValue] = useState<string | null>('logs');

			return (
				<>
					<RadioCards aria-label="Signal" items={ITEMS} value={value} onChange={setValue} />
					<button type="button" onClick={() => setValue(null)}>
						Clear
					</button>
				</>
			);
		}

		render(<Controlled />);

		await user.click(screen.getByRole('radio', { name: 'Metrics' }));
		expect(screen.getByRole('radio', { name: 'Metrics' })).toBeChecked();

		await user.click(screen.getByRole('button', { name: 'Clear' }));
		for (const radio of screen.getAllByRole('radio')) {
			expect(radio).not.toBeChecked();
		}
	});

	it('stays controlled when value turns undefined, shows no card checked, and warns', () => {
		const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
		const { rerender } = render(
			<RadioCards aria-label="Signal" items={ITEMS} value="traces" defaultValue="metrics" />,
		);

		rerender(
			<RadioCards aria-label="Signal" items={ITEMS} value={undefined} defaultValue="metrics" />,
		);

		for (const radio of screen.getAllByRole('radio')) {
			expect(radio).not.toBeChecked();
		}
		expect(warn).toHaveBeenCalledWith(
			expect.stringContaining('RadioCards: `value` turned `undefined`'),
		);
	});

	it('ignores a value that appears on a group that started uncontrolled, and warns', async () => {
		const user = userEvent.setup();
		const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
		const { rerender } = render(<RadioCards aria-label="Signal" items={ITEMS} />);

		await user.click(screen.getByRole('radio', { name: 'Traces' }));
		rerender(<RadioCards aria-label="Signal" items={ITEMS} value="metrics" />);

		expect(screen.getByRole('radio', { name: 'Traces' })).toBeChecked();
		expect(warn).toHaveBeenCalledWith(
			expect.stringContaining('RadioCards: `value` was `undefined` on the first render'),
		);
	});

	it('keeps Space from scrolling the page on the tab stop of a disabled group', async () => {
		const user = userEvent.setup();
		render(
			<RadioCards aria-label="Signal" items={ITEMS} disabled disabledTooltip="Ask an admin" />,
		);

		await user.tab();
		const card = screen.getByRole('radio', { name: 'Logs' });
		expect(card).toHaveFocus();

		expect(fireEvent.keyDown(card, { key: ' ' })).toBe(false);
	});
});

describe('RadioCards allowClear', () => {
	it('unchecks the checked card on click and reports null', async () => {
		const user = userEvent.setup();
		const onChange = vi.fn();
		render(
			<RadioCards
				aria-label="Signal"
				items={ITEMS}
				defaultValue="logs"
				allowClear
				onChange={onChange}
			/>,
		);

		await user.click(screen.getByRole('radio', { name: 'Logs' }));

		expect(onChange).toHaveBeenCalledOnce();
		expect(onChange).toHaveBeenCalledWith(null);
		for (const radio of screen.getAllByRole('radio')) {
			expect(radio).not.toBeChecked();
		}

		await user.click(screen.getByRole('radio', { name: 'Traces' }));
		expect(onChange).toHaveBeenLastCalledWith('traces');
		expect(screen.getByRole('radio', { name: 'Traces' })).toBeChecked();
	});

	it('unchecks the focused card on Space, and checks it again', async () => {
		const user = userEvent.setup();
		const onChange = vi.fn();
		render(
			<RadioCards
				aria-label="Signal"
				items={ITEMS}
				defaultValue="traces"
				allowClear
				onChange={onChange}
			/>,
		);

		await user.tab();
		await user.keyboard(' ');

		expect(onChange).toHaveBeenLastCalledWith(null);
		expect(screen.getByRole('radio', { name: 'Traces' })).not.toBeChecked();
		expect(screen.getByRole('radio', { name: 'Traces' })).toHaveFocus();

		await user.keyboard(' ');
		expect(onChange).toHaveBeenLastCalledWith('traces');
		expect(screen.getByRole('radio', { name: 'Traces' })).toBeChecked();
	});

	it('hands null to a controlled group', async () => {
		const user = userEvent.setup();

		function Controlled(): JSX.Element {
			const [value, setValue] = useState<string | null>('metrics');

			return (
				<RadioCards
					aria-label="Signal"
					items={ITEMS}
					value={value}
					allowClear
					onChange={setValue}
				/>
			);
		}

		render(<Controlled />);

		await user.click(screen.getByRole('radio', { name: 'Metrics' }));

		for (const radio of screen.getAllByRole('radio')) {
			expect(radio).not.toBeChecked();
		}
	});

	it('leaves a controlled group checked until the call site writes null', async () => {
		const user = userEvent.setup();
		const onChange = vi.fn();
		render(
			<RadioCards aria-label="Signal" items={ITEMS} value="logs" allowClear onChange={onChange} />,
		);

		await user.click(screen.getByRole('radio', { name: 'Logs' }));

		expect(onChange).toHaveBeenCalledWith(null);
		expect(screen.getByRole('radio', { name: 'Logs' })).toBeChecked();
	});

	it('unchecks nothing while read-only or disabled', async () => {
		const user = userEvent.setup();
		const onChange = vi.fn();
		render(
			<>
				<RadioCards
					aria-label="Read-only"
					items={ITEMS}
					defaultValue="logs"
					allowClear
					readOnly
					readOnlyTooltip="Saving"
					onChange={onChange}
				/>
				<RadioCards
					aria-label="Disabled"
					items={ITEMS}
					defaultValue="logs"
					allowClear
					disabled
					disabledTooltip="Ask an admin"
					onChange={onChange}
				/>
			</>,
		);

		for (const name of ['Read-only', 'Disabled']) {
			const logs = within(screen.getByRole('radiogroup', { name })).getByRole('radio', {
				name: 'Logs',
			});
			await user.click(logs);
			await user.keyboard(' ');

			expect(logs).toBeChecked();
		}

		expect(onChange).not.toHaveBeenCalled();
	});

	it('does not uncheck a disabled card', async () => {
		const user = userEvent.setup();
		const onChange = vi.fn();
		render(
			<RadioCards
				aria-label="Signal"
				items={ITEMS_WITH_A_DISABLED_ONE}
				defaultValue="traces"
				allowClear
				onChange={onChange}
			/>,
		);

		await user.click(screen.getByRole('radio', { name: 'Traces' }));

		expect(onChange).not.toHaveBeenCalled();
		expect(screen.getByRole('radio', { name: 'Traces' })).toBeChecked();
	});

	it('keeps the arrow keys checking the card they land on', async () => {
		const user = userEvent.setup();
		const onChange = vi.fn();
		render(
			<RadioCards
				aria-label="Signal"
				items={ITEMS}
				defaultValue="logs"
				allowClear
				onChange={onChange}
			/>,
		);

		await user.tab();
		await user.keyboard('{ArrowDown}');

		expect(onChange).toHaveBeenLastCalledWith('traces');
		expect(screen.getByRole('radio', { name: 'Traces' })).toBeChecked();
	});
});

describe('RadioCards.Multiple interaction', () => {
	it('checks and unchecks a card on click, and reports the list', async () => {
		const user = userEvent.setup();
		const onChange = vi.fn();
		render(
			<RadioCards.Multiple
				aria-label="Tools"
				items={ITEMS}
				defaultValue={['logs']}
				onChange={onChange}
			/>,
		);

		await user.click(screen.getByRole('checkbox', { name: 'Metrics' }));
		expect(onChange).toHaveBeenLastCalledWith(['logs', 'metrics']);

		await user.click(screen.getByRole('checkbox', { name: 'Logs' }));
		expect(onChange).toHaveBeenLastCalledWith(['metrics']);
		expect(screen.getByRole('checkbox', { name: 'Logs' })).not.toBeChecked();
	});

	it('toggles the focused card on Space', async () => {
		const user = userEvent.setup();
		const onChange = vi.fn();
		render(
			<RadioCards.Multiple
				aria-label="Tools"
				items={ITEMS}
				defaultValue={['traces']}
				onChange={onChange}
			/>,
		);

		await user.tab();
		await user.keyboard(' ');
		// In the order of `items`, not the order the cards were checked in.
		expect(onChange).toHaveBeenLastCalledWith(['logs', 'traces']);

		await user.keyboard(' ');
		expect(onChange).toHaveBeenLastCalledWith(['traces']);
	});

	it('keeps the last checked card, on click and on Space', async () => {
		const user = userEvent.setup();
		const onChange = vi.fn();
		render(
			<RadioCards.Multiple
				aria-label="Tools"
				items={ITEMS}
				defaultValue={['logs']}
				onChange={onChange}
			/>,
		);

		await user.click(screen.getByRole('checkbox', { name: 'Logs' }));
		await user.keyboard(' ');

		expect(onChange).not.toHaveBeenCalled();
		expect(screen.getByRole('checkbox', { name: 'Logs' })).toBeChecked();
	});

	it('starts empty without allowClear, and then keeps one card', async () => {
		const user = userEvent.setup();
		const onChange = vi.fn();
		render(<RadioCards.Multiple aria-label="Tools" items={ITEMS} onChange={onChange} />);

		await user.tab();
		await user.keyboard(' ');
		expect(onChange).toHaveBeenLastCalledWith(['logs']);

		await user.keyboard(' ');
		expect(onChange).toHaveBeenCalledOnce();
		expect(screen.getByRole('checkbox', { name: 'Logs' })).toBeChecked();
	});

	it('reports the empty list once allowClear unchecks the last card', async () => {
		const user = userEvent.setup();
		const onChange = vi.fn();
		render(
			<RadioCards.Multiple
				aria-label="Tools"
				items={ITEMS}
				defaultValue={['logs']}
				allowClear
				onChange={onChange}
			/>,
		);

		await user.click(screen.getByRole('checkbox', { name: 'Logs' }));

		expect(onChange).toHaveBeenCalledWith([]);
		expect(screen.getByRole('checkbox', { name: 'Logs' })).not.toBeChecked();
	});

	it.each([
		['a value that matches no item', ITEMS, ['newrelic', 'logs']],
		['a checked card that is disabled', ITEMS_WITH_A_DISABLED_ONE, ['traces', 'logs']],
	])('keeps the last card without allowClear, not counting %s', async (_, items, defaultValue) => {
		const user = userEvent.setup();
		const onChange = vi.fn();
		render(
			<RadioCards.Multiple
				aria-label="Tools"
				items={items}
				defaultValue={defaultValue}
				onChange={onChange}
			/>,
		);

		await user.click(screen.getByRole('checkbox', { name: 'Logs' }));

		expect(onChange).not.toHaveBeenCalled();
		expect(screen.getByRole('checkbox', { name: 'Logs' })).toBeChecked();
	});

	it('walks the cards with Tab, skipping a disabled one', async () => {
		const user = userEvent.setup();
		render(
			<RadioCards.Multiple
				aria-label="Tools"
				items={[
					{ label: 'Logs', value: 'logs' },
					{ label: 'Traces', value: 'traces', disabled: true, disabledTooltip: 'Soon' },
					{ label: 'Metrics', value: 'metrics' },
				]}
			/>,
		);

		await user.tab();
		expect(screen.getByRole('checkbox', { name: 'Logs' })).toHaveFocus();

		await user.tab();
		expect(screen.getByRole('checkbox', { name: 'Metrics' })).toHaveFocus();
	});

	it('does nothing on the arrows, Enter, Home and End, and does not submit the form', async () => {
		const user = userEvent.setup();
		const onChange = vi.fn();
		const onSubmit = vi.fn((event: SubmitEvent) => event.preventDefault());
		render(
			<form
				onSubmit={(event) => onSubmit(event.nativeEvent as SubmitEvent)}
				aria-label="Tools form"
			>
				<RadioCards.Multiple aria-label="Tools" items={ITEMS} onChange={onChange} />
				<button type="submit">Next</button>
			</form>,
		);

		await user.tab();
		await user.keyboard('{ArrowDown}{ArrowRight}{Home}{End}{Enter}');

		expect(onChange).not.toHaveBeenCalled();
		expect(screen.getByRole('checkbox', { name: 'Logs' })).toHaveFocus();
		await Promise.resolve();
		expect(onSubmit).not.toHaveBeenCalled();
	});

	it('changes nothing while read-only, and the focus still moves', async () => {
		const user = userEvent.setup();
		const onChange = vi.fn();
		render(
			<RadioCards.Multiple
				aria-label="Tools"
				items={ITEMS}
				defaultValue={['logs']}
				readOnly
				readOnlyTooltip="Saving"
				onChange={onChange}
			/>,
		);

		await user.click(screen.getByRole('checkbox', { name: 'Traces' }));
		await user.keyboard(' ');
		await user.tab();

		expect(onChange).not.toHaveBeenCalled();
		expect(screen.getByRole('checkbox', { name: 'Logs' })).toBeChecked();
		expect(screen.getByRole('checkbox', { name: 'Traces' })).not.toBeChecked();
		expect(screen.getByRole('checkbox', { name: 'Metrics' })).toHaveFocus();
	});

	it('changes nothing while disabled', async () => {
		const user = userEvent.setup();
		const onChange = vi.fn();
		render(
			<RadioCards.Multiple
				aria-label="Tools"
				items={ITEMS}
				disabled
				disabledTooltip="Ask an admin"
				onChange={onChange}
			/>,
		);

		await user.click(screen.getByRole('checkbox', { name: 'Logs' }));
		await user.tab();
		await user.keyboard(' ');

		expect(onChange).not.toHaveBeenCalled();
	});

	it('keeps the first card the one tab stop while disabled', async () => {
		const user = userEvent.setup();
		render(
			<>
				<RadioCards.Multiple
					aria-label="Tools"
					items={ITEMS}
					disabled
					disabledTooltip="Ask an admin"
				/>
				<button type="button">Next</button>
			</>,
		);

		await user.tab();
		expect(screen.getByRole('checkbox', { name: 'Logs' })).toHaveFocus();

		await user.tab();
		expect(screen.getByRole('button', { name: 'Next' })).toHaveFocus();
	});

	it('keeps Space from scrolling the page on the tab stop of a disabled group', async () => {
		const user = userEvent.setup();
		render(
			<RadioCards.Multiple
				aria-label="Tools"
				items={ITEMS}
				disabled
				disabledTooltip="Ask an admin"
			/>,
		);

		await user.tab();
		const card = screen.getByRole('checkbox', { name: 'Logs' });
		expect(card).toHaveFocus();

		expect(fireEvent.keyDown(card, { key: ' ' })).toBe(false);
	});

	it('stays controlled when value turns undefined, shows no card checked, and warns', () => {
		const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
		const { rerender } = render(
			<RadioCards.Multiple
				aria-label="Tools"
				items={ITEMS}
				value={['traces']}
				defaultValue={['metrics']}
			/>,
		);

		rerender(
			<RadioCards.Multiple
				aria-label="Tools"
				items={ITEMS}
				value={undefined}
				defaultValue={['metrics']}
			/>,
		);

		for (const checkbox of screen.getAllByRole('checkbox')) {
			expect(checkbox).not.toBeChecked();
		}
		expect(warn).toHaveBeenCalledWith(
			expect.stringContaining('RadioCards.Multiple: `value` turned `undefined`'),
		);
	});

	it('ignores a value that appears on a group that started uncontrolled, and warns', async () => {
		const user = userEvent.setup();
		const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
		const { rerender } = render(<RadioCards.Multiple aria-label="Tools" items={ITEMS} />);

		await user.click(screen.getByRole('checkbox', { name: 'Traces' }));
		rerender(<RadioCards.Multiple aria-label="Tools" items={ITEMS} value={['metrics']} />);

		expect(screen.getByRole('checkbox', { name: 'Traces' })).toBeChecked();
		expect(screen.getByRole('checkbox', { name: 'Metrics' })).not.toBeChecked();
		expect(warn).toHaveBeenCalledWith(
			expect.stringContaining('RadioCards.Multiple: `value` was `undefined` on the first render'),
		);
	});

	it('follows a controlled value', async () => {
		const user = userEvent.setup();

		function Controlled(): JSX.Element {
			const [value, setValue] = useState<string[]>(['traces']);

			return (
				<RadioCards.Multiple aria-label="Tools" items={ITEMS} value={value} onChange={setValue} />
			);
		}

		render(<Controlled />);

		await user.click(screen.getByRole('checkbox', { name: 'Logs' }));

		expect(screen.getByRole('checkbox', { name: 'Logs' })).toBeChecked();
		expect(screen.getByRole('checkbox', { name: 'Traces' })).toBeChecked();
	});

	it.each([
		['controlled', true],
		['uncontrolled', false],
	])('checks a card whose value is an empty string, %s', async (_, isControlled) => {
		const user = userEvent.setup();
		const items: RadioCardsItemType[] = [...ITEMS, { label: 'None', value: '' }];

		function Group(): JSX.Element {
			const [value, setValue] = useState<string[]>([]);

			return isControlled ? (
				<RadioCards.Multiple aria-label="Tools" items={items} value={value} onChange={setValue} />
			) : (
				<RadioCards.Multiple aria-label="Tools" items={items} />
			);
		}

		render(<Group />);

		await user.click(screen.getByRole('checkbox', { name: 'None' }));

		expect(screen.getByRole('checkbox', { name: 'None' })).toBeChecked();
	});
});
