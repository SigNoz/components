import { act, render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { type ReactNode, StrictMode, Suspense, useEffect, useState } from 'react';
import { type Mock, describe, expect, it, vi } from 'vitest';
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
	// Also drops the question, which the pod closing from the app does not close on its own.
	const closeEdit = (): void => {
		setEditOpen(false);
		setName('');
		setConfirming(false);
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
					stack="overlay"
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
						onConfirm={closeEdit}
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

/**
 * A pod with a log over it, both kept in one stack of names, and each `onClose` drops the last name
 * from the stack it rendered with, not from the latest one.
 */
function StackPage(): ReactNode {
	const [stack, setStack] = useState(['pod', 'log']);
	const closeTop = (): void => {
		setStack(stack.slice(0, -1));
	};

	return (
		<Drawer
			stack="overlay"
			type="task"
			open={stack.includes('pod')}
			onClose={closeTop}
			title="Pod"
			testId="pod"
		>
			<Drawer
				stack="overlay"
				type="inspector"
				open={stack.includes('log')}
				onClose={closeTop}
				title="Log"
				testId="log"
			>
				The log.
			</Drawer>
		</Drawer>
	);
}

describe('Drawer closing with an app state of its own', () => {
	it('calls its own onClose from the render after the drawers over it closed', async () => {
		render(<StackPage />);
		await waitFor(() => {
			expect(document.querySelector('[data-testid="log"]')).not.toBeNull();
		});
		await waitForSettled();

		await userEvent.click(screen.getByTestId('pod-close'));

		await waitFor(() => {
			expect(document.querySelector('[data-testid="pod"]')).toBeNull();
		});
		expect(document.querySelector('[data-testid="log"]')).toBeNull();
	});
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
	shown = true,
}: {
	onOpenChange: (name: HandleName, open: boolean) => void;
	onHandles: (handles: Handles) => void;
	/**
	 * Whether the pod is rendered, so the app can remove it from the tree while it is open.
	 */
	shown?: boolean;
}): ReactNode {
	const pod = useDrawerHandle((open) => onOpenChange('pod', open));
	const trace = useDrawerHandle((open) => onOpenChange('trace', open));
	const log = useDrawerHandle((open) => onOpenChange('log', open));

	useEffect(() => {
		onHandles({ pod, trace, log });
	});

	return shown ? (
		<Drawer handle={pod} type="task" stack="overlay" title="Pod" testId="pod">
			<Drawer stack="overlay" handle={trace} type="inspector" title="Trace" testId="trace">
				<Drawer stack="overlay" handle={log} type="inspector" title="Log" testId="log">
					The log.
				</Drawer>
			</Drawer>
		</Drawer>
	) : null;
}

/**
 * Opens the pod, the trace and the log, and returns the handles, the `onOpenChange` calls made
 * after that, and a function that removes the pod from the tree.
 */
async function openHandleChain(): Promise<{
	handles: Handles;
	events: string[];
	removePod: () => void;
}> {
	const events: string[] = [];
	const rendered: { handles?: Handles } = {};
	const page = (shown: boolean): ReactNode => (
		<HandlePage
			shown={shown}
			onOpenChange={(name, open) => events.push(`${name} ${open}`)}
			onHandles={(next) => {
				rendered.handles = next;
			}}
		/>
	);
	const { rerender } = render(page(true));
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

	return { handles, events, removePod: () => rerender(page(false)) };
}

function exiting(name: string): HTMLElement {
	const element = document.querySelector<HTMLElement>(`[data-testid="${name}"]`);
	expect(element).not.toBeNull();
	expect(element).toHaveAttribute('data-ending-style');

	return element as HTMLElement;
}

type LevelName = 'trace' | 'log';

/**
 * A pod with a trace over it and a log over the trace, all controlled. The app keeps the drawers in
 * `keeps` open on `parent-close`, so they are there again with the pod. With `removesPod`, closing
 * the pod from the app takes it out of the tree, the way a page renders a drawer only while a row is
 * selected.
 */
function KeepOpenPage({
	keeps,
	removesPod = false,
	onClosed,
	onAppClose,
}: {
	keeps: LevelName[];
	removesPod?: boolean;
	onClosed: (name: LevelName, reason: DrawerCloseReasonType) => void;
	onAppClose: (close: () => void) => void;
}): ReactNode {
	const [podOpen, setPodOpen] = useState(true);
	const [traceOpen, setTraceOpen] = useState(true);
	const [logOpen, setLogOpen] = useState(true);

	useEffect(() => {
		onAppClose(() => setPodOpen(false));
	});

	return (
		<>
			<button type="button" onClick={() => setPodOpen(true)}>
				Open pod
			</button>
			{removesPod && !podOpen ? null : (
				<Drawer
					stack="overlay"
					type="task"
					open={podOpen}
					onClose={() => setPodOpen(false)}
					title="Pod"
					testId="pod"
				>
					<Drawer
						stack="overlay"
						type="inspector"
						open={traceOpen}
						onClose={(reason) => {
							onClosed('trace', reason);
							if (reason !== 'parent-close' || !keeps.includes('trace')) {
								setTraceOpen(false);
							}
						}}
						title="Trace"
						testId="trace"
					>
						<Drawer
							stack="overlay"
							type="inspector"
							open={logOpen}
							onClose={(reason) => {
								onClosed('log', reason);
								if (reason !== 'parent-close' || !keeps.includes('log')) {
									setLogOpen(false);
								}
							}}
							title="Log"
							testId="log"
						>
							The log.
						</Drawer>
					</Drawer>
				</Drawer>
			)}
		</>
	);
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

	it('drops the question of the form when the app closes it while the question is open', async () => {
		let closeFromApp = (): void => {};
		await openPodAndEdit('overlay', 'Ada', (close) => {
			closeFromApp = close;
		});
		await userEvent.click(screen.getByTestId('pod-close'));
		await waitForQuestion();

		act(() => {
			closeFromApp();
		});
		await waitFor(() => {
			expect(queryPanel('pod')).toBeNull();
		});
		expect(screen.queryByRole('alertdialog')).toBeNull();

		await userEvent.click(screen.getByRole('button', { name: 'Open pod' }));
		await userEvent.click(await screen.findByRole('button', { name: 'Edit pod' }));
		await waitFor(() => {
			expect(panel('edit')).toBeVisible();
		});
		await waitForSettled();

		expect(screen.queryByRole('alertdialog')).toBeNull();
	});

	it('closes every drawer on a handle over it in the same commit, so they slide out together', async () => {
		const { handles, events } = await openHandleChain();

		act(() => {
			handles.pod.close();
		});

		for (const name of ['pod', 'trace', 'log']) {
			exiting(name);
		}
		expect(events).toEqual(['pod false', 'log false', 'trace false']);

		await waitFor(() => {
			expect(document.querySelector('[data-testid="pod"]')).toBeNull();
		});
		expect(events).toEqual(['pod false', 'log false', 'trace false']);
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

	async function openKeepOpenPage(
		keeps: LevelName[],
		{ removesPod = false, strict = false } = {},
	): Promise<{
		onClosed: Mock<(name: LevelName, reason: DrawerCloseReasonType) => void>;
		closeFromApp: () => void;
	}> {
		const onClosed = vi.fn<(name: LevelName, reason: DrawerCloseReasonType) => void>();
		const app = { close: (): void => {} };
		const page = (
			<KeepOpenPage
				keeps={keeps}
				removesPod={removesPod}
				onClosed={onClosed}
				onAppClose={(close) => {
					app.close = close;
				}}
			/>
		);
		render(strict ? <StrictMode>{page}</StrictMode> : page);
		await waitFor(() => {
			expect(document.querySelector('[data-testid="log"]')).not.toBeNull();
		});
		await waitForSettled();

		return { onClosed, closeFromApp: () => app.close() };
	}

	it('closes the drawers over one the app keeps open, which unmount with it', async () => {
		const { onClosed, closeFromApp } = await openKeepOpenPage(['trace']);

		act(() => {
			closeFromApp();
		});

		expect(onClosed.mock.calls).toEqual([
			['log', 'parent-close'],
			['trace', 'parent-close'],
		]);
		await waitFor(() => {
			expect(document.querySelector('[data-testid="pod"]')).toBeNull();
		});

		await userEvent.click(screen.getByRole('button', { name: 'Open pod' }));
		await waitFor(() => {
			expect(document.querySelector('[data-testid="trace"]')).not.toBeNull();
		});
		await waitForSettled();

		expect(document.querySelector('[data-testid="log"]')).toBeNull();
		expect(onClosed).toHaveBeenCalledTimes(2);
	});

	it('tells a drawer the app keeps open once, while each drawer below it closes', async () => {
		const { onClosed, closeFromApp } = await openKeepOpenPage(['log']);

		act(() => {
			closeFromApp();
		});
		await waitFor(() => {
			expect(document.querySelector('[data-testid="pod"]')).toBeNull();
		});

		expect(onClosed.mock.calls).toEqual([
			['log', 'parent-close'],
			['trace', 'parent-close'],
		]);
	});

	it('tells a drawer the app keeps open again after the drawer below it opens again', async () => {
		const { onClosed, closeFromApp } = await openKeepOpenPage(['trace', 'log']);

		act(() => {
			closeFromApp();
		});
		// Open again while it slides out, so the drawers over it never unmount.
		act(() => {
			screen.getByRole('button', { name: 'Open pod' }).click();
		});
		await waitForSettled();
		expect(document.querySelector('[data-testid="log"]')).not.toBeNull();

		act(() => {
			closeFromApp();
		});

		expect(onClosed.mock.calls).toEqual([
			['log', 'parent-close'],
			['trace', 'parent-close'],
			['log', 'parent-close'],
			['trace', 'parent-close'],
		]);
	});

	it('tells the drawers over a drawer the app removes while it is open, the one on top first', async () => {
		const errors = vi.spyOn(console, 'error');
		try {
			const { onClosed, closeFromApp } = await openKeepOpenPage([], { removesPod: true });

			act(() => {
				closeFromApp();
			});

			expect(document.querySelector('[data-testid="pod"]')).toBeNull();
			expect(onClosed.mock.calls).toEqual([
				['log', 'parent-close'],
				['trace', 'parent-close'],
			]);
			// The app's `onClose` sets state while React deletes the drawers, which must not warn.
			const reported = errors.mock.calls
				.map(([message]) => String(message))
				.filter((message) => !message.includes('not wrapped in act('));
			expect(reported).toEqual([]);
		} finally {
			errors.mockRestore();
		}
	});

	it('opens the next drawer without the ones that were over the one the app removed', async () => {
		const { closeFromApp } = await openKeepOpenPage([], { removesPod: true });
		act(() => {
			closeFromApp();
		});

		await userEvent.click(screen.getByRole('button', { name: 'Open pod' }));
		await waitFor(() => {
			expect(document.querySelector('[data-testid="pod"]')).not.toBeNull();
		});
		await waitForSettled();

		expect(document.querySelector('[data-testid="trace"]')).toBeNull();
		expect(document.querySelector('[data-testid="log"]')).toBeNull();
	});

	it.each([
		{ keeps: ['trace'] as LevelName[] },
		{ keeps: ['log'] as LevelName[] },
		{ keeps: ['trace', 'log'] as LevelName[] },
	])(
		'tells a drawer the app keeps open once when the app removes the drawer below it, keeping $keeps',
		async ({ keeps }) => {
			const { onClosed, closeFromApp } = await openKeepOpenPage(keeps, { removesPod: true });

			act(() => {
				closeFromApp();
			});
			await act(async () => {});

			expect(onClosed.mock.calls).toEqual([
				['log', 'parent-close'],
				['trace', 'parent-close'],
			]);
		},
	);

	it('closes every drawer on a handle over a drawer the app removes, once each, the one on top first', async () => {
		const { events, removePod } = await openHandleChain();

		act(() => {
			removePod();
		});
		await act(async () => {});

		expect(events).toEqual(['log false', 'trace false', 'pod false']);
	});

	it('tells the drawers over a drawer nothing when Strict Mode mounts it', async () => {
		const { onClosed } = await openKeepOpenPage(['trace', 'log'], { strict: true });
		await act(async () => {});

		expect(onClosed).not.toHaveBeenCalled();
		expect(document.querySelector('[data-testid="trace"]')).not.toBeNull();
		expect(document.querySelector('[data-testid="log"]')).not.toBeNull();
	});

	it('tells the drawers over a drawer the app removes in Strict Mode', async () => {
		const { onClosed, closeFromApp } = await openKeepOpenPage([], {
			removesPod: true,
			strict: true,
		});

		act(() => {
			closeFromApp();
		});
		await act(async () => {});

		expect(onClosed.mock.calls).toEqual([
			['log', 'parent-close'],
			['trace', 'parent-close'],
		]);
	});
});

/**
 * A pod with a log over it, both rendered from one selection, the way a page shows a row's drawers.
 * The log's `onClose` clears the selection, which closes the pod too. With `removesPod`, the pod
 * renders only while something is selected.
 */
function SelectionPage({
	removesPod,
	onPodClose,
}: {
	removesPod: boolean;
	onPodClose: (reason: DrawerCloseReasonType) => void;
}): ReactNode {
	const [selected, setSelected] = useState<'pod' | 'log' | null>('log');

	if (removesPod && selected === null) {
		return null;
	}

	return (
		<Drawer
			type="task"
			stack="overlay"
			open={selected !== null}
			onClose={(reason) => {
				onPodClose(reason);
				setSelected(null);
			}}
			title="Pod"
			testId="pod"
		>
			<Drawer
				type="inspector"
				stack="overlay"
				open={selected === 'log'}
				onClose={() => setSelected(null)}
				title="Log"
				testId="log"
			>
				The log.
			</Drawer>
		</Drawer>
	);
}

describe('Drawer closed by the onClose of a drawer over it', () => {
	it.each([
		['stays mounted', false],
		['is removed', true],
	])('does not call its own onClose when it %s', async (_name, removesPod) => {
		const onPodClose = vi.fn();
		render(<SelectionPage removesPod={removesPod} onPodClose={onPodClose} />);
		await waitForSettled();

		await userEvent.click(screen.getByTestId('pod-close'));

		await waitFor(() => {
			expect(document.querySelector('[data-testid="pod"]')).toBeNull();
		});
		expect(onPodClose).not.toHaveBeenCalled();
	});
});

/**
 * A pod that stays mounted, with a log over it that the page renders only while the pod is open.
 */
function PodWithLogWhileOpen({
	onLogClose,
	onAppClose,
}: {
	onLogClose: (reason: DrawerCloseReasonType) => void;
	onAppClose: (close: () => void, open: () => void) => void;
}): ReactNode {
	const [podOpen, setPodOpen] = useState(true);
	const [logOpen, setLogOpen] = useState(true);

	useEffect(() => {
		onAppClose(
			() => setPodOpen(false),
			() => setPodOpen(true),
		);
	});

	return (
		<Drawer
			type="task"
			stack="overlay"
			open={podOpen}
			onClose={() => setPodOpen(false)}
			title="Pod"
			testId="pod"
		>
			{podOpen ? (
				<Drawer
					type="inspector"
					stack="overlay"
					open={logOpen}
					onClose={(reason) => {
						onLogClose(reason);
						setLogOpen(false);
					}}
					title="Log"
					testId="log"
				>
					The log.
				</Drawer>
			) : null}
		</Drawer>
	);
}

describe('Drawer closed from the app with a drawer it renders only while open', () => {
	it('sends parent-close to that drawer, so it is not back with the pod', async () => {
		const onLogClose = vi.fn();
		let closeFromApp = (): void => {};
		let openFromApp = (): void => {};
		render(
			<PodWithLogWhileOpen
				onLogClose={onLogClose}
				onAppClose={(close, open) => {
					closeFromApp = close;
					openFromApp = open;
				}}
			/>,
		);
		await waitForSettled();

		act(() => {
			closeFromApp();
		});

		expect(onLogClose.mock.calls).toEqual([['parent-close']]);
		await waitFor(() => {
			expect(document.querySelector('[data-testid="pod"]')).toBeNull();
		});

		act(() => {
			openFromApp();
		});
		await waitFor(() => {
			expect(document.querySelector('[data-testid="pod"]')).not.toBeNull();
		});
		await waitForSettled();
		expect(document.querySelector('[data-testid="log"]')).toBeNull();
	});
});

const pending = new Promise<never>(() => {});

/**
 * Suspends while `suspends` is set, the way a lazy chart or a query does.
 */
function Loading({ suspends }: { suspends: boolean }): ReactNode {
	if (suspends) {
		throw pending;
	}

	return null;
}

/**
 * A pod with a log over it, in a Suspense boundary that is already showing them.
 */
function SuspendingPage({
	suspends,
	onLogClose,
}: {
	suspends: boolean;
	onLogClose: (reason: DrawerCloseReasonType) => void;
}): ReactNode {
	return (
		<Suspense fallback={<p>Loading</p>}>
			<Drawer type="task" stack="overlay" open onClose={() => {}} title="Pod" testId="pod">
				<Drawer type="inspector" stack="overlay" open onClose={onLogClose} title="Log" testId="log">
					The log.
				</Drawer>
			</Drawer>
			<Loading suspends={suspends} />
		</Suspense>
	);
}

describe('Drawer hidden by a Suspense fallback with a drawer open over it', () => {
	it('tells that drawer nothing, and both are back when the content is', async () => {
		const onLogClose = vi.fn();
		const { rerender } = render(<SuspendingPage suspends={false} onLogClose={onLogClose} />);
		await waitForSettled();

		act(() => {
			rerender(<SuspendingPage suspends onLogClose={onLogClose} />);
		});
		expect(screen.getByText('Loading')).toBeInTheDocument();

		act(() => {
			rerender(<SuspendingPage suspends={false} onLogClose={onLogClose} />);
		});
		await waitForSettled();

		expect(onLogClose).not.toHaveBeenCalled();
		expect(document.querySelector('[data-testid="log"]')).not.toBeNull();
	});
});
