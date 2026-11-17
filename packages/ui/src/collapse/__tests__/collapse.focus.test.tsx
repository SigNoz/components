import { act, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { describe, expect, it } from 'vitest';

import { Collapse } from '../collapse.js';

function Form({ keepMounted }: { keepMounted: boolean }) {
	const [open, setOpen] = useState(true);

	return (
		<>
			<button type="button" onClick={() => setOpen(false)}>
				Close from outside
			</button>
			<Collapse
				variant="ghost"
				size="sm"
				testId="c"
				title="Form"
				keepMounted={keepMounted}
				expanded={open}
				onExpandedChange={setOpen}
			>
				<input aria-label="Name" />
				<button type="button" onClick={() => setOpen(false)}>
					Save
				</button>
			</Collapse>
		</>
	);
}

describe.each([false, true])('Collapse focus return, keepMounted %s', (keepMounted) => {
	it('moves the focus to the header button when the parent closes the section from inside', async () => {
		const user = userEvent.setup();

		render(<Form keepMounted={keepMounted} />);

		await user.click(screen.getByRole('button', { name: 'Save' }));

		await waitFor(() =>
			expect(screen.getByTestId('c-toggle')).toHaveAttribute('aria-expanded', 'false'),
		);
		expect(screen.getByRole('button', { name: 'Form' })).toHaveFocus();
	});

	it('moves the focus to the header button when expanded turns false while a field has it', async () => {
		const user = userEvent.setup();
		const { rerender } = render(
			<Collapse
				variant="ghost"
				size="sm"
				testId="c"
				title="Form"
				keepMounted={keepMounted}
				expanded
				onExpandedChange={() => {}}
			>
				<input aria-label="Name" />
			</Collapse>,
		);

		await user.click(screen.getByRole('textbox', { name: 'Name' }));
		expect(screen.getByRole('textbox', { name: 'Name' })).toHaveFocus();

		rerender(
			<Collapse
				variant="ghost"
				size="sm"
				testId="c"
				title="Form"
				keepMounted={keepMounted}
				expanded={false}
				onExpandedChange={() => {}}
			>
				<input aria-label="Name" />
			</Collapse>,
		);

		await waitFor(() =>
			expect(screen.getByTestId('c-toggle')).toHaveAttribute('aria-expanded', 'false'),
		);
		expect(screen.getByRole('button', { name: 'Form' })).toHaveFocus();
	});

	it('moves the focus when a field gets it from code, not from a click', async () => {
		const { rerender } = render(
			<Collapse
				variant="ghost"
				size="sm"
				testId="c"
				title="Form"
				keepMounted={keepMounted}
				expanded
				onExpandedChange={() => {}}
			>
				<input aria-label="Name" />
			</Collapse>,
		);

		act(() => {
			screen.getByRole('textbox', { name: 'Name' }).focus();
		});

		rerender(
			<Collapse
				variant="ghost"
				size="sm"
				testId="c"
				title="Form"
				keepMounted={keepMounted}
				expanded={false}
				onExpandedChange={() => {}}
			>
				<input aria-label="Name" />
			</Collapse>,
		);

		await waitFor(() => expect(screen.getByRole('button', { name: 'Form' })).toHaveFocus());
	});

	it('leaves the focus alone when it was outside the panel before the section closed', async () => {
		const user = userEvent.setup();

		render(<Form keepMounted={keepMounted} />);

		await user.click(screen.getByRole('button', { name: 'Close from outside' }));

		await waitFor(() =>
			expect(screen.getByTestId('c-toggle')).toHaveAttribute('aria-expanded', 'false'),
		);
		expect(screen.getByRole('button', { name: 'Close from outside' })).toHaveFocus();
	});

	it('leaves the focus alone when it moved from the panel to another control before closing', async () => {
		const user = userEvent.setup();
		const { rerender } = render(
			<>
				<button type="button">Elsewhere</button>
				<Collapse
					variant="ghost"
					size="sm"
					testId="c"
					title="Form"
					keepMounted={keepMounted}
					expanded
					onExpandedChange={() => {}}
				>
					<input aria-label="Name" />
				</Collapse>
			</>,
		);

		await user.click(screen.getByRole('textbox', { name: 'Name' }));
		await user.click(screen.getByRole('button', { name: 'Elsewhere' }));

		rerender(
			<>
				<button type="button">Elsewhere</button>
				<Collapse
					variant="ghost"
					size="sm"
					testId="c"
					title="Form"
					keepMounted={keepMounted}
					expanded={false}
					onExpandedChange={() => {}}
				>
					<input aria-label="Name" />
				</Collapse>
			</>,
		);

		await waitFor(() =>
			expect(screen.getByTestId('c-toggle')).toHaveAttribute('aria-expanded', 'false'),
		);
		expect(screen.getByRole('button', { name: 'Elsewhere' })).toHaveFocus();
	});

	it('keeps the focus on the header button when the user closes the section from it', async () => {
		const user = userEvent.setup();

		render(
			<Collapse
				variant="ghost"
				size="sm"
				testId="c"
				title="Form"
				keepMounted={keepMounted}
				defaultExpanded
			>
				<input aria-label="Name" />
			</Collapse>,
		);

		await user.tab();
		await user.keyboard('{Enter}');

		await waitFor(() =>
			expect(screen.getByTestId('c-toggle')).toHaveAttribute('aria-expanded', 'false'),
		);
		expect(screen.getByTestId('c-toggle')).toHaveFocus();
	});

	it('returns the focus again on a second close', async () => {
		const user = userEvent.setup();

		render(<Form keepMounted={keepMounted} />);

		await user.click(screen.getByRole('button', { name: 'Save' }));
		await waitFor(() => expect(screen.getByRole('button', { name: 'Form' })).toHaveFocus());

		await user.click(screen.getByRole('button', { name: 'Form' }));
		await user.click(screen.getByRole('button', { name: 'Save' }));

		await waitFor(() =>
			expect(screen.getByTestId('c-toggle')).toHaveAttribute('aria-expanded', 'false'),
		);
		expect(screen.getByRole('button', { name: 'Form' })).toHaveFocus();
	});
});

describe.each([false, true])('Collapse.Group focus return, keepMounted %s', (keepMounted) => {
	function Group() {
		const [value, setValue] = useState<string[]>(['logs', 'traces']);

		return (
			<Collapse.Group
				variant="outlined"
				size="sm"
				testId="g"
				keepMounted={keepMounted}
				value={value}
				onChange={setValue}
				items={[
					{
						value: 'logs',
						title: 'Logs',
						children: (
							<button
								type="button"
								onClick={() => setValue((current) => current.filter((v) => v !== 'logs'))}
							>
								Clear logs
							</button>
						),
					},
					{ value: 'traces', title: 'Traces', children: <input aria-label="Trace id" /> },
				]}
			/>
		);
	}

	it('moves the focus to the header button of the item that closed', async () => {
		const user = userEvent.setup();

		render(<Group />);

		await user.click(screen.getByRole('button', { name: 'Clear logs' }));

		await waitFor(() =>
			expect(screen.getByTestId('g-item-logs-toggle')).toHaveAttribute('aria-expanded', 'false'),
		);
		expect(screen.getByRole('button', { name: 'Logs' })).toHaveFocus();
		expect(screen.getByRole('button', { name: 'Traces' })).toHaveAttribute('aria-expanded', 'true');
	});

	it('leaves the focus in another open item alone', async () => {
		const user = userEvent.setup();
		const { rerender } = render(
			<Collapse.Group
				variant="outlined"
				size="sm"
				keepMounted={keepMounted}
				value={['logs', 'traces']}
				onChange={() => {}}
				items={[
					{ value: 'logs', title: 'Logs', children: 'Logs body' },
					{ value: 'traces', title: 'Traces', children: <input aria-label="Trace id" /> },
				]}
			/>,
		);

		await user.click(screen.getByRole('textbox', { name: 'Trace id' }));

		rerender(
			<Collapse.Group
				variant="outlined"
				size="sm"
				keepMounted={keepMounted}
				value={['traces']}
				onChange={() => {}}
				items={[
					{ value: 'logs', title: 'Logs', children: 'Logs body' },
					{ value: 'traces', title: 'Traces', children: <input aria-label="Trace id" /> },
				]}
			/>,
		);

		await waitFor(() =>
			expect(screen.getByRole('button', { name: 'Logs' })).toHaveAttribute(
				'aria-expanded',
				'false',
			),
		);
		expect(screen.getByRole('textbox', { name: 'Trace id' })).toHaveFocus();
	});
});
