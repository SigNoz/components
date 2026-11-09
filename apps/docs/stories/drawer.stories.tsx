import {
	Box,
	ChevronDown,
	ChevronUp,
	Copy,
	Ellipsis,
	ExternalLink,
	FileText,
	Folder,
	Network,
	Server,
	Waypoints,
} from '@signozhq/icons';
import {
	AlertDialog,
	Badge,
	Button,
	Dialog,
	Drawer,
	type DrawerProps,
	Input,
	Skeleton,
	Tooltip,
	Typography,
	useDrawerHandle,
} from '@signozhq/ui';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { createSerializer, parseAsArrayOf, parseAsStringLiteral, useQueryState } from 'nuqs';
import { NuqsAdapter } from 'nuqs/adapters/react';
import { Fragment, type ReactElement, useRef, useState } from 'react';
import { expect, fn, userEvent, waitFor, within } from 'storybook/test';
import { allModes } from '../.storybook/modes.js';
import styles from './drawer.stories.module.css';
import { drawerArgTypes, drawerParameters, WIDTHS } from './shared/drawer-arg-types.js';
import { waitForEffects } from './shared/play.js';
import { type PreviewStep, StepPreview } from './shared/step-preview.js';

const meta: Meta<typeof Drawer> = {
	title: 'Composed Components/Drawer',
	component: Drawer,
	parameters: drawerParameters,
	argTypes: drawerArgTypes,
	args: {
		type: 'task',
		stack: 'overlay',
		open: false,
		onClose: fn(),
		title: 'Edit member',
		description: 'Changes apply the next time they sign in.',
		children: 'The member keeps their dashboards and alerts whatever role you give them.',
		width: 'base',
		testId: 'drawer',
	},
};

export default meta;

type Story = StoryObj<typeof Drawer>;

function getNode(testId: string): HTMLElement {
	// The drawers portal to `document.body`, so none of this is inside the canvas element.
	const node = document.querySelector<HTMLElement>(`[data-testid="${testId}"]`);

	if (node === null) {
		throw new Error(`Drawer story: no node named "${testId}".`);
	}

	return node;
}

/**
 * Owns `open`, as a consumer does, and opens from a button. The footer actions are the
 * playground's own, since its buttons have to close the drawer.
 */
function DrawerPlayground({
	type,
	open: _open,
	handle: _handle,
	onClose,
	description,
	footerPrefix: _footerPrefix,
	footerSuffix: _footerSuffix,
	...props
}: DrawerProps): ReactElement {
	const [open, setOpen] = useState(false);
	const close = (): void => setOpen(false);

	return (
		<div className="story-container">
			<Button variant="solid" color="primary" size="md" onClick={() => setOpen(true)}>
				Open drawer
			</Button>
			{type === 'task' ? (
				<Drawer
					{...props}
					type="task"
					open={open}
					description={description}
					onClose={(reason) => {
						onClose?.(reason);
						close();
					}}
					footerSuffix={
						<>
							<Button variant="outlined" color="secondary" size="md" onClick={close}>
								Cancel
							</Button>
							<Button variant="solid" color="primary" size="md" onClick={close}>
								Save changes
							</Button>
						</>
					}
				/>
			) : (
				<Drawer
					{...props}
					type="inspector"
					open={open}
					onClose={(reason) => {
						onClose?.(reason);
						close();
					}}
				/>
			)}
		</div>
	);
}

/**
 * The playground the Controls table drives. Open it from the button, and close it from `Esc`, the
 * close button, the footer or, on a `task`, a press on the backdrop.
 */
export const Default: Story = {
	parameters: {
		// The drawer opens from a press, and the other stories keep one open for the snapshot.
		chromatic: { disableSnapshot: true },
	},
	render: (args) => <DrawerPlayground {...args} />,
};

type Pod = {
	name: string;
	status: string;
	node: string;
	namespace: string;
	restarts: number;
};

const PODS: Pod[] = [
	{
		name: 'payments-checkout-worker-7c9d4f6b8-xk2lp',
		status: 'CrashLoopBackOff',
		node: 'gke-prod-pool-b-6h0t',
		namespace: 'payments',
		restarts: 6,
	},
	{
		name: 'payments-api-5d8f7c9b6-q2m4n',
		status: 'Running',
		node: 'gke-prod-pool-a-1x8q',
		namespace: 'payments',
		restarts: 0,
	},
	{
		name: 'checkout-frontend-6b7c8d9f5-r7t2v',
		status: 'Running',
		node: 'gke-prod-pool-a-9d3w',
		namespace: 'checkout',
		restarts: 1,
	},
];

function PodSummary({ pod }: { pod: Pod }): ReactElement {
	return (
		<dl className={styles.summary}>
			<dt>Status</dt>
			<dd>{pod.status}</dd>
			<dt>Restarts</dt>
			<dd>{pod.restarts}</dd>
			<dt>Namespace</dt>
			<dd>{pod.namespace}</dd>
			<dt>Node</dt>
			<dd>{pod.node}</dd>
		</dl>
	);
}

/**
 * The header of an infra entity inspector, built from the slots: ↑/↓ through the list in
 * `headerPrefix`, the type badge in `titlePrefix`, copy in `titleSuffix`, and one kind of action
 * plus `⋯` in `headerSuffix`.
 */
function PodsPage(): ReactElement {
	// `open` is kept apart from the row, so the record stays on screen while the drawer slides out.
	const [open, setOpen] = useState(true);
	const [selected, setSelected] = useState(0);
	const pod = PODS[selected];

	return (
		<div className={styles.page}>
			<Typography
				variant="label"
				size="base"
				weight="medium"
				color="main"
				as="h1"
				textOverflow="wrap"
			>
				Kubernetes pods
			</Typography>
			<ul className={styles.rows}>
				{PODS.map((row, index) => (
					<li key={row.name}>
						<button
							type="button"
							className={styles.rowButton}
							aria-current={(open && index === selected) || undefined}
							onClick={() => {
								setSelected(index);
								setOpen(true);
							}}
						>
							{row.name}
						</button>
					</li>
				))}
			</ul>
			<Drawer
				stack="overlay"
				type="inspector"
				open={open}
				onClose={() => setOpen(false)}
				title={pod.name}
				width="entity"
				testId="pod"
				headerPrefix={
					<>
						<Button
							variant="ghost"
							color="secondary"
							size="sm"
							icon
							aria-label="Previous pod"
							disabled={selected === 0}
							disabledTooltip="This is the first pod in the list"
							onClick={() => setSelected((index) => index - 1)}
						>
							<ChevronUp />
						</Button>
						<Button
							variant="ghost"
							color="secondary"
							size="sm"
							icon
							aria-label="Next pod"
							disabled={selected === PODS.length - 1}
							disabledTooltip="This is the last pod in the list"
							onClick={() => setSelected((index) => index + 1)}
						>
							<ChevronDown />
						</Button>
					</>
				}
				titlePrefix={
					<Badge variant="outlined" color="secondary">
						Pod
					</Badge>
				}
				titleSuffix={
					<Tooltip title="Copy pod name">
						<Button variant="ghost" color="secondary" size="sm" icon aria-label="Copy pod name">
							<Copy />
						</Button>
					</Tooltip>
				}
				headerSuffix={
					<>
						<Tooltip title="Open in Explorer">
							<Button
								variant="ghost"
								color="secondary"
								size="sm"
								icon
								aria-label="Open in Explorer"
							>
								<ExternalLink />
							</Button>
						</Tooltip>
						<Button variant="ghost" color="secondary" size="sm" icon aria-label="More actions">
							<Ellipsis />
						</Button>
					</>
				}
			>
				<PodSummary pod={pod} />
			</Drawer>
		</div>
	);
}

/**
 * An `inspector`: one record to read, with the page still usable. There is no backdrop, the list
 * behind takes presses and a press on another row opens it in the same drawer, and the focus is
 * not trapped. ↑/↓ in the header step through the list and are disabled at its ends.
 */
export const Inspector: Story = {
	parameters: {
		chromatic: { disableSnapshot: false, modes: allModes },
		controls: { disable: true },
	},
	render: () => <PodsPage />,
	play: async ({ canvasElement }) => {
		await waitForEffects();
		await waitFor(() => expect(getNode('pod')).toBeVisible());

		const panel = getNode('pod');

		await expect(panel).toHaveAttribute('data-type', 'inspector');
		await expect(panel).not.toHaveAttribute('aria-modal');
		await expect(document.querySelector('[data-slot="drawer-backdrop"]')).toBeNull();
		await expect(getNode('pod-title')).toHaveTextContent(PODS[0].name);
		// A disabled button with a tooltip stays focusable, so it is `aria-disabled`.
		await expect(within(panel).getByRole('button', { name: 'Previous pod' })).toHaveAttribute(
			'aria-disabled',
			'true',
		);

		await userEvent.click(within(canvasElement).getByRole('button', { name: PODS[2].name }));
		await waitFor(() => expect(getNode('pod-title')).toHaveTextContent(PODS[2].name));
		await expect(within(panel).getByRole('button', { name: 'Next pod' })).toHaveAttribute(
			'aria-disabled',
			'true',
		);

		await userEvent.click(within(panel).getByRole('button', { name: 'Previous pod' }));
		await waitFor(() => expect(getNode('pod-title')).toHaveTextContent(PODS[1].name));
	},
};

function EditMember(): ReactElement {
	const [open, setOpen] = useState(true);
	const close = (): void => setOpen(false);

	return (
		<div className={styles.page}>
			<Button variant="outlined" color="secondary" size="md" onClick={() => setOpen(true)}>
				Edit member
			</Button>
			<Drawer
				stack="overlay"
				type="task"
				open={open}
				onClose={close}
				title="Edit member"
				description="Changes apply the next time they sign in."
				width="wide"
				testId="member"
				footerPrefix={
					<Button variant="solid" color="danger" size="md">
						Remove member
					</Button>
				}
				footerSuffix={
					<>
						<Button variant="outlined" color="secondary" size="md" onClick={close}>
							Cancel
						</Button>
						<Button variant="solid" color="primary" size="md" type="submit" form="edit-member">
							Save changes
						</Button>
					</>
				}
			>
				<form
					id="edit-member"
					className={styles.form}
					onSubmit={(event) => {
						event.preventDefault();
						close();
					}}
				>
					<Input aria-label="Name" defaultValue="Jane Doe" />
					<Input aria-label="Email" defaultValue="jane@example.com" />
				</form>
			</Drawer>
		</div>
	);
}

/**
 * A `task`: one job to finish behind a backdrop. A line of guidance sits under the title, the
 * footer holds Cancel and one primary at the end, and the one destructive action at the start, away
 * from the primary. It opens a confirmation in the product.
 */
export const Task: Story = {
	parameters: {
		chromatic: { disableSnapshot: false, modes: allModes },
		controls: { disable: true },
	},
	render: () => <EditMember />,
	play: async () => {
		await waitForEffects();
		await waitFor(() => expect(getNode('member')).toBeVisible());

		const panel = getNode('member');

		await expect(panel).toHaveAttribute('data-type', 'task');
		await expect(panel).toHaveAttribute('aria-modal', 'true');
		await expect(panel).toHaveAttribute('data-width', 'wide');
		await expect(getNode('member-backdrop')).toBeInTheDocument();
		await expect(panel).toHaveAttribute('aria-labelledby', getNode('member-title').id);
		await expect(panel).toHaveAttribute('aria-describedby', getNode('member-description').id);
		await expect(getNode('member-footer-prefix')).toHaveTextContent('Remove member');
		await expect(getNode('member-footer-suffix')).toHaveTextContent('CancelSave changes');
	},
};

function UnsavedChangesForm(): ReactElement {
	const [open, setOpen] = useState(true);
	const [name, setName] = useState('Checkout latency');
	const [discarding, setDiscarding] = useState(false);
	const changes = name === 'Checkout latency' ? 0 : 1;

	const close = (): void => {
		setOpen(false);
		setName('Checkout latency');
	};
	const requestClose = (): void => {
		if (changes > 0) {
			setDiscarding(true);
		} else {
			close();
		}
	};

	return (
		<div className={styles.page}>
			<Button variant="outlined" color="secondary" size="md" onClick={() => setOpen(true)}>
				Edit panel
			</Button>
			<Drawer
				stack="overlay"
				type="task"
				open={open}
				// Unsaved edits: every way out asks first, the backdrop and `Esc` included.
				onClose={requestClose}
				title="Edit panel"
				width="wide"
				testId="unsaved"
				footerPrefix={
					changes > 0 ? (
						<Typography
							variant="label"
							size="base"
							weight="regular"
							color="primary"
							as="span"
							textOverflow="visible"
						>
							{`• ${changes} unsaved change`}
						</Typography>
					) : null
				}
				footerSuffix={
					<>
						<Button variant="outlined" color="secondary" size="md" onClick={requestClose}>
							Cancel
						</Button>
						<Button variant="solid" color="primary" size="md" onClick={close}>
							Save changes
						</Button>
					</>
				}
			>
				<div className={styles.form}>
					<Input
						aria-label="Panel name"
						value={name}
						onChange={(event) => setName(event.target.value)}
					/>
				</div>
				<AlertDialog
					open={discarding}
					title={`Discard ${changes} unsaved change?`}
					color="danger"
					confirmText="Discard"
					cancelText="Keep editing"
					testId="unsaved-discard"
					onConfirm={() => {
						setDiscarding(false);
						close();
					}}
					onCancel={() => setDiscarding(false)}
				>
					The name you changed in this panel is lost.
				</AlertDialog>
			</Drawer>
		</div>
	);
}

/**
 * A `task` with unsaved edits guards its own close: `onClose` and Cancel open a nested
 * `AlertDialog` while the form is dirty, and the footer says what is unsaved. With no edits, both
 * close at once.
 */
export const UnsavedChanges: Story = {
	parameters: {
		chromatic: { disableSnapshot: true },
		controls: { disable: true },
	},
	render: () => <UnsavedChangesForm />,
	play: async () => {
		await waitForEffects();
		await waitFor(() => expect(getNode('unsaved')).toBeVisible());

		const field = within(getNode('unsaved-body')).getByRole('textbox', { name: 'Panel name' });

		await userEvent.type(field, ' p99');
		await expect(getNode('unsaved-footer-prefix')).toHaveTextContent('• 1 unsaved change');

		await userEvent.keyboard('{Escape}');
		await waitFor(() => expect(getNode('unsaved-discard')).toBeVisible());

		await userEvent.click(
			within(getNode('unsaved-discard')).getByRole('button', { name: 'Keep editing' }),
		);
		await waitFor(() =>
			expect(document.querySelector('[data-testid="unsaved-discard"]')).toBeNull(),
		);
		await expect(getNode('unsaved')).toBeVisible();
	},
};

function WidthBox({ width }: { width: (typeof WIDTHS)[number] }): ReactElement {
	const boxRef = useRef<HTMLDivElement | null>(null);

	return (
		<div ref={boxRef} className={styles.widthBox}>
			<Drawer
				stack="overlay"
				type="inspector"
				open
				container={boxRef}
				initialFocus={false}
				onClose={() => undefined}
				title={width}
				width={width}
				testId={`width-${width}`}
			>
				{`The ${width} drawer.`}
			</Drawer>
		</div>
	);
}

/**
 * The five widths, each a max width: `narrow` 384px, `base` 512px, `wide` 672px, `extra-wide`
 * 820px and `entity` 880px. Pick the nearest name, not a width that fits the content. Each drawer
 * here renders in its own box.
 */
export const Widths: Story = {
	parameters: {
		chromatic: { disableSnapshot: false, modes: allModes },
		controls: { disable: true },
	},
	render: () => (
		<div className={`story-container-full ${styles.widths}`}>
			{WIDTHS.map((width) => (
				<WidthBox key={width} width={width} />
			))}
		</div>
	),
	play: async () => {
		await waitForEffects();
		await waitFor(() => expect(getNode('width-entity')).toBeVisible());

		const panelWidths = WIDTHS.map(
			(width) => getNode(`width-${width}`).getBoundingClientRect().width,
		);

		for (const width of WIDTHS) {
			await expect(getNode(`width-${width}`)).toHaveAttribute('data-width', width);
		}

		await expect(panelWidths).toEqual([...panelWidths].sort((a, b) => a - b));
		await expect(new Set(panelWidths.map(Math.round)).size).toBe(WIDTHS.length);
	},
};

/**
 * Opened before the record arrives. The title, the badge and the description show a skeleton,
 * copy is hidden, the nav and the actions stay on screen but take no input, and the close button
 * keeps working.
 */
export const Loading: Story = {
	parameters: {
		chromatic: { disableSnapshot: false, modes: allModes },
		controls: { disable: true },
	},
	render: () => (
		<div className={styles.page}>
			<Drawer
				stack="overlay"
				type="inspector"
				open
				loading
				onClose={() => undefined}
				title="payments-checkout-worker-7c9d4f6b8-xk2lp"
				width="entity"
				testId="loading"
				headerPrefix={
					<>
						<Button variant="ghost" color="secondary" size="sm" icon aria-label="Previous pod">
							<ChevronUp />
						</Button>
						<Button variant="ghost" color="secondary" size="sm" icon aria-label="Next pod">
							<ChevronDown />
						</Button>
					</>
				}
				titlePrefix={
					<Badge variant="outlined" color="secondary">
						Pod
					</Badge>
				}
				titleSuffix={
					<Button variant="ghost" color="secondary" size="sm" icon aria-label="Copy pod name">
						<Copy />
					</Button>
				}
				headerSuffix={
					<Button variant="ghost" color="secondary" size="sm" icon aria-label="More actions">
						<Ellipsis />
					</Button>
				}
				loadingContent={<Skeleton paragraph={{ rows: 6 }} />}
			>
				Not rendered while loading.
			</Drawer>
		</div>
	),
	play: async () => {
		await waitForEffects();
		await waitFor(() => expect(getNode('loading')).toBeVisible());

		await expect(getNode('loading')).toHaveAttribute('aria-busy', 'true');
		await expect(getNode('loading-title-skeleton')).toBeInTheDocument();
		await expect(document.querySelector('[data-testid="loading-title-suffix"]')).toBeNull();
		await expect(getNode('loading-header-suffix')).toHaveAttribute('data-loading');
		await expect(getNode('loading-close')).toBeEnabled();
	},
};

type LogRow = { id: string; timestamp: string; service: string; body: string };

const LOGS: LogRow[] = [
	{
		id: 'log-1',
		timestamp: '2026-10-20 06:14:02',
		service: 'payments',
		body: 'OOMKilled: container payments exceeded its 2Gi limit',
	},
	{
		id: 'log-2',
		timestamp: '2026-10-20 06:14:05',
		service: 'checkout',
		body: 'POST /charge 502 in 2.4s',
	},
	{
		id: 'log-3',
		timestamp: '2026-10-20 06:14:09',
		service: 'payments',
		body: 'Retrying charge 4bf92f35 after upstream timeout',
	},
];

function LogsTable(): ReactElement {
	const logDetails = useDrawerHandle<LogRow>();

	return (
		<div className={styles.page}>
			<ul className={styles.rows}>
				{LOGS.map((log) => (
					<li key={log.id}>
						<button type="button" className={styles.rowButton} onClick={() => logDetails.open(log)}>
							{`${log.timestamp} ${log.body}`}
						</button>
					</li>
				))}
			</ul>
			<Drawer
				stack="overlay"
				type="inspector"
				handle={logDetails}
				title="Log details"
				width="extra-wide"
				testId="log"
			>
				{(log) => (
					<dl className={styles.summary}>
						<dt>Timestamp</dt>
						<dd>{log.timestamp}</dd>
						<dt>Service</dt>
						<dd>{log.service}</dd>
						<dt>Body</dt>
						<dd>{log.body}</dd>
					</dl>
				)}
			</Drawer>
		</div>
	);
}

/**
 * One drawer for every row, opened from a handle. `useDrawerHandle()` returns it,
 * `handle.open(row)` shows the drawer, and `children` is a function of that row. A press on another
 * row swaps the payload in place, with no exit and no entrance. The drawer closes itself on every
 * close request, so `open` and `onClose` are not passed.
 */
export const FromAHandle: Story = {
	parameters: {
		chromatic: { disableSnapshot: true },
		controls: { disable: true },
	},
	render: () => <LogsTable />,
	play: async ({ canvasElement }) => {
		await waitForEffects();
		const canvas = within(canvasElement);

		await userEvent.click(canvas.getByRole('button', { name: new RegExp(LOGS[0].body) }));
		await waitFor(() => expect(getNode('log-body')).toHaveTextContent(LOGS[0].body));

		await userEvent.click(canvas.getByRole('button', { name: new RegExp(LOGS[1].body) }));
		await waitFor(() => expect(getNode('log-body')).toHaveTextContent(LOGS[1].body));
	},
};

function PipelinePreview(): ReactElement {
	const [previewing, setPreviewing] = useState(true);
	const [logOpen, setLogOpen] = useState(true);
	const [log, setLog] = useState<LogRow>(LOGS[0]);

	return (
		<div className={styles.page}>
			<Button variant="outlined" color="secondary" size="md" onClick={() => setPreviewing(true)}>
				Preview pipeline
			</Button>
			<Dialog
				open={previewing}
				onClose={() => setPreviewing(false)}
				title="Preview pipeline"
				description="The logs the pipeline would process in the last 15 minutes."
				width="wide"
				testId="preview"
			>
				<ul className={styles.rows}>
					{LOGS.map((row) => (
						<li key={row.id}>
							<button
								type="button"
								className={styles.rowButton}
								onClick={() => {
									setLog(row);
									setLogOpen(true);
								}}
							>
								{row.body}
							</button>
						</li>
					))}
				</ul>
				<Drawer
					stack="overlay"
					type="inspector"
					open={logOpen}
					onClose={() => setLogOpen(false)}
					title="Log details"
					width="extra-wide"
					testId="preview-log"
				>
					{log.body}
				</Drawer>
			</Dialog>
		</div>
	);
}

/**
 * A drawer opened from a dialog covers the dialog, and a dialog opened from a drawer covers the
 * drawer: they share one layer, in open order, with no `zIndex`. `Esc` closes the top one first.
 */
export const OverADialog: Story = {
	parameters: {
		chromatic: { disableSnapshot: false, modes: allModes },
		controls: { disable: true },
	},
	render: () => <PipelinePreview />,
	play: async () => {
		await waitForEffects();
		await waitFor(() => expect(getNode('preview-log')).toBeVisible());

		const drawer = getNode('preview-log');
		const { left, top, width, height } = drawer.getBoundingClientRect();

		await expect(
			drawer.contains(document.elementFromPoint(left + width / 2, top + height / 2)),
		).toBe(true);

		await userEvent.keyboard('{Escape}');
		await waitFor(() => expect(document.querySelector('[data-testid="preview-log"]')).toBeNull());
		await expect(getNode('preview')).toBeVisible();
	},
};

function PodLabels(): ReactElement {
	const pod = PODS[0];
	const [podOpen, setPodOpen] = useState(true);
	const [editing, setEditing] = useState(true);

	return (
		<div className={styles.page}>
			<Button variant="outlined" color="secondary" size="md" onClick={() => setPodOpen(true)}>
				Open pod
			</Button>
			<Drawer
				type="inspector"
				stack="overlay"
				open={podOpen}
				onClose={() => setPodOpen(false)}
				title={pod.name}
				width="entity"
				testId="labels-pod"
				titlePrefix={
					<Badge variant="outlined" color="secondary">
						Pod
					</Badge>
				}
				headerSuffix={
					<Button variant="outlined" color="secondary" size="sm" onClick={() => setEditing(true)}>
						Edit labels
					</Button>
				}
			>
				<PodSummary pod={pod} />
				<Dialog
					open={editing}
					onClose={() => setEditing(false)}
					title="Edit labels"
					description="Labels are added to every log and trace of the pod."
					testId="labels-dialog"
					footerSuffix={
						<>
							<Button
								variant="outlined"
								color="secondary"
								size="md"
								onClick={() => setEditing(false)}
							>
								Cancel
							</Button>
							<Button variant="solid" color="primary" size="md" onClick={() => setEditing(false)}>
								Save
							</Button>
						</>
					}
				>
					<Input aria-label="Team" defaultValue="payments" />
				</Dialog>
			</Drawer>
		</div>
	);
}

/**
 * A dialog opened from a drawer covers it, the way a drawer opened from a dialog covers the
 * dialog in `OverADialog`: the one opened last is on top, with no `zIndex`. `Esc` closes the
 * dialog first, and the drawer stays open under it.
 */
export const DialogOverADrawer: Story = {
	parameters: {
		chromatic: { disableSnapshot: false, modes: allModes },
		controls: { disable: true },
	},
	render: () => <PodLabels />,
	play: async () => {
		await waitForEffects();
		await waitFor(() => expect(getNode('labels-dialog')).toBeVisible());

		const dialog = getNode('labels-dialog');
		const { left, top, width, height } = dialog.getBoundingClientRect();

		await expect(
			dialog.contains(document.elementFromPoint(left + width / 2, top + height / 2)),
		).toBe(true);

		await userEvent.keyboard('{Escape}');
		await waitFor(() => expect(document.querySelector('[data-testid="labels-dialog"]')).toBeNull());
		await expect(getNode('labels-pod')).toBeVisible();

		await userEvent.click(
			within(getNode('labels-pod')).getByRole('button', { name: 'Edit labels' }),
		);
		await waitFor(() => expect(getNode('labels-dialog')).toBeVisible());
	},
};

function PodWithLogs(): ReactElement {
	const pod = PODS[0];
	const [podOpen, setPodOpen] = useState(true);
	const [logOpen, setLogOpen] = useState(true);
	const [log, setLog] = useState<LogRow>(LOGS[0]);

	return (
		<div className={styles.page}>
			<Button variant="outlined" color="secondary" size="md" onClick={() => setPodOpen(true)}>
				Open pod
			</Button>
			<Drawer
				type="inspector"
				stack="overlay"
				open={podOpen}
				onClose={() => setPodOpen(false)}
				title={pod.name}
				width="entity"
				testId="overlay-pod"
				titlePrefix={
					<Badge variant="outlined" color="secondary">
						Pod
					</Badge>
				}
			>
				<PodSummary pod={pod} />
				<ul className={styles.rows}>
					{LOGS.map((row) => (
						<li key={row.id}>
							<button
								type="button"
								className={styles.rowButton}
								onClick={() => {
									setLog(row);
									setLogOpen(true);
								}}
							>
								{row.body}
							</button>
						</li>
					))}
				</ul>
				<Drawer
					type="inspector"
					stack="overlay"
					open={logOpen}
					onClose={() => setLogOpen(false)}
					title="Log details"
					testId="overlay-log"
				>
					<dl className={styles.summary}>
						<dt>Timestamp</dt>
						<dd>{log.timestamp}</dd>
						<dt>Service</dt>
						<dd>{log.service}</dd>
						<dt>Body</dt>
						<dd>{log.body}</dd>
					</dl>
				</Drawer>
			</Drawer>
		</div>
	);
}

/**
 * `stack="overlay"`: a drawer opened from another one covers it at 80% of its width, so the pod
 * stays in sight. The pod takes no input until the log closes, and `Esc` closes the log first.
 */
export const StackAsOverlay: Story = {
	parameters: {
		chromatic: { disableSnapshot: false, modes: allModes },
		controls: { disable: true },
	},
	render: () => <PodWithLogs />,
	play: async () => {
		await waitForEffects();
		await waitFor(() => expect(getNode('overlay-log')).toBeVisible());

		const pod = getNode('overlay-pod');
		const log = getNode('overlay-log');

		await expect(log).toHaveAttribute('data-nested', 'overlay');
		await expect(pod).toHaveAttribute('data-covered');
		await expect(log.getBoundingClientRect().width).toBeCloseTo(
			pod.getBoundingClientRect().width * 0.8,
			0,
		);

		await userEvent.keyboard('{Escape}');
		await waitFor(() => expect(document.querySelector('[data-testid="overlay-log"]')).toBeNull());
		await expect(getNode('overlay-pod')).not.toHaveAttribute('data-covered');

		// Opened again from the pod, so the snapshot shows the stack.
		await userEvent.click(
			within(getNode('overlay-pod')).getByRole('button', { name: LOGS[1].body }),
		);
		await waitFor(() => expect(getNode('overlay-log')).toHaveTextContent(LOGS[1].body));
	},
};

const DRILL_DOWN: PreviewStep[] = [
	{
		kind: 'Cluster',
		name: 'prod-gke-eu-west1',
		icon: <Network />,
		facts: [
			['Nodes', '12'],
			['Region', 'europe-west1'],
		],
	},
	{
		kind: 'Node',
		name: 'gke-prod-pool-b-6h0t',
		icon: <Server />,
		facts: [
			['Status', 'MemoryPressure'],
			['Pods', '38'],
		],
	},
	{
		kind: 'Namespace',
		name: 'payments',
		icon: <Folder />,
		facts: [
			['Pods', '9'],
			['Services', '4'],
		],
	},
	{
		kind: 'Pod',
		name: 'payments-7c9d4f6b8-xk2lp',
		icon: <Box />,
		facts: [
			['Status', 'CrashLoopBackOff'],
			['Restarts', '6'],
		],
	},
	{
		kind: 'Trace',
		name: 'POST /charge · 2.4s',
		icon: <Waypoints />,
		facts: [
			['Spans', '42'],
			['Errors', '3'],
		],
	},
	{
		kind: 'Log',
		name: 'OOMKilled: container payments exceeded its 2Gi limit',
		icon: <FileText />,
		facts: [
			['Severity', 'ERROR'],
			['Container', 'payments'],
		],
	},
];

function crumbPreview(index: number): ReactElement {
	return (
		<StepPreview
			step={DRILL_DOWN[index]}
			from={DRILL_DOWN[index - 1]}
			position={index + 1}
			total={DRILL_DOWN.length}
		/>
	);
}

function DrillDownStep({
	index,
	depth,
	setDepth,
	hrefFor,
}: {
	index: number;
	depth: number;
	setDepth: (depth: number) => void;
	hrefFor?: (index: number) => string;
}): ReactElement | null {
	const step = DRILL_DOWN[index];

	if (step === undefined) {
		return null;
	}

	const next = DRILL_DOWN[index + 1];

	return (
		<Drawer
			type="inspector"
			stack="breadcrumb"
			open={depth >= index}
			onClose={() => setDepth(index - 1)}
			title={step.name}
			crumb={{
				icon: step.icon,
				preview: crumbPreview(index),
				...(hrefFor === undefined ? {} : { href: hrefFor(index) }),
			}}
			width="entity"
			testId={`drill-${index}`}
			titlePrefix={
				<Badge variant="outlined" color="secondary">
					{step.kind}
				</Badge>
			}
		>
			<dl className={styles.summary}>
				{step.facts.map(([label, value]) => (
					<Fragment key={label}>
						<dt>{label}</dt>
						<dd>{value}</dd>
					</Fragment>
				))}
			</dl>
			{next === undefined ? null : (
				<ul className={styles.rows}>
					<li>
						<button type="button" className={styles.rowButton} onClick={() => setDepth(index + 1)}>
							{`${next.kind}: ${next.name}`}
						</button>
					</li>
				</ul>
			)}
			<DrillDownStep index={index + 1} depth={depth} setDepth={setDepth} hrefFor={hrefFor} />
		</Drawer>
	);
}

function DrillDown(): ReactElement {
	const [depth, setDepth] = useState(DRILL_DOWN.length - 1);

	return (
		<div className={styles.page}>
			<Button variant="outlined" color="secondary" size="md" onClick={() => setDepth(0)}>
				Open cluster
			</Button>
			<DrillDownStep index={0} depth={depth} setDepth={setDepth} />
		</div>
	);
}

/**
 * `stack="breadcrumb"`: a record opened from a drawer opens in place, at the same width, and the
 * trail under the header leads back: the first crumb, a `...` crumb that lists the earlier steps
 * on hover and on a press, and the last three. A press on a crumb goes back to it, `Esc` steps
 * back one record, and the close button closes the whole trail.
 */
export const StackAsBreadcrumb: Story = {
	parameters: {
		chromatic: { disableSnapshot: false, modes: allModes },
		controls: { disable: true },
	},
	render: () => <DrillDown />,
	play: async () => {
		const last = DRILL_DOWN.length - 1;
		await waitForEffects();
		await waitFor(() => expect(getNode(`drill-${last}`)).toBeVisible());

		const panel = getNode(`drill-${last}`);
		const trail = getNode(`drill-${last}-trail-breadcrumb`);

		await expect(panel).toHaveAttribute('data-nested', 'breadcrumb');
		await expect(panel.getBoundingClientRect().width).toBeCloseTo(
			getNode('drill-0').getBoundingClientRect().width,
			0,
		);
		await expect(trail).toHaveAttribute('data-variant', 'outlined');

		await userEvent.keyboard('{Escape}');
		await waitFor(() => expect(document.querySelector(`[data-testid="drill-${last}"]`)).toBeNull());

		const backTo = DRILL_DOWN[last - 3];
		await userEvent.click(
			within(getNode(`drill-${last - 1}-trail-breadcrumb`)).getByRole('button', {
				name: backTo.name,
			}),
		);
		await waitFor(() =>
			expect(document.querySelector(`[data-testid="drill-${last - 2}"]`)).toBeNull(),
		);
		await expect(getNode(`drill-${last - 3}`)).toBeVisible();

		// Down the trail again, so the snapshot shows it at its longest.
		for (let index = last - 3; index < last; index++) {
			await userEvent.click(
				within(getNode(`drill-${index}-body`)).getByRole('button', {
					name: `${DRILL_DOWN[index + 1].kind}: ${DRILL_DOWN[index + 1].name}`,
				}),
			);
			await waitFor(() => expect(getNode(`drill-${index + 1}`)).toBeVisible());
		}

		// The card of an earlier crumb, so the snapshot shows it.
		const previewed = DRILL_DOWN[last - 2];
		await userEvent.hover(
			within(getNode(`drill-${last}-trail-breadcrumb`)).getByRole('button', {
				name: previewed.name,
			}),
		);
		await waitFor(() =>
			expect(
				within(document.body).getByText(`Step ${last - 1} of ${DRILL_DOWN.length}`, {
					exact: false,
				}),
			).toBeVisible(),
		);
	},
};

const DRILL_DOWN_KEYS = DRILL_DOWN.map((step) => step.kind.toLowerCase());

const trailParser = parseAsArrayOf(parseAsStringLiteral(DRILL_DOWN_KEYS)).withOptions({
	history: 'push',
});

const serializeTrail = createSerializer({ trail: trailParser });

function DeepLinkedDrillDown(): ReactElement {
	const [trail, setTrail] = useQueryState('trail', trailParser);
	const depth = (trail?.length ?? 0) - 1;

	const setDepth = (next: number): void => {
		void setTrail(next < 0 ? null : DRILL_DOWN_KEYS.slice(0, next + 1));
	};

	return (
		<div className={styles.page}>
			<Button variant="outlined" color="secondary" size="md" onClick={() => setDepth(0)}>
				Open cluster
			</Button>
			<DrillDownStep
				index={0}
				depth={depth}
				setDepth={setDepth}
				hrefFor={(index) =>
					serializeTrail(window.location.search, { trail: DRILL_DOWN_KEYS.slice(0, index + 1) })
				}
			/>
		</div>
	);
}

/**
 * A trail kept in the URL with [nuqs](https://nuqs.dev), `?trail=cluster,node,...`, so every step
 * has a deep link. A plain click on a crumb steps back, and `onClose` writes the shorter trail to
 * the URL. `Ctrl` or `Cmd` and a click on a crumb, or on its row in the `...` list, opens that step
 * in a new tab, which reads the trail from the URL and opens every drawer of it. The browser's back
 * button steps back too.
 */
export const DeepLinkWithNuqs: Story = {
	parameters: {
		// The trail lives in the URL, and `StackAsBreadcrumb` snapshots the same trail.
		chromatic: { disableSnapshot: true },
		controls: { disable: true },
	},
	render: () => (
		<NuqsAdapter>
			<DeepLinkedDrillDown />
		</NuqsAdapter>
	),
	play: async ({ canvasElement }) => {
		const last = DRILL_DOWN.length - 1;
		const trailInUrl = (): string | null =>
			new URLSearchParams(window.location.search).get('trail');
		await waitForEffects();

		// A trail left in the URL by an earlier run is closed first, so every run starts the same.
		if (document.querySelector('[data-testid="drill-0"]') !== null) {
			await userEvent.click(getNode('drill-0-close'));
		}
		await waitFor(() => expect(trailInUrl()).toBeNull());

		await userEvent.click(within(canvasElement).getByRole('button', { name: 'Open cluster' }));
		for (let index = 0; index < last; index++) {
			await waitFor(() => expect(getNode(`drill-${index}`)).toBeVisible());
			await userEvent.click(
				within(getNode(`drill-${index}-body`)).getByRole('button', {
					name: `${DRILL_DOWN[index + 1].kind}: ${DRILL_DOWN[index + 1].name}`,
				}),
			);
		}
		await waitFor(() => expect(getNode(`drill-${last}`)).toBeVisible());
		await waitFor(() => expect(trailInUrl()).toBe(DRILL_DOWN_KEYS.join(',')));

		const trail = getNode(`drill-${last}-trail-breadcrumb`);
		const backTo = within(trail).getByRole('link', { name: DRILL_DOWN[last - 2].name });
		await expect(
			new URL(backTo.getAttribute('href') ?? '', window.location.href).searchParams.get('trail'),
		).toBe(DRILL_DOWN_KEYS.slice(0, last - 1).join(','));

		await userEvent.click(backTo);
		await waitFor(() =>
			expect(document.querySelector(`[data-testid="drill-${last - 1}"]`)).toBeNull(),
		);
		await waitFor(() => expect(trailInUrl()).toBe(DRILL_DOWN_KEYS.slice(0, last - 1).join(',')));
		await expect(getNode(`drill-${last - 2}`)).toBeVisible();
		// The drawer handled the click, so the link guard of the docs shows no toast over it.
		await expect(document.querySelector('[data-slot="toast"]')).toBeNull();
	},
};

const serializeSteps = createSerializer({ steps: trailParser });

function ControlledTrailDrillDown(): ReactElement {
	const [steps, setSteps] = useQueryState('steps', trailParser);
	const open = (steps?.length ?? 0) > 0;
	const [shown, setShown] = useState<string[]>([]);

	// The drawer plays its exit with the steps it had, so its content does not change while it
	// slides out.
	if (steps !== null && steps.length > 0 && steps.join() !== shown.join()) {
		setShown(steps);
	}

	const currentIndex = Math.max(DRILL_DOWN_KEYS.indexOf(shown.at(-1) ?? ''), 0);
	const current = DRILL_DOWN[currentIndex];
	const next = DRILL_DOWN[currentIndex + 1];

	return (
		<div className={styles.page}>
			<Button
				variant="outlined"
				color="secondary"
				size="md"
				onClick={() => void setSteps([DRILL_DOWN_KEYS[0]])}
			>
				Open cluster
			</Button>
			<Drawer
				type="inspector"
				stack="breadcrumb"
				open={open}
				onClose={() => void setSteps(null)}
				title={current.name}
				crumb={{ icon: current.icon }}
				trail={shown.slice(0, -1).map((key, index) => {
					const stepIndex = DRILL_DOWN_KEYS.indexOf(key);

					return {
						title: DRILL_DOWN[stepIndex].name,
						icon: DRILL_DOWN[stepIndex].icon,
						preview: crumbPreview(stepIndex),
						href: serializeSteps(window.location.search, { steps: shown.slice(0, index + 1) }),
					};
				})}
				onTrailSelect={(index) => void setSteps(shown.slice(0, index + 1))}
				width="entity"
				testId="controlled"
				titlePrefix={
					<Badge variant="outlined" color="secondary">
						{current.kind}
					</Badge>
				}
			>
				<dl className={styles.summary}>
					{current.facts.map(([label, value]) => (
						<Fragment key={label}>
							<dt>{label}</dt>
							<dd>{value}</dd>
						</Fragment>
					))}
				</dl>
				{next === undefined ? null : (
					<ul className={styles.rows}>
						<li>
							<button
								type="button"
								className={styles.rowButton}
								onClick={() => void setSteps([...shown, DRILL_DOWN_KEYS[currentIndex + 1]])}
							>
								{`${next.kind}: ${next.name}`}
							</button>
						</li>
					</ul>
				)}
			</Drawer>
		</div>
	);
}

/**
 * The same drill-down with one drawer and a `trail` instead of one drawer per step, for steps too
 * heavy to keep mounted, such as a page of charts. The steps live in the URL,
 * `?steps=cluster,node,...`, through nuqs, and `onTrailSelect` drops the steps after the crumb that
 * was pressed. This mode mounts only the current step, so a step back mounts that step again and it
 * keeps no scroll or state. `Esc` steps back one step too, and a click on a crumb with `Ctrl` or
 * `Cmd` opens that step in a new tab.
 */
export const ControlledTrail: Story = {
	parameters: {
		// The trail lives in the URL, and `StackAsBreadcrumb` snapshots the same trail.
		chromatic: { disableSnapshot: true },
		controls: { disable: true },
	},
	render: () => (
		<NuqsAdapter>
			<ControlledTrailDrillDown />
		</NuqsAdapter>
	),
	play: async ({ canvasElement }) => {
		const last = 3;
		const stepsInUrl = (): string | null =>
			new URLSearchParams(window.location.search).get('steps');
		const keysUpTo = (index: number): string => DRILL_DOWN_KEYS.slice(0, index + 1).join(',');
		const labelOf = (index: number): string =>
			`${DRILL_DOWN[index].kind}: ${DRILL_DOWN[index].name}`;
		const crumbs = (): HTMLElement => getNode('controlled-trail-breadcrumb');
		const drillButton = (index: number): HTMLElement =>
			within(getNode('controlled-body')).getByRole('button', { name: labelOf(index) });
		await waitForEffects();

		// A trail left in the URL by an earlier run is closed first, so every run starts the same.
		if (document.querySelector('[data-testid="controlled"]') !== null) {
			await userEvent.click(getNode('controlled-close'));
		}
		await waitFor(() => expect(stepsInUrl()).toBeNull());

		await userEvent.click(within(canvasElement).getByRole('button', { name: 'Open cluster' }));
		await waitFor(() => expect(getNode('controlled')).toBeVisible());
		await expect(getNode('controlled-title')).toHaveTextContent(DRILL_DOWN[0].name);
		await expect(document.querySelector('[data-testid="controlled-trail"]')).toBeNull();

		for (let index = 1; index <= last; index++) {
			await userEvent.click(drillButton(index));
			await waitFor(() =>
				expect(getNode('controlled-title')).toHaveTextContent(DRILL_DOWN[index].name),
			);
		}
		await waitFor(() => expect(stepsInUrl()).toBe(keysUpTo(last)));

		for (let index = 0; index < last; index++) {
			const crumb = within(crumbs()).getByRole('link', { name: DRILL_DOWN[index].name });
			await expect(
				new URL(crumb.getAttribute('href') ?? '', window.location.href).searchParams.get('steps'),
			).toBe(keysUpTo(index));
		}
		await expect(within(crumbs()).queryByRole('link', { name: DRILL_DOWN[last].name })).toBeNull();
		await expect(within(crumbs()).getByText(DRILL_DOWN[last].name)).toBeVisible();

		for (let index = 1; index <= last; index++) {
			await expect(within(document.body).queryByText(labelOf(index))).toBeNull();
		}
		await expect(drillButton(last + 1)).toBeVisible();

		await userEvent.click(within(crumbs()).getByRole('link', { name: DRILL_DOWN[last - 1].name }));
		await waitFor(() =>
			expect(getNode('controlled-title')).toHaveTextContent(DRILL_DOWN[last - 1].name),
		);
		await waitFor(() => expect(stepsInUrl()).toBe(keysUpTo(last - 1)));
		await expect(within(document.body).queryByText(labelOf(last + 1))).toBeNull();
		await expect(drillButton(last)).toBeVisible();
		// The drawer handled the click, so the link guard of the docs shows no toast over it.
		await expect(document.querySelector('[data-slot="toast"]')).toBeNull();

		// `Esc` asks for the last earlier step, so the drawer steps back once more and stays open.
		await userEvent.keyboard('{Escape}');
		await waitFor(() =>
			expect(getNode('controlled-title')).toHaveTextContent(DRILL_DOWN[last - 2].name),
		);
		await waitFor(() => expect(stepsInUrl()).toBe(keysUpTo(last - 2)));
		await expect(getNode('controlled')).toBeVisible();
		await expect(drillButton(last - 1)).toBeVisible();
		await expect(within(crumbs()).getAllByRole('link')).toHaveLength(last - 2);
	},
};

function TraceFromPod(): ReactElement {
	const pod = PODS[0];
	const [podOpen, setPodOpen] = useState(true);
	const [traceOpen, setTraceOpen] = useState(true);
	const [logOpen, setLogOpen] = useState(true);

	return (
		<div className={styles.page}>
			<Button variant="outlined" color="secondary" size="md" onClick={() => setPodOpen(true)}>
				Open pod
			</Button>
			<Drawer
				type="inspector"
				stack="breadcrumb"
				open={podOpen}
				onClose={() => setPodOpen(false)}
				title={pod.name}
				crumb={{ icon: <Box /> }}
				width="entity"
				testId="mixed-pod"
			>
				<PodSummary pod={pod} />
				<Button variant="outlined" color="secondary" size="md" onClick={() => setTraceOpen(true)}>
					Open the latest trace
				</Button>
				<Drawer
					type="inspector"
					stack="overlay"
					open={traceOpen}
					onClose={() => setTraceOpen(false)}
					title="POST /charge · 2.4s"
					crumb={{ icon: <Waypoints /> }}
					testId="mixed-trace"
				>
					<Button variant="outlined" color="secondary" size="md" onClick={() => setLogOpen(true)}>
						Open the error log
					</Button>
					<Drawer
						type="inspector"
						stack="overlay"
						open={logOpen}
						onClose={() => setLogOpen(false)}
						title="Log details"
						testId="mixed-log"
					>
						{LOGS[0].body}
					</Drawer>
				</Drawer>
			</Drawer>
		</div>
	);
}

/**
 * The two at once: the trace opens in the pod's trail, and the trace sets `stack="overlay"`, so
 * its log covers the trail. The trail takes no input until the log closes.
 */
export const BreadcrumbThenOverlay: Story = {
	parameters: {
		chromatic: { disableSnapshot: false, modes: allModes },
		controls: { disable: true },
	},
	render: () => <TraceFromPod />,
	play: async () => {
		await waitForEffects();
		await waitFor(() => expect(getNode('mixed-log')).toBeVisible());

		const trace = getNode('mixed-trace');
		const log = getNode('mixed-log');

		await expect(trace).toHaveAttribute('data-nested', 'breadcrumb');
		await expect(trace).toHaveAttribute('data-covered');
		await expect(log).toHaveAttribute('data-nested', 'overlay');
		await expect(log.getBoundingClientRect().width).toBeCloseTo(
			trace.getBoundingClientRect().width * 0.8,
			0,
		);

		await userEvent.keyboard('{Escape}');
		await waitFor(() => expect(document.querySelector('[data-testid="mixed-log"]')).toBeNull());
		await expect(getNode('mixed-trace')).not.toHaveAttribute('data-covered');
		await expect(getNode('mixed-trace-trail')).toBeVisible();

		await userEvent.click(
			within(getNode('mixed-trace')).getByRole('button', { name: 'Open the error log' }),
		);
		await waitFor(() => expect(getNode('mixed-log')).toBeVisible());
	},
};

const SERVICES_REPORTING = Array.from({ length: 40 }, (_, index) => `checkout-${index + 1}`);

/**
 * A body taller than the panel. The panel stops 16px from the top, the right and the bottom of the
 * viewport, the header and the footer stay in place, and only the body scrolls.
 */
export const Overflow: Story = {
	parameters: {
		chromatic: { disableSnapshot: false, modes: allModes },
		controls: { disable: true },
	},
	render: () => (
		<div className={styles.page}>
			<Drawer
				stack="overlay"
				type="task"
				open
				onClose={() => undefined}
				title="Services reporting"
				description="Pick the services this alert watches."
				testId="overflow"
				footerSuffix={
					<Button variant="solid" color="primary" size="md">
						Done
					</Button>
				}
			>
				<ul className={styles.rows}>
					{SERVICES_REPORTING.map((name) => (
						<li key={name} className={styles.row}>
							<span>{name}</span>
							<span>Healthy</span>
						</li>
					))}
				</ul>
			</Drawer>
		</div>
	),
	play: async () => {
		await waitForEffects();
		await waitFor(() => expect(getNode('overflow-body')).toBeVisible());

		const body = getNode('overflow-body');

		await expect(body.scrollHeight).toBeGreaterThan(body.clientHeight);
		await expect(getNode('overflow-header')).toBeVisible();
		await expect(getNode('overflow-footer')).toBeVisible();
	},
};

function DrawerInABox(): ReactElement {
	const [open, setOpen] = useState(false);
	const boxRef = useRef<HTMLDivElement | null>(null);

	return (
		<div className={styles.page}>
			<Typography
				variant="paragraph"
				size="small"
				weight="regular"
				color="secondary"
				as="p"
				textOverflow="wrap"
			>
				The drawer opens inside the dashed box, backdrop included, and not over the page.
			</Typography>
			<div ref={boxRef} className={styles.box} data-testid="box">
				<Button variant="solid" color="primary" size="md" onClick={() => setOpen(true)}>
					Open drawer
				</Button>
			</div>
			<Drawer
				stack="overlay"
				type="task"
				open={open}
				container={boxRef}
				onClose={() => setOpen(false)}
				title="Share panel"
				width="narrow"
				testId="box-drawer"
			>
				The link stops working when you delete the panel.
			</Drawer>
		</div>
	);
}

/**
 * `container` names the element the drawer renders in. Use it when the page shows only part of
 * the document, such as a chart in fullscreen. The backdrop and the panel are fixed to the
 * viewport, so the box has a `contain` that fixes them to itself, and a fullscreen element needs
 * none.
 */
export const InAContainer: Story = {
	parameters: {
		chromatic: { disableSnapshot: false, modes: allModes },
		controls: { disable: true },
	},
	render: () => <DrawerInABox />,
	play: async ({ canvasElement }) => {
		await waitForEffects();
		await userEvent.click(within(canvasElement).getByRole('button', { name: 'Open drawer' }));
		await waitFor(() => expect(getNode('box-drawer')).toBeVisible());
		await expect(getNode('box').contains(getNode('box-drawer'))).toBe(true);
	},
};
