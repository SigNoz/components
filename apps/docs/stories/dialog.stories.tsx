import {
	Gauge,
	KeyRound,
	LayoutGrid,
	List,
	LockKeyhole,
	Logs,
	Search,
	Settings,
	Trash2,
	Workflow,
} from '@signozhq/icons';
import {
	AlertDialog,
	Badge,
	Button,
	Checkbox,
	Combobox,
	type ComboboxOptionItemType,
	Dialog,
	type DialogProps,
	Input,
	RadioCards,
	type RadioCardsItemType,
	RadioGroup,
	type RadioGroupItemType,
	Select,
	type SelectOptionItemType,
	Skeleton,
	Slider,
	Switch,
	ToggleGroup,
	type ToggleGroupItemProps,
	Typography,
	useDialogHandle,
} from '@signozhq/ui';
import { ForceOpenProvider } from '@signozhq/ui/testing';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { type ReactElement, type ReactNode, useEffect, useRef, useState } from 'react';
import { expect, fn, userEvent, waitFor, within } from 'storybook/test';
import { allModes } from '../.storybook/modes.js';
import styles from './dialog.stories.module.css';
import { dialogArgTypes, dialogParameters, WIDTHS } from './shared/dialog-arg-types.js';
import { waitForEffects } from './shared/play.js';

const meta: Meta<typeof Dialog> = {
	title: 'Composed Components/Dialog',
	component: Dialog,
	parameters: dialogParameters,
	argTypes: dialogArgTypes,
	args: {
		open: false,
		onClose: fn(),
		title: 'Rename view',
		description: 'Dashboards that link to this view keep working under the new name.',
		children: 'Pick a name your team will recognise in the list of views.',
		width: 'base',
		testId: 'dialog',
	},
};

export default meta;

type Story = StoryObj<typeof Dialog>;

/**
 * Owns `open`, as a consumer does, and opens from a button. The footer actions are the
 * playground's own, since its buttons have to close the dialog.
 */
function DialogPlayground({
	open: _open,
	handle: _handle,
	onClose,
	footerSuffix: _footerSuffix,
	...props
}: DialogProps): ReactElement {
	const [open, setOpen] = useState(false);

	return (
		<div className="story-container">
			<Button variant="solid" color="primary" size="md" onClick={() => setOpen(true)}>
				Open dialog
			</Button>
			<Dialog
				{...props}
				open={open}
				onClose={(reason) => {
					onClose?.(reason);
					setOpen(false);
				}}
				footerSuffix={
					<>
						<Button variant="outlined" color="secondary" size="md" onClick={() => setOpen(false)}>
							Cancel
						</Button>
						<Button variant="solid" color="primary" size="md" onClick={() => setOpen(false)}>
							Save
						</Button>
					</>
				}
			/>
		</div>
	);
}

/**
 * The playground the Controls table drives. Open it from the button, and close it from `Esc`, a
 * press on the backdrop, the close button or the footer.
 */
export const Default: Story = {
	parameters: {
		// The dialog opens from a press, and `Showcase` holds a stack of them open.
		chromatic: { disableSnapshot: true },
	},
	render: (args) => <DialogPlayground {...args} />,
};

const PANELS = [
	['Checkout latency', 'Time series'],
	['Error budget', 'Value'],
	['Deploy markers', 'Time series'],
	['Slowest endpoints', 'Table'],
	['Queue depth', 'Time series'],
	['Cache hit rate', 'Value'],
	['Failed payments', 'Time series'],
	['Active sessions', 'Value'],
	['Database connections', 'Time series'],
	['Top customers by spend', 'Table'],
];

/**
 * A dialog that opens a dialog that opens an `AlertDialog`, each from inside the one below, so all
 * three are in the page at once. The panels get narrower with the depth, and the parent's edges
 * show around the child.
 */
function ShowcaseStack(): ReactElement {
	const [editing, setEditing] = useState(true);
	const [configuring, setConfiguring] = useState(true);
	const [discarding, setDiscarding] = useState(true);

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
				Every dialog is open. Answer the last one, then close each dialog in turn, and open the
				stack again from the button.
			</Typography>
			<Button
				variant="outlined"
				color="secondary"
				size="md"
				onClick={() => {
					setEditing(true);
					setConfiguring(true);
					setDiscarding(true);
				}}
			>
				Open the stack
			</Button>
			<Dialog
				open={editing}
				onClose={() => setEditing(false)}
				title="Edit dashboard"
				titleIcon={<LayoutGrid />}
				description="Changes are saved to the copy the whole team sees."
				width="extra-wide"
				testId="showcase"
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
							Save changes
						</Button>
					</>
				}
			>
				<ul className={styles.rows}>
					{PANELS.map(([name, kind]) => (
						<li key={name} className={styles.row}>
							<span>{name}</span>
							<span className={styles.rowKind}>{kind}</span>
						</li>
					))}
				</ul>
				<Dialog
					open={configuring}
					onClose={() => setConfiguring(false)}
					title="Panel settings"
					titleIcon={<Settings />}
					width="base"
					testId="showcase-panel"
					footerSuffix={
						<>
							<Button
								variant="outlined"
								color="secondary"
								size="md"
								onClick={() => setConfiguring(false)}
							>
								Cancel
							</Button>
							<Button
								variant="solid"
								color="primary"
								size="md"
								type="submit"
								form="showcase-panel-form"
							>
								Apply
							</Button>
						</>
					}
				>
					<form
						id="showcase-panel-form"
						className={styles.form}
						onSubmit={(event) => {
							event.preventDefault();
							setConfiguring(false);
						}}
					>
						<Input aria-label="Panel name" defaultValue="Checkout latency" />
						<Input aria-label="Panel description" placeholder="What the panel shows" />
					</form>
					<AlertDialog
						open={discarding}
						title="Discard your changes?"
						color="danger"
						confirmText="Discard changes"
						cancelText="Keep editing"
						testId="showcase-discard"
						onConfirm={() => {
							setDiscarding(false);
							setConfiguring(false);
						}}
						onCancel={() => setDiscarding(false)}
					>
						The name and the settings you changed in this panel are lost.
					</AlertDialog>
				</Dialog>
			</Dialog>
		</div>
	);
}

function getNode(testId: string): HTMLElement {
	// The dialogs portal to `document.body`, so none of this is inside the canvas element.
	const node = document.querySelector<HTMLElement>(`[data-testid="${testId}"]`);

	if (node === null) {
		throw new Error(`Dialog showcase: no node named "${testId}".`);
	}

	return node;
}

/**
 * Three dialogs held open at once, since a modal covers the page and cannot sit in a grid: a
 * wide dialog with an icon, a description, a body and a footer, the dialog it opens, and the
 * `AlertDialog` that asks to discard what was changed there. The body is short enough that the
 * panel never reaches its max height, so nothing scrolls in the snapshot.
 *
 * Only the top one takes input. The two below stay rendered and inert, the first one's backdrop is
 * the only backdrop, and each panel under another carries `data-nested-dialog-open`.
 */
export const Showcase: Story = {
	parameters: {
		chromatic: { disableSnapshot: false, modes: allModes },
		controls: { disable: true },
	},
	render: () => <ShowcaseStack />,
	play: async () => {
		await waitForEffects();
		await waitFor(() => expect(getNode('showcase-discard')).toBeInTheDocument());

		const parent = getNode('showcase');
		const child = getNode('showcase-panel');
		const discard = getNode('showcase-discard');

		await expect(parent).toHaveAttribute('role', 'dialog');
		await expect(parent).toHaveAttribute('aria-modal', 'true');
		await expect(parent).toHaveAttribute('data-width', 'extra-wide');
		await expect(parent).toHaveAttribute('data-nested-dialog-open');
		await expect(getNode('showcase-title')).toHaveTextContent('Edit dashboard');
		await expect(parent).toHaveAttribute('aria-labelledby', getNode('showcase-title').id);
		await expect(getNode('showcase-description')).toHaveTextContent('Changes are saved');
		await expect(parent).toHaveAttribute('aria-describedby', getNode('showcase-description').id);
		await expect(getNode('showcase-close')).toHaveAccessibleName('Close');
		await expect(getNode('showcase-body')).toBeInTheDocument();
		await expect(getNode('showcase-footer')).toBeInTheDocument();

		await expect(child).toHaveAttribute('role', 'dialog');
		await expect(child).toHaveAttribute('data-width', 'base');
		await expect(child).toHaveAttribute('data-nested-dialog-open');
		await expect(getNode('showcase-panel-title')).toHaveTextContent('Panel settings');
		// A dialog with no description has no `aria-describedby` and no description part.
		await expect(child).not.toHaveAttribute('aria-describedby');
		await expect(document.querySelector('[data-testid="showcase-panel-description"]')).toBeNull();

		await expect(discard).toHaveAttribute('role', 'alertdialog');
		await expect(discard).toHaveAttribute('aria-modal', 'true');
		await expect(discard).toHaveAttribute('data-color', 'danger');
		await expect(discard).not.toHaveAttribute('data-nested-dialog-open');
		await expect(getNode('showcase-discard-title')).toHaveTextContent('Discard your changes?');
		await expect(discard).toHaveAttribute('aria-describedby', getNode('showcase-discard-body').id);
		await expect(document.querySelector('[data-testid="showcase-discard-close"]')).toBeNull();
		await waitFor(() => expect(discard).toHaveFocus());
		await expect(getNode('showcase-discard-confirm')).toHaveTextContent('Discard changes');

		// The stack shares one backdrop.
		await expect(document.querySelectorAll('[data-slot$="backdrop"]')).toHaveLength(1);
	},
};

/**
 * One dialog held open in its own box through `container`, since a modal covers the page and two
 * cannot share it. The box is wider than the widest name that is not `full`, so each panel reaches
 * its max width.
 */
function WidthBox({ width }: { width: (typeof WIDTHS)[number] }): ReactElement {
	const [open, setOpen] = useState(true);
	const [box, setBox] = useState<HTMLDivElement | null>(null);

	return (
		<div className="story-section-sm">
			<div className="story-row">
				<Typography
					variant="label"
					size="base"
					weight="bold"
					color="main"
					as="span"
					textOverflow="visible"
				>
					{width}
				</Typography>
				<Button variant="outlined" color="secondary" size="md" onClick={() => setOpen(true)}>
					Open dialog
				</Button>
			</div>
			<div ref={setBox} className={styles.widthBox} />
			<Dialog
				open={open}
				container={box}
				onClose={() => setOpen(false)}
				title="Rename view"
				width={width}
				testId={`width-${width}`}
				footerSuffix={
					<>
						<Button variant="outlined" color="secondary" size="md" onClick={() => setOpen(false)}>
							Cancel
						</Button>
						<Button variant="solid" color="primary" size="md" onClick={() => setOpen(false)}>
							Save
						</Button>
					</>
				}
			>
				Dashboards that link to it keep working.
			</Dialog>
		</div>
	);
}

/**
 * Every `width`, one dialog per box. `width` is a max width, so each panel is as wide as its name
 * allows until the room runs out, and `full` fills the box minus the 16px the panel keeps from
 * each edge.
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
		await waitFor(() => expect(getNode('width-full')).toBeVisible());

		const panelWidths = WIDTHS.map((width) => {
			const panel = getNode(`width-${width}`);

			return panel.getBoundingClientRect().width;
		});

		for (const width of WIDTHS) {
			await expect(getNode(`width-${width}`)).toHaveAttribute('data-width', width);
		}

		await expect(panelWidths).toEqual([...panelWidths].sort((a, b) => a - b));
		await expect(new Set(panelWidths.map(Math.round)).size).toBe(WIDTHS.length);
	},
};

const SERVICES_REPORTING = Array.from({ length: 40 }, (_, index) => `checkout-${index + 1}`);

function OverflowingDialog(): ReactElement {
	const [open, setOpen] = useState(true);

	return (
		<div className={styles.page}>
			<Button variant="outlined" color="secondary" size="md" onClick={() => setOpen(true)}>
				Open dialog
			</Button>
			<Dialog
				open={open}
				onClose={() => setOpen(false)}
				title="Services reporting"
				description="Every service that sent data in the last 15 minutes."
				testId="overflow"
				footerSuffix={
					<Button variant="solid" color="primary" size="md" onClick={() => setOpen(false)}>
						Done
					</Button>
				}
			>
				<ul className={styles.rows}>
					{SERVICES_REPORTING.map((name) => (
						<li key={name} className={styles.row}>
							<span>{name}</span>
							<span className={styles.rowKind}>Healthy</span>
						</li>
					))}
				</ul>
			</Dialog>
		</div>
	);
}

/**
 * A body taller than the room left. The panel stops 16px from each edge of the viewport, the header
 * and the footer stay in place, and the body scrolls.
 */
export const Overflow: Story = {
	parameters: {
		chromatic: { disableSnapshot: false, modes: allModes },
		controls: { disable: true },
	},
	render: () => <OverflowingDialog />,
	play: async () => {
		await waitForEffects();
		await waitFor(() => expect(getNode('overflow-body')).toBeVisible());

		const body = getNode('overflow-body');

		await expect(body.scrollHeight).toBeGreaterThan(body.clientHeight);
		await expect(getNode('overflow-header')).toBeVisible();
		await expect(getNode('overflow-footer')).toBeVisible();
	},
};

/**
 * Each way out reports its reason, and the dialog stays open until the story sets `open`. Closed,
 * it hands the focus back to the button it was opened from.
 */
export const Closing: Story = {
	parameters: {
		chromatic: { disableSnapshot: true },
		controls: { disable: true },
	},
	args: { onClose: fn() },
	render: (args) => <DialogPlayground {...args} />,
	play: async ({ canvasElement }) => {
		await waitForEffects();
		await userEvent.click(within(canvasElement).getByRole('button', { name: 'Open dialog' }));
		await waitFor(() => expect(getNode('dialog')).toBeVisible());
	},
};

/**
 * Edits one API key. The page owns `open`, and the dialog starts open so the footer shows without a
 * press. `Revoke key` is the `footerPrefix`, at the start of the footer and apart from Cancel and
 * Save. The `AlertDialog` it opens renders beside it, so it is nested in the dialog.
 */
function EditApiKey(): ReactElement {
	const [open, setOpen] = useState(true);
	const [revoking, setRevoking] = useState(false);
	const [revoked, setRevoked] = useState(false);

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
				{revoked ? 'The Checkout service key is revoked.' : 'The Checkout service key is active.'}
			</Typography>
			<Button variant="outlined" color="secondary" size="md" onClick={() => setOpen(true)}>
				Edit API key
			</Button>
			<Dialog
				open={open}
				onClose={() => setOpen(false)}
				title="Edit API key"
				description="Services that use the key keep working until you revoke it."
				testId="api-key"
				footerPrefix={
					<>
						<Button variant="link" color="danger" size="md" onClick={() => setRevoking(true)}>
							Revoke key
						</Button>
						<AlertDialog
							open={revoking}
							title="Revoke this key?"
							color="danger"
							confirmText="Revoke key"
							cancelText="Keep key"
							testId="api-key-revoke"
							onConfirm={() => {
								setRevoking(false);
								setOpen(false);
								setRevoked(true);
							}}
							onCancel={() => setRevoking(false)}
						>
							Services that use this key stop authenticating the moment it is revoked.
						</AlertDialog>
					</>
				}
				footerSuffix={
					<>
						<Button variant="outlined" color="secondary" size="md" onClick={() => setOpen(false)}>
							Cancel
						</Button>
						<Button variant="solid" color="primary" size="md" type="submit" form="api-key-form">
							Save
						</Button>
					</>
				}
			>
				<form
					id="api-key-form"
					className={styles.form}
					onSubmit={(event) => {
						event.preventDefault();
						setOpen(false);
					}}
				>
					<Input aria-label="Key name" defaultValue="Checkout service" />
				</form>
			</Dialog>
		</div>
	);
}

/**
 * `footerPrefix` holds one destructive action for the dialog, kept at the start of the footer so a
 * slip of the cursor toward Save does not reach it. The button opens an `AlertDialog`, which asks
 * before anything is lost. Cancel and Save stay in `footerSuffix`, primary last. Below 640px the
 * prefix goes under the stacked buttons.
 */
export const FooterPrefix: Story = {
	parameters: {
		chromatic: { disableSnapshot: false, modes: allModes },
		controls: { disable: true },
	},
	render: () => <EditApiKey />,
	play: async () => {
		await waitForEffects();
		await waitFor(() => expect(getNode('api-key-footer-prefix')).toBeVisible());
	},
};

interface ServiceAccountKey {
	id: string;
	name: string;
	lastObservedAt: string;
}

const CHECKOUT_KEY: ServiceAccountKey = {
	id: '0193f2c4-7d1e-7a35-b8c6-2f4e9a1d5b70',
	name: 'Checkout service',
	lastObservedAt: 'Nov 3, 2026, 14:12',
};

const EXPIRY_ITEMS: ToggleGroupItemProps[] = [
	{ value: 'none', label: 'No expiration' },
	{ value: 'date', label: 'Set expiration date' },
];

/**
 * The fields of a service account key, filled in from the request.
 */
function EditKeyForm({ keyItem }: { keyItem: ServiceAccountKey }): ReactElement {
	return (
		<form
			id="edit-key-form"
			className={styles.keyForm}
			onSubmit={(event) => {
				event.preventDefault();
			}}
		>
			<Field id="edit-key-name" label="Name">
				<Input aria-labelledby="edit-key-name" defaultValue={keyItem.name} />
			</Field>
			<Field id="edit-key-id" label="ID">
				<Input
					aria-labelledby="edit-key-id"
					value={keyItem.id}
					readOnly
					readOnlyTooltip="The ID is set when the key is created."
					suffix={<LockKeyhole />}
				/>
			</Field>
			<Field id="edit-key-secret" label="Key">
				<Input
					aria-labelledby="edit-key-secret"
					value="********************"
					readOnly
					readOnlyTooltip="The key is shown once, when it is created."
					suffix={<LockKeyhole />}
				/>
			</Field>
			<Field id="edit-key-expiration" label="Expiration">
				<ToggleGroup
					type="single"
					variant="outlined"
					color="secondary"
					size="sm"
					items={EXPIRY_ITEMS}
					defaultValue="none"
					aria-labelledby="edit-key-expiration"
				/>
			</Field>
			<Field id="edit-key-last-observed" label="Last observed at">
				<div className={styles.inline}>
					<Badge variant="outlined" color="secondary" textTransform="none">
						{keyItem.lastObservedAt}
					</Badge>
				</div>
			</Field>
		</form>
	);
}

/**
 * `loadingContent` for the key dialog: the same fields, with a skeleton where each value goes. The
 * labels are known before the request, so they stay, and the body keeps its height when the key
 * arrives.
 */
function EditKeyFormSkeleton(): ReactElement {
	return (
		<div className={styles.keyForm}>
			<Field id="edit-key-name-loading" label="Name">
				<Skeleton.Input active size="md" />
			</Field>
			<Field id="edit-key-id-loading" label="ID">
				<Skeleton.Input active size="md" />
			</Field>
			<Field id="edit-key-secret-loading" label="Key">
				<Skeleton.Input active size="md" />
			</Field>
			<Field id="edit-key-expiration-loading" label="Expiration">
				<Skeleton.Input active size="md" width={160} />
			</Field>
			<Field id="edit-key-last-observed-loading" label="Last observed at">
				<div className={styles.badgeSkeleton}>
					<Skeleton.Input active size="sm" width={160} />
				</div>
			</Field>
		</div>
	);
}

/**
 * Edits one service account key, the way the Service accounts page does when it opens the dialog
 * from a link before the key list has loaded. While `loading`, every slot that is passed shows a
 * skeleton: the icon and the title, the description, Revoke key, and Cancel and Save changes. The
 * body shows `EditKeyFormSkeleton`. The close button stays, so the user can leave before the key
 * arrives.
 */
function EditKeyDialog({
	open,
	onClose,
	keyItem,
}: {
	open: boolean;
	onClose: () => void;
	keyItem: ServiceAccountKey | undefined;
}): ReactElement {
	return (
		<Dialog
			open={open}
			onClose={onClose}
			title={keyItem ? `Edit ${keyItem.name} key` : 'Edit key'}
			titleIcon={<KeyRound />}
			description="Services that use this key keep working until you revoke it."
			testId="edit-key"
			loading={!keyItem}
			loadingContent={<EditKeyFormSkeleton />}
			footerPrefix={
				<Button variant="link" color="danger" size="md" prefix={<Trash2 />}>
					Revoke key
				</Button>
			}
			footerSuffix={
				<>
					<Button variant="outlined" color="secondary" size="md" onClick={onClose}>
						Cancel
					</Button>
					<Button variant="solid" color="primary" size="md" type="submit" form="edit-key-form">
						Save changes
					</Button>
				</>
			}
		>
			{keyItem ? <EditKeyForm keyItem={keyItem} /> : null}
		</Dialog>
	);
}

function LoadingKey({ loading }: { loading: boolean }): ReactElement {
	const [open, setOpen] = useState(true);

	return (
		<div className={styles.page}>
			<Button variant="outlined" color="secondary" size="md" onClick={() => setOpen(true)}>
				Edit key
			</Button>
			<EditKeyDialog
				open={open}
				onClose={() => setOpen(false)}
				keyItem={loading ? undefined : CHECKOUT_KEY}
			/>
		</div>
	);
}

/**
 * `loading` while the key is on its way. Each slot that is passed shows a skeleton, and
 * `loadingContent` gives the body the shape of the form that replaces it. Turn `loading` off in
 * the controls to see the loaded dialog.
 */
export const Loading: Story = {
	parameters: {
		chromatic: { disableSnapshot: false, modes: allModes },
		controls: { include: ['loading'] },
	},
	args: { loading: true },
	render: (args) => <LoadingKey loading={args.loading ?? false} />,
	play: async () => {
		await waitForEffects();
		await waitFor(() => expect(getNode('edit-key-title-skeleton')).toBeVisible());
	},
};

function LoadingRetentionNote({ loading }: { loading: boolean }): ReactElement {
	const [open, setOpen] = useState(true);

	return (
		<div className={styles.page}>
			<Button variant="outlined" color="secondary" size="md" onClick={() => setOpen(true)}>
				Retention policy
			</Button>
			<Dialog
				open={open}
				onClose={() => setOpen(false)}
				title="Retention policy"
				testId="retention"
				loading={loading}
				footerSuffix={
					<Button variant="solid" color="primary" size="md" onClick={() => setOpen(false)}>
						Done
					</Button>
				}
			>
				<Typography
					variant="paragraph"
					size="base"
					weight="regular"
					color="inherit"
					as="p"
					textOverflow="wrap"
				>
					Logs are kept for 15 days and traces for 7 days. Data older than that is deleted at
					midnight UTC, and the change applies to data ingested after you save it.
				</Typography>
			</Dialog>
		</div>
	);
}

/**
 * `loading` with no `loadingContent`: the body shows the default skeleton, a title line and three
 * text lines, which fits a body of text. Turn `loading` off in the controls to see the text that
 * replaces it.
 */
export const LoadingDefaultContent: Story = {
	parameters: {
		chromatic: { disableSnapshot: false, modes: allModes },
		controls: { include: ['loading'] },
	},
	args: { loading: true },
	render: (args) => <LoadingRetentionNote loading={args.loading ?? false} />,
	play: async () => {
		await waitForEffects();
		await waitFor(() => expect(getNode('retention-body-skeleton')).toBeVisible());
	},
};

function FetchedKey(): ReactElement {
	const [open, setOpen] = useState(false);
	const [keyItem, setKeyItem] = useState<ServiceAccountKey>();

	// Stands in for the request the page sends when the dialog opens.
	useEffect(() => {
		if (!open) {
			return undefined;
		}

		const timer = window.setTimeout(() => setKeyItem(CHECKOUT_KEY), 1500);

		return () => window.clearTimeout(timer);
	}, [open]);

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
				The key takes 1.5s to load after the dialog opens.
			</Typography>
			<Button
				variant="outlined"
				color="secondary"
				size="md"
				onClick={() => {
					setKeyItem(undefined);
					setOpen(true);
				}}
			>
				Edit key
			</Button>
			<EditKeyDialog open={open} onClose={() => setOpen(false)} keyItem={keyItem} />
		</div>
	);
}

/**
 * The dialog opens at once and fills in when the request resolves, with no jump in the header or
 * the body. `loading` is `!keyItem`, so the form renders only once there is a key to fill it with.
 */
export const LoadingThenContent: Story = {
	parameters: {
		chromatic: { disableSnapshot: true },
		controls: { disable: true },
	},
	render: () => <FetchedKey />,
	play: async ({ canvasElement }) => {
		await waitForEffects();
		await userEvent.click(within(canvasElement).getByRole('button', { name: 'Edit key' }));
		await waitFor(
			() => expect(getNode('edit-key-footer-suffix')).toHaveTextContent('Save changes'),
			{
				timeout: 3000,
			},
		);
	},
};

/**
 * Owns `open`, and starts open. The hint is the `footerPrefix`, and Cancel and Send invites are the
 * `footerSuffix`.
 */
function InviteTeammates(): ReactElement {
	const [open, setOpen] = useState(true);

	return (
		<div className={styles.page}>
			<Button variant="outlined" color="secondary" size="md" onClick={() => setOpen(true)}>
				Invite teammates
			</Button>
			<Dialog
				open={open}
				onClose={() => setOpen(false)}
				title="Invite teammates"
				testId="invite"
				footerPrefix={
					<Typography
						variant="paragraph"
						size="small"
						weight="regular"
						color="secondary"
						as="p"
						textOverflow="wrap"
					>
						Invited people join as Viewers.
					</Typography>
				}
				footerSuffix={
					<>
						<Button variant="outlined" color="secondary" size="md" onClick={() => setOpen(false)}>
							Cancel
						</Button>
						<Button variant="solid" color="primary" size="md" type="submit" form="invite-form">
							Send invites
						</Button>
					</>
				}
			>
				<form
					id="invite-form"
					className={styles.form}
					onSubmit={(event) => {
						event.preventDefault();
						setOpen(false);
					}}
				>
					<Input aria-label="Email address" placeholder="alex@example.com" />
				</form>
			</Dialog>
		</div>
	);
}

/**
 * The other use of `footerPrefix`: one line of hint text, apart from the actions, such as the role
 * an invited person gets. Like the destructive button, it renders only with a `footerSuffix`.
 */
export const FooterHint: Story = {
	parameters: {
		chromatic: { disableSnapshot: false, modes: allModes },
		controls: { disable: true },
	},
	render: () => <InviteTeammates />,
	play: async () => {
		await waitForEffects();
		await waitFor(() => expect(getNode('invite-footer')).toBeInTheDocument());

		const prefix = getNode('invite-footer-prefix');
		const suffix = getNode('invite-footer-suffix');

		await expect(prefix).toHaveTextContent('Invited people join as Viewers.');
		await expect(within(prefix).queryByRole('button')).toBeNull();
		await expect(
			prefix.compareDocumentPosition(suffix) & Node.DOCUMENT_POSITION_FOLLOWING,
		).toBeTruthy();
		await expect(
			within(suffix)
				.getAllByRole('button')
				.map((action) => action.textContent),
		).toEqual(['Cancel', 'Send invites']);
	},
};

const ALERT_RULES = [
	{
		id: 'checkout-latency',
		name: 'Checkout latency',
		owner: 'alex@example.com',
		threshold: 'p95 above 800 ms',
	},
	{
		id: 'error-budget',
		name: 'Error budget burn',
		owner: 'sam@example.com',
		threshold: '2% per hour',
	},
	{
		id: 'queue-depth',
		name: 'Queue depth',
		owner: 'riley@example.com',
		threshold: 'more than 5000 jobs',
	},
];

type AlertRule = (typeof ALERT_RULES)[number];

/**
 * One dialog for every row. The rows have no state of their own: each Edit button calls
 * `handle.open(row)`, and the dialog renders that row through its `children`.
 */
function AlertRules(): ReactElement {
	const editRule = useDialogHandle<AlertRule>();

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
				One dialog serves every row. Each Edit button opens it with the row it belongs to.
			</Typography>
			<ul className={styles.alerts}>
				{ALERT_RULES.map((rule) => (
					<li key={rule.id} className={styles.alert}>
						<span className={styles.alertText}>
							<Typography
								variant="label"
								size="base"
								weight="medium"
								color="main"
								as="span"
								display="block"
								textOverflow="wrap"
							>
								{rule.name}
							</Typography>
							<Typography
								variant="label"
								size="base"
								weight="regular"
								color="secondary"
								as="span"
								display="block"
								textOverflow="wrap"
							>
								{rule.owner}
							</Typography>
						</span>
						<Button
							variant="outlined"
							color="secondary"
							size="sm"
							aria-label={`Edit ${rule.name}`}
							onClick={() => editRule.open(rule)}
						>
							Edit
						</Button>
					</li>
				))}
			</ul>
			<Dialog
				handle={editRule}
				title="Edit alert"
				description="Changes apply to the next evaluation."
				testId="handle-dialog"
				footerSuffix={
					<>
						<Button variant="outlined" color="secondary" size="md" onClick={() => editRule.close()}>
							Cancel
						</Button>
						<Button
							variant="solid"
							color="primary"
							size="md"
							type="submit"
							form="handle-dialog-form"
						>
							Save
						</Button>
					</>
				}
			>
				{(rule) => (
					<form
						id="handle-dialog-form"
						className={styles.form}
						onSubmit={(event) => {
							event.preventDefault();
							editRule.close();
						}}
					>
						<Input aria-label="Alert name" defaultValue={rule.name} />
						<dl className={styles.details}>
							<dt>Owner</dt>
							<dd>{rule.owner}</dd>
							<dt>Fires when</dt>
							<dd>{rule.threshold}</dd>
						</dl>
					</form>
				)}
			</Dialog>
		</div>
	);
}

/**
 * A dialog opened from a handle, for a press that is far from where the dialog is declared, such
 * as a row action. There is no `open` state: `useDialogHandle()` returns the handle,
 * `handle.open(row)` shows the dialog, and `children` is a function of that row. The dialog closes
 * itself on every close request (`Esc`, the backdrop and the close button), so `open` and
 * `onClose` are not passed, and the form closes it with `handle.close()` once it is saved. Pass a
 * callback to `useDialogHandle(onOpenChange)` to learn of a close.
 */
export const FromAHandle: Story = {
	parameters: {
		chromatic: { disableSnapshot: true },
		controls: { disable: true },
	},
	render: () => <AlertRules />,
	play: async ({ canvasElement }) => {
		await waitForEffects();
		await userEvent.click(within(canvasElement).getByRole('button', { name: 'Edit Queue depth' }));
		await waitFor(() => expect(getNode('handle-dialog')).toBeVisible());
		await expect(
			within(getNode('handle-dialog-body')).getByRole('textbox', { name: 'Alert name' }),
		).toHaveValue('Queue depth');
	},
};

/**
 * Renders the dialog in an element of the page instead of `document.body`, which is what a page
 * in fullscreen needs: only the fullscreen element and what is inside it are shown, so a dialog
 * in `document.body` never appears. The box here stands in for that element.
 */
function DialogInABox(): ReactElement {
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
				The dialog opens inside the dashed box, backdrop included, and not over the page.
			</Typography>
			<div ref={boxRef} className={styles.box} data-testid="box">
				<Button variant="solid" color="primary" size="md" onClick={() => setOpen(true)}>
					Open dialog
				</Button>
			</div>
			<Dialog
				open={open}
				container={boxRef}
				onClose={() => setOpen(false)}
				title="Share panel"
				description="Anyone with the link can see Checkout latency."
				width="narrow"
				testId="box-dialog"
			>
				The link stops working when you delete the panel.
			</Dialog>
		</div>
	);
}

/**
 * `container` names the element the dialog renders in. Use it when the page shows only part of
 * the document, such as a chart in fullscreen. The backdrop and the panel are fixed to the
 * viewport, so the box has a `contain` that fixes them to itself, and a fullscreen element needs
 * none.
 */
export const InAContainer: Story = {
	parameters: {
		chromatic: { disableSnapshot: false, modes: allModes },
		controls: { disable: true },
	},
	render: () => <DialogInABox />,
	play: async ({ canvasElement }) => {
		await waitForEffects();

		const canvas = within(canvasElement);

		await userEvent.click(canvas.getByRole('button', { name: 'Open dialog' }));
		await waitFor(() => expect(getNode('box-dialog')).toBeVisible());
		await expect(canvas.getByTestId('box')).toContainElement(getNode('box-dialog'));
	},
};

const SERVICES: SelectOptionItemType[] = [
	{ type: 'item', value: 'frontend', label: 'frontend' },
	{ type: 'item', value: 'checkout', label: 'checkout' },
	{ type: 'item', value: 'payments', label: 'payments' },
	{ type: 'item', value: 'inventory', label: 'inventory' },
];

const ENVIRONMENTS: ComboboxOptionItemType[] = [
	{ type: 'item', value: 'production', label: 'production' },
	{ type: 'item', value: 'staging', label: 'staging' },
	{ type: 'item', value: 'development', label: 'development' },
	{ type: 'item', value: 'preview', label: 'preview' },
];

const VIEW_ITEMS: ToggleGroupItemProps[] = [
	{ value: 'list', label: 'List', prefix: <List /> },
	{ value: 'grid', label: 'Grid', prefix: <LayoutGrid /> },
];

const RANGE_ITEMS: ToggleGroupItemProps[] = [
	{ value: '15m', label: '15m' },
	{ value: '1h', label: '1h' },
	{ value: '1d', label: '1d' },
];

const SIGNAL_ITEMS: ToggleGroupItemProps[] = [
	{ value: 'logs', label: 'Logs' },
	{ value: 'traces', label: 'Traces' },
	{ value: 'metrics', label: 'Metrics' },
];

const SEVERITIES: RadioGroupItemType[] = [
	{ label: 'Critical', value: 'critical' },
	{ label: 'Warning', value: 'warning' },
	{ label: 'Info', value: 'info' },
];

const SIGNALS: RadioCardsItemType[] = [
	{ label: 'Logs', value: 'logs', prefix: <Logs /> },
	{ label: 'Traces', value: 'traces', prefix: <Workflow /> },
	{ label: 'Metrics', value: 'metrics', prefix: <Gauge /> },
];

function FormSection({ title, children }: { title: string; children: ReactNode }): ReactElement {
	return (
		<section className={styles.formSection}>
			<Typography variant="label" size="base" weight="bold" color="main" as="p" textOverflow="wrap">
				{title}
			</Typography>
			{children}
		</section>
	);
}

function Field({
	id,
	label,
	children,
}: {
	id: string;
	label: string;
	children: ReactNode;
}): ReactElement {
	return (
		<div className={styles.field}>
			<Typography
				variant="label"
				size="base"
				weight="regular"
				color="main"
				as="span"
				id={id}
				textOverflow="wrap"
			>
				{label}
			</Typography>
			{children}
		</div>
	);
}

/**
 * The dialog the form control stories share. It starts open, so Chromatic shoots the controls on
 * the panel background, and each story keeps its body short enough that nothing scrolls.
 */
function FormDialog({
	title,
	description,
	testId,
	children,
}: {
	title: string;
	description: string;
	testId: string;
	children: ReactNode;
}): ReactElement {
	const [open, setOpen] = useState(true);

	return (
		<div className="story-container">
			<Button variant="solid" color="primary" size="md" onClick={() => setOpen(true)}>
				Open dialog
			</Button>
			<Dialog
				open={open}
				onClose={() => setOpen(false)}
				title={title}
				description={description}
				width="extra-wide"
				testId={testId}
				footerSuffix={
					<>
						<Button variant="outlined" color="secondary" size="md" onClick={() => setOpen(false)}>
							Cancel
						</Button>
						<Button variant="solid" color="primary" size="md" onClick={() => setOpen(false)}>
							Save
						</Button>
					</>
				}
			>
				{children}
			</Dialog>
		</div>
	);
}

function PickersDialog(): ReactElement {
	return (
		<FormDialog
			title="Alert scope"
			description="The services and environments the rule evaluates."
			testId="pickers-dialog"
		>
			<ForceOpenProvider>
				<div className={styles.pickerRow}>
					<div className={styles.pickerCell}>
						<Field id="dialog-form-select" label="Service">
							<Select
								items={SERVICES}
								placeholder="Select a service"
								defaultValue="checkout"
								aria-labelledby="dialog-form-select"
								testId="dialog-form-select"
							/>
						</Field>
					</div>
					<div className={styles.pickerCell}>
						<Field id="dialog-form-select-multiple" label="Services">
							<Select
								multiple
								items={SERVICES}
								placeholder="Select services"
								defaultValue={['frontend', 'payments']}
								aria-labelledby="dialog-form-select-multiple"
								testId="dialog-form-select-multiple"
							/>
						</Field>
					</div>
					<div className={styles.pickerCellSearch}>
						<Field id="dialog-form-combobox" label="Environment">
							<Combobox
								items={ENVIRONMENTS}
								placeholder="Select an environment"
								searchInputProps={{ placeholder: 'Search environments' }}
								defaultValue="production"
								aria-labelledby="dialog-form-combobox"
								testId="dialog-form-combobox"
							/>
						</Field>
					</div>
					<div className={styles.pickerCellSearch}>
						<Field id="dialog-form-combobox-multiple" label="Environments">
							<Combobox
								multiple
								allowClear
								items={ENVIRONMENTS}
								placeholder="Select environments"
								searchInputProps={{ placeholder: 'Search environments' }}
								defaultValue={['production', 'staging']}
								aria-labelledby="dialog-form-combobox-multiple"
								testId="dialog-form-combobox-multiple"
							/>
						</Field>
					</div>
				</div>
			</ForceOpenProvider>
		</FormDialog>
	);
}

function TextFieldsDialog(): ReactElement {
	return (
		<FormDialog
			title="Notification channel"
			description="Where the alert is sent when it fires."
			testId="text-fields-dialog"
		>
			<div className={styles.formStack}>
				<FormSection title="Text fields">
					<div className={styles.fieldGrid}>
						<Field id="dialog-form-name" label="Name">
							<Input
								placeholder="High error rate"
								aria-labelledby="dialog-form-name"
								testId="dialog-form-name"
							/>
						</Field>
						<Field id="dialog-form-search" label="Search">
							<Input
								prefix={<Search />}
								placeholder="Search services"
								aria-labelledby="dialog-form-search"
							/>
						</Field>
						<Field id="dialog-form-endpoint" label="Endpoint (large)">
							<Input
								size="large"
								defaultValue="https://hooks.example.com/alerts"
								aria-labelledby="dialog-form-endpoint"
							/>
						</Field>
						<Field id="dialog-form-password" label="Password">
							<Input.Password
								defaultValue="hunter2-example"
								aria-labelledby="dialog-form-password"
							/>
						</Field>
						<Field id="dialog-form-number" label="Threshold">
							<Input.Number defaultValue={500} aria-labelledby="dialog-form-number" />
						</Field>
						<Field id="dialog-form-notes" label="Notes">
							<Input.TextArea
								rows={3}
								defaultValue="Page the on-call engineer when the error rate stays above the threshold."
								aria-labelledby="dialog-form-notes"
							/>
						</Field>
					</div>
				</FormSection>
				<FormSection title="Input states">
					<div className={styles.stateRow}>
						<Field id="dialog-form-success" label="Success">
							<Input
								status="success"
								defaultValue="#alerts-checkout"
								aria-labelledby="dialog-form-success"
							/>
						</Field>
						<Field id="dialog-form-warning" label="Warning">
							<Input
								status="warning"
								defaultValue="#general"
								aria-labelledby="dialog-form-warning"
							/>
						</Field>
						<Field id="dialog-form-danger" label="Danger">
							<Input
								status="danger"
								defaultValue="not a channel"
								aria-labelledby="dialog-form-danger"
							/>
						</Field>
						<Field id="dialog-form-disabled" label="Disabled">
							<Input
								disabled
								disabledTooltip="Ask an admin to unlock this field"
								defaultValue="ops@example.com"
								aria-labelledby="dialog-form-disabled"
							/>
						</Field>
						<Field id="dialog-form-readonly" label="Read only">
							<Input
								readOnly
								readOnlyTooltip="Set by the rule template"
								defaultValue="rule-1042"
								aria-labelledby="dialog-form-readonly"
							/>
						</Field>
					</div>
				</FormSection>
			</div>
		</FormDialog>
	);
}

function ChoicesAndTogglesDialog(): ReactElement {
	return (
		<FormDialog
			title="Alert settings"
			description="Changes apply to the next evaluation of the rule."
			testId="toggles-dialog"
		>
			<div className={styles.formGrid}>
				<FormSection title="Choices">
					<Field id="dialog-form-severity" label="Severity">
						<RadioGroup
							color="primary"
							items={SEVERITIES}
							defaultValue="critical"
							aria-labelledby="dialog-form-severity"
						/>
					</Field>
					<Field id="dialog-form-signal" label="Signal">
						<RadioCards
							items={SIGNALS}
							columns={3}
							defaultValue="traces"
							aria-labelledby="dialog-form-signal"
						/>
					</Field>
				</FormSection>
				<FormSection title="Toggle groups">
					<Field id="dialog-form-view" label="View (md, icons)">
						<ToggleGroup
							type="single"
							variant="outlined"
							color="secondary"
							size="md"
							items={VIEW_ITEMS}
							defaultValue="list"
							aria-labelledby="dialog-form-view"
						/>
					</Field>
					<Field id="dialog-form-range" label="Window (sm)">
						<ToggleGroup
							type="single"
							variant="outlined"
							color="secondary"
							size="sm"
							items={RANGE_ITEMS}
							defaultValue="1h"
							aria-labelledby="dialog-form-range"
						/>
					</Field>
					<Field id="dialog-form-signals" label="Signals (multiple)">
						<ToggleGroup
							type="multiple"
							variant="outlined"
							color="secondary"
							size="sm"
							items={SIGNAL_ITEMS}
							defaultValue={['logs', 'traces']}
							aria-labelledby="dialog-form-signals"
						/>
					</Field>
					<Field id="dialog-form-signals-disabled" label="Signals (disabled)">
						<ToggleGroup
							type="single"
							variant="outlined"
							color="secondary"
							size="sm"
							items={SIGNAL_ITEMS}
							defaultValue="metrics"
							disabled
							disabledTooltip="Locked by the rule template"
							aria-labelledby="dialog-form-signals-disabled"
						/>
					</Field>
				</FormSection>
				<FormSection title="Checkboxes, switches and sliders">
					<div className={styles.inline}>
						<Checkbox color="primary" defaultValue>
							Notify on resolve
						</Checkbox>
						<Checkbox color="primary" defaultValue="indeterminate">
							Group by service
						</Checkbox>
					</div>
					<div className={styles.inline}>
						<Switch color="primary" textPlacement="right" defaultValue>
							Enabled
						</Switch>
						<Switch
							color="primary"
							textPlacement="right"
							disabled
							disabledTooltip="Ask an admin for access"
						>
							Mute
						</Switch>
					</div>
					<Field id="dialog-form-slider" label="Sensitivity">
						<Slider color="primary" defaultValue={40} aria-labelledby="dialog-form-slider" />
					</Field>
					<Field id="dialog-form-slider-range" label="Latency (ms)">
						<Slider.Range
							color="primary"
							min={0}
							max={2000}
							step={50}
							defaultValue={[200, 1200]}
							aria-labelledby="dialog-form-slider-range"
						/>
					</Field>
				</FormSection>
			</div>
		</FormDialog>
	);
}

/**
 * Selects and comboboxes inside the panel. `ForceOpenProvider` holds every popup open, each in a
 * cell tall enough that no popup covers the field under it, so the snapshot shows them all above
 * the panel.
 */
export const WithPickers: Story = {
	parameters: {
		chromatic: { disableSnapshot: false, modes: allModes },
		controls: { disable: true },
	},
	render: () => <PickersDialog />,
	play: async () => {
		await waitForEffects();
		await waitFor(async () => {
			await expect(getNode('dialog-form-select-item-payments')).toBeVisible();
			await expect(getNode('dialog-form-select-multiple-item-inventory')).toBeVisible();
			await expect(getNode('dialog-form-combobox-item-preview')).toBeVisible();
			await expect(getNode('dialog-form-combobox-multiple-item-preview')).toBeVisible();
		});
	},
};

/**
 * Every kind of input inside the panel, and the states an input can be in.
 */
export const WithTextFields: Story = {
	parameters: {
		chromatic: { disableSnapshot: false, modes: allModes },
		controls: { disable: true },
	},
	render: () => <TextFieldsDialog />,
	play: async () => {
		await waitForEffects();
		await waitFor(() => expect(getNode('dialog-form-name')).toBeVisible());
	},
};

/**
 * Radios, radio cards, toggle groups, checkboxes, switches and sliders inside the panel.
 */
export const WithChoicesAndToggles: Story = {
	parameters: {
		chromatic: { disableSnapshot: false, modes: allModes },
		controls: { disable: true },
	},
	render: () => <ChoicesAndTogglesDialog />,
	play: async () => {
		await waitForEffects();
		await waitFor(() => expect(getNode('toggles-dialog')).toBeVisible());
	},
};
