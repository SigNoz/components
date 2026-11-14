import { render, screen, waitFor, within } from '@testing-library/react';
import { forwardRef, type MouseEvent, type ReactNode, useEffect, useState } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { userEvent as browserUser } from 'vitest/browser';
import type { BreadcrumbEllipsisOptions } from '../../breadcrumb/types.js';
import { Drawer } from '../drawer.js';
import type {
	DrawerCloseReasonType,
	DrawerCrumbType,
	DrawerTrailSelectReasonType,
} from '../types.js';
import { waitForSettled } from './drawer.test-utils.js';

const STEPS = ['cluster', 'node', 'namespace', 'pod', 'trace', 'log'];

type CrumbFor = (name: string, index: number) => DrawerCrumbType | undefined;

function Step({
	index,
	last,
	depth,
	setDepth,
	onClose,
	crumbFor,
	trailEllipsis,
	refuses,
}: {
	index: number;
	last: number;
	depth: number;
	setDepth: (depth: number) => void;
	onClose: (name: string, reason: DrawerCloseReasonType) => void;
	crumbFor: CrumbFor | undefined;
	trailEllipsis: BreadcrumbEllipsisOptions | undefined;
	refuses: string | undefined;
}): ReactNode {
	const name = STEPS[index];

	if (name === undefined || index > last) {
		return null;
	}

	return (
		<Drawer
			type="inspector"
			stack="breadcrumb"
			open={depth >= index}
			onClose={(reason) => {
				onClose(name, reason);
				if (name !== refuses) {
					setDepth(index - 1);
				}
			}}
			title={name}
			crumb={crumbFor?.(name, index)}
			{...(index === 0 && trailEllipsis !== undefined ? { trailEllipsis } : {})}
			testId={name}
		>
			{`The ${name}.`}
			<Step
				index={index + 1}
				last={last}
				depth={depth}
				setDepth={setDepth}
				onClose={onClose}
				crumbFor={crumbFor}
				trailEllipsis={trailEllipsis}
				refuses={refuses}
			/>
		</Drawer>
	);
}

function Trail({
	last,
	onClose = () => {},
	crumbFor,
	trailEllipsis,
	refuses,
}: {
	last: number;
	onClose?: (name: string, reason: DrawerCloseReasonType) => void;
	crumbFor?: CrumbFor;
	trailEllipsis?: BreadcrumbEllipsisOptions;
	/**
	 * The step whose `onClose` keeps it open, the way an unsaved-changes guard does.
	 */
	refuses?: string;
}): ReactNode {
	const [depth, setDepth] = useState(last);

	return (
		<Step
			index={0}
			last={last}
			depth={depth}
			setDepth={setDepth}
			onClose={onClose}
			crumbFor={crumbFor}
			trailEllipsis={trailEllipsis}
			refuses={refuses}
		/>
	);
}

async function renderTrail(props: Parameters<typeof Trail>[0]): Promise<HTMLElement> {
	render(<Trail {...props} />);
	const top = STEPS[props.last];
	await waitFor(() => {
		expect(document.querySelector(`[data-testid="${top}"]`)).not.toBeNull();
	});
	await waitForSettled();

	return screen.findByTestId(`${top}-trail-breadcrumb`);
}

const hrefFor: CrumbFor = (name) => ({ href: `#trail-${name}` });

// What the page saw of each click once the drawer handled it, and no click leaves the test page.
let seen: { defaultPrevented: boolean }[] = [];
const recordClick = (event: Event): void => {
	seen.push({ defaultPrevented: event.defaultPrevented });
	event.preventDefault();
};

// A real pointer stays where the last test left it, over whatever renders there next. While the
// safe polygon of a hover popup is active Base UI sets `pointer-events: none` on the body, so the
// move has to be forced.
beforeEach(async () => {
	seen = [];
	window.addEventListener('click', recordClick);
	await browserUser.unhover(document.body, { force: true });
});

afterEach(() => {
	window.removeEventListener('click', recordClick);
});

describe('Drawer trail crumbs with a link', () => {
	it('renders every earlier crumb as a link, and the current one as text', async () => {
		const trail = await renderTrail({ last: 2, crumbFor: hrefFor });

		expect(within(trail).getByRole('link', { name: 'cluster' })).toHaveAttribute(
			'href',
			'#trail-cluster',
		);
		expect(within(trail).getByRole('link', { name: 'node' })).toHaveAttribute(
			'href',
			'#trail-node',
		);
		expect(within(trail).queryByRole('link', { name: 'namespace' })).toBeNull();
		expect(within(trail).getByText('namespace').closest('[aria-current="page"]')).not.toBeNull();
	});

	it('steps back on a plain click, and does not follow the link', async () => {
		const onClose = vi.fn();
		const trail = await renderTrail({ last: 2, crumbFor: hrefFor, onClose });

		await browserUser.click(within(trail).getByRole('link', { name: 'cluster' }));

		await waitFor(() => {
			expect(document.querySelector('[data-testid="node"]')).toBeNull();
		});
		expect(onClose.mock.calls).toEqual([
			['namespace', 'crumb-press'],
			['node', 'crumb-press'],
		]);
		expect(seen).toEqual([{ defaultPrevented: true }]);
		expect(window.location.hash).toBe('');
	});

	it.each([
		['Control', { ctrlKey: true }],
		['Meta', { metaKey: true }],
		['Shift', { shiftKey: true }],
	])('leaves a click with %s to the browser, and closes nothing', async (_key, modifier) => {
		const onClose = vi.fn();
		const trail = await renderTrail({ last: 2, crumbFor: hrefFor, onClose });
		const link = within(trail).getByRole('link', { name: 'cluster' });

		link.dispatchEvent(
			new window.MouseEvent('click', { bubbles: true, cancelable: true, button: 0, ...modifier }),
		);

		expect(seen).toEqual([{ defaultPrevented: false }]);
		expect(onClose).not.toHaveBeenCalled();
		expect(screen.getByTestId('namespace')).toBeVisible();
	});

	it('cancels the navigation of a router link before its own handler runs', async () => {
		const routerClick = vi.fn((event: MouseEvent) => event.defaultPrevented);
		// The shape of a router link: its own `to`, and the rest forwarded to its `a`. A router reads
		// `defaultPrevented` in its click handler before it navigates.
		const RouterLink = forwardRef<
			HTMLAnchorElement,
			{ to: string; onClick?: typeof routerClick; children?: ReactNode }
		>(function RouterLink({ to, onClick, children, ...rest }, ref) {
			return (
				<a ref={ref} href={to} onClick={onClick} {...rest}>
					{children}
				</a>
			);
		});
		const onClose = vi.fn();
		const trail = await renderTrail({
			last: 1,
			onClose,
			crumbFor: (name) => ({ render: <RouterLink to={`#route-${name}`} onClick={routerClick} /> }),
		});

		const link = within(trail).getByRole('link', { name: 'cluster' });
		expect(link).toHaveAttribute('href', '#route-cluster');
		await browserUser.click(link);

		await waitFor(() => {
			expect(document.querySelector('[data-testid="node"]')).toBeNull();
		});
		expect(routerClick).toHaveBeenCalledTimes(1);
		expect(routerClick.mock.results[0]?.value).toBe(true);
		expect(onClose.mock.calls).toEqual([['node', 'crumb-press']]);
	});
});

describe('Drawer trail crumbs with no link', () => {
	// A modifier key only matters to a link, which it opens elsewhere. A crumb with no link has
	// nowhere else to go, so the click still steps back.
	it.each([
		['Shift', { shiftKey: true }],
		['Meta', { metaKey: true }],
	])('steps back on a click with %s', async (_key, modifier) => {
		const onClose = vi.fn();
		const trail = await renderTrail({ last: 2, onClose });

		within(trail)
			.getByRole('button', { name: 'cluster' })
			.dispatchEvent(
				new window.MouseEvent('click', { bubbles: true, cancelable: true, button: 0, ...modifier }),
			);

		await waitFor(() => {
			expect(document.querySelector('[data-testid="node"]')).toBeNull();
		});
		expect(onClose.mock.calls).toEqual([
			['namespace', 'crumb-press'],
			['node', 'crumb-press'],
		]);
	});
});

describe('Drawer trail crumb titles', () => {
	it('names a crumb with a blank title after its drawer, and a blank drawer `<No title>`', async () => {
		render(
			<Drawer type="inspector" stack="breadcrumb" open onClose={() => {}} title="" testId="root">
				<Drawer
					type="inspector"
					stack="breadcrumb"
					open
					onClose={() => {}}
					title="pod"
					crumb={{ title: ' ' }}
					testId="pod"
				>
					The pod.
				</Drawer>
			</Drawer>,
		);
		const trail = await screen.findByTestId('pod-trail-breadcrumb');

		expect(
			within(trail)
				.getAllByRole('listitem')
				.map((crumb) => crumb.textContent),
		).toEqual(['<No title>', 'pod']);
	});
});

/**
 * Three drawers of a trail, where the one in the middle closes by unmounting, as a page that
 * renders it only while its record is selected does.
 */
function UnmountingTrail({
	onClose,
}: {
	onClose: (name: string, reason: DrawerCloseReasonType) => void;
}): ReactNode {
	const [clusterOpen, setClusterOpen] = useState(true);
	const [hasNode, setHasNode] = useState(true);
	const [namespaceOpen, setNamespaceOpen] = useState(true);

	return (
		<Drawer
			type="inspector"
			stack="breadcrumb"
			open={clusterOpen}
			onClose={(reason) => {
				onClose('cluster', reason);
				setClusterOpen(false);
			}}
			title="cluster"
			testId="cluster"
		>
			{hasNode ? (
				<Drawer
					type="inspector"
					stack="breadcrumb"
					open
					onClose={(reason) => {
						onClose('node', reason);
						setHasNode(false);
					}}
					title="node"
					testId="node"
				>
					<Drawer
						type="inspector"
						stack="breadcrumb"
						open={namespaceOpen}
						onClose={(reason) => {
							onClose('namespace', reason);
							setNamespaceOpen(false);
						}}
						title="namespace"
						testId="namespace"
					>
						The namespace.
					</Drawer>
				</Drawer>
			) : null}
		</Drawer>
	);
}

describe('Drawer trail with a drawer that stays open on close', () => {
	it('closes only the drawers above it from the close button', async () => {
		const onClose = vi.fn();
		await renderTrail({ last: 2, refuses: 'node', onClose });

		await browserUser.click(
			within(screen.getByTestId('namespace')).getByRole('button', { name: 'Close' }),
		);

		await waitFor(() => {
			expect(document.querySelector('[data-testid="namespace"]')).toBeNull();
		});
		expect(onClose.mock.calls).toEqual([
			['namespace', 'close-press'],
			['node', 'close-press'],
		]);
		expect(screen.getByTestId('node')).toHaveAttribute('data-open');
		expect(screen.getByTestId('node')).not.toHaveAttribute('data-covered');
		expect(screen.getByTestId('cluster')).toHaveAttribute('data-open');
	});

	it('stops a crumb press at it, and leaves the drawers under it as they were', async () => {
		const onClose = vi.fn();
		const trail = await renderTrail({ last: 2, refuses: 'node', onClose });

		await browserUser.click(within(trail).getByRole('button', { name: 'cluster' }));

		await waitFor(() => {
			expect(document.querySelector('[data-testid="namespace"]')).toBeNull();
		});
		expect(onClose.mock.calls).toEqual([
			['namespace', 'crumb-press'],
			['node', 'crumb-press'],
		]);
		expect(screen.getByTestId('node')).toHaveAttribute('data-open');
		expect(screen.getByTestId('cluster')).toHaveAttribute('data-open');
		expect(screen.getByTestId('cluster')).toHaveAttribute('data-covered', 'breadcrumb');
	});

	it('counts a drawer that its onClose unmounts as closed, and goes on to the next', async () => {
		const onClose = vi.fn();
		render(<UnmountingTrail onClose={onClose} />);
		await screen.findByTestId('namespace-trail');
		await waitForSettled();

		await browserUser.click(
			within(screen.getByTestId('namespace')).getByRole('button', { name: 'Close' }),
		);

		await waitFor(() => {
			expect(document.querySelector('[data-testid="cluster"]')).toBeNull();
		});
		expect(onClose.mock.calls).toEqual([
			['namespace', 'close-press'],
			['node', 'close-press'],
			['cluster', 'close-press'],
		]);
	});
});

describe('Drawer trail crumb preview', () => {
	it('shows the preview of an earlier crumb on hover, and none on the current one', async () => {
		const trail = await renderTrail({
			last: 1,
			crumbFor: (name) => ({ preview: `About the ${name}` }),
		});

		await browserUser.hover(within(trail).getByRole('button', { name: 'cluster' }));

		expect(await screen.findByText('About the cluster')).toBeVisible();
		expect(screen.queryByText('About the node')).toBeNull();
	});
});

function ellipsisTrigger(trail: HTMLElement): HTMLElement {
	return within(trail).getByRole('button', { name: /hidden items?/ });
}

// Breadcrumb names the `...` popup after the heading of its list.
function findEarlierSteps(heading = 'Earlier steps'): Promise<HTMLElement> {
	return screen.findByRole('dialog', { name: heading });
}

async function openEarlierSteps(trail: HTMLElement, heading?: string): Promise<HTMLElement> {
	await browserUser.click(ellipsisTrigger(trail));
	const popup = await findEarlierSteps(heading);

	// The press that opened the list is not a click on one of its rows.
	seen = [];

	return popup;
}

function rowTexts(popup: HTMLElement): string[] {
	return within(popup)
		.getAllByRole('listitem')
		.map((item) => item.textContent ?? '');
}

describe('Drawer trail `...` list', () => {
	it('opens on a press under `Earlier steps`, each row ending with its step number', async () => {
		const trail = await renderTrail({ last: 5 });

		const popup = await openEarlierSteps(trail);

		expect(within(popup).getByText('Earlier steps')).toBeVisible();
		expect(rowTexts(popup)).toEqual(['node2', 'namespace3']);

		for (const [name, step] of [
			['node', '2'],
			['namespace', '3'],
		] as const) {
			const row = within(popup).getByRole('button', { name });
			const suffix = row.lastElementChild;

			expect(suffix).toHaveAttribute('data-slot', 'breadcrumb-ellipsis-row-suffix');
			expect(suffix).toHaveTextContent(step);
			expect(suffix?.firstElementChild).toHaveAttribute('aria-hidden', 'true');
		}
	});

	it('opens while the pointer rests on it, with the same list', async () => {
		const trail = await renderTrail({ last: 5 });

		await browserUser.hover(ellipsisTrigger(trail));

		const popup = await findEarlierSteps();
		expect(within(popup).getByText('Earlier steps')).toBeVisible();
		expect(rowTexts(popup)).toEqual(['node2', 'namespace3']);
	});

	it('takes `trailEllipsis` from the first drawer of the trail, over the default', async () => {
		const trail = await renderTrail({ last: 5, trailEllipsis: { heading: 'Path so far' } });

		const popup = await openEarlierSteps(trail, 'Path so far');

		expect(within(popup).getByText('Path so far')).toBeVisible();
		expect(within(popup).queryByText('Earlier steps')).toBeNull();
		expect(rowTexts(popup)).toEqual(['node2', 'namespace3']);
	});

	it('closes on Esc before the drawer does, and gives the focus back to the `...`', async () => {
		const onClose = vi.fn();
		const trail = await renderTrail({ last: 5, onClose });
		await openEarlierSteps(trail);

		await browserUser.keyboard('{Escape}');

		await waitFor(() => {
			expect(screen.queryByRole('dialog', { name: 'Earlier steps' })).toBeNull();
		});
		expect(onClose).not.toHaveBeenCalled();
		expect(screen.getByTestId('log')).toBeVisible();
		expect(ellipsisTrigger(trail)).toHaveFocus();
	});

	it('steps back on a plain click on a row, and does not follow its link', async () => {
		const onClose = vi.fn();
		const trail = await renderTrail({ last: 5, crumbFor: hrefFor, onClose });
		const popup = await openEarlierSteps(trail);
		const row = within(popup).getByRole('link', { name: 'node' });
		expect(row).toHaveAttribute('href', '#trail-node');

		await browserUser.click(row);

		await waitFor(() => {
			expect(document.querySelector('[data-testid="namespace"]')).toBeNull();
		});
		expect(onClose.mock.calls).toEqual([
			['log', 'crumb-press'],
			['trace', 'crumb-press'],
			['pod', 'crumb-press'],
			['namespace', 'crumb-press'],
		]);
		expect(seen).toEqual([{ defaultPrevented: true }]);
		expect(window.location.hash).toBe('');
		expect(screen.queryByRole('dialog', { name: 'Earlier steps' })).toBeNull();
		expect(screen.getByTestId('node')).toBeVisible();
	});

	it.each([
		['Control', { ctrlKey: true }],
		['Meta', { metaKey: true }],
		['Shift', { shiftKey: true }],
	])(
		'leaves a click with %s on a row to the browser, closes no drawer and keeps the list open',
		async (_key, modifier) => {
			const onClose = vi.fn();
			const trail = await renderTrail({ last: 5, crumbFor: hrefFor, onClose });
			const popup = await openEarlierSteps(trail);

			within(popup)
				.getByRole('link', { name: 'node' })
				.dispatchEvent(
					new window.MouseEvent('click', {
						bubbles: true,
						cancelable: true,
						button: 0,
						...modifier,
					}),
				);

			expect(seen).toEqual([{ defaultPrevented: false }]);
			expect(onClose).not.toHaveBeenCalled();
			expect(popup).toBeVisible();
			expect(screen.getByTestId('log')).toBeVisible();
		},
	);
});

describe('Drawer trail covered content', () => {
	it('takes the content of a covered drawer of the trail out of layout and paint', async () => {
		await renderTrail({ last: 2 });

		expect(screen.getByTestId('cluster')).toHaveAttribute('data-covered', 'breadcrumb');
		expect(screen.getByTestId('node')).toHaveAttribute('data-covered', 'breadcrumb');
		expect(screen.getByTestId('namespace')).not.toHaveAttribute('data-covered');
		expect(screen.getByText('The cluster.').checkVisibility()).toBe(false);
		expect(screen.getByText('The node.').checkVisibility()).toBe(false);
		expect(screen.getByText('The namespace.').checkVisibility()).toBe(true);
	});

	it('shows the content again on a step back, where it was', async () => {
		const trail = await renderTrail({ last: 2, crumbFor: hrefFor });

		await browserUser.click(within(trail).getByRole('link', { name: 'node' }));

		await waitFor(() => {
			expect(document.querySelector('[data-testid="namespace"]')).toBeNull();
		});
		expect(screen.getByTestId('node')).not.toHaveAttribute('data-covered');
		expect(screen.getByText('The node.').checkVisibility()).toBe(true);
	});

	it('keeps the drawer under an overlay in sight', async () => {
		render(
			<Drawer type="inspector" stack="overlay" open onClose={() => {}} title="root" testId="root">
				The root.
				<Drawer
					type="inspector"
					stack="overlay"
					open
					onClose={() => {}}
					title="child"
					testId="child"
				>
					The child.
				</Drawer>
			</Drawer>,
		);
		await waitFor(() => {
			expect(screen.getByTestId('root')).toHaveAttribute('data-covered', 'overlay');
		});

		expect(screen.getByText('The root.').checkVisibility()).toBe(true);
	});
});

const LEVELS = ['cluster', 'node', 'namespace', 'pod'];

function Mounts({ name, onMount }: { name: string; onMount: (name: string) => void }): ReactNode {
	useEffect(() => {
		onMount(name);
	}, [name, onMount]);

	return <p>{`The ${name}.`}</p>;
}

function ControlledTrail({
	start = 3,
	withLog = false,
	logRefuses = false,
	onTrailSelect = () => {},
	onClose = () => {},
	onMount = () => {},
}: {
	start?: number;
	withLog?: boolean;
	logRefuses?: boolean;
	onTrailSelect?: (index: number, reason: DrawerTrailSelectReasonType) => void;
	onClose?: (name: string, reason: DrawerCloseReasonType) => void;
	onMount?: (name: string) => void;
}): ReactNode {
	const [depth, setDepth] = useState(start);
	const [logOpen, setLogOpen] = useState(withLog);
	const current = LEVELS[depth] ?? 'cluster';

	return (
		<Drawer
			type="inspector"
			stack="breadcrumb"
			open
			onClose={(reason) => {
				onClose(current, reason);
			}}
			title={current}
			trail={LEVELS.slice(0, depth).map((name) => ({ title: name, href: `#step-${name}` }))}
			onTrailSelect={(index, reason) => {
				onTrailSelect(index, reason);
				setDepth(index);
			}}
			testId="entity"
		>
			<Mounts key={current} name={current} onMount={onMount} />
			<Drawer
				type="inspector"
				stack="breadcrumb"
				open={logOpen}
				onClose={(reason) => {
					onClose('log', reason);
					if (!logRefuses) {
						setLogOpen(false);
					}
				}}
				title="log"
				testId="log"
			>
				The log.
			</Drawer>
		</Drawer>
	);
}

async function renderControlled(
	props: Parameters<typeof ControlledTrail>[0] = {},
): Promise<HTMLElement> {
	render(<ControlledTrail {...props} />);
	const top = props.withLog ? 'log' : 'entity';
	await waitFor(() => {
		expect(document.querySelector(`[data-testid="${top}"]`)).not.toBeNull();
	});
	await waitForSettled();

	return screen.findByTestId(`${top}-trail-breadcrumb`);
}

describe('Drawer with a controlled trail', () => {
	it('renders the steps as crumbs before its own, and mounts only the current step', async () => {
		const onMount = vi.fn();
		const trail = await renderControlled({ onMount });

		expect(within(trail).getByRole('link', { name: 'cluster' })).toHaveAttribute(
			'href',
			'#step-cluster',
		);
		expect(within(trail).getByRole('link', { name: 'namespace' })).toBeVisible();
		expect(within(trail).getByText('pod').closest('[aria-current="page"]')).not.toBeNull();
		expect(onMount.mock.calls).toEqual([['pod']]);
		expect(screen.queryByText('The namespace.')).toBeNull();
	});

	it('calls onTrailSelect on a plain click, and the drawer stays open with the step', async () => {
		const onTrailSelect = vi.fn();
		const onClose = vi.fn();
		const onMount = vi.fn();
		const trail = await renderControlled({ onTrailSelect, onClose, onMount });

		await browserUser.click(within(trail).getByRole('link', { name: 'node' }));

		expect(onTrailSelect.mock.calls).toEqual([[1, 'crumb-press']]);
		expect(seen).toEqual([{ defaultPrevented: true }]);
		expect(await screen.findByText('The node.')).toBeVisible();
		expect(screen.queryByText('The pod.')).toBeNull();
		expect(onMount.mock.calls).toEqual([['pod'], ['node']]);
		expect(onClose).not.toHaveBeenCalled();
		expect(within(screen.getByTestId('entity-trail-breadcrumb')).getByText('node')).toBeVisible();
	});

	it('leaves a click with a modifier key to the browser', async () => {
		const onTrailSelect = vi.fn();
		const trail = await renderControlled({ onTrailSelect });

		within(trail)
			.getByRole('link', { name: 'cluster' })
			.dispatchEvent(
				new window.MouseEvent('click', {
					bubbles: true,
					cancelable: true,
					button: 0,
					ctrlKey: true,
				}),
			);

		expect(seen).toEqual([{ defaultPrevented: false }]);
		expect(onTrailSelect).not.toHaveBeenCalled();
	});

	it('steps back to the last step on Esc, and closes on Esc with no step left', async () => {
		const onTrailSelect = vi.fn();
		const onClose = vi.fn();
		await renderControlled({ start: 1, onTrailSelect, onClose });

		await browserUser.keyboard('{Escape}');

		expect(onTrailSelect.mock.calls).toEqual([[0, 'escape-key']]);
		expect(await screen.findByText('The cluster.')).toBeVisible();
		expect(screen.queryByTestId('entity-trail')).toBeNull();
		expect(onClose).not.toHaveBeenCalled();

		await browserUser.keyboard('{Escape}');

		expect(onClose.mock.calls).toEqual([['cluster', 'escape-key']]);
	});

	it('closes once on the close button, with every step', async () => {
		const onClose = vi.fn();
		const onTrailSelect = vi.fn();
		await renderControlled({ onClose, onTrailSelect });

		await browserUser.click(
			within(screen.getByTestId('entity')).getByRole('button', { name: 'Close' }),
		);

		expect(onClose.mock.calls).toEqual([['pod', 'close-press']]);
		expect(onTrailSelect).not.toHaveBeenCalled();
	});

	it('closes a nested drawer of the trail before it shows an earlier step', async () => {
		const onTrailSelect = vi.fn();
		const onClose = vi.fn();
		const trail = await renderControlled({ withLog: true, onTrailSelect, onClose });

		expect(within(trail).getByRole('link', { name: 'cluster' })).toBeVisible();
		expect(within(trail).getByRole('button', { name: 'pod' })).toBeVisible();
		expect(within(trail).getByText('log').closest('[aria-current="page"]')).not.toBeNull();

		const popup = await openEarlierSteps(trail);
		await browserUser.click(within(popup).getByRole('link', { name: 'node' }));

		await waitFor(() => {
			expect(document.querySelector('[data-testid="log"]')).toBeNull();
		});
		expect(seen).toEqual([{ defaultPrevented: true }]);
		expect(onClose.mock.calls).toEqual([['log', 'crumb-press']]);
		expect(onTrailSelect.mock.calls).toEqual([[1, 'crumb-press']]);
		expect(await screen.findByText('The node.')).toBeVisible();
	});

	it('shows no earlier step while the nested drawer stays open', async () => {
		const onTrailSelect = vi.fn();
		const onClose = vi.fn();
		const trail = await renderControlled({
			withLog: true,
			logRefuses: true,
			onTrailSelect,
			onClose,
		});

		const popup = await openEarlierSteps(trail);
		await browserUser.click(within(popup).getByRole('link', { name: 'node' }));

		expect(onClose.mock.calls).toEqual([['log', 'crumb-press']]);
		expect(onTrailSelect).not.toHaveBeenCalled();
		expect(screen.getByTestId('log')).toHaveAttribute('data-open');
		expect(screen.getByText('The pod.')).toBeInTheDocument();
	});

	it('steps back to its own crumb from a nested drawer, closing only that drawer', async () => {
		const onTrailSelect = vi.fn();
		const onClose = vi.fn();
		const trail = await renderControlled({ withLog: true, onTrailSelect, onClose });

		await browserUser.click(within(trail).getByRole('button', { name: 'pod' }));

		await waitFor(() => {
			expect(document.querySelector('[data-testid="log"]')).toBeNull();
		});
		expect(onClose.mock.calls).toEqual([['log', 'crumb-press']]);
		expect(onTrailSelect).not.toHaveBeenCalled();
		expect(screen.getByText('The pod.').checkVisibility()).toBe(true);
	});
});
