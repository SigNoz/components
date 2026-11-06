import { Rocket, Trash2, TriangleAlert, X } from '@signozhq/icons';
import {
	AlertDialog,
	type AlertDialogProps,
	Button,
	Checkbox,
	Typography,
	useDialogHandle,
} from '@signozhq/ui';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { type ReactElement, useState } from 'react';
import { expect, fn, userEvent, waitFor, within } from 'storybook/test';
import { allModes } from '../.storybook/modes.js';
import styles from './alert-dialog.stories.module.css';
import { alertDialogArgTypes, alertDialogParameters } from './shared/alert-dialog-arg-types.js';
import { waitForEffects } from './shared/play.js';

const meta: Meta<typeof AlertDialog> = {
	title: 'Composed Components/AlertDialog',
	component: AlertDialog,
	parameters: alertDialogParameters,
	argTypes: alertDialogArgTypes,
	args: {
		open: false,
		title: 'Delete this view?',
		color: 'danger',
		confirmText: 'Delete view',
		confirmIcon: <Trash2 />,
		children: 'Dashboards that link to it will open the default view.',
		testId: 'alert',
		onConfirm: fn(),
		onCancel: fn(),
	},
};

export default meta;

type Story = StoryObj<typeof AlertDialog>;

function wait(ms: number): Promise<void> {
	return new Promise((resolve) => {
		setTimeout(resolve, ms);
	});
}

function getNode(testId: string): HTMLElement {
	// The alert portals to `document.body`, so none of this is inside the canvas element.
	const node = document.querySelector<HTMLElement>(`[data-testid="${testId}"]`);

	if (node === null) {
		throw new Error(`AlertDialog story: no node named "${testId}".`);
	}

	return node;
}

/**
 * Owns `open`, as a consumer does, and opens from a button. The confirm handler runs the request
 * and closes the alert once it resolves, so the confirm button is loading for as long as the
 * promise is pending.
 */
function AlertPlayground({
	startOpen = false,
	open: _open,
	handle: _handle,
	onConfirm,
	onCancel,
	...props
}: AlertDialogProps & { startOpen?: boolean }): ReactElement {
	const [open, setOpen] = useState(startOpen);

	return (
		<div className="story-container">
			<Button variant="solid" color="secondary" size="md" onClick={() => setOpen(true)}>
				Open alert
			</Button>
			<AlertDialog
				{...props}
				open={open}
				onConfirm={async () => {
					await onConfirm(undefined);
					setOpen(false);
				}}
				onCancel={() => {
					onCancel?.();
					setOpen(false);
				}}
			/>
		</div>
	);
}

/**
 * The playground the Controls table drives. Open it from the button, then answer it: Cancel and
 * `Esc` cancel, and Delete view runs a request that takes 1.2s while the button loads.
 */
export const Default: Story = {
	parameters: {
		// The alert opens from a press, and the stories below hold it open.
		chromatic: { disableSnapshot: true },
	},
	args: { onConfirm: fn(() => wait(1200)) },
	render: (args) => <AlertPlayground {...args} />,
};

/**
 * An alert is answered, not escaped. A press on the backdrop does nothing, `Esc` is the cancel
 * button, and the confirm button reports the payload. Focus starts on the panel, and goes back to
 * the button the alert was opened from.
 */
export const Answering: Story = {
	parameters: {
		chromatic: { disableSnapshot: true },
		controls: { disable: true },
	},
	render: (args) => <AlertPlayground {...args} />,
	play: async ({ args, canvasElement }) => {
		await waitForEffects();

		const opener = within(canvasElement).getByRole('button', { name: 'Open alert' });

		await userEvent.click(opener);
		await waitFor(() => expect(getNode('alert')).toBeVisible());
		await waitFor(() => expect(getNode('alert')).toHaveFocus());

		await userEvent.click(getNode('alert-backdrop'));
		await expect(getNode('alert')).toBeVisible();
		await expect(args.onCancel).not.toHaveBeenCalled();

		await userEvent.keyboard('{Escape}');
		await waitFor(() => expect(args.onCancel).toHaveBeenCalledTimes(1));
		await waitFor(() => expect(document.querySelector('[data-testid="alert"]')).toBeNull());
		await waitFor(() => expect(opener).toHaveFocus());

		await userEvent.click(opener);
		await waitFor(() => expect(getNode('alert')).toBeVisible());
		await userEvent.click(getNode('alert-confirm'));
		await waitFor(() => expect(args.onConfirm).toHaveBeenCalledTimes(1));
		await waitFor(() => expect(document.querySelector('[data-testid="alert"]')).toBeNull());
	},
};

/**
 * A confirmation that has been answered and is waiting on its request, held in the state the play
 * function drives it to. The confirm button is loading, the cancel button is disabled, and `Esc`
 * does nothing: the request cannot be stopped, and closing would hide its result.
 */
export const Pending: Story = {
	parameters: {
		chromatic: { disableSnapshot: false, modes: allModes },
		controls: { disable: true },
	},
	args: {
		open: true,
		title: 'Publish this dashboard?',
		titleIcon: <Rocket />,
		color: 'primary',
		confirmText: 'Publish dashboard',
		confirmIcon: undefined,
		children: 'Everyone in the workspace sees the new version as soon as it is published.',
		testId: 'alert-pending',
		onConfirm: () => new Promise<void>(() => {}),
	},
	render: (args) => <AlertDialog {...args} />,
	play: async ({ args }) => {
		await waitForEffects();
		await waitFor(() => expect(getNode('alert-pending')).toBeVisible());

		const alert = getNode('alert-pending');
		const cancel = getNode('alert-pending-cancel');
		const confirm = getNode('alert-pending-confirm');

		await expect(alert).toHaveAttribute('role', 'alertdialog');
		await expect(alert).toHaveAttribute('aria-modal', 'true');
		await expect(alert).toHaveAttribute('data-color', 'primary');
		await expect(alert).toHaveAccessibleName('Publish this dashboard?');
		await expect(alert).toHaveAccessibleDescription(
			'Everyone in the workspace sees the new version as soon as it is published.',
		);
		await waitFor(() => expect(alert).toHaveFocus());

		await userEvent.click(confirm);
		await waitFor(() => expect(confirm).toHaveAttribute('aria-busy', 'true'));
		// The button stays focusable, so it is `aria-disabled` and not `disabled`.
		await expect(cancel).toHaveAttribute('aria-disabled', 'true');

		await userEvent.keyboard('{Escape}');
		await expect(args.onCancel).not.toHaveBeenCalled();
		await expect(alert).toBeInTheDocument();
	},
};

const SAVED_VIEWS = [
	{ id: 'checkout-latency', name: 'Checkout latency', owner: 'alex@example.com' },
	{ id: 'error-budget', name: 'Error budget burn', owner: 'sam@example.com' },
	{ id: 'queue-depth', name: 'Queue depth', owner: 'riley@example.com' },
];

type SavedView = (typeof SAVED_VIEWS)[number];

function ViewRows({
	views,
	onDelete,
}: {
	views: SavedView[];
	onDelete: (view: SavedView) => void;
}): ReactElement {
	return (
		<ul className={styles.views}>
			{views.map((view) => (
				<li key={view.id} className={styles.view}>
					<span className={styles.viewText}>
						<Typography
							variant="label"
							size="base"
							weight="medium"
							color="main"
							as="span"
							display="block"
							textOverflow="wrap"
						>
							{view.name}
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
							{view.owner}
						</Typography>
					</span>
					<Button
						variant="outlined"
						color="secondary"
						size="sm"
						aria-label={`Delete ${view.name}`}
						onClick={() => onDelete(view)}
					>
						Delete
					</Button>
				</li>
			))}
		</ul>
	);
}

/**
 * One alert for every row. Each Delete button calls `handle.open(view)`, and `onConfirm` receives
 * that view. The alert closes itself once the promise `onConfirm` returns resolves, so the story
 * holds no `open` state.
 */
function SavedViews(): ReactElement {
	const [views, setViews] = useState(SAVED_VIEWS);
	const deleteView = useDialogHandle<SavedView>();

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
				Delete a view and confirm. The confirm button loads until the request resolves, and then the
				alert closes and the row is gone.
			</Typography>
			<ViewRows views={views} onDelete={(view) => deleteView.open(view)} />
			<AlertDialog
				handle={deleteView}
				title="Delete this view?"
				color="danger"
				confirmText="Delete view"
				confirmIcon={<Trash2 />}
				testId="alert-handle"
				onConfirm={async (view) => {
					await wait(400);
					setViews((current) => current.filter((item) => item.id !== view.id));
				}}
			>
				{(view) => (
					<>
						Everyone who can see <strong>{view.name}</strong> loses it, and dashboards that link to
						it open the default view.
					</>
				)}
			</AlertDialog>
		</div>
	);
}

/**
 * An alert opened from a handle. The body is a function of the row, `onConfirm` receives the same
 * row, and the alert closes itself once the request resolves. Cancel closes it too: with a
 * handle there is no `open` and no `onCancel`.
 */
export const FromAHandle: Story = {
	parameters: {
		chromatic: { disableSnapshot: true },
		controls: { disable: true },
	},
	render: () => <SavedViews />,
	play: async ({ canvasElement }) => {
		await waitForEffects();

		const canvas = within(canvasElement);

		await userEvent.click(canvas.getByRole('button', { name: 'Delete Error budget burn' }));
		await waitFor(() => expect(getNode('alert-handle')).toBeVisible());
		await expect(getNode('alert-handle')).toHaveAccessibleDescription(
			/Everyone who can see Error budget burn/,
		);

		await userEvent.click(getNode('alert-handle-confirm'));
		await waitFor(() => expect(canvas.queryByText('Error budget burn')).toBeNull(), {
			timeout: 3000,
		});
		await waitFor(() => expect(document.querySelector('[data-testid="alert-handle"]')).toBeNull());
		await expect(canvas.getByText('Checkout latency')).toBeInTheDocument();
	},
};

/**
 * The same rows, with a request that fails once. The handler reports the failure and answers
 * `false`, so the alert stays open and the confirm button stops loading. The second press succeeds,
 * and the alert closes.
 */
function FailingDelete(): ReactElement {
	const [views, setViews] = useState(SAVED_VIEWS);
	const [failed, setFailed] = useState(false);
	const deleteView = useDialogHandle<SavedView>((open) => {
		if (!open) {
			setFailed(false);
		}
	});

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
				The first delete fails. The alert stays open with the error in its body, and the second try
				goes through.
			</Typography>
			<ViewRows views={views} onDelete={(view) => deleteView.open(view)} />
			<AlertDialog
				handle={deleteView}
				title="Delete this view?"
				color="danger"
				confirmText="Delete view"
				confirmIcon={<Trash2 />}
				testId="alert-failed"
				onConfirm={async (view) => {
					await wait(300);

					// Stands in for a request that fails once.
					if (!failed) {
						setFailed(true);
						return false;
					}

					setViews((current) => current.filter((item) => item.id !== view.id));
					return true;
				}}
			>
				{(view) =>
					failed
						? `${view.name} could not be deleted. Nothing changed, so you can try again.`
						: `Everyone who can see ${view.name} loses it.`
				}
			</AlertDialog>
		</div>
	);
}

/**
 * An answer of `false` keeps an alert on a handle open, for a request that failed and was already
 * reported. Any other answer closes it. A rejected promise keeps it open too, with the loading
 * state ended and nothing rethrown.
 */
export const FailedRequest: Story = {
	parameters: {
		chromatic: { disableSnapshot: true },
		controls: { disable: true },
	},
	render: () => <FailingDelete />,
	play: async ({ canvasElement }) => {
		await waitForEffects();

		const canvas = within(canvasElement);

		await userEvent.click(canvas.getByRole('button', { name: 'Delete Queue depth' }));
		await waitFor(() => expect(getNode('alert-failed')).toBeVisible());

		const confirm = getNode('alert-failed-confirm');

		await userEvent.click(confirm);
		await waitFor(() => expect(confirm).toHaveAttribute('aria-busy', 'true'));
		await waitFor(() =>
			expect(getNode('alert-failed-body')).toHaveTextContent('Queue depth could not be deleted'),
		);
		await waitFor(() => expect(confirm).not.toHaveAttribute('aria-busy'));
		await expect(getNode('alert-failed')).toBeVisible();
		await expect(canvas.getByText('Queue depth')).toBeInTheDocument();

		await userEvent.click(confirm);
		await waitFor(() => expect(document.querySelector('[data-testid="alert-failed"]')).toBeNull());
		await waitFor(() => expect(canvas.queryByText('Queue depth')).toBeNull());
	},
};

const COLORS = [
	{
		color: 'primary',
		title: 'Publish this dashboard?',
		confirmText: 'Publish dashboard',
		body: 'Everyone in the workspace sees the new version as soon as it is published.',
	},
	{
		color: 'danger',
		title: 'Delete this view?',
		confirmText: 'Delete view',
		body: 'Dashboards that link to it will open the default view.',
	},
] as const;

/**
 * One alert held open in its own box through `container`, since a modal covers the page and two
 * cannot share it.
 */
function ColorBox({
	color,
	title,
	confirmText,
	body,
}: (typeof COLORS)[number] & { body: string }): ReactElement {
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
					{color}
				</Typography>
				<Button variant="outlined" color="secondary" size="md" onClick={() => setOpen(true)}>
					Open alert
				</Button>
			</div>
			<div ref={setBox} className={styles.box} />
			<AlertDialog
				open={open}
				container={box}
				title={title}
				color={color}
				confirmText={confirmText}
				testId={`color-${color}`}
				onConfirm={() => setOpen(false)}
				onCancel={() => setOpen(false)}
			>
				{body}
			</AlertDialog>
		</div>
	);
}

/**
 * Both values of `color`, one alert per box. `danger` is for an action that destroys or revokes
 * something, and `primary` for one that is consequential and can be undone. It sets the intent of
 * the confirm button and nothing else in the panel.
 */
export const Colors: Story = {
	parameters: {
		chromatic: { disableSnapshot: false, modes: allModes },
		controls: { disable: true },
	},
	render: () => (
		<div className={`story-container-full ${styles.boxes}`}>
			{COLORS.map((item) => (
				<ColorBox key={item.color} {...item} />
			))}
		</div>
	),
	play: async () => {
		await waitForEffects();
		await waitFor(() => expect(getNode('color-danger')).toBeVisible());

		for (const { color } of COLORS) {
			await expect(getNode(`color-${color}`)).toHaveAttribute('data-color', color);
			await expect(getNode(`color-${color}-confirm`)).toHaveAttribute('data-color', color);
			await expect(getNode(`color-${color}-cancel`)).toHaveAttribute('data-color', 'secondary');
		}
	},
};

/**
 * `titleIcon` before the title, and `confirmIcon` and `cancelIcon` as the prefix of each button.
 * The title icon is hidden from assistive tech, so the title alone names the panel.
 */
export const WithIcons: Story = {
	parameters: {
		chromatic: { disableSnapshot: false, modes: allModes },
		controls: { disable: true },
	},
	args: {
		title: 'Delete this view?',
		titleIcon: <TriangleAlert />,
		confirmIcon: <Trash2 />,
		cancelIcon: <X />,
		testId: 'alert-icons',
	},
	render: (args) => <AlertPlayground {...args} startOpen />,
	play: async () => {
		await waitForEffects();
		await waitFor(() => expect(getNode('alert-icons')).toBeVisible());

		const title = getNode('alert-icons-title');

		await expect(title.previousElementSibling).toHaveAttribute('aria-hidden', 'true');
		await expect(title.previousElementSibling?.querySelector('svg')).not.toBeNull();
		await expect(getNode('alert-icons')).toHaveAccessibleName('Delete this view?');
		await expect(getNode('alert-icons-confirm').querySelector('svg')).not.toBeNull();
		await expect(getNode('alert-icons-cancel').querySelector('svg')).not.toBeNull();
	},
};

/**
 * `cancelText` names the safe answer after what it keeps, such as `Keep editing`, when `Cancel`
 * leaves it unclear what is kept. The first `Tab` from the panel reaches this button.
 */
export const CancelText: Story = {
	parameters: {
		chromatic: { disableSnapshot: false, modes: allModes },
		controls: { disable: true },
	},
	args: {
		title: 'Discard your changes?',
		confirmText: 'Discard changes',
		confirmIcon: undefined,
		cancelText: 'Keep editing',
		children: 'The changes you made to this alert are lost.',
		testId: 'alert-keep',
	},
	render: (args) => <AlertPlayground {...args} startOpen />,
	play: async () => {
		await waitForEffects();
		await waitFor(() => expect(getNode('alert-keep')).toBeVisible());
		await expect(getNode('alert-keep-cancel')).toHaveTextContent('Keep editing');
		await waitFor(() => expect(getNode('alert-keep')).toHaveFocus());
		await userEvent.tab();
		await waitFor(() => expect(getNode('alert-keep-cancel')).toHaveFocus());
	},
};

/**
 * Owns `open` and the choice. The checkbox is part of `children`, so the alert knows nothing about
 * it: the confirm handler reads it and stores what the page needs to skip the alert next time.
 */
function ConfirmWithOptOut(): ReactElement {
	const [open, setOpen] = useState(true);
	const [skipChecked, setSkipChecked] = useState(false);
	const [skipNextTime, setSkipNextTime] = useState(false);

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
				{skipNextTime
					? 'The next delete runs without asking.'
					: 'The alert asks before every delete.'}
			</Typography>
			<Button variant="outlined" color="secondary" size="md" onClick={() => setOpen(true)}>
				Open alert
			</Button>
			<AlertDialog
				open={open}
				title="Delete this view?"
				color="danger"
				confirmText="Delete view"
				testId="alert-opt-out"
				onConfirm={() => {
					setSkipNextTime(skipChecked);
					setOpen(false);
				}}
				onCancel={() => setOpen(false)}
			>
				<div>Dashboards that link to it will open the default view.</div>
				<div>
					<Checkbox
						color="primary"
						testId="alert-opt-out-skip"
						value={skipChecked}
						onChange={setSkipChecked}
					>
						Do not ask me again
					</Checkbox>
				</div>
			</AlertDialog>
		</div>
	);
}

/**
 * The alert has no checkbox for "Do not ask me again". Render one in `children`, under the text of
 * the consequence, and keep the choice yourself: where it is stored, and skipping the alert the
 * next time. The play function checks it, confirms, and opens the alert again.
 */
export const DoNotAskAgain: Story = {
	parameters: {
		chromatic: { disableSnapshot: false, modes: allModes },
		controls: { disable: true },
	},
	render: () => <ConfirmWithOptOut />,
	play: async ({ canvasElement }) => {
		await waitForEffects();
		await waitFor(() => expect(getNode('alert-opt-out')).toBeVisible());

		const skip = getNode('alert-opt-out-skip');

		await expect(getNode('alert-opt-out-body')).toContainElement(skip);
		await expect(skip).toHaveAttribute('aria-checked', 'false');

		await userEvent.click(skip);
		await expect(skip).toHaveAttribute('aria-checked', 'true');
		await userEvent.click(getNode('alert-opt-out-confirm'));

		await waitFor(() => expect(document.querySelector('[data-testid="alert-opt-out"]')).toBeNull());

		const canvas = within(canvasElement);

		await expect(canvas.getByText('The next delete runs without asking.')).toBeVisible();

		await userEvent.click(canvas.getByRole('button', { name: 'Open alert' }));
		await waitFor(() => expect(getNode('alert-opt-out')).toBeVisible());
		await expect(getNode('alert-opt-out-skip')).toHaveAttribute('aria-checked', 'true');
	},
};
