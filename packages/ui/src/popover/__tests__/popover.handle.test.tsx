import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useRef } from 'react';
import { describe, expect, it } from 'vitest';
import { Popover } from '../popover.js';
import { usePopoverHandle } from '../use-popover-handle.js';

type Row = { label: string };

/**
 * One declared popover serving several rows, the shape a hover card over a table takes: the
 * handle says which row to show and where, and `children` renders that row.
 */
function RowList({ openOn = 'click' }: { openOn?: 'click' | 'hover' }): JSX.Element {
	const card = usePopoverHandle<Row>();
	const rows = ['alpha', 'beta', 'gamma'];

	return (
		<>
			{rows.map((label) => (
				<button
					key={label}
					type="button"
					onClick={
						openOn === 'click' ? (event) => card.showAt(event.currentTarget, { label }) : undefined
					}
					onMouseEnter={
						openOn === 'hover' ? (event) => card.showAt(event.currentTarget, { label }) : undefined
					}
				>
					{label}
				</button>
			))}
			<Popover nativeButton side="bottom" align="start" handle={card}>
				{(row) => <p>Row: {row?.label}</p>}
			</Popover>
		</>
	);
}

describe('Popover handle', () => {
	it('shows nothing until showAt is called', () => {
		render(<RowList />);

		expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
	});

	it('shows the payload of the row it was given', async () => {
		render(<RowList />);

		await userEvent.click(screen.getByRole('button', { name: 'beta' }));

		expect(await screen.findByRole('dialog')).toHaveTextContent('Row: beta');
	});

	it('swaps content and moves when another row shows it', async () => {
		render(<RowList />);

		await userEvent.click(screen.getByRole('button', { name: 'alpha' }));
		expect(await screen.findByRole('dialog')).toHaveTextContent('Row: alpha');

		await userEvent.click(screen.getByRole('button', { name: 'gamma' }));
		await waitFor(() => expect(screen.getByRole('dialog')).toHaveTextContent('Row: gamma'));
		// One popup, not one per row.
		expect(screen.getAllByRole('dialog')).toHaveLength(1);
	});

	it('renders no trigger of its own when the handle is the only way in', async () => {
		render(<RowList />);
		await userEvent.click(screen.getByRole('button', { name: 'alpha' }));

		await screen.findByRole('dialog');
		expect(document.querySelector('[data-slot="popover-trigger"]')).toBeNull();
	});

	it('closes on Escape, and the handle reports it', async () => {
		render(<RowList />);
		await userEvent.click(screen.getByRole('button', { name: 'alpha' }));
		await screen.findByRole('dialog');

		await userEvent.keyboard('{Escape}');

		await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
	});

	it('positions against a DOMRect', async () => {
		function AtARect(): JSX.Element {
			const handle = usePopoverHandle();

			return (
				<>
					<button
						type="button"
						onClick={() => handle.showAt(DOMRect.fromRect({ x: 120, y: 90, width: 0, height: 0 }))}
					>
						Show
					</button>
					<Popover nativeButton side="bottom" align="start" handle={handle}>
						<p>At a rect</p>
					</Popover>
				</>
			);
		}
		render(<AtARect />);

		await userEvent.click(screen.getByRole('button', { name: 'Show' }));

		expect(await screen.findByRole('dialog')).toHaveTextContent('At a rect');
	});

	it('positions against an element that is not a trigger', async () => {
		function AtAnElement(): JSX.Element {
			const handle = usePopoverHandle();
			const row = useRef<HTMLDivElement>(null);

			return (
				<>
					<div ref={row}>
						<input aria-label="Query" onFocus={() => handle.showAt(row.current as Element)} />
					</div>
					<Popover nativeButton side="bottom" align="start" handle={handle} initialFocus={false}>
						<p>Suggestions</p>
					</Popover>
				</>
			);
		}
		render(<AtAnElement />);

		const input = screen.getByRole('textbox', { name: 'Query' });
		input.focus();

		expect(await screen.findByRole('dialog')).toHaveTextContent('Suggestions');
		// The input keeps the caret: the popup is anchored to its row, not triggered by it.
		expect(input).toHaveFocus();
	});

	it('reports every open and close, whichever caused it', async () => {
		const changes: boolean[] = [];

		function Reported(): JSX.Element {
			const handle = usePopoverHandle((open) => changes.push(open));

			return (
				<>
					<button type="button" onClick={(event) => handle.showAt(event.currentTarget)}>
						Show
					</button>
					<button type="button" onClick={() => handle.close()}>
						Hide
					</button>
					<Popover
						nativeButton
						side="bottom"
						align="start"
						handle={handle}
						trigger={<button type="button">Toggle</button>}
					>
						<p>Body</p>
					</Popover>
				</>
			);
		}
		render(<Reported />);

		await userEvent.click(screen.getByRole('button', { name: 'Show' }));
		await screen.findByRole('dialog');
		await userEvent.click(screen.getByRole('button', { name: 'Hide' }));
		await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());

		await userEvent.click(screen.getByRole('button', { name: 'Toggle' }));
		await screen.findByRole('dialog');
		await userEvent.keyboard('{Escape}');
		await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());

		expect(changes).toEqual([true, false, true, false]);
	});

	it('closes a trigger-opened popover, for a form that just saved', async () => {
		function SaveForm(): JSX.Element {
			const handle = usePopoverHandle();

			return (
				<Popover
					nativeButton
					side="bottom"
					align="start"
					handle={handle}
					trigger={<button type="button">Open</button>}
				>
					<button type="button" onClick={() => handle.close()}>
						Save
					</button>
				</Popover>
			);
		}
		render(<SaveForm />);

		await userEvent.click(screen.getByRole('button', { name: 'Open' }));
		await screen.findByRole('dialog');

		await userEvent.click(screen.getByRole('button', { name: 'Save' }));

		await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
	});
});
