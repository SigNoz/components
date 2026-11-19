import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { Collapse } from '../collapse.js';
import { GROUP_ITEMS } from './collapse.test-utils.js';

afterEach(() => {
	vi.restoreAllMocks();
});

function expanded(name: string): string | null {
	return screen.getByRole('button', { name }).getAttribute('aria-expanded');
}

function ControlledGroup({
	initial,
	onChange,
}: {
	initial: string[];
	onChange?: (value: string[]) => void;
}) {
	const [value, setValue] = useState(initial);

	return (
		<Collapse.Group
			variant="outlined"
			size="sm"
			testId="g"
			items={GROUP_ITEMS}
			value={value}
			onChange={(next: string[]) => {
				onChange?.(next);
				setValue(next);
			}}
		/>
	);
}

describe('Collapse.Group uncontrolled', () => {
	it('opens the items of defaultValue and no other', () => {
		render(
			<Collapse.Group
				variant="outlined"
				size="sm"
				items={GROUP_ITEMS}
				defaultValue={['logs', 'metrics']}
			/>,
		);

		expect(expanded('Logs')).toBe('true');
		expect(expanded('Traces')).toBe('false');
		expect(expanded('Metrics')).toBe('true');
	});

	it('opens an item on a press, and reports the new list', async () => {
		const user = userEvent.setup();
		const onChange = vi.fn();

		render(
			<Collapse.Group
				variant="outlined"
				size="sm"
				items={GROUP_ITEMS}
				defaultValue={[]}
				onChange={onChange}
			/>,
		);

		await user.click(screen.getByRole('button', { name: 'Traces' }));

		expect(onChange).toHaveBeenCalledTimes(1);
		expect(onChange).toHaveBeenCalledWith(['traces']);
		expect(expanded('Traces')).toBe('true');
		expect(screen.getByRole('region', { name: 'Traces' })).toHaveTextContent('Traces body');
	});

	it('closes an item on a second press, and reports the list without it', async () => {
		const user = userEvent.setup();
		const onChange = vi.fn();

		render(
			<Collapse.Group
				variant="outlined"
				size="sm"
				items={GROUP_ITEMS}
				defaultValue={['logs', 'traces']}
				onChange={onChange}
			/>,
		);

		await user.click(screen.getByRole('button', { name: 'Logs' }));

		expect(onChange).toHaveBeenLastCalledWith(['traces']);
		expect(expanded('Logs')).toBe('false');
		expect(expanded('Traces')).toBe('true');
	});

	it('never closes another item when one opens', async () => {
		const user = userEvent.setup();

		render(<Collapse.Group variant="outlined" size="sm" items={GROUP_ITEMS} defaultValue={[]} />);

		await user.click(screen.getByRole('button', { name: 'Logs' }));
		await user.click(screen.getByRole('button', { name: 'Traces' }));
		await user.click(screen.getByRole('button', { name: 'Metrics' }));

		expect(expanded('Logs')).toBe('true');
		expect(expanded('Traces')).toBe('true');
		expect(expanded('Metrics')).toBe('true');
	});

	it('works without an onChange', async () => {
		const user = userEvent.setup();

		render(<Collapse.Group variant="outlined" size="sm" items={GROUP_ITEMS} defaultValue={[]} />);

		await user.click(screen.getByRole('button', { name: 'Logs' }));

		expect(expanded('Logs')).toBe('true');
	});

	it('opens the item with data-expanded and drops it again on close', async () => {
		const user = userEvent.setup();

		render(
			<Collapse.Group
				variant="outlined"
				size="sm"
				testId="g"
				items={GROUP_ITEMS}
				defaultValue={[]}
			/>,
		);

		await user.click(screen.getByRole('button', { name: 'Logs' }));
		expect(screen.getByTestId('g-item-logs')).toHaveAttribute('data-expanded');

		await user.click(screen.getByRole('button', { name: 'Logs' }));
		expect(screen.getByTestId('g-item-logs')).not.toHaveAttribute('data-expanded');
	});
});

describe('Collapse.Group onChange order', () => {
	it('follows the order of items, not the order of the presses', async () => {
		const user = userEvent.setup();
		const onChange = vi.fn();

		render(
			<Collapse.Group
				variant="outlined"
				size="sm"
				items={GROUP_ITEMS}
				defaultValue={[]}
				onChange={onChange}
			/>,
		);

		await user.click(screen.getByRole('button', { name: 'Metrics' }));
		expect(onChange).toHaveBeenLastCalledWith(['metrics']);

		await user.click(screen.getByRole('button', { name: 'Logs' }));
		expect(onChange).toHaveBeenLastCalledWith(['logs', 'metrics']);

		await user.click(screen.getByRole('button', { name: 'Traces' }));
		expect(onChange).toHaveBeenLastCalledWith(['logs', 'traces', 'metrics']);
	});

	it('follows the order of items even when defaultValue lists them another way', async () => {
		const user = userEvent.setup();
		const onChange = vi.fn();

		render(
			<Collapse.Group
				variant="outlined"
				size="sm"
				items={GROUP_ITEMS}
				defaultValue={['metrics', 'logs']}
				onChange={onChange}
			/>,
		);

		await user.click(screen.getByRole('button', { name: 'Traces' }));

		expect(onChange).toHaveBeenLastCalledWith(['logs', 'traces', 'metrics']);
	});

	it('keeps a value that matches no item after the items, in the order it came', async () => {
		const user = userEvent.setup();
		const onChange = vi.fn();

		render(
			<Collapse.Group
				variant="outlined"
				size="sm"
				items={GROUP_ITEMS}
				defaultValue={['zzz', 'yyy']}
				onChange={onChange}
			/>,
		);

		await user.click(screen.getByRole('button', { name: 'Metrics' }));
		expect(onChange).toHaveBeenLastCalledWith(['metrics', 'zzz', 'yyy']);

		await user.click(screen.getByRole('button', { name: 'Logs' }));
		expect(onChange).toHaveBeenLastCalledWith(['logs', 'metrics', 'zzz', 'yyy']);

		await user.click(screen.getByRole('button', { name: 'Metrics' }));
		expect(onChange).toHaveBeenLastCalledWith(['logs', 'zzz', 'yyy']);
	});

	it('opens no item for a value that matches none', () => {
		render(
			<Collapse.Group variant="outlined" size="sm" items={GROUP_ITEMS} defaultValue={['zzz']} />,
		);

		for (const { title } of GROUP_ITEMS) {
			expect(expanded(title)).toBe('false');
		}
	});

	it('hands onChange a fresh array each time', async () => {
		const user = userEvent.setup();
		const onChange = vi.fn();
		const defaultValue = ['logs'];

		render(
			<Collapse.Group
				variant="outlined"
				size="sm"
				items={GROUP_ITEMS}
				defaultValue={defaultValue}
				onChange={onChange}
			/>,
		);

		await user.click(screen.getByRole('button', { name: 'Traces' }));

		expect(onChange.mock.calls[0]?.[0]).not.toBe(defaultValue);
		expect(defaultValue).toEqual(['logs']);
	});
});

describe('Collapse.Group controlled', () => {
	it('follows value, and [] collapses every item', () => {
		const { rerender } = render(
			<Collapse.Group
				variant="outlined"
				size="sm"
				items={GROUP_ITEMS}
				value={['logs']}
				onChange={vi.fn()}
			/>,
		);

		expect(expanded('Logs')).toBe('true');
		expect(expanded('Traces')).toBe('false');

		rerender(
			<Collapse.Group
				variant="outlined"
				size="sm"
				items={GROUP_ITEMS}
				value={['traces', 'metrics']}
				onChange={vi.fn()}
			/>,
		);

		expect(expanded('Logs')).toBe('false');
		expect(expanded('Traces')).toBe('true');
		expect(expanded('Metrics')).toBe('true');

		rerender(
			<Collapse.Group
				variant="outlined"
				size="sm"
				items={GROUP_ITEMS}
				value={[]}
				onChange={vi.fn()}
			/>,
		);

		for (const { title } of GROUP_ITEMS) {
			expect(expanded(title)).toBe('false');
		}
	});

	it('reports the press but does not change until the parent does', async () => {
		const user = userEvent.setup();
		const onChange = vi.fn();

		render(
			<Collapse.Group
				variant="outlined"
				size="sm"
				items={GROUP_ITEMS}
				value={['logs']}
				onChange={onChange}
			/>,
		);

		await user.click(screen.getByRole('button', { name: 'Traces' }));

		expect(onChange).toHaveBeenCalledWith(['logs', 'traces']);
		expect(expanded('Traces')).toBe('false');
		expect(expanded('Logs')).toBe('true');
	});

	it('reports a value that matches no item after the items', async () => {
		const user = userEvent.setup();
		const onChange = vi.fn();

		render(
			<Collapse.Group
				variant="outlined"
				size="sm"
				items={GROUP_ITEMS}
				value={['zzz']}
				onChange={onChange}
			/>,
		);

		await user.click(screen.getByRole('button', { name: 'Logs' }));

		expect(onChange).toHaveBeenCalledWith(['logs', 'zzz']);
	});

	it('follows a parent that holds the state', async () => {
		const user = userEvent.setup();
		const onChange = vi.fn();

		render(<ControlledGroup initial={['metrics']} onChange={onChange} />);

		await user.click(screen.getByRole('button', { name: 'Logs' }));
		expect(onChange).toHaveBeenLastCalledWith(['logs', 'metrics']);
		expect(expanded('Logs')).toBe('true');
		expect(expanded('Metrics')).toBe('true');

		await user.click(screen.getByRole('button', { name: 'Metrics' }));
		expect(onChange).toHaveBeenLastCalledWith(['logs']);
		expect(expanded('Metrics')).toBe('false');
		expect(onChange).toHaveBeenCalledTimes(2);
	});

	it('does not call onChange when value changes from the outside', async () => {
		const onChange = vi.fn();
		const { rerender } = render(
			<Collapse.Group
				variant="outlined"
				size="sm"
				items={GROUP_ITEMS}
				value={[]}
				onChange={onChange}
			/>,
		);

		rerender(
			<Collapse.Group
				variant="outlined"
				size="sm"
				items={GROUP_ITEMS}
				value={['logs', 'traces']}
				onChange={onChange}
			/>,
		);
		rerender(
			<Collapse.Group
				variant="outlined"
				size="sm"
				items={GROUP_ITEMS}
				value={[]}
				onChange={onChange}
			/>,
		);

		await waitFor(() => expect(expanded('Logs')).toBe('false'));
		expect(onChange).not.toHaveBeenCalled();
	});

	it('stays controlled when value turns undefined, and shows no item open', () => {
		const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
		const { rerender } = render(
			<Collapse.Group
				variant="outlined"
				size="sm"
				items={GROUP_ITEMS}
				value={['logs']}
				onChange={vi.fn()}
			/>,
		);

		expect(warn).not.toHaveBeenCalled();

		rerender(
			<Collapse.Group
				variant="outlined"
				size="sm"
				items={GROUP_ITEMS}
				value={undefined}
				onChange={vi.fn()}
			/>,
		);

		for (const { title } of GROUP_ITEMS) {
			expect(expanded(title)).toBe('false');
		}

		expect(warn).not.toHaveBeenCalled();
	});

	it('follows a value that appears on a group that started uncontrolled, and warns', async () => {
		const user = userEvent.setup();
		const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
		const onChange = vi.fn();
		const { rerender } = render(
			<Collapse.Group variant="outlined" size="sm" items={GROUP_ITEMS} defaultValue={[]} />,
		);

		await user.click(screen.getByRole('button', { name: 'Traces' }));
		expect(warn).not.toHaveBeenCalled();

		rerender(
			<Collapse.Group
				variant="outlined"
				size="sm"
				items={GROUP_ITEMS}
				value={['logs']}
				onChange={onChange}
			/>,
		);

		expect(expanded('Traces')).toBe('false');
		expect(expanded('Logs')).toBe('true');
		expect(warn).toHaveBeenCalledWith(
			expect.stringContaining(
				'Collapse.Group: `value` was `undefined` on the first render and is set now',
			),
		);

		await user.click(screen.getByRole('button', { name: 'Traces' }));

		expect(onChange).toHaveBeenCalled();
		expect(expanded('Traces')).toBe('false');
	});

	it('does not warn for a group that stays controlled or uncontrolled', async () => {
		const user = userEvent.setup();
		const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});

		render(
			<>
				<ControlledGroup initial={[]} />
				<Collapse.Group variant="outlined" size="sm" items={GROUP_ITEMS} defaultValue={[]} />
			</>,
		);

		await user.click(screen.getAllByRole('button', { name: 'Logs' })[0] as HTMLElement);
		await user.click(screen.getAllByRole('button', { name: 'Logs' })[1] as HTMLElement);

		expect(warn).not.toHaveBeenCalled();
	});
});

describe('Collapse.Group duplicate values', () => {
	const items = [
		{ value: 'a', title: 'First', children: 'First body' },
		{ value: 'b', title: 'Other', children: 'Other body' },
		{ value: 'a', title: 'Second', children: 'Second body' },
	];

	it('warns once on mount', () => {
		const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});

		render(<Collapse.Group variant="outlined" size="sm" items={items} defaultValue={[]} />);

		expect(warn).toHaveBeenCalledTimes(1);
		expect(warn).toHaveBeenCalledWith(expect.stringContaining('Collapse.Group'));
	});

	it('toggles the first item for the shared value', async () => {
		const user = userEvent.setup();
		vi.spyOn(console, 'warn').mockImplementation(() => {});
		const onChange = vi.fn();

		render(
			<Collapse.Group
				variant="outlined"
				size="sm"
				testId="g"
				items={items}
				defaultValue={[]}
				onChange={onChange}
			/>,
		);

		await user.click(screen.getByRole('button', { name: 'First' }));

		expect(onChange).toHaveBeenCalledWith(['a']);
		expect(screen.getByTestId('g-item-a-panel')).toHaveTextContent('First body');
		expect(screen.queryByText('Second body')).not.toBeInTheDocument();
	});

	it('warns when a duplicate appears after the first render', () => {
		const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
		const { rerender } = render(
			<Collapse.Group variant="outlined" size="sm" items={items.slice(0, 2)} defaultValue={[]} />,
		);

		expect(warn).not.toHaveBeenCalled();

		rerender(<Collapse.Group variant="outlined" size="sm" items={items} defaultValue={[]} />);

		expect(warn).toHaveBeenCalledTimes(1);
	});
});

describe('Collapse.Group items that change', () => {
	it('renders an item added later, closed', () => {
		const { rerender } = render(
			<Collapse.Group
				variant="outlined"
				size="sm"
				items={GROUP_ITEMS.slice(0, 2)}
				defaultValue={['logs']}
			/>,
		);

		rerender(
			<Collapse.Group variant="outlined" size="sm" items={GROUP_ITEMS} defaultValue={['logs']} />,
		);

		expect(expanded('Metrics')).toBe('false');
		expect(expanded('Logs')).toBe('true');
	});

	it('moves with the items when they are reordered, keeping what is open', () => {
		const { rerender } = render(
			<Collapse.Group variant="outlined" size="sm" items={GROUP_ITEMS} defaultValue={['logs']} />,
		);

		rerender(
			<Collapse.Group
				variant="outlined"
				size="sm"
				items={[...GROUP_ITEMS].reverse()}
				defaultValue={['logs']}
			/>,
		);

		expect(screen.getAllByRole('button').map((button) => button.textContent)).toEqual([
			'Metrics',
			'Traces',
			'Logs',
		]);
		expect(expanded('Logs')).toBe('true');
	});
});
