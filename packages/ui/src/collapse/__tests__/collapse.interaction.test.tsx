import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { Collapse } from '../collapse.js';
import { GROUP_ITEMS } from './collapse.test-utils.js';

const icon = <svg data-testid="icon" />;

afterEach(() => {
	vi.restoreAllMocks();
});

function Controlled({
	initial,
	onExpandedChange,
}: {
	initial: boolean;
	onExpandedChange?: (expanded: boolean) => void;
}) {
	const [expanded, setExpanded] = useState(initial);

	return (
		<Collapse
			variant="outlined"
			size="sm"
			testId="c"
			title="Advanced"
			expanded={expanded}
			onExpandedChange={(next: boolean) => {
				onExpandedChange?.(next);
				setExpanded(next);
			}}
		>
			Body
		</Collapse>
	);
}

describe('Collapse uncontrolled', () => {
	it.each([true, false])('starts with defaultExpanded %s', (defaultExpanded) => {
		render(
			<Collapse
				variant="outlined"
				size="sm"
				testId="c"
				title="Advanced"
				defaultExpanded={defaultExpanded}
			>
				Body
			</Collapse>,
		);

		expect(screen.getByTestId('c-toggle')).toHaveAttribute(
			'aria-expanded',
			String(defaultExpanded),
		);
		expect(screen.queryByTestId('c-panel') !== null).toBe(defaultExpanded);
	});

	it('opens and closes on a press of the header button, and reports each change', async () => {
		const user = userEvent.setup();
		const onExpandedChange = vi.fn();

		render(
			<Collapse
				variant="outlined"
				size="sm"
				testId="c"
				title="Advanced"
				defaultExpanded={false}
				onExpandedChange={onExpandedChange}
			>
				Body
			</Collapse>,
		);

		await user.click(screen.getByRole('button', { name: 'Advanced' }));

		expect(onExpandedChange).toHaveBeenCalledTimes(1);
		expect(onExpandedChange).toHaveBeenLastCalledWith(true);
		expect(screen.getByTestId('c-toggle')).toHaveAttribute('aria-expanded', 'true');
		expect(screen.getByTestId('c')).toHaveAttribute('data-expanded');
		expect(screen.getByRole('region', { name: 'Advanced' })).toHaveTextContent('Body');

		await user.click(screen.getByRole('button', { name: 'Advanced' }));

		expect(onExpandedChange).toHaveBeenCalledTimes(2);
		expect(onExpandedChange).toHaveBeenLastCalledWith(false);
		expect(screen.getByTestId('c-toggle')).toHaveAttribute('aria-expanded', 'false');
		expect(screen.getByTestId('c')).not.toHaveAttribute('data-expanded');
	});

	it('works without an onExpandedChange', async () => {
		const user = userEvent.setup();

		render(
			<Collapse variant="outlined" size="sm" testId="c" title="Advanced" defaultExpanded={false}>
				Body
			</Collapse>,
		);

		await user.click(screen.getByTestId('c-toggle'));

		expect(screen.getByTestId('c-toggle')).toHaveAttribute('aria-expanded', 'true');
	});

	it('toggles from a click anywhere in the header button', async () => {
		const user = userEvent.setup();
		const onExpandedChange = vi.fn();

		const { container } = render(
			<Collapse
				variant="outlined"
				size="sm"
				testId="c"
				title="Advanced"
				description="More settings"
				prefix={icon}
				defaultExpanded={false}
				onExpandedChange={onExpandedChange}
			>
				Body
			</Collapse>,
		);

		const chevron = container.querySelector('[data-slot="collapse-chevron"]') as HTMLElement;
		const parts = [
			chevron,
			screen.getByTestId('c-prefix'),
			screen.getByTestId('c-title'),
			screen.getByTestId('c-description'),
			screen.getByTestId('c-toggle'),
		];

		for (const [index, part] of parts.entries()) {
			await user.click(part);

			expect(onExpandedChange).toHaveBeenCalledTimes(index + 1);
			expect(screen.getByTestId('c-toggle')).toHaveAttribute(
				'aria-expanded',
				String(index % 2 === 0),
			);
		}
	});

	it('does not toggle from a click in the panel', async () => {
		const user = userEvent.setup();
		const onExpandedChange = vi.fn();

		render(
			<Collapse
				variant="outlined"
				size="sm"
				testId="c"
				title="Advanced"
				defaultExpanded
				onExpandedChange={onExpandedChange}
			>
				Body
			</Collapse>,
		);

		await user.click(screen.getByTestId('c-panel'));

		expect(onExpandedChange).not.toHaveBeenCalled();
		expect(screen.getByTestId('c-toggle')).toHaveAttribute('aria-expanded', 'true');
	});
});

describe('Collapse header suffix', () => {
	it('does not toggle on a click on its controls, and reaches their own handlers', async () => {
		const user = userEvent.setup();
		const onExpandedChange = vi.fn();
		const onEdit = vi.fn();

		render(
			<Collapse
				variant="outlined"
				size="sm"
				testId="c"
				title="Advanced"
				headerSuffix={
					<button type="button" onClick={onEdit}>
						Edit
					</button>
				}
				defaultExpanded={false}
				onExpandedChange={onExpandedChange}
			>
				Body
			</Collapse>,
		);

		await user.click(screen.getByRole('button', { name: 'Edit' }));

		expect(onEdit).toHaveBeenCalledTimes(1);
		expect(onExpandedChange).not.toHaveBeenCalled();
		expect(screen.getByTestId('c-toggle')).toHaveAttribute('aria-expanded', 'false');
	});

	it('does not toggle on a click in the suffix area outside its controls', async () => {
		const user = userEvent.setup();
		const onExpandedChange = vi.fn();

		render(
			<Collapse
				variant="outlined"
				size="sm"
				testId="c"
				title="Advanced"
				headerSuffix={<span>Saved</span>}
				defaultExpanded={false}
				onExpandedChange={onExpandedChange}
			>
				Body
			</Collapse>,
		);

		await user.click(screen.getByTestId('c-header-suffix'));
		await user.click(screen.getByText('Saved'));

		expect(onExpandedChange).not.toHaveBeenCalled();
		expect(screen.getByTestId('c-toggle')).toHaveAttribute('aria-expanded', 'false');
	});

	it('does not toggle on a keypress in a suffix control while open', async () => {
		const user = userEvent.setup();

		render(
			<Collapse
				variant="outlined"
				size="sm"
				testId="c"
				title="Advanced"
				headerSuffix={<button type="button">Edit</button>}
				defaultExpanded
			>
				Body
			</Collapse>,
		);

		screen.getByRole('button', { name: 'Edit' }).focus();
		await user.keyboard('{Enter}');
		await user.keyboard(' ');

		expect(screen.getByTestId('c-toggle')).toHaveAttribute('aria-expanded', 'true');
	});
});

describe('Collapse keyboard', () => {
	it('is one tab stop, and Enter toggles it with the focus kept on the button', async () => {
		const user = userEvent.setup();
		const onExpandedChange = vi.fn();

		render(
			<Collapse
				variant="outlined"
				size="sm"
				testId="c"
				title="Advanced"
				defaultExpanded={false}
				onExpandedChange={onExpandedChange}
			>
				Body
			</Collapse>,
		);

		await user.tab();
		const toggle = screen.getByRole('button', { name: 'Advanced' });

		expect(toggle).toHaveFocus();

		await user.keyboard('{Enter}');

		expect(toggle).toHaveAttribute('aria-expanded', 'true');
		expect(toggle).toHaveFocus();
		expect(onExpandedChange).toHaveBeenLastCalledWith(true);

		await user.keyboard('{Enter}');

		expect(toggle).toHaveAttribute('aria-expanded', 'false');
		expect(toggle).toHaveFocus();
		expect(onExpandedChange).toHaveBeenLastCalledWith(false);
	});

	it('toggles on Space with the focus kept on the button', async () => {
		const user = userEvent.setup();

		render(
			<Collapse variant="outlined" size="sm" testId="c" title="Advanced" defaultExpanded={false}>
				Body
			</Collapse>,
		);

		await user.tab();
		const toggle = screen.getByRole('button', { name: 'Advanced' });

		await user.keyboard(' ');

		expect(toggle).toHaveAttribute('aria-expanded', 'true');
		expect(toggle).toHaveFocus();

		await user.keyboard(' ');

		expect(toggle).toHaveAttribute('aria-expanded', 'false');
		expect(toggle).toHaveFocus();
	});

	it.each([
		'{ArrowDown}',
		'{ArrowUp}',
		'{ArrowLeft}',
		'{ArrowRight}',
		'{Home}',
		'{End}',
		'{Escape}',
	])('does nothing on %s', async (key) => {
		const user = userEvent.setup();
		const onExpandedChange = vi.fn();

		render(
			<Collapse
				variant="outlined"
				size="sm"
				testId="c"
				title="Advanced"
				defaultExpanded
				onExpandedChange={onExpandedChange}
			>
				Body
			</Collapse>,
		);

		await user.tab();
		await user.keyboard(key);

		expect(screen.getByTestId('c-toggle')).toHaveAttribute('aria-expanded', 'true');
		expect(screen.getByTestId('c-toggle')).toHaveFocus();
		expect(onExpandedChange).not.toHaveBeenCalled();
	});

	it('tabs from the header button to the header suffix, then into the open panel', async () => {
		const user = userEvent.setup();

		render(
			<Collapse
				variant="outlined"
				size="sm"
				testId="c"
				title="Advanced"
				headerSuffix={<button type="button">Edit</button>}
				defaultExpanded
			>
				<button type="button">Save</button>
			</Collapse>,
		);

		await user.tab();
		expect(screen.getByRole('button', { name: 'Advanced' })).toHaveFocus();

		await user.tab();
		expect(screen.getByRole('button', { name: 'Edit' })).toHaveFocus();

		await user.tab();
		expect(screen.getByRole('button', { name: 'Save' })).toHaveFocus();

		await user.tab({ shift: true });
		await user.tab({ shift: true });
		expect(screen.getByRole('button', { name: 'Advanced' })).toHaveFocus();
	});

	it('leaves the content of a collapsed section out of the tab order', async () => {
		const user = userEvent.setup();

		render(
			<Collapse variant="outlined" size="sm" title="Advanced" defaultExpanded={false} keepMounted>
				<button type="button">Save</button>
			</Collapse>,
		);

		await user.tab();
		expect(screen.getByRole('button', { name: 'Advanced' })).toHaveFocus();

		await user.tab();
		expect(screen.getByText('Save')).not.toHaveFocus();
	});
});

describe('Collapse controlled', () => {
	it('follows expanded', () => {
		const { rerender } = render(
			<Collapse
				variant="outlined"
				size="sm"
				testId="c"
				title="Advanced"
				expanded={false}
				onExpandedChange={vi.fn()}
			>
				Body
			</Collapse>,
		);

		expect(screen.getByTestId('c-toggle')).toHaveAttribute('aria-expanded', 'false');
		expect(screen.queryByTestId('c-panel')).not.toBeInTheDocument();

		rerender(
			<Collapse
				variant="outlined"
				size="sm"
				testId="c"
				title="Advanced"
				expanded
				onExpandedChange={vi.fn()}
			>
				Body
			</Collapse>,
		);

		expect(screen.getByTestId('c-toggle')).toHaveAttribute('aria-expanded', 'true');
		expect(screen.getByTestId('c-panel')).toHaveTextContent('Body');
	});

	it('reports the press but does not change until the parent does', async () => {
		const user = userEvent.setup();
		const onExpandedChange = vi.fn();

		render(
			<Collapse
				variant="outlined"
				size="sm"
				testId="c"
				title="Advanced"
				expanded={false}
				onExpandedChange={onExpandedChange}
			>
				Body
			</Collapse>,
		);

		await user.click(screen.getByTestId('c-toggle'));

		expect(onExpandedChange).toHaveBeenCalledTimes(1);
		expect(onExpandedChange).toHaveBeenCalledWith(true);
		expect(screen.getByTestId('c-toggle')).toHaveAttribute('aria-expanded', 'false');
		expect(screen.queryByTestId('c-panel')).not.toBeInTheDocument();
	});

	it('keeps an open section open until the parent closes it', async () => {
		const user = userEvent.setup();
		const onExpandedChange = vi.fn();

		render(
			<Collapse
				variant="outlined"
				size="sm"
				testId="c"
				title="Advanced"
				expanded
				onExpandedChange={onExpandedChange}
			>
				Body
			</Collapse>,
		);

		await user.click(screen.getByTestId('c-toggle'));

		expect(onExpandedChange).toHaveBeenCalledWith(false);
		expect(screen.getByTestId('c-toggle')).toHaveAttribute('aria-expanded', 'true');
		expect(screen.getByTestId('c-panel')).toBeInTheDocument();
	});

	it('follows a parent that holds the state', async () => {
		const user = userEvent.setup();
		const onExpandedChange = vi.fn();

		render(<Controlled initial={false} onExpandedChange={onExpandedChange} />);

		await user.click(screen.getByTestId('c-toggle'));
		expect(screen.getByTestId('c-toggle')).toHaveAttribute('aria-expanded', 'true');
		expect(onExpandedChange).toHaveBeenLastCalledWith(true);

		await user.click(screen.getByTestId('c-toggle'));
		expect(screen.getByTestId('c-toggle')).toHaveAttribute('aria-expanded', 'false');
		expect(onExpandedChange).toHaveBeenLastCalledWith(false);
		expect(onExpandedChange).toHaveBeenCalledTimes(2);
	});

	it('does not call onExpandedChange when expanded changes from the outside', async () => {
		const onExpandedChange = vi.fn();
		const { rerender } = render(
			<Collapse
				variant="outlined"
				size="sm"
				testId="c"
				title="Advanced"
				expanded={false}
				onExpandedChange={onExpandedChange}
			>
				Body
			</Collapse>,
		);

		rerender(
			<Collapse
				variant="outlined"
				size="sm"
				testId="c"
				title="Advanced"
				expanded
				onExpandedChange={onExpandedChange}
			>
				Body
			</Collapse>,
		);
		rerender(
			<Collapse
				variant="outlined"
				size="sm"
				testId="c"
				title="Advanced"
				expanded={false}
				onExpandedChange={onExpandedChange}
			>
				Body
			</Collapse>,
		);

		await waitFor(() => expect(screen.queryByTestId('c-panel')).not.toBeInTheDocument());
		expect(onExpandedChange).not.toHaveBeenCalled();
	});

	it('stays controlled when expanded turns undefined, shows it closed, and warns', () => {
		const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
		const { rerender } = render(
			<Collapse
				variant="outlined"
				size="sm"
				testId="c"
				title="Advanced"
				expanded
				onExpandedChange={vi.fn()}
			>
				Body
			</Collapse>,
		);

		expect(warn).not.toHaveBeenCalled();

		rerender(
			<Collapse
				variant="outlined"
				size="sm"
				testId="c"
				title="Advanced"
				expanded={undefined}
				onExpandedChange={vi.fn()}
			>
				Body
			</Collapse>,
		);

		expect(screen.getByTestId('c-toggle')).toHaveAttribute('aria-expanded', 'false');
		expect(warn).toHaveBeenCalledWith(
			expect.stringContaining('Collapse: `expanded` turned `undefined`'),
		);
	});

	it('stays closed and warns after expanded turns undefined, whatever a press reports', async () => {
		const user = userEvent.setup();
		vi.spyOn(console, 'warn').mockImplementation(() => {});
		const onExpandedChange = vi.fn();
		const { rerender } = render(
			<Collapse
				variant="outlined"
				size="sm"
				testId="c"
				title="Advanced"
				expanded
				onExpandedChange={onExpandedChange}
			>
				Body
			</Collapse>,
		);

		rerender(
			<Collapse
				variant="outlined"
				size="sm"
				testId="c"
				title="Advanced"
				expanded={undefined}
				onExpandedChange={onExpandedChange}
			>
				Body
			</Collapse>,
		);
		await user.click(screen.getByTestId('c-toggle'));

		expect(onExpandedChange).toHaveBeenCalledWith(true);
		expect(screen.getByTestId('c-toggle')).toHaveAttribute('aria-expanded', 'false');
	});
});

describe('Collapse controlled and uncontrolled switch', () => {
	it('ignores an expanded that appears on a section that started uncontrolled, and warns', async () => {
		const user = userEvent.setup();
		const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
		const { rerender } = render(
			<Collapse variant="outlined" size="sm" testId="c" title="Advanced" defaultExpanded={false}>
				Body
			</Collapse>,
		);

		await user.click(screen.getByTestId('c-toggle'));
		expect(screen.getByTestId('c-toggle')).toHaveAttribute('aria-expanded', 'true');
		expect(warn).not.toHaveBeenCalled();

		rerender(
			<Collapse
				variant="outlined"
				size="sm"
				testId="c"
				title="Advanced"
				expanded={false}
				onExpandedChange={vi.fn()}
			>
				Body
			</Collapse>,
		);

		expect(screen.getByTestId('c-toggle')).toHaveAttribute('aria-expanded', 'true');
		expect(warn).toHaveBeenCalledWith(
			expect.stringContaining('Collapse: `expanded` was `undefined` on the first render'),
		);
	});

	it('keeps its own state after the ignored expanded, and still toggles', async () => {
		const user = userEvent.setup();
		vi.spyOn(console, 'warn').mockImplementation(() => {});
		const { rerender } = render(
			<Collapse variant="outlined" size="sm" testId="c" title="Advanced" defaultExpanded={false}>
				Body
			</Collapse>,
		);

		rerender(
			<Collapse
				variant="outlined"
				size="sm"
				testId="c"
				title="Advanced"
				expanded
				onExpandedChange={vi.fn()}
			>
				Body
			</Collapse>,
		);

		expect(screen.getByTestId('c-toggle')).toHaveAttribute('aria-expanded', 'false');

		await user.click(screen.getByTestId('c-toggle'));

		expect(screen.getByTestId('c-toggle')).toHaveAttribute('aria-expanded', 'true');
	});

	it('does not warn for an uncontrolled section that never gets an expanded', async () => {
		const user = userEvent.setup();
		const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
		const { rerender } = render(
			<Collapse variant="outlined" size="sm" testId="c" title="Advanced" defaultExpanded={false}>
				Body
			</Collapse>,
		);

		await user.click(screen.getByTestId('c-toggle'));
		rerender(
			<Collapse variant="outlined" size="sm" testId="c" title="Advanced" defaultExpanded={false}>
				Other
			</Collapse>,
		);

		expect(warn).not.toHaveBeenCalled();
	});

	it('does not warn for a section that stays controlled', async () => {
		const user = userEvent.setup();
		const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});

		render(<Controlled initial={false} />);
		await user.click(screen.getByTestId('c-toggle'));
		await user.click(screen.getByTestId('c-toggle'));

		expect(warn).not.toHaveBeenCalled();
	});
});

describe('Collapse.Group keyboard', () => {
	it('makes every header button its own tab stop, in the order of items', async () => {
		const user = userEvent.setup();

		render(<Collapse.Group variant="outlined" size="sm" items={GROUP_ITEMS} defaultValue={[]} />);

		await user.tab();
		expect(screen.getByRole('button', { name: 'Logs' })).toHaveFocus();

		await user.tab();
		expect(screen.getByRole('button', { name: 'Traces' })).toHaveFocus();

		await user.tab();
		expect(screen.getByRole('button', { name: 'Metrics' })).toHaveFocus();
	});

	it('tabs from an open item into its content, then to the next header button', async () => {
		const user = userEvent.setup();

		render(
			<Collapse.Group
				variant="outlined"
				size="sm"
				defaultValue={['logs']}
				items={[
					{ value: 'logs', title: 'Logs', children: <button type="button">Filter</button> },
					{ value: 'traces', title: 'Traces', children: 'Traces body' },
				]}
			/>,
		);

		await user.tab();
		await user.tab();
		expect(screen.getByRole('button', { name: 'Filter' })).toHaveFocus();

		await user.tab();
		expect(screen.getByRole('button', { name: 'Traces' })).toHaveFocus();
	});

	it.each(['{ArrowDown}', '{ArrowUp}', '{Home}', '{End}'])(
		'does not move focus between header buttons on %s',
		async (key) => {
			const user = userEvent.setup();

			render(<Collapse.Group variant="outlined" size="sm" items={GROUP_ITEMS} defaultValue={[]} />);

			await user.tab();
			await user.tab();
			const traces = screen.getByRole('button', { name: 'Traces' });

			expect(traces).toHaveFocus();

			await user.keyboard(key);

			expect(traces).toHaveFocus();
			expect(traces).toHaveAttribute('aria-expanded', 'false');
		},
	);

	it('toggles an item on Enter and Space with the focus kept', async () => {
		const user = userEvent.setup();

		render(<Collapse.Group variant="outlined" size="sm" items={GROUP_ITEMS} defaultValue={[]} />);

		await user.tab();
		const logs = screen.getByRole('button', { name: 'Logs' });

		await user.keyboard('{Enter}');
		expect(logs).toHaveAttribute('aria-expanded', 'true');
		expect(logs).toHaveFocus();

		await user.keyboard(' ');
		expect(logs).toHaveAttribute('aria-expanded', 'false');
		expect(logs).toHaveFocus();
	});
});

describe('Collapse.Group header suffix', () => {
	it('does not toggle the item on a click on its controls', async () => {
		const user = userEvent.setup();
		const onChange = vi.fn();

		render(
			<Collapse.Group
				variant="outlined"
				size="sm"
				defaultValue={[]}
				onChange={onChange}
				items={[
					{
						value: 'logs',
						title: 'Logs',
						headerSuffix: <button type="button">Edit</button>,
						children: 'a',
					},
				]}
			/>,
		);

		await user.click(screen.getByRole('button', { name: 'Edit' }));

		expect(onChange).not.toHaveBeenCalled();
		expect(screen.getByRole('button', { name: 'Logs' })).toHaveAttribute('aria-expanded', 'false');
	});
});
