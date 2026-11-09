import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { userEvent as browserUser } from 'vitest/browser';
import { Dialog } from '../dialog.js';
import {
	NestedHarness,
	type NestedHarnessProps,
	openChild,
	OPENER_NAME,
	slot,
	slots,
	waitForClosed,
} from './dialog.test-utils.js';

function parentPanel(): HTMLElement {
	return screen.getByRole('dialog', { name: 'Edit view', hidden: true });
}

function centerOf(element: Element): { x: number; y: number } {
	const { left, top, width, height } = element.getBoundingClientRect();

	return { x: left + width / 2, y: top + height / 2 };
}

/**
 * A press on the edge of the parent panel, where a narrow child leaves it uncovered. With a child
 * open, the page paints the child's viewport there, which is what a user presses.
 */
async function pressWhereTheParentIs(): Promise<void> {
	const { left, top, height } = parentPanel().getBoundingClientRect();

	await userEvent.click(document.elementFromPoint(left + 4, top + height / 2) as Element);
}

async function waitForChildClosed(): Promise<void> {
	await waitFor(() => {
		expect(screen.queryByTestId('child')).toBeNull();
	});
}

async function pressBackdrop(): Promise<void> {
	await userEvent.click(document.elementFromPoint(2, 2) as Element);
}

async function renderNested(props: NestedHarnessProps = {}) {
	render(<NestedHarness {...props} />);
	await userEvent.click(screen.getByRole('button', { name: OPENER_NAME }));
	await waitFor(() => {
		expect(screen.getByRole('dialog', { name: 'Edit view' }).contains(document.activeElement)).toBe(
			true,
		);
	});
}

describe('Dialog nested with a Dialog as the child', () => {
	it('renders the child above the parent, which stays rendered', async () => {
		await renderNested();

		const panel = await openChild();

		expect(panel).toBeInTheDocument();
		expect(parentPanel()).toBeInTheDocument();
		expect(parentPanel().isConnected).toBe(true);
		expect(screen.getByRole('textbox', { name: 'Parent field', hidden: true })).toBeInTheDocument();
	});

	it('lets only the top dialog take input: the parent is hidden from assistive technology', async () => {
		await renderNested();
		await openChild();

		expect(screen.queryByRole('dialog', { name: 'Edit view' })).toBeNull();
		expect(screen.queryByRole('textbox', { name: 'Parent field' })).toBeNull();
		expect(screen.getByRole('dialog', { name: 'Discard changes?' })).toBeInTheDocument();
	});

	it('lets only the top dialog take input: the page paints the child over the parent', async () => {
		await renderNested();
		const panel = await openChild();
		const { x, y } = centerOf(screen.getByRole('textbox', { name: 'Parent field', hidden: true }));

		expect(parentPanel().contains(document.elementFromPoint(x, y))).toBe(false);
		expect(
			panel.closest('[data-slot="dialog-layer"]')?.contains(document.elementFromPoint(x, y)),
		).toBe(true);
	});

	it('traps the focus in the child however many times Tab is pressed', async () => {
		await renderNested();
		const panel = await openChild();

		for (let step = 0; step < 6; step += 1) {
			await browserUser.tab();
			expect(panel.contains(document.activeElement)).toBe(true);
		}
		for (let step = 0; step < 6; step += 1) {
			await browserUser.tab({ shift: true });
			expect(panel.contains(document.activeElement)).toBe(true);
		}
	});

	it('marks the parent panel with data-nested-dialog-open while the child is open', async () => {
		await renderNested();

		expect(parentPanel()).not.toHaveAttribute('data-nested-dialog-open');

		await openChild();

		expect(parentPanel()).toHaveAttribute('data-nested-dialog-open');
		expect(screen.getByRole('dialog')).not.toHaveAttribute('data-nested-dialog-open');

		await userEvent.keyboard('{Escape}');
		await waitForChildClosed();
		await waitFor(() => {
			expect(parentPanel()).not.toHaveAttribute('data-nested-dialog-open');
		});
	});

	it('renders one backdrop, the first dialog', async () => {
		await renderNested();
		await openChild();

		expect(document.querySelectorAll('[data-slot$="backdrop"]')).toHaveLength(1);
		expect(slots('dialog-backdrop')).toHaveLength(1);
		expect(screen.queryByTestId('child-backdrop')).toBeNull();
	});

	it('closes only the top dialog on Esc, then the parent on the next', async () => {
		const onParentClose = vi.fn();
		const onChildClose = vi.fn();
		await renderNested({ onParentClose, onChildClose });
		await openChild();

		await userEvent.keyboard('{Escape}');

		expect(onChildClose).toHaveBeenCalledExactlyOnceWith('escape-key');
		expect(onParentClose).not.toHaveBeenCalled();

		await waitForChildClosed();
		expect(screen.getByRole('dialog', { name: 'Edit view' })).toBeInTheDocument();

		await userEvent.keyboard('{Escape}');

		expect(onParentClose).toHaveBeenCalledExactlyOnceWith('escape-key');
		await waitForClosed();
	});

	it('does not close the parent when the child stays open on Esc', async () => {
		const onParentClose = vi.fn();
		await renderNested({ onParentClose, closes: false });
		await openChild();

		await userEvent.keyboard('{Escape}');
		await userEvent.keyboard('{Escape}');

		expect(onParentClose).not.toHaveBeenCalled();
		expect(screen.getByRole('dialog', { name: 'Discard changes?' })).toBeInTheDocument();
	});

	it('treats a press where the parent panel is as an outside press for the child only', async () => {
		const onParentClose = vi.fn();
		const onChildClose = vi.fn();
		await renderNested({ childWidth: 'narrow', onParentClose, onChildClose, closes: false });
		await openChild();

		await pressWhereTheParentIs();

		expect(onParentClose).not.toHaveBeenCalled();
		expect(onChildClose).toHaveBeenCalledExactlyOnceWith('outside-press');
	});

	it('treats a press on the backdrop as an outside press for the child only', async () => {
		const onParentClose = vi.fn();
		const onChildClose = vi.fn();
		await renderNested({ onParentClose, onChildClose, closes: false });
		await openChild();

		await pressBackdrop();

		expect(onParentClose).not.toHaveBeenCalled();
		expect(onChildClose).toHaveBeenCalledExactlyOnceWith('outside-press');
	});

	it('closes the child on a press outside it and leaves the parent open', async () => {
		const onParentClose = vi.fn();
		await renderNested({ onParentClose });
		await openChild();

		await pressBackdrop();

		await waitFor(() => {
			expect(screen.queryByRole('dialog', { name: 'Discard changes?' })).toBeNull();
		});
		expect(screen.getByRole('dialog', { name: 'Edit view' })).toBeInTheDocument();
		expect(onParentClose).not.toHaveBeenCalled();
	});

	it('does not treat a press inside the child as an outside press', async () => {
		const onParentClose = vi.fn();
		const onChildClose = vi.fn();
		await renderNested({ onParentClose, onChildClose, closes: false });
		const panel = await openChild();

		await userEvent.click(screen.getByTestId('child-title'));
		await userEvent.click(panel);

		expect(onParentClose).not.toHaveBeenCalled();
		expect(onChildClose).not.toHaveBeenCalled();
	});

	it('gives the focus back to the element in the parent that opened the child', async () => {
		await renderNested();
		await openChild();

		await userEvent.keyboard('{Escape}');
		await waitForChildClosed();

		await waitFor(() => {
			expect(screen.getByRole('button', { name: 'Open child' })).toHaveFocus();
		});
		expect(screen.getByRole('dialog', { name: 'Edit view' })).toBeInTheDocument();
	});

	it('gives the focus back to it when the child closes from its own button', async () => {
		await renderNested();
		await openChild();

		await userEvent.click(screen.getByRole('button', { name: 'Close' }));
		await waitForChildClosed();

		await waitFor(() => {
			expect(screen.getByRole('button', { name: 'Open child' })).toHaveFocus();
		});
	});

	it('keeps the state of the parent while the child opens and closes', async () => {
		await renderNested();
		await userEvent.type(screen.getByRole('textbox', { name: 'Parent field' }), 'Latency');

		await openChild();
		await userEvent.keyboard('{Escape}');
		await waitForChildClosed();

		expect(screen.getByRole('textbox', { name: 'Parent field' })).toHaveValue('Latency');
	});

	it.each(['footer-suffix', 'footer-prefix'] as const)(
		'works when the child renders in the %s of the parent',
		async (childIn) => {
			const onParentClose = vi.fn();
			await renderNested({ childIn, onParentClose });

			expect(screen.getByRole('button', { name: 'Open child' }).closest('[data-slot]')).toBe(
				slot(`dialog-${childIn}`),
			);
			await openChild();

			expect(parentPanel()).toHaveAttribute('data-nested-dialog-open');
			expect(document.querySelectorAll('[data-slot$="backdrop"]')).toHaveLength(1);

			await userEvent.keyboard('{Escape}');
			await waitForChildClosed();

			expect(onParentClose).not.toHaveBeenCalled();
			await waitFor(() => {
				expect(screen.getByRole('button', { name: 'Open child' })).toHaveFocus();
			});
		},
	);

	it('closes the child with the parent, because it is part of its content', async () => {
		const onChildClose = vi.fn();
		function Harness({ open }: { open: boolean }) {
			return (
				<Dialog open={open} onClose={() => {}} title="Edit view">
					<Dialog open onClose={onChildClose} title="Discard changes?">
						Body
					</Dialog>
				</Dialog>
			);
		}
		const { rerender } = render(<Harness open />);
		await screen.findByRole('dialog', { name: 'Discard changes?' });

		rerender(<Harness open={false} />);
		await waitForClosed();

		expect(screen.queryByRole('dialog', { hidden: true })).toBeNull();
		expect(onChildClose).not.toHaveBeenCalled();
	});

	it('opens again from scratch after the parent closed with the child open', async () => {
		await renderNested();
		await openChild();

		await userEvent.keyboard('{Escape}');
		await waitForChildClosed();
		await userEvent.keyboard('{Escape}');
		await waitForClosed();
		await userEvent.click(screen.getByRole('button', { name: OPENER_NAME }));

		expect(await screen.findByRole('dialog', { name: 'Edit view' })).toBeInTheDocument();
		expect(screen.queryByTestId('child')).toBeNull();
		expect(slot('dialog-popup')).not.toHaveAttribute('data-nested-dialog-open');
	});

	it('renders open at the same time as its parent when both start open', async () => {
		render(<NestedHarness defaultParentOpen defaultChildOpen />);

		const panel = await screen.findByRole('dialog', { name: 'Discard changes?' });

		await waitFor(() => {
			expect(panel.contains(document.activeElement)).toBe(true);
		});
		expect(document.querySelectorAll('[data-slot$="backdrop"]')).toHaveLength(1);
		expect(parentPanel()).toHaveAttribute('data-nested-dialog-open');
	});
});

describe('Dialog nested at any depth', () => {
	it('closes the top dialog on each Esc, down to the first', async () => {
		const calls: string[] = [];
		function Harness() {
			const [first, setFirst] = useState(true);
			const [second, setSecond] = useState(true);
			const [third, setThird] = useState(true);

			return (
				<Dialog
					open={first}
					title="First"
					onClose={() => {
						calls.push('first');
						setFirst(false);
					}}
				>
					<Dialog
						open={second}
						title="Second"
						onClose={() => {
							calls.push('second');
							setSecond(false);
						}}
					>
						<Dialog
							open={third}
							title="Third"
							onClose={() => {
								calls.push('third');
								setThird(false);
							}}
						>
							Deep
						</Dialog>
					</Dialog>
				</Dialog>
			);
		}
		render(<Harness />);
		await screen.findByRole('dialog', { name: 'Third' });

		expect(document.querySelectorAll('[data-slot$="backdrop"]')).toHaveLength(1);

		await userEvent.keyboard('{Escape}');
		await waitFor(() => {
			expect(screen.queryByRole('dialog', { name: 'Third', hidden: true })).toBeNull();
		});
		await userEvent.keyboard('{Escape}');
		await waitFor(() => {
			expect(screen.queryByRole('dialog', { name: 'Second', hidden: true })).toBeNull();
		});
		await userEvent.keyboard('{Escape}');
		await waitForClosed();

		expect(calls).toEqual(['third', 'second', 'first']);
	});

	it('marks every dialog under the top one', async () => {
		function Harness() {
			return (
				<Dialog open onClose={() => {}} title="First" testId="first">
					<Dialog open onClose={() => {}} title="Second" testId="second">
						<Dialog open onClose={() => {}} title="Third" testId="third">
							Deep
						</Dialog>
					</Dialog>
				</Dialog>
			);
		}
		render(<Harness />);
		await screen.findByRole('dialog', { name: 'Third' });

		expect(screen.getByTestId('first')).toHaveAttribute('data-nested-dialog-open');
		expect(screen.getByTestId('second')).toHaveAttribute('data-nested-dialog-open');
		expect(screen.getByTestId('third')).not.toHaveAttribute('data-nested-dialog-open');
	});
});

describe('Dialog next to another dialog that is not in its tree', () => {
	it('is a second dialog on its own: it has its own backdrop and does not mark the first', async () => {
		function Harness() {
			const [second, setSecond] = useState(false);

			return (
				<>
					<Dialog open onClose={() => {}} title="First" testId="first">
						<button type="button" onClick={() => setSecond(true)}>
							Open second
						</button>
					</Dialog>
					<Dialog open={second} onClose={() => setSecond(false)} title="Second" testId="second">
						Body
					</Dialog>
				</>
			);
		}
		render(<Harness />);
		await userEvent.click(await screen.findByRole('button', { name: 'Open second' }));
		await screen.findByRole('dialog', { name: 'Second' });

		expect(screen.getByTestId('first')).not.toHaveAttribute('data-nested-dialog-open');
		expect(slots('dialog-backdrop')).toHaveLength(2);
	});
});
