import { act, render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { type ReactNode, useEffect, useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { AlertDialog } from '../../alert-dialog/index.js';
import { waitForSettled as waitForDialogSettled } from '../../dialog/__tests__/dialog.test-utils.js';
import { Drawer } from '../drawer.js';
import type { DrawerCloseReasonType, DrawerHandleType, DrawerStackType } from '../types.js';
import { useDrawerHandle } from '../use-drawer-handle.js';
import { slot, waitForSettled } from './drawer.test-utils.js';

type Closed = (name: 'pod' | 'edit', reason: DrawerCloseReasonType) => void;

interface PodPageProps {
	/**
	 * How the edit drawer opens from the pod: over it, or in its place with a breadcrumb trail.
	 */
	stack: DrawerStackType;
	onClosed: Closed;
	/**
	 * Receives the app's own close of the pod, the way a URL change or a stats card closes it.
	 */
	onAppClose?: (close: () => void) => void;
}

/**
 * A pod drawer with an edit drawer opened from it, the way an entity drawer opens a form. The form
 * asks "Discard changes?" before it closes with unsaved edits. Over the pod it is an inspector, so
 * the pod's close button stays in reach; in a trail it takes the pod's place.
 */
function PodPage({ stack, onClosed, onAppClose }: PodPageProps): ReactNode {
	const [podOpen, setPodOpen] = useState(false);
	const [editOpen, setEditOpen] = useState(false);
	const [confirming, setConfirming] = useState(false);
	const [name, setName] = useState('');
	const closeEdit = (): void => {
		setEditOpen(false);
		setName('');
	};

	useEffect(() => {
		onAppClose?.(() => setPodOpen(false));
	});

	return (
		<>
			<button type="button" onClick={() => setPodOpen(true)}>
				Open pod
			</button>
			<Drawer
				type="task"
				stack={stack}
				open={podOpen}
				onClose={(reason) => {
					onClosed('pod', reason);
					setPodOpen(false);
				}}
				title="Pod api-7f9c"
				testId="pod"
			>
				<button type="button" onClick={() => setEditOpen(true)}>
					Edit pod
				</button>
				<Drawer
					type="inspector"
					open={editOpen}
					onClose={(reason) => {
						onClosed('edit', reason);
						// The pod closed from the app: the form goes with it, so there is nothing to ask.
						if (name === '' || reason === 'parent-close') {
							closeEdit();
						} else {
							setConfirming(true);
						}
					}}
					title="Edit pod"
					testId="edit"
				>
					<input aria-label="Name" value={name} onChange={(event) => setName(event.target.value)} />
					<AlertDialog
						open={confirming}
						title="Discard changes?"
						color="danger"
						confirmText="Discard"
						cancelText="Keep editing"
						onConfirm={() => {
							setConfirming(false);
							closeEdit();
						}}
						onCancel={() => setConfirming(false)}
					>
						The edits to this pod are lost.
					</AlertDialog>
				</Drawer>
			</Drawer>
		</>
	);
}

function queryPanel(name: 'pod' | 'edit'): HTMLElement | null {
	return document.querySelector<HTMLElement>(`[data-testid="${name}"]`);
}

function panel(name: 'pod' | 'edit'): HTMLElement {
	const element = queryPanel(name);
	expect(element).not.toBeNull();

	return element as HTMLElement;
}

async function openPodAndEdit(
	stack: DrawerStackType,
	edits = 'Ada',
	onAppClose?: PodPageProps['onAppClose'],
): Promise<Closed> {
	const onClosed = vi.fn<Closed>();
	render(<PodPage stack={stack} onClosed={onClosed} onAppClose={onAppClose} />);

	await userEvent.click(screen.getByRole('button', { name: 'Open pod' }));
	await waitFor(() => {
		expect(panel('pod')).toBeVisible();
	});
	await userEvent.click(screen.getByRole('button', { name: 'Edit pod' }));
	await waitFor(() => {
		expect(panel('edit')).toBeVisible();
	});
	await waitForSettled();
	if (edits !== '') {
		await userEvent.type(screen.getByRole('textbox', { name: 'Name' }), edits);
	}

	return onClosed;
}

async function waitForQuestion(): Promise<void> {
	await waitFor(() => {
		expect(screen.getByRole('alertdialog', { name: 'Discard changes?' })).toBeVisible();
	});
	await waitForDialogSettled();
}

async function answer(name: 'Discard' | 'Keep editing'): Promise<void> {
	await userEvent.click(screen.getByRole('button', { name }));
	await waitFor(() => {
		expect(slot('alert-dialog-popup')).toBeNull();
	});
	await waitForSettled();
}

/**
 * The user actions that close the pod with the edit drawer open: the pod's close button with the
 * form over it, and, in a trail, the pod's crumb and the close button of the trail.
 */
const CLOSES: Array<{
	name: string;
	stack: DrawerStackType;
	reason: DrawerCloseReasonType;
	press: () => Promise<void>;
	podCloses: boolean;
}> = [
	{
		name: 'the close button of the pod under the form',
		stack: 'overlay',
		reason: 'close-press',
		press: async () => userEvent.click(screen.getByTestId('pod-close')),
		podCloses: true,
	},
	{
		name: 'the close button of the trail',
		stack: 'breadcrumb',
		reason: 'close-press',
		press: async () => userEvent.click(screen.getByTestId('edit-close')),
		podCloses: true,
	},
	{
		name: 'the crumb of the pod',
		stack: 'breadcrumb',
		reason: 'crumb-press',
		press: async () =>
			userEvent.click(
				within(screen.getByTestId('edit-trail-breadcrumb')).getByRole('button', {
					name: 'Pod api-7f9c',
				}),
			),
		podCloses: false,
	},
];

describe('Drawer closing with an unsaved form open over it', () => {
	it.each(CLOSES)(
		'closes the form first, then the pod when it should, on $name with no edits',
		async ({ stack, reason, press, podCloses }) => {
			const onClosed = await openPodAndEdit(stack, '');

			await press();
			await waitFor(() => {
				expect(queryPanel('edit')).toBeNull();
			});
			await waitForSettled();

			expect(screen.queryByRole('alertdialog')).toBeNull();
			if (podCloses) {
				expect(vi.mocked(onClosed).mock.calls).toEqual([
					['edit', reason],
					['pod', reason],
				]);
				expect(queryPanel('pod')).toBeNull();
			} else {
				expect(vi.mocked(onClosed).mock.calls).toEqual([['edit', reason]]);
				expect(panel('pod')).toBeVisible();
			}
		},
	);

	it.each(CLOSES)(
		'asks about the edits on $name, and keeps the form and the pod open',
		async ({ stack, reason, press }) => {
			const onClosed = await openPodAndEdit(stack);

			await press();
			await waitForQuestion();

			expect(vi.mocked(onClosed).mock.calls).toEqual([['edit', reason]]);
			expect(panel('pod')).toHaveAttribute('data-open');
			expect(panel('edit')).toHaveAttribute('data-open');
		},
	);

	it.each(CLOSES)(
		'goes back to the form with its edits on Keep editing after $name',
		async ({ stack, press }) => {
			const onClosed = await openPodAndEdit(stack);
			await press();
			await waitForQuestion();

			await answer('Keep editing');

			expect(vi.mocked(onClosed).mock.calls.map(([name]) => name)).toEqual(['edit']);
			expect(panel('pod')).toHaveAttribute('data-open');
			expect(panel('edit')).toHaveAttribute('data-open');
			expect(screen.getByRole('textbox', { name: 'Name' })).toHaveValue('Ada');
		},
	);

	it.each(CLOSES)(
		'closes only the form on Discard after $name, and the pod on the next press',
		async ({ stack, reason, press, podCloses }) => {
			const onClosed = await openPodAndEdit(stack);
			await press();
			await waitForQuestion();

			await answer('Discard');
			await waitFor(() => {
				expect(queryPanel('edit')).toBeNull();
			});

			expect(vi.mocked(onClosed).mock.calls).toEqual([['edit', reason]]);
			expect(panel('pod')).toBeVisible();

			if (!podCloses) {
				return;
			}
			await userEvent.click(screen.getByTestId('pod-close'));
			await waitFor(() => {
				expect(queryPanel('pod')).toBeNull();
			});

			expect(vi.mocked(onClosed).mock.calls).toEqual([
				['edit', reason],
				['pod', 'close-press'],
			]);
		},
	);

	it.each(['overlay', 'breadcrumb'] as const)(
		'opens the pod again without the form after it closed with it (%s)',
		async (stack) => {
			await openPodAndEdit(stack, '');

			await userEvent.click(screen.getByTestId(stack === 'overlay' ? 'pod-close' : 'edit-close'));
			await waitFor(() => {
				expect(queryPanel('pod')).toBeNull();
			});
			await userEvent.click(screen.getByRole('button', { name: 'Open pod' }));
			await waitFor(() => {
				expect(panel('pod')).toBeVisible();
			});
			await waitForSettled();

			expect(queryPanel('edit')).toBeNull();
		},
	);
});

type HandleName = 'pod' | 'trace' | 'log';
type Handles = Record<HandleName, DrawerHandleType>;

/**
 * A pod with a trace opened from it and a log opened from the trace, each on its own handle, so
 * the app can close the pod from anywhere.
 */
function HandlePage({
	onOpenChange,
	onHandles,
}: {
	onOpenChange: (name: HandleName, open: boolean) => void;
	onHandles: (handles: Handles) => void;
}): ReactNode {
	const pod = useDrawerHandle((open) => onOpenChange('pod', open));
	const trace = useDrawerHandle((open) => onOpenChange('trace', open));
	const log = useDrawerHandle((open) => onOpenChange('log', open));

	useEffect(() => {
		onHandles({ pod, trace, log });
	});

	return (
		<Drawer handle={pod} type="task" stack="overlay" title="Pod" testId="pod">
			<Drawer handle={trace} type="inspector" title="Trace" testId="trace">
				<Drawer handle={log} type="inspector" title="Log" testId="log">
					The log.
				</Drawer>
			</Drawer>
		</Drawer>
	);
}

/**
 * Opens the pod, the trace and the log, and returns the handles and the `onOpenChange` calls made
 * after that.
 */
async function openHandleChain(): Promise<{ handles: Handles; events: string[] }> {
	const events: string[] = [];
	const rendered: { handles?: Handles } = {};
	render(
		<HandlePage
			onOpenChange={(name, open) => events.push(`${name} ${open}`)}
			onHandles={(next) => {
				rendered.handles = next;
			}}
		/>,
	);
	const { handles } = rendered;
	if (!handles) {
		throw new Error('HandlePage gave no handles');
	}
	for (const name of ['pod', 'trace', 'log'] as const) {
		act(() => {
			handles[name].open();
		});
		await waitFor(() => {
			expect(document.querySelector(`[data-testid="${name}"]`)).not.toBeNull();
		});
	}
	await waitForSettled();
	events.length = 0;

	return { handles, events };
}

function exiting(name: string): HTMLElement {
	const element = document.querySelector<HTMLElement>(`[data-testid="${name}"]`);
	expect(element).not.toBeNull();
	expect(element).toHaveAttribute('data-ending-style');

	return element as HTMLElement;
}

describe('Drawer closed from the app with drawers open over it', () => {
	it('closes the form over it with parent-close, which skips the question', async () => {
		let closeFromApp = (): void => {};
		const onClosed = await openPodAndEdit('overlay', 'Ada', (close) => {
			closeFromApp = close;
		});

		act(() => {
			closeFromApp();
		});

		exiting('pod');
		exiting('edit');
		expect(vi.mocked(onClosed).mock.calls).toEqual([['edit', 'parent-close']]);

		await waitFor(() => {
			expect(queryPanel('pod')).toBeNull();
		});
		expect(screen.queryByRole('alertdialog')).toBeNull();

		await userEvent.click(screen.getByRole('button', { name: 'Open pod' }));
		await waitFor(() => {
			expect(panel('pod')).toBeVisible();
		});
		await waitForSettled();

		expect(queryPanel('edit')).toBeNull();
	});

	it('closes every drawer on a handle over it in the same commit, so they slide out together', async () => {
		const { handles, events } = await openHandleChain();

		act(() => {
			handles.pod.close();
		});

		for (const name of ['pod', 'trace', 'log']) {
			exiting(name);
		}
		expect(events).toEqual(['pod false', 'trace false', 'log false']);

		await waitFor(() => {
			expect(document.querySelector('[data-testid="pod"]')).toBeNull();
		});
		expect(events).toEqual(['pod false', 'trace false', 'log false']);
	});

	it('closes the drawers over it first when the user closes it, with no parent-close', async () => {
		const { events } = await openHandleChain();

		act(() => {
			screen.getByTestId('pod-close').click();
		});

		for (const name of ['pod', 'trace', 'log']) {
			exiting(name);
		}
		expect(events).toEqual(['log false', 'trace false', 'pod false']);
	});
});
