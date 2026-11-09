import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { type ReactNode, useState } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { userEvent as browserUser } from 'vitest/browser';
import { Drawer } from '../drawer.js';
import type {
	DrawerClosePositionType,
	DrawerCloseReasonType,
	DrawerStackType,
	DrawerTypeType,
} from '../types.js';
import { waitForSettled } from './drawer.test-utils.js';

type Level = 'root' | 'child' | 'grandchild';

interface ChainProps {
	rootStack?: DrawerStackType;
	childStack?: DrawerStackType;
	rootType?: DrawerTypeType;
	rootClosePosition?: DrawerClosePositionType;
	childType?: DrawerTypeType;
	grandchildType?: DrawerTypeType;
	open?: Level[];
	onClose?: (level: Level, reason: DrawerCloseReasonType) => void;
}

function NestedDrawer({
	level,
	type,
	stack,
	closePosition,
	open,
	onClose,
	children,
}: {
	level: Level;
	type: DrawerTypeType;
	stack: DrawerStackType;
	closePosition?: DrawerClosePositionType;
	open: boolean;
	onClose: (reason: DrawerCloseReasonType) => void;
	children?: ReactNode;
}): ReactNode {
	const title = `${level} record`;

	return type === 'task' ? (
		<Drawer
			type="task"
			stack={stack}
			closePosition={closePosition}
			open={open}
			onClose={onClose}
			title={title}
			crumb={{ title: level, icon: <svg data-testid={`${level}-icon`} /> }}
			width="entity"
			testId={level}
		>
			{children}
		</Drawer>
	) : (
		<Drawer
			type="inspector"
			stack={stack}
			closePosition={closePosition}
			open={open}
			onClose={onClose}
			title={title}
			crumb={{ title: level, icon: <svg data-testid={`${level}-icon`} /> }}
			width="entity"
			testId={level}
		>
			{children}
		</Drawer>
	);
}

/**
 * Three drawers, each declared in the body of the one before, the way a drill-down is built. Each
 * level keeps its own `open` and closes on every reason.
 */
function Chain({
	rootStack = 'overlay',
	childStack = 'overlay',
	rootType = 'inspector',
	rootClosePosition,
	childType = 'inspector',
	grandchildType = 'inspector',
	open: initiallyOpen = ['root', 'child'],
	onClose,
}: ChainProps): ReactNode {
	const [open, setOpen] = useState<ReadonlySet<Level>>(new Set(initiallyOpen));
	const close =
		(level: Level) =>
		(reason: DrawerCloseReasonType): void => {
			onClose?.(level, reason);
			setOpen((current) => new Set([...current].filter((item) => item !== level)));
		};
	const show = (level: Level) => (): void => {
		setOpen((current) => new Set([...current, level]));
	};

	return (
		<NestedDrawer
			level="root"
			type={rootType}
			stack={rootStack}
			closePosition={rootClosePosition}
			open={open.has('root')}
			onClose={close('root')}
		>
			<button type="button" onClick={show('child')}>
				Open child
			</button>
			<NestedDrawer
				level="child"
				type={childType}
				stack={childStack}
				open={open.has('child')}
				onClose={close('child')}
			>
				<button type="button" onClick={show('grandchild')}>
					Open grandchild
				</button>
				<NestedDrawer
					level="grandchild"
					type={grandchildType}
					stack="overlay"
					open={open.has('grandchild')}
					onClose={close('grandchild')}
				>
					The grandchild.
				</NestedDrawer>
			</NestedDrawer>
		</NestedDrawer>
	);
}

function panelOf(level: Level): HTMLElement {
	const panel = document.querySelector<HTMLElement>(`[data-testid="${level}"]`);
	expect(panel).not.toBeNull();

	return panel as HTMLElement;
}

function queryPanel(level: Level): HTMLElement | null {
	return document.querySelector<HTMLElement>(`[data-testid="${level}"]`);
}

function widthOf(level: Level): number {
	return panelOf(level).getBoundingClientRect().width;
}

async function renderChain(props: ChainProps): Promise<void> {
	render(<Chain {...props} />);
	const top = props.open?.at(-1) ?? 'child';
	await waitFor(() => {
		expect(panelOf(top)).toBeVisible();
	});
	await waitForSettled();
}

describe('Drawer nested with stack="overlay"', () => {
	it('opens the nested drawer at 80% of the width of the drawer it is declared in', async () => {
		await renderChain({ rootStack: 'overlay' });

		expect(panelOf('child')).toHaveAttribute('data-nested', 'overlay');
		expect(panelOf('root')).not.toHaveAttribute('data-nested');
		expect(widthOf('child')).toBeCloseTo(widthOf('root') * 0.8, 0);
	});

	describe('where there is no ResizeObserver', () => {
		afterEach(() => {
			vi.unstubAllGlobals();
		});

		// jsdom, which the tests of an app run in, has no ResizeObserver.
		it('still renders, measuring the drawer it is declared in once', async () => {
			vi.stubGlobal('ResizeObserver', undefined);
			await renderChain({ rootStack: 'overlay' });

			expect(widthOf('child')).toBeCloseTo(widthOf('root') * 0.8, 0);
		});
	});

	it('takes no input on the drawer below while the nested one is open', async () => {
		const user = userEvent.setup();
		await renderChain({ rootStack: 'overlay' });

		expect(panelOf('root')).toHaveAttribute('data-covered');
		expect(panelOf('root').inert).toBe(true);

		await user.click(within(panelOf('child')).getByRole('button', { name: 'Close' }));
		await waitFor(() => {
			expect(queryPanel('child')).toBeNull();
		});

		expect(panelOf('root')).not.toHaveAttribute('data-covered');
		expect(panelOf('root').inert).toBe(false);
	});

	it('lets the type of the nested drawer set its own backdrop', async () => {
		await renderChain({ rootStack: 'overlay', rootType: 'inspector', childType: 'task' });

		expect(document.querySelector('[data-testid="root-backdrop"]')).toBeNull();
		expect(document.querySelector('[data-testid="child-backdrop"]')).not.toBeNull();
		expect(panelOf('child')).toHaveAttribute('aria-modal', 'true');
	});

	it('renders no backdrop for a nested inspector', async () => {
		await renderChain({ rootStack: 'overlay', rootType: 'task', childType: 'inspector' });

		expect(document.querySelectorAll('[data-slot="drawer-backdrop"]')).toHaveLength(1);
		expect(panelOf('child')).not.toHaveAttribute('aria-modal');
	});

	it('closes only the nested drawer on Esc, and renders no trail', async () => {
		const user = userEvent.setup();
		const onClose = vi.fn();
		await renderChain({ rootStack: 'overlay', onClose });

		expect(document.querySelector('[data-slot="drawer-trail"]')).toBeNull();

		await user.keyboard('{Escape}');
		await waitFor(() => {
			expect(queryPanel('child')).toBeNull();
		});

		expect(onClose).toHaveBeenCalledTimes(1);
		expect(onClose).toHaveBeenCalledWith('child', 'escape-key');
		expect(panelOf('root')).toBeVisible();
	});
});

describe('Drawer nested with stack="breadcrumb"', () => {
	it('opens the nested drawer in place, at the same width', async () => {
		await renderChain({ rootStack: 'breadcrumb' });

		expect(panelOf('child')).toHaveAttribute('data-nested', 'breadcrumb');
		expect(widthOf('child')).toBeCloseTo(widthOf('root'), 0);
		expect(panelOf('root').inert).toBe(true);
	});

	it('renders a trail of crumbs under the header, the current drawer last', async () => {
		await renderChain({
			rootStack: 'breadcrumb',
			childStack: 'breadcrumb',
			open: ['root', 'child'],
		});

		expect(within(panelOf('root')).queryByTestId('root-trail')).toBeNull();

		const trail = screen.getByTestId('child-trail-breadcrumb');
		const crumbs = within(trail).getAllByRole('listitem');

		expect(crumbs.map((crumb) => crumb.textContent)).toEqual(['root', 'child']);
		expect(within(crumbs[0]).getByTestId('root-icon')).toBeInTheDocument();
		expect(within(crumbs[0]).getByRole('button', { name: 'root' })).toBeInTheDocument();
		expect(within(crumbs[1]).queryByRole('button')).toBeNull();
		expect(trail).toHaveAttribute('data-variant', 'outlined');
	});

	it('closes every drawer after a crumb on a press, the top one first', async () => {
		const user = userEvent.setup();
		const onClose = vi.fn();
		render(
			<Chain
				rootStack="breadcrumb"
				childStack="breadcrumb"
				open={['root', 'child', 'grandchild']}
				onClose={onClose}
			/>,
		);
		await waitFor(() => {
			expect(panelOf('grandchild')).toBeVisible();
		});
		await waitForSettled();

		const trail = screen.getByTestId('grandchild-trail-breadcrumb');
		await user.click(within(trail).getByRole('button', { name: 'root' }));

		await waitFor(() => {
			expect(queryPanel('child')).toBeNull();
		});

		expect(onClose.mock.calls).toEqual([
			['grandchild', 'crumb-press'],
			['child', 'crumb-press'],
		]);
		expect(panelOf('root')).toBeVisible();
		expect(panelOf('root').inert).toBe(false);
	});

	it('steps back one drawer on Esc', async () => {
		const user = userEvent.setup();
		const onClose = vi.fn();
		await renderChain({ rootStack: 'breadcrumb', onClose });

		await user.keyboard('{Escape}');
		await waitFor(() => {
			expect(queryPanel('child')).toBeNull();
		});

		expect(onClose.mock.calls).toEqual([['child', 'escape-key']]);
		expect(panelOf('root')).toBeVisible();
	});

	it('closes the whole trail from the close button, the top one first', async () => {
		const user = userEvent.setup();
		const onClose = vi.fn();
		await renderChain({ rootStack: 'breadcrumb', onClose });

		await user.click(within(panelOf('child')).getByRole('button', { name: 'Close' }));
		await waitFor(() => {
			expect(queryPanel('root')).toBeNull();
		});

		expect(onClose.mock.calls).toEqual([
			['child', 'close-press'],
			['root', 'close-press'],
		]);
	});

	it('takes the backdrop and the focus trap from the first drawer of the trail', async () => {
		await renderChain({ rootStack: 'breadcrumb', rootType: 'task', childType: 'inspector' });

		expect(document.querySelectorAll('[data-slot="drawer-backdrop"]')).toHaveLength(1);
		expect(panelOf('child')).toHaveAttribute('aria-modal', 'true');
	});

	it('renders no backdrop for a nested task under an inspector', async () => {
		await renderChain({ rootStack: 'breadcrumb', rootType: 'inspector', childType: 'task' });

		expect(document.querySelector('[data-slot="drawer-backdrop"]')).toBeNull();
		expect(panelOf('child')).not.toHaveAttribute('aria-modal');
	});

	it('takes the closePosition from the first drawer of the trail', async () => {
		await renderChain({ rootStack: 'breadcrumb', rootClosePosition: 'start' });

		const header = within(panelOf('child')).getByTestId('child-header');

		expect(header).toHaveAttribute('data-close-position', 'start');
		expect(header.firstElementChild).toBe(within(header).getByRole('button', { name: 'Close' }));
	});

	it('keeps the closePosition of a nested drawer in an overlay its own', async () => {
		await renderChain({ rootStack: 'overlay', rootClosePosition: 'start' });

		expect(within(panelOf('root')).getByTestId('root-header')).toHaveAttribute(
			'data-close-position',
			'start',
		);
		expect(within(panelOf('child')).getByTestId('child-header')).toHaveAttribute(
			'data-close-position',
			'end',
		);
	});
});

describe('Drawer with a breadcrumb trail and then an overlay', () => {
	it('opens the overlay over the trail, which takes no input until it closes', async () => {
		const user = userEvent.setup();
		render(
			<Chain rootStack="breadcrumb" childStack="overlay" open={['root', 'child', 'grandchild']} />,
		);
		await waitFor(() => {
			expect(panelOf('grandchild')).toBeVisible();
		});
		await waitForSettled();

		expect(panelOf('child')).toHaveAttribute('data-nested', 'breadcrumb');
		expect(panelOf('grandchild')).toHaveAttribute('data-nested', 'overlay');
		expect(widthOf('grandchild')).toBeCloseTo(widthOf('child') * 0.8, 0);
		expect(panelOf('child').inert).toBe(true);
		expect(within(panelOf('grandchild')).queryByTestId('grandchild-trail')).toBeNull();

		await user.keyboard('{Escape}');
		await waitFor(() => {
			expect(queryPanel('grandchild')).toBeNull();
		});

		expect(panelOf('child').inert).toBe(false);
		expect(screen.getByTestId('child-trail')).toBeVisible();
	});
});

const DRILL = ['cluster', 'node', 'namespace', 'pod', 'trace', 'log'];

function DrillStep({
	index,
	depth,
	setDepth,
	onClose,
}: {
	index: number;
	depth: number;
	setDepth: (depth: number) => void;
	onClose: (name: string, reason: DrawerCloseReasonType) => void;
}): ReactNode {
	const name = DRILL[index];

	if (name === undefined) {
		return null;
	}

	return (
		<Drawer
			type="inspector"
			stack="breadcrumb"
			open={depth >= index}
			onClose={(reason) => {
				onClose(name, reason);
				setDepth(index - 1);
			}}
			title={name}
			testId={name}
		>
			{`The ${name}.`}
			<DrillStep index={index + 1} depth={depth} setDepth={setDepth} onClose={onClose} />
		</Drawer>
	);
}

function Drill({ onClose }: { onClose: (name: string, reason: DrawerCloseReasonType) => void }) {
	const [depth, setDepth] = useState(DRILL.length - 1);

	return <DrillStep index={0} depth={depth} setDepth={setDepth} onClose={onClose} />;
}

describe('Drawer breadcrumb trail with collapsed crumbs', () => {
	it('goes back to a crumb picked from the `...` list', async () => {
		const onClose = vi.fn();
		render(<Drill onClose={onClose} />);
		await waitFor(() => {
			expect(document.querySelector('[data-testid="log"]')).not.toBeNull();
		});
		await waitForSettled();

		const trail = screen.getByTestId('log-trail-breadcrumb');
		await browserUser.click(within(trail).getByRole('button', { name: /hidden items/ }));
		const popup = await screen.findByRole('dialog', { name: 'Earlier steps' });
		await browserUser.click(within(popup).getByRole('button', { name: 'node' }));

		await waitFor(() => {
			expect(document.querySelector('[data-testid="namespace"]')).toBeNull();
		});

		expect(onClose.mock.calls).toEqual([
			['log', 'crumb-press'],
			['trace', 'crumb-press'],
			['pod', 'crumb-press'],
			['namespace', 'crumb-press'],
		]);
		expect(screen.getByTestId('node')).toBeVisible();
	});
});
