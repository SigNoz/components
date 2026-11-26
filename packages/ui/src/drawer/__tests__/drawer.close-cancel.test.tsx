import { act, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { type ReactNode, startTransition, useEffect, useState } from 'react';
import { flushSync } from 'react-dom';
import { describe, expect, it, vi } from 'vitest';
import { Drawer } from '../drawer.js';
import type { DrawerCloseDetailsType, DrawerCloseReasonType, DrawerStackType } from '../types.js';
import { waitForSettled } from './drawer.test-utils.js';

type Name = 'pod' | 'log';
type Closed = (name: Name, reason: DrawerCloseReasonType) => void;

/**
 * What the app does to the drawers: the `onClose` of each drawer and the test both get it.
 * `removePod` takes the pod out of the tree, the way a page that renders it only while a row is
 * selected does.
 */
interface Actions {
	closeLog: () => void;
	closePod: () => void;
	removePod: () => void;
}

type Handler = (
	reason: DrawerCloseReasonType,
	details: DrawerCloseDetailsType,
	actions: Actions,
) => void;

const closesPod: Handler = (_reason, _details, actions) => actions.closePod();
const closesLog: Handler = (_reason, _details, actions) => actions.closeLog();

interface PageProps {
	/**
	 * How the log opens from the pod: over it, or in its place with a breadcrumb trail.
	 */
	stack: DrawerStackType;
	podHandler: Handler;
	logHandler: Handler;
	onClosed: Closed;
	onActions: (actions: Actions) => void;
}

/**
 * A pod with a log over it, each with its own `open`, and the page state that renders the pod. What
 * each `onClose` does is up to the test, which is how the cases below differ.
 */
function CancelPage({ stack, podHandler, logHandler, onClosed, onActions }: PageProps): ReactNode {
	const [rendered, setRendered] = useState(true);
	const [podOpen, setPodOpen] = useState(true);
	const [logOpen, setLogOpen] = useState(true);
	const actions: Actions = {
		closeLog: () => setLogOpen(false),
		closePod: () => setPodOpen(false),
		removePod: () => setRendered(false),
	};

	useEffect(() => {
		onActions(actions);
	});

	return (
		<>
			<button
				type="button"
				onClick={() => {
					setRendered(true);
					setPodOpen(true);
					setLogOpen(true);
				}}
			>
				Open pod
			</button>
			{rendered ? (
				<Drawer
					type="task"
					stack={stack}
					open={podOpen}
					onClose={(reason, details) => {
						onClosed('pod', reason);
						podHandler(reason, details, actions);
					}}
					title="Pod"
					testId="pod"
				>
					<Drawer
						type="inspector"
						stack={stack}
						open={logOpen}
						onClose={(reason, details) => {
							onClosed('log', reason);
							logHandler(reason, details, actions);
						}}
						title="Log"
						testId="log"
					>
						<input aria-label="Log field" />
					</Drawer>
				</Drawer>
			) : null}
		</>
	);
}

function queryPanel(name: Name): HTMLElement | null {
	return document.querySelector<HTMLElement>(`[data-testid="${name}"]`);
}

async function waitForGone(...names: Name[]): Promise<void> {
	await waitFor(() => {
		for (const name of names) {
			expect(queryPanel(name)).toBeNull();
		}
	});
}

async function waitForOpen(...names: Name[]): Promise<void> {
	await waitFor(() => {
		for (const name of names) {
			expect(queryPanel(name)).not.toBeNull();
		}
	});
	await waitForSettled();
}

async function openPage({
	stack = 'overlay',
	podHandler = closesPod,
	logHandler = closesLog,
}: Partial<Pick<PageProps, 'stack' | 'podHandler' | 'logHandler'>> = {}): Promise<{
	onClosed: ReturnType<typeof vi.fn<Closed>>;
	closeFromApp: () => void;
}> {
	const onClosed = vi.fn<Closed>();
	let latest: Actions | undefined;
	render(
		<CancelPage
			stack={stack}
			podHandler={podHandler}
			logHandler={logHandler}
			onClosed={onClosed}
			onActions={(actions) => {
				latest = actions;
			}}
		/>,
	);
	await waitForOpen('pod', 'log');

	return {
		onClosed,
		closeFromApp: () => {
			act(() => {
				latest?.closePod();
			});
		},
	};
}

async function pressEscInLog(): Promise<void> {
	screen.getByRole('textbox', { name: 'Log field' }).focus();
	await userEvent.keyboard('{Escape}');
	await waitForSettled();
}

describe('Drawer closing with a drawer over it that closes after its onClose returned', () => {
	it('closes the pod on the same press when the log closes in a transition, with no parent-close for the log', async () => {
		const { onClosed } = await openPage({
			logHandler: (_reason, _details, actions) => {
				startTransition(actions.closeLog);
			},
		});

		await userEvent.click(screen.getByTestId('pod-close'));
		await waitForGone('pod', 'log');

		expect(onClosed.mock.calls).toEqual([
			['log', 'close-press'],
			['pod', 'close-press'],
		]);
	});

	it('closes the pod on the same press when the log closes in a timer, with no parent-close for the log', async () => {
		const { onClosed } = await openPage({
			logHandler: (_reason, _details, actions) => {
				setTimeout(actions.closeLog, 0);
			},
		});

		await userEvent.click(screen.getByTestId('pod-close'));
		await waitForGone('pod', 'log');

		expect(onClosed.mock.calls).toEqual([
			['log', 'close-press'],
			['pod', 'close-press'],
		]);
	});

	it('leaves the trail on the same press when the log closes in a transition, with no parent-close for the log', async () => {
		const { onClosed } = await openPage({
			stack: 'breadcrumb',
			logHandler: (_reason, _details, actions) => {
				startTransition(actions.closeLog);
			},
		});

		await userEvent.click(screen.getByTestId('log-close'));
		await waitForGone('pod', 'log');

		expect(onClosed.mock.calls).toEqual([
			['log', 'close-press'],
			['pod', 'close-press'],
		]);
	});
});

describe('Drawer that agreed to a close and has not closed yet', () => {
	it('gets one onClose when its handler synchronously removes the drawer below', async () => {
		const { onClosed } = await openPage({
			logHandler: (_reason, _details, actions) => {
				flushSync(actions.removePod);
			},
		});

		await userEvent.click(screen.getByTestId('log-close'));
		await waitForGone('pod', 'log');

		expect(onClosed.mock.calls).toEqual([['log', 'close-press']]);
	});

	it('gets one onClose for its own press when that press removes the drawer below in a transition', async () => {
		const { onClosed } = await openPage({
			// The transition starts in a task of its own. One started in the press would commit before
			// the press ends, as the test events run in `act`, and that is no test of a close that lands
			// after it.
			logHandler: (_reason, _details, actions) => {
				setTimeout(() => startTransition(actions.removePod), 0);
			},
		});

		await userEvent.click(screen.getByTestId('log-close'));
		await waitForGone('pod', 'log');

		expect(onClosed.mock.calls).toEqual([['log', 'close-press']]);
	});

	it('gets parent-close again once it cancelled a press of its own, when the app closes the drawer below', async () => {
		const { onClosed, closeFromApp } = await openPage({
			logHandler: (reason, details) => {
				if (reason === 'escape-key') {
					details.cancel();
				}
			},
		});

		await pressEscInLog();
		expect(onClosed.mock.calls).toEqual([['log', 'escape-key']]);
		expect(queryPanel('log')).toHaveAttribute('data-open');

		closeFromApp();
		await waitForGone('pod', 'log');

		expect(onClosed.mock.calls).toEqual([
			['log', 'escape-key'],
			['log', 'parent-close'],
		]);
	});

	it('gets parent-close again once a later press asked it and it cancelled, when the app closes the drawer below', async () => {
		let asks = 0;
		const { onClosed, closeFromApp } = await openPage({
			// The first press leaves it open with no `cancel()`, which counts as agreeing, as an app that
			// closes it later does. The second press asks it again.
			logHandler: (reason, details) => {
				if (reason === 'escape-key') {
					asks += 1;
					if (asks > 1) {
						details.cancel();
					}
				}
			},
		});

		await pressEscInLog();
		await pressEscInLog();
		expect(onClosed.mock.calls).toEqual([
			['log', 'escape-key'],
			['log', 'escape-key'],
		]);

		closeFromApp();
		await waitForGone('pod', 'log');

		expect(onClosed.mock.calls).toEqual([
			['log', 'escape-key'],
			['log', 'escape-key'],
			['log', 'parent-close'],
		]);
	});
});

describe('Drawer cancel()', () => {
	it('does nothing in onClose for parent-close, so the drawer unmounts with the one below', async () => {
		const { onClosed, closeFromApp } = await openPage({
			logHandler: (_reason, details) => {
				details.cancel();
			},
		});

		closeFromApp();
		await waitForGone('pod', 'log');

		expect(onClosed.mock.calls).toEqual([['log', 'parent-close']]);
	});

	it('does nothing when it is kept and called after onClose returned, for that press or a later one', async () => {
		const kept: Array<() => void> = [];
		const callKept = (): void => {
			for (const cancel of kept) {
				cancel();
			}
		};
		const { onClosed } = await openPage({
			// `Esc` leaves the log open without cancelling, which agrees to it. The press on the pod
			// closes it.
			logHandler: (reason, details, actions) => {
				kept.push(details.cancel);
				if (reason !== 'escape-key') {
					actions.closeLog();
				}
			},
			// The pod is asked after the log answered, so this is a late call within the same press.
			podHandler: (_reason, _details, actions) => {
				callKept();
				actions.closePod();
			},
		});

		await pressEscInLog();
		act(callKept);
		await userEvent.click(screen.getByTestId('pod-close'));
		await waitForGone('pod', 'log');

		expect(onClosed.mock.calls).toEqual([
			['log', 'escape-key'],
			['log', 'close-press'],
			['pod', 'close-press'],
		]);
	});

	it('keeps the drawer below open when its own onClose calls it after the drawer over it agreed', async () => {
		const { onClosed } = await openPage({
			logHandler: (_reason, _details, actions) => {
				startTransition(actions.closeLog);
			},
			podHandler: (_reason, details) => {
				details.cancel();
			},
		});

		await userEvent.click(screen.getByTestId('pod-close'));
		await waitForGone('log');
		await waitForSettled();

		expect(onClosed.mock.calls).toEqual([
			['log', 'close-press'],
			['pod', 'close-press'],
		]);
		expect(queryPanel('pod')).toHaveAttribute('data-open');
		expect(queryPanel('log')).toBeNull();
	});
});
