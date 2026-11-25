import { act, render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { type ReactNode, useEffect, useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { Drawer } from '../drawer.js';
import type { DrawerCloseDetailsType, DrawerCloseReasonType, DrawerStackType } from '../types.js';
import { waitForSettled } from './drawer.test-utils.js';

type Name = 'pod' | 'form' | 'trace' | 'log' | 'entity';
type Closed = (name: Name, reason: DrawerCloseReasonType) => void;

/**
 * What the app does to the drawers. `remove` takes a drawer, and the drawers declared in it, out of
 * the tree, the way a page that renders it only while a row is selected does.
 */
interface App {
	close: (name: Name) => void;
	remove: (name: Name) => void;
}

type Handler = (
	reason: DrawerCloseReasonType,
	details: DrawerCloseDetailsType,
	app: App,
) => void | Promise<void>;

interface Deferred {
	promise: Promise<void>;
	resolve: () => void;
	reject: (error: unknown) => void;
}

function deferred(): Deferred {
	let resolve: Deferred['resolve'] = () => {};
	let reject: Deferred['reject'] = () => {};
	const promise = new Promise<void>((res, rej) => {
		resolve = res;
		reject = rej;
	});

	return { promise, resolve, reject };
}

const ALL_SHOWN: Record<Name, boolean> = {
	pod: true,
	form: true,
	trace: true,
	log: true,
	entity: true,
};

interface ChainProps {
	chain: readonly Name[];
	index: number;
	stack: DrawerStackType;
	open: Record<Name, boolean>;
	rendered: Record<Name, boolean>;
	handlers: Partial<Record<Name, Handler>>;
	onClosed: Closed;
	app: App;
}

/**
 * The drawer at `index` of `chain`, with the rest of the chain declared in it. The first is a `task`
 * and the others are inspectors, so a drawer under an overlay keeps its close button usable. A
 * drawer with no handler closes on every request.
 */
function ChainDrawer(props: ChainProps): ReactNode {
	const { chain, index, stack, open, rendered, handlers, onClosed, app } = props;
	const name = chain[index];
	if (name === undefined || !rendered[name]) {
		return null;
	}

	const onClose = (reason: DrawerCloseReasonType, details: DrawerCloseDetailsType) => {
		onClosed(name, reason);
		const handler = handlers[name];
		if (handler === undefined) {
			app.close(name);
			return undefined;
		}

		return handler(reason, details, app);
	};
	const content = (
		<>
			<input aria-label={`${name} field`} />
			<ChainDrawer {...props} index={index + 1} />
		</>
	);

	return index === 0 ? (
		<Drawer
			type="task"
			stack={stack}
			open={open[name]}
			onClose={onClose}
			title={name}
			testId={name}
		>
			{content}
		</Drawer>
	) : (
		<Drawer
			type="inspector"
			stack={stack}
			open={open[name]}
			onClose={onClose}
			title={name}
			testId={name}
		>
			{content}
		</Drawer>
	);
}

interface PageProps {
	chain: readonly Name[];
	stack: DrawerStackType;
	handlers: Partial<Record<Name, Handler>>;
	onClosed: Closed;
	onApp: (app: App) => void;
}

function AsyncPage({ chain, stack, handlers, onClosed, onApp }: PageProps): ReactNode {
	const [open, setOpen] = useState(ALL_SHOWN);
	const [rendered, setRendered] = useState(ALL_SHOWN);
	const app: App = {
		close: (name) => setOpen((current) => ({ ...current, [name]: false })),
		remove: (name) => setRendered((current) => ({ ...current, [name]: false })),
	};

	useEffect(() => {
		onApp(app);
	});

	return (
		<>
			<button
				type="button"
				onClick={() => {
					setOpen(ALL_SHOWN);
					setRendered(ALL_SHOWN);
				}}
			>
				Open all
			</button>
			<ChainDrawer
				chain={chain}
				index={0}
				stack={stack}
				open={open}
				rendered={rendered}
				handlers={handlers}
				onClosed={onClosed}
				app={app}
			/>
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

async function waitForOpen(...names: readonly Name[]): Promise<void> {
	await waitFor(() => {
		for (const name of names) {
			expect(queryPanel(name)).toHaveAttribute('data-open');
		}
	});
	await waitForSettled();
}

/**
 * Lets the tasks queued so far run, and React commit what they did, before a test checks that
 * nothing more happened.
 */
async function letTasksRun(): Promise<void> {
	await act(async () => {
		await new Promise((resolve) => {
			setTimeout(resolve, 20);
		});
	});
	await waitForSettled();
}

async function openPage({
	chain,
	stack = 'overlay',
	handlers = {},
}: {
	chain: readonly Name[];
	stack?: DrawerStackType;
	handlers?: Partial<Record<Name, Handler>>;
}): Promise<{ onClosed: ReturnType<typeof vi.fn<Closed>>; app: App }> {
	const onClosed = vi.fn<Closed>();
	let latest: App | undefined;
	render(
		<AsyncPage
			chain={chain}
			stack={stack}
			handlers={handlers}
			onClosed={onClosed}
			onApp={(app) => {
				latest = app;
			}}
		/>,
	);
	await waitForOpen(...chain);

	const fromApp =
		(action: keyof App) =>
		(name: Name): void => {
			act(() => {
				latest?.[action](name);
			});
		};

	return { onClosed, app: { close: fromApp('close'), remove: fromApp('remove') } };
}

async function press(testId: string): Promise<void> {
	await userEvent.click(screen.getByTestId(testId));
}

/**
 * A form that saves or asks before it closes: it waits for `gate`, then closes, or calls `cancel()`
 * when `refuses`. `parent-close` cannot be refused, so it closes at once for that one.
 */
function waitsFor(gate: Promise<void>, { refuses = false } = {}): Handler {
	return async (reason, { cancel }, app) => {
		if (reason === 'parent-close') {
			app.close('form');
			return;
		}
		await gate;
		if (refuses) {
			cancel();
		} else {
			app.close('form');
		}
	};
}

describe('Drawer closing with a drawer over it whose onClose returns a promise', () => {
	it('waits for the form before it asks the pod, then closes the form and the pod in that order', async () => {
		const gate = deferred();
		const { onClosed } = await openPage({
			chain: ['pod', 'form'],
			handlers: { form: waitsFor(gate.promise) },
		});

		await press('pod-close');
		await letTasksRun();

		expect(onClosed.mock.calls).toEqual([['form', 'close-press']]);
		expect(queryPanel('pod')).toHaveAttribute('data-open');
		expect(queryPanel('form')).toHaveAttribute('data-open');

		gate.resolve();
		await waitForGone('pod', 'form');

		expect(onClosed.mock.calls).toEqual([
			['form', 'close-press'],
			['pod', 'close-press'],
		]);
	});

	it('keeps the form and the pod open, and never asks the pod, when the form calls cancel() after its await', async () => {
		const gate = deferred();
		const { onClosed } = await openPage({
			chain: ['pod', 'form'],
			handlers: { form: waitsFor(gate.promise, { refuses: true }) },
		});

		await press('pod-close');
		gate.resolve();
		await letTasksRun();

		expect(onClosed.mock.calls).toEqual([['form', 'close-press']]);
		expect(queryPanel('pod')).toHaveAttribute('data-open');
		expect(queryPanel('form')).toHaveAttribute('data-open');
	});

	it('counts a promise that rejects as cancel(), and reports its error', async () => {
		const reported = vi.spyOn(globalThis, 'reportError').mockImplementation(() => {});
		try {
			const gate = deferred();
			const failure = new Error('The save failed');
			const { onClosed } = await openPage({
				chain: ['pod', 'form'],
				handlers: { form: waitsFor(gate.promise) },
			});

			await press('pod-close');
			gate.reject(failure);
			await letTasksRun();

			expect(reported).toHaveBeenCalledExactlyOnceWith(failure);
			expect(onClosed.mock.calls).toEqual([['form', 'close-press']]);
			expect(queryPanel('pod')).toHaveAttribute('data-open');
			expect(queryPanel('form')).toHaveAttribute('data-open');
		} finally {
			reported.mockRestore();
		}
	});

	it('ignores another press on the pod, and the close button of the form, while the form decides', async () => {
		const gate = deferred();
		const { onClosed } = await openPage({
			chain: ['pod', 'form'],
			handlers: { form: waitsFor(gate.promise) },
		});

		await press('pod-close');
		await press('pod-close');
		await press('form-close');
		await letTasksRun();

		expect(onClosed.mock.calls).toEqual([['form', 'close-press']]);

		gate.resolve();
		await waitForGone('pod', 'form');

		expect(onClosed.mock.calls).toEqual([
			['form', 'close-press'],
			['pod', 'close-press'],
		]);
	});

	it('sends parent-close to the form when the app closes the pod while the form decides, and asks the pod nothing', async () => {
		const gate = deferred();
		const { onClosed, app } = await openPage({
			chain: ['pod', 'form'],
			handlers: { form: waitsFor(gate.promise) },
		});

		await press('pod-close');
		await letTasksRun();
		app.close('pod');
		await waitForGone('pod', 'form');

		expect(onClosed.mock.calls).toEqual([
			['form', 'close-press'],
			['form', 'parent-close'],
		]);

		gate.resolve();
		await letTasksRun();

		expect(onClosed.mock.calls).toEqual([
			['form', 'close-press'],
			['form', 'parent-close'],
		]);
	});

	it('ignores every press on the form and the pod while a promise never settles, until the app opens the pod again', async () => {
		let asks = 0;
		const { onClosed, app } = await openPage({
			chain: ['pod', 'form'],
			handlers: {
				form: (reason, _details, actions) => {
					if (reason === 'close-press') {
						asks += 1;
						if (asks === 1) {
							return new Promise<void>(() => {});
						}
					}
					actions.close('form');
					return undefined;
				},
			},
		});

		await press('pod-close');
		await press('pod-close');
		await press('form-close');
		await letTasksRun();

		expect(onClosed.mock.calls).toEqual([['form', 'close-press']]);

		app.close('pod');
		await waitForGone('pod', 'form');
		await userEvent.click(screen.getByRole('button', { name: 'Open all' }));
		await waitForOpen('pod', 'form');
		await press('pod-close');
		await waitForGone('pod', 'form');

		expect(onClosed.mock.calls).toEqual([
			['form', 'close-press'],
			['form', 'parent-close'],
			['form', 'close-press'],
			['pod', 'close-press'],
		]);
	});
});

describe('Drawer whose own async onClose removes the drawer below', () => {
	// The removal lands in a task of its own after the promise settled, as an `await` then
	// `router.back()` does in an app, so the gate opens outside `act`.
	it('gets one onClose, for its own press, and no parent-close', async () => {
		const gate = deferred();
		const { onClosed } = await openPage({
			chain: ['pod', 'log'],
			handlers: {
				log: async (reason, _details, app) => {
					if (reason === 'close-press') {
						await gate.promise;
						app.remove('pod');
					}
				},
			},
		});

		await press('log-close');
		gate.resolve();
		await waitForGone('pod', 'log');

		expect(onClosed.mock.calls).toEqual([['log', 'close-press']]);
	});
});

describe('Drawer with a synchronous onClose', () => {
	// A promise answer would ask the pod in a microtask, after the log's own microtask.
	it('asks the drawer below in the same call, before any microtask the drawer over it queued', async () => {
		const order: string[] = [];
		await openPage({
			chain: ['pod', 'log'],
			handlers: {
				log: (_reason, _details, app) => {
					queueMicrotask(() => {
						order.push('microtask');
					});
					order.push('log');
					app.close('log');
				},
				pod: (_reason, _details, app) => {
					order.push('pod');
					app.close('pod');
				},
			},
		});

		await press('pod-close');
		await waitForGone('pod', 'log');

		expect(order).toEqual(['log', 'pod', 'microtask']);
	});
});

describe('Drawer leaving a trail with a drawer in it whose onClose returns a promise', () => {
	function tracePausesOn(gate: Promise<void>, { refuses = false } = {}): Handler {
		return async (reason, { cancel }, app) => {
			if (reason !== 'parent-close') {
				await gate;
			}
			if (refuses) {
				cancel();
			} else {
				app.close('trace');
			}
		};
	}

	it('waits for the trace in the middle, then goes on to the pod when it agrees', async () => {
		const gate = deferred();
		const { onClosed } = await openPage({
			chain: ['pod', 'trace', 'log'],
			stack: 'breadcrumb',
			handlers: { trace: tracePausesOn(gate.promise) },
		});

		await press('log-close');
		await waitForGone('log');
		await letTasksRun();

		expect(onClosed.mock.calls).toEqual([
			['log', 'close-press'],
			['trace', 'close-press'],
		]);
		expect(queryPanel('pod')).toHaveAttribute('data-open');

		gate.resolve();
		await waitForGone('pod', 'trace');

		expect(onClosed.mock.calls).toEqual([
			['log', 'close-press'],
			['trace', 'close-press'],
			['pod', 'close-press'],
		]);
	});

	it('stops at the trace in the middle when it calls cancel() after its await', async () => {
		const gate = deferred();
		const { onClosed } = await openPage({
			chain: ['pod', 'trace', 'log'],
			stack: 'breadcrumb',
			handlers: { trace: tracePausesOn(gate.promise, { refuses: true }) },
		});

		await press('log-close');
		gate.resolve();
		await waitForGone('log');
		await letTasksRun();

		expect(onClosed.mock.calls).toEqual([
			['log', 'close-press'],
			['trace', 'close-press'],
		]);
		expect(queryPanel('trace')).toHaveAttribute('data-open');
		expect(queryPanel('pod')).not.toBeNull();
	});

	it('goes on to the pod when the app removes the trace while the log on top decides', async () => {
		const gate = deferred();
		const { onClosed, app } = await openPage({
			chain: ['pod', 'trace', 'log'],
			stack: 'breadcrumb',
			handlers: {
				log: async (reason, _details, actions) => {
					if (reason !== 'parent-close') {
						await gate.promise;
					}
					actions.close('log');
				},
			},
		});

		await press('log-close');
		await letTasksRun();
		app.remove('trace');
		await waitForGone('trace', 'log');

		expect(onClosed.mock.calls).toEqual([
			['log', 'close-press'],
			['log', 'parent-close'],
		]);

		gate.resolve();
		await waitForGone('pod');

		expect(onClosed.mock.calls).toEqual([
			['log', 'close-press'],
			['log', 'parent-close'],
			['pod', 'close-press'],
		]);
	});
});

const STEPS = ['node', 'pod'] as const;

/**
 * A drawer that shows its own trail, `node` then `pod`, with an inspector over it whose `onClose`
 * is up to the test.
 */
function StepPage({
	logHandler,
	onSelect,
	onClosed,
	onApp,
}: {
	logHandler: Handler;
	onSelect: (index: number) => void;
	onClosed: Closed;
	onApp: (app: App) => void;
}): ReactNode {
	const [step, setStep] = useState(1);
	const [open, setOpen] = useState(ALL_SHOWN);
	const [rendered, setRendered] = useState(ALL_SHOWN);
	const app: App = {
		close: (name) => setOpen((current) => ({ ...current, [name]: false })),
		remove: (name) => setRendered((current) => ({ ...current, [name]: false })),
	};

	useEffect(() => {
		onApp(app);
	});

	return (
		<Drawer
			type="inspector"
			stack="overlay"
			open={open.entity}
			onClose={(reason) => {
				onClosed('entity', reason);
				app.close('entity');
			}}
			title={STEPS[step] ?? 'node'}
			trail={STEPS.slice(0, step).map((title) => ({ title }))}
			onTrailSelect={(index) => {
				onSelect(index);
				setStep(index);
			}}
			testId="entity"
		>
			<p>{`The ${STEPS[step] ?? 'node'}.`}</p>
			{rendered.log ? (
				<Drawer
					type="inspector"
					stack="overlay"
					open={open.log}
					onClose={(reason, details) => {
						onClosed('log', reason);
						return logHandler(reason, details, app);
					}}
					title="log"
					testId="log"
				>
					The log.
				</Drawer>
			) : null}
		</Drawer>
	);
}

async function openSteps(logHandler: Handler): Promise<{
	onClosed: ReturnType<typeof vi.fn<Closed>>;
	onSelect: ReturnType<typeof vi.fn<(index: number) => void>>;
	app: App;
}> {
	const onClosed = vi.fn<Closed>();
	const onSelect = vi.fn<(index: number) => void>();
	let latest: App | undefined;
	render(
		<StepPage
			logHandler={logHandler}
			onSelect={onSelect}
			onClosed={onClosed}
			onApp={(app) => {
				latest = app;
			}}
		/>,
	);
	await waitForOpen('entity', 'log');

	return {
		onClosed,
		onSelect,
		app: {
			close: (name) => {
				act(() => {
					latest?.close(name);
				});
			},
			remove: (name) => {
				act(() => {
					latest?.remove(name);
				});
			},
		},
	};
}

async function pressNodeCrumb(): Promise<void> {
	await userEvent.click(
		within(screen.getByTestId('entity-trail-breadcrumb')).getByRole('button', { name: 'node' }),
	);
}

function logPausesOn(gate: Promise<void>, { refuses = false } = {}): Handler {
	return async (reason, { cancel }, app) => {
		if (reason !== 'parent-close') {
			await gate;
		}
		if (refuses && reason !== 'parent-close') {
			cancel();
		} else {
			app.close('log');
		}
	};
}

describe('Drawer stepping back in its own trail under an inspector whose onClose returns a promise', () => {
	it('shows the step once the inspector agreed', async () => {
		const gate = deferred();
		const { onClosed, onSelect } = await openSteps(logPausesOn(gate.promise));

		await pressNodeCrumb();
		await letTasksRun();

		expect(onClosed.mock.calls).toEqual([['log', 'crumb-press']]);
		expect(onSelect).not.toHaveBeenCalled();

		gate.resolve();
		expect(await screen.findByText('The node.')).toBeVisible();

		expect(onSelect.mock.calls).toEqual([[0]]);
		expect(onClosed.mock.calls).toEqual([['log', 'crumb-press']]);
	});

	it('shows no step when the inspector calls cancel() after its await', async () => {
		const gate = deferred();
		const { onClosed, onSelect } = await openSteps(logPausesOn(gate.promise, { refuses: true }));

		await pressNodeCrumb();
		gate.resolve();
		await letTasksRun();

		expect(onClosed.mock.calls).toEqual([['log', 'crumb-press']]);
		expect(onSelect).not.toHaveBeenCalled();
		expect(queryPanel('log')).toHaveAttribute('data-open');
		expect(screen.getByText('The pod.')).toBeInTheDocument();
	});

	it('shows no step when the app closes the drawer while the inspector decides', async () => {
		const gate = deferred();
		const { onClosed, onSelect, app } = await openSteps(logPausesOn(gate.promise));

		await pressNodeCrumb();
		await letTasksRun();
		app.close('entity');
		await waitForGone('entity', 'log');
		gate.resolve();
		await letTasksRun();

		expect(onSelect).not.toHaveBeenCalled();
		expect(onClosed.mock.calls).toEqual([
			['log', 'crumb-press'],
			['log', 'parent-close'],
		]);
	});
});

describe('Drawer whose async onClose answer lands after it opened again', () => {
	it('does not count the old answer for the form the app opened again with the pod', async () => {
		const gate = deferred();
		const { onClosed, app } = await openPage({
			chain: ['pod', 'form'],
			handlers: {
				form: async (reason, _details, actions) => {
					if (reason === 'parent-close') {
						actions.close('form');
						return;
					}
					await gate.promise;
				},
			},
		});

		await press('pod-close');
		await letTasksRun();
		app.close('pod');
		await waitForGone('pod', 'form');
		await userEvent.click(screen.getByRole('button', { name: 'Open all' }));
		await waitForOpen('pod', 'form');
		gate.resolve();
		await letTasksRun();
		app.close('pod');
		await waitForGone('pod', 'form');

		expect(onClosed.mock.calls).toEqual([
			['form', 'close-press'],
			['form', 'parent-close'],
			['form', 'parent-close'],
		]);
	});

	it('skips the pod onClose when the form removes the pod after its await', async () => {
		const gate = deferred();
		const { onClosed } = await openPage({
			chain: ['pod', 'form'],
			handlers: {
				form: async (reason, _details, actions) => {
					if (reason === 'parent-close') {
						actions.close('form');
						return;
					}
					await gate.promise;
					actions.remove('pod');
				},
			},
		});

		await press('pod-close');
		gate.resolve();
		await waitForGone('pod', 'form');

		expect(onClosed.mock.calls).toEqual([['form', 'close-press']]);
	});

	it('skips the pod onClose when the form removes the pod at once', async () => {
		const { onClosed } = await openPage({
			chain: ['pod', 'form'],
			handlers: {
				form: (reason, _details, actions) => {
					actions.remove('pod');
				},
			},
		});

		await press('pod-close');
		await waitForGone('pod', 'form');

		expect(onClosed.mock.calls).toEqual([['form', 'close-press']]);
	});
	it('does not close the pod on the old answer of a form that closed and opened again, and the form still gets parent-close', async () => {
		const gate = deferred();
		const { onClosed, app } = await openPage({
			chain: ['pod', 'form'],
			handlers: {
				form: async (reason, _details, actions) => {
					actions.close('form');
					if (reason !== 'parent-close') {
						await gate.promise;
					}
				},
			},
		});

		await press('pod-close');
		await waitForGone('form');
		await userEvent.click(screen.getByRole('button', { name: 'Open all', hidden: true }));
		await waitForOpen('pod', 'form');
		gate.resolve();
		await letTasksRun();
		const afterResolve = [...onClosed.mock.calls];
		if (queryPanel('pod') !== null) {
			app.close('pod');
		}
		await waitForGone('pod', 'form');

		expect({ afterResolve, all: onClosed.mock.calls }).toEqual({
			afterResolve: [['form', 'close-press']],
			all: [
				['form', 'close-press'],
				['form', 'parent-close'],
			],
		});
	});
});
