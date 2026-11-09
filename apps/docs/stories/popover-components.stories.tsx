import { Ellipsis } from '@signozhq/icons';
import {
	Button,
	ButtonColor,
	ButtonVariant,
	Dialog,
	Popover,
	type PopoverHandleType,
	Typography,
	usePopoverHandle,
} from '@signozhq/ui';
import { ForceOpenProvider } from '@signozhq/ui/testing';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { type ComponentProps, type ReactElement, type ReactNode, useState } from 'react';
import { expect, fireEvent, userEvent, waitFor, within } from 'storybook/test';
import { allModes } from '../.storybook/modes.js';
import styles from './popover.stories.module.css';
import { waitForEffects } from './shared/play.js';

/**
 * The static members of `Popover`, grouped under `Popover/Components` in the sidebar. They are
 * documented on the `Popover` page, `popover.mdx`, so this file has no docs page of its own.
 *
 * Every story is one way of sharing a popup between triggers. The line above each says what it
 * shows and what to try, and its `play` function asserts it.
 */
const meta: Meta<typeof Popover> = {
	title: 'Composed Components/Popover/Components',
	component: Popover,
	tags: ['!autodocs'],
	parameters: {
		chromatic: { disableSnapshot: true },
	},
	decorators: [
		(Story) => (
			<div className="story-container-lg">
				<Story />
			</div>
		),
	],
};

export default meta;

type Service = { id: string; name: string; owner: string; latency: string };

const SERVICES: Service[] = [
	{ id: 'frontend', name: 'frontend', owner: 'web team', latency: '84ms p99' },
	{ id: 'checkout', name: 'checkout', owner: 'payments team', latency: '212ms p99' },
	{ id: 'cart', name: 'cart', owner: 'payments team', latency: '47ms p99' },
];

const TRIGGER = {
	variant: ButtonVariant.Outlined,
	color: ButtonColor.Secondary,
	size: 'md',
} as const;

/** A click on a story link must not leave the story. */
const stay = (event: { preventDefault: () => void }): void => event.preventDefault();

/**
 * What the story shows and what to try, above it, so a reviewer does not have to read the code.
 */
function Hint({ children }: { children: ReactNode }): ReactElement {
	return (
		<Typography
			variant="paragraph"
			size="small"
			weight="regular"
			color="tertiary"
			as="p"
			textOverflow="wrap"
			marginBottom={4}
		>
			{children}
		</Typography>
	);
}

/**
 * A service name as a link. A function, not a component: a trigger merges its props and its ref
 * into the element it is given, so that element has to be the link itself, or the props stop at a
 * wrapper that does not pass them on.
 */
function serviceLink(service: Service, id?: string): ReactElement {
	return (
		<Typography.Link
			variant="label"
			size="base"
			weight="medium"
			textOverflow="visible"
			href={`#${service.id}`}
			onClick={stay}
			{...(id === undefined ? {} : { id })}
		>
			{service.name}
		</Typography.Link>
	);
}

/** The content every story swaps: the name of the service and two facts about it. */
function ServiceCard({ service }: { service: Service | undefined }): ReactElement | null {
	if (service === undefined) {
		return null;
	}

	return (
		<div className={styles.serviceCard}>
			<Typography
				variant="label"
				size="base"
				weight="medium"
				color="main"
				as="p"
				textOverflow="wrap"
			>
				{service.name}
			</Typography>
			<Typography
				variant="paragraph"
				size="small"
				weight="regular"
				color="secondary"
				as="p"
				textOverflow="wrap"
			>
				{service.owner} · {service.latency}
			</Typography>
		</div>
	);
}

function popup(testId: string): HTMLElement | null {
	return document.querySelector<HTMLElement>(`[data-testid="${testId}-popup"]`);
}

async function findPopup(testId: string): Promise<HTMLElement> {
	return await waitFor(
		() => {
			const node = popup(testId);
			expect(node).not.toBeNull();

			return node as HTMLElement;
		},
		{ timeout: 2000 },
	);
}

/** Base UI opens on a real pointer resting: the three events together stand in for one. */
function restPointerOn(element: HTMLElement): void {
	fireEvent.pointerEnter(element);
	fireEvent.mouseEnter(element);
	fireEvent.mouseMove(element);
}

/**
 * The props the Controls table documents. `handle`, `payload`, `children`, `nativeButton` and
 * `openOnHover` are fixed by the story, so they are listed without a control.
 */
type TriggerArgs = Pick<
	ComponentProps<typeof Popover.Trigger>,
	'preview' | 'delay' | 'closeDelay'
> &
	Partial<Pick<ComponentProps<typeof Popover.Trigger>, 'nativeButton' | 'openOnHover'>> & {
		handle?: unknown;
		payload?: unknown;
		children?: unknown;
	};

/**
 * The props of one `Popover.Trigger`. With `preview` the services are links that open a card on
 * hover and on the keyboard focus. Without it they are buttons that open a dialog on a press.
 */
export const Trigger: StoryObj<TriggerArgs> = {
	args: {
		preview: true,
		delay: 300,
		closeDelay: 150,
	},
	argTypes: {
		handle: {
			control: false,
			description:
				'Required. The handle of the `Popover` this trigger opens, from `usePopoverHandle()`. Every trigger of one handle opens the same popup.',
			table: { category: 'Behavior', type: { summary: 'PopoverHandleType<Payload>' } },
		},
		payload: {
			control: false,
			description:
				'What the popover’s `children` function receives while this trigger has it open.',
			table: { category: 'Content', type: { summary: 'Payload' } },
		},
		children: {
			control: false,
			description:
				'Required. The trigger element, with the trigger’s props and ref merged in. Its `id` is the one `handle.openTrigger(id)` takes. A component of your own has to pass the props and the ref on to its element.',
			table: { category: 'Content', type: { summary: 'ReactElement' } },
		},
		nativeButton: {
			control: false,
			description:
				'Required. Whether `children` renders a native `<button>`, which Base UI cannot tell before it mounts.',
			table: { category: 'Behavior', type: { summary: 'boolean' } },
		},
		openOnHover: {
			control: false,
			description:
				'Also opens the popover while the pointer rests on the trigger, which still opens it on a press. Not with `preview`.',
			table: {
				category: 'Behavior',
				type: { summary: 'boolean' },
				defaultValue: { summary: 'false' },
			},
		},
		preview: {
			control: 'boolean',
			description:
				'Opens a card about the element instead of a dialog: on hover and on the keyboard focus, never on a press. The popup has no role and no name and takes no focus.',
			table: {
				category: 'Behavior',
				type: { summary: 'boolean' },
				defaultValue: { summary: 'false' },
			},
		},
		delay: {
			control: 'number',
			description:
				'Milliseconds the pointer, or the keyboard focus of a `preview`, rests on the trigger before the popover opens. Only with `openOnHover` or `preview`.',
			table: {
				category: 'Behavior',
				type: { summary: 'number' },
				defaultValue: { summary: '300' },
			},
		},
		closeDelay: {
			control: 'number',
			description:
				'Milliseconds after the pointer leaves before the popover closes: the time it has to cross onto the popup, or onto the next trigger.',
			table: {
				category: 'Behavior',
				type: { summary: 'number' },
				defaultValue: { summary: '0' },
			},
		},
	},
	render: function TriggerStory(args) {
		const card = usePopoverHandle<Service>();

		return (
			<div className={styles.roomBelow}>
				<Hint>
					Three triggers, one popup. With preview on, rest the pointer on a service or Tab to it: a
					card opens and follows the pointer or the focus to the next one. With preview off, press a
					service.
				</Hint>
				<div className={styles.serviceRow}>
					{SERVICES.map((service) =>
						args.preview ? (
							<Popover.Trigger
								key={service.id}
								handle={card}
								payload={service}
								nativeButton={false}
								preview
								delay={args.delay}
								closeDelay={args.closeDelay}
							>
								{serviceLink(service)}
							</Popover.Trigger>
						) : (
							<Popover.Trigger key={service.id} handle={card} payload={service} nativeButton>
								<Button {...TRIGGER}>{service.name}</Button>
							</Popover.Trigger>
						),
					)}
				</div>
				<Popover handle={card} side="bottom" align="start" aria-label="Service">
					{(service) => <ServiceCard service={service} />}
				</Popover>
			</div>
		);
	},
};

/**
 * Press triggers. Each button opens the same dialog with its own payload. A press on another button
 * moves the open popup to it and swaps the content, with no close in between. `Escape` closes it
 * and gives the focus back to the button that opened it.
 */
export const PressTriggers: StoryObj = {
	render: function PressTriggersStory() {
		const card = usePopoverHandle<Service>();

		return (
			<div className={styles.roomBelow}>
				<Hint>
					Press a service, then press another one: the same popup moves and swaps its content. It is
					a dialog named “Service”. Escape closes it and returns the focus to the button.
				</Hint>
				<div className={styles.serviceRow}>
					{SERVICES.map((service) => (
						<Popover.Trigger key={service.id} handle={card} payload={service} nativeButton>
							<Button {...TRIGGER} testId={`press-${service.id}`}>
								{service.name}
							</Button>
						</Popover.Trigger>
					))}
				</div>
				<Popover handle={card} side="bottom" align="start" aria-label="Service" testId="press">
					{(service) => <ServiceCard service={service} />}
				</Popover>
			</div>
		);
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		await waitForEffects();

		await userEvent.click(canvas.getByTestId('press-frontend'));
		const shown = await findPopup('press');
		await expect(shown).toHaveAttribute('role', 'dialog');
		await expect(shown).toHaveTextContent('web team');

		await userEvent.click(canvas.getByTestId('press-checkout'));
		await waitFor(() => expect(popup('press')).toHaveTextContent('payments team'));
		// The same element: it moved, it did not close and open again.
		await expect(popup('press')).toBe(shown);
		await expect(canvas.getByTestId('press-checkout')).toHaveAttribute('data-popup-open');

		await userEvent.keyboard('{Escape}');
		await waitFor(() => expect(popup('press')).toBeNull());
		await expect(canvas.getByTestId('press-checkout')).toHaveFocus();
	},
};

/**
 * Hover triggers. `openOnHover` opens the popup once the pointer has rested on a button for
 * `delay`, and `closeDelay` gives the pointer time to cross to the next one, which takes the popup
 * over without a close. A press still opens it, which is the route the keyboard takes.
 */
export const HoverTriggers: StoryObj = {
	render: function HoverTriggersStory() {
		const card = usePopoverHandle<Service>();

		return (
			<div className={styles.roomBelow}>
				<Hint>
					Rest the pointer on a service, then slide along the row: the popup follows it. Tab to a
					service and press Enter to open it from the keyboard.
				</Hint>
				<div className={styles.serviceRow}>
					{SERVICES.map((service) => (
						<Popover.Trigger
							key={service.id}
							handle={card}
							payload={service}
							nativeButton
							openOnHover
							closeDelay={150}
						>
							<Button {...TRIGGER} testId={`hover-${service.id}`}>
								{service.name}
							</Button>
						</Popover.Trigger>
					))}
				</div>
				<Popover handle={card} side="bottom" align="start" aria-label="Service" testId="hover">
					{(service) => <ServiceCard service={service} />}
				</Popover>
			</div>
		);
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		await waitForEffects();

		restPointerOn(canvas.getByTestId('hover-frontend'));
		const shown = await findPopup('hover');
		await expect(shown).toHaveTextContent('web team');

		restPointerOn(canvas.getByTestId('hover-cart'));
		await waitFor(() => expect(popup('hover')).toHaveTextContent('47ms p99'));
		await expect(popup('hover')).toBe(shown);
	},
};

/**
 * Preview cards on links. A `preview` trigger opens a card about its element on hover and on the
 * keyboard focus, never on a press: the link still navigates. The card is not a dialog. It has no
 * role and no name, carries `data-preview`, and leaves the focus on the link, so Tab goes on to the
 * next link and the card follows.
 */
export const PreviewLinks: StoryObj = {
	render: function PreviewLinksStory() {
		const card = usePopoverHandle<Service>();

		return (
			<div className={styles.roomBelow}>
				<Hint>
					Hover a service, or Tab to it: a card opens below it. Tab again and the card moves to the
					next service. The link keeps its role and its click, and the card never takes the focus.
				</Hint>
				<div className={styles.serviceRow}>
					{SERVICES.map((service) => (
						<Popover.Trigger
							key={service.id}
							handle={card}
							payload={service}
							nativeButton={false}
							preview
							closeDelay={150}
						>
							{serviceLink(service)}
						</Popover.Trigger>
					))}
				</div>
				<Popover handle={card} side="bottom" align="start" testId="preview">
					{(service) => <ServiceCard service={service} />}
				</Popover>
			</div>
		);
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		await waitForEffects();

		await userEvent.tab();
		const frontend = canvas.getByRole('link', { name: 'frontend' });
		await expect(frontend).toHaveFocus();
		const card = await findPopup('preview');
		await expect(card).toHaveAttribute('data-preview');
		await expect(card).not.toHaveAttribute('role');
		await expect(card).toHaveTextContent('web team');
		await expect(frontend).toHaveFocus();
		await expect(frontend).not.toHaveAttribute('aria-haspopup');
		await expect(frontend).toHaveAttribute('href', '#frontend');

		await userEvent.tab();
		await expect(canvas.getByRole('link', { name: 'checkout' })).toHaveFocus();
		await waitFor(() => expect(popup('preview')).toHaveTextContent('212ms p99'));
	},
};

const VIEWS: Service[] = [
	{ id: 'errors', name: 'Errors by service', owner: 'you', latency: 'edited 2h ago' },
	{ id: 'slow', name: 'Slow checkout traces', owner: 'payments team', latency: 'edited 1d ago' },
	{ id: 'oom', name: 'OOMKilled pods', owner: 'platform team', latency: 'edited 3d ago' },
];

/**
 * One card for a whole list, the shape of the saved views list in SigNoz: each row is a `<div>`
 * that holds a link and an actions button, and the row is the trigger. The card opens when the
 * pointer rests on the row, or when the keyboard focus reaches anything in it, and it stays while
 * the focus moves along the row. The actions button closes it with `handle.close()`, the way a
 * row menu would before it opens.
 */
export const PreviewRows: StoryObj = {
	render: function PreviewRowsStory() {
		const card = usePopoverHandle<Service>();
		const [acted, setActed] = useState<string>();

		return (
			<div className={styles.roomBelow}>
				<Hint>
					Hover a row, or Tab into it: the card for that row opens on the right. Tab to the row’s
					actions button and the card stays. Press the button and the card closes. Tab on to the
					next row and the card moves to it.
				</Hint>
				<div className={styles.viewRows}>
					{VIEWS.map((view) => (
						<Popover.Trigger
							key={view.id}
							handle={card}
							payload={view}
							nativeButton={false}
							preview
							closeDelay={150}
						>
							<div className={styles.viewRow} data-testid={`row-${view.id}`}>
								{serviceLink(view)}
								<Button
									variant={ButtonVariant.Ghost}
									color={ButtonColor.Secondary}
									size="sm"
									icon
									aria-label={`Actions for ${view.name}`}
									onClick={() => {
										card.close();
										setActed(view.name);
									}}
								>
									<Ellipsis />
								</Button>
							</div>
						</Popover.Trigger>
					))}
				</div>
				<Popover handle={card} side="right" align="start" testId="rows">
					{(view) => <ServiceCard service={view} />}
				</Popover>
				<Hint>{acted === undefined ? 'No action yet.' : `Actions for ${acted}.`}</Hint>
			</div>
		);
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		await waitForEffects();

		await userEvent.tab();
		await expect(canvas.getByRole('link', { name: 'Errors by service' })).toHaveFocus();
		await waitFor(() => expect(popup('rows')).toHaveTextContent('edited 2h ago'));

		await userEvent.tab();
		await expect(
			canvas.getByRole('button', { name: 'Actions for Errors by service' }),
		).toHaveFocus();
		await new Promise((resolve) => setTimeout(resolve, 100));
		await expect(popup('rows')).toHaveTextContent('edited 2h ago');

		await userEvent.keyboard('{Enter}');
		await waitFor(() => expect(popup('rows')).toBeNull());

		await userEvent.tab();
		await expect(canvas.getByRole('link', { name: 'Slow checkout traces' })).toHaveFocus();
		await waitFor(() => expect(popup('rows')).toHaveTextContent('payments team'));
	},
};

/**
 * A press trigger and preview triggers on one popup, the way the `...` crumb and the crumb cards of
 * `Breadcrumb` share theirs. The press opens a dialog, named and with the focus moved in. Each
 * preview opens a card. A press on a preview link closes the dialog, which would otherwise outlive
 * a click that lands outside it.
 */
export const PressAndPreview: StoryObj = {
	render: function PressAndPreviewStory() {
		const card = usePopoverHandle<Service | 'more'>();

		return (
			<div className={styles.roomBelow}>
				<Hint>
					Press “More services” for a dialog that lists them. Hover a service for its card. With the
					dialog open, press a service: the dialog closes.
				</Hint>
				<div className={styles.serviceRow}>
					{SERVICES.slice(0, 2).map((service) => (
						<Popover.Trigger
							key={service.id}
							handle={card}
							payload={service}
							nativeButton={false}
							preview
							closeDelay={150}
						>
							{serviceLink(service)}
						</Popover.Trigger>
					))}
					<Popover.Trigger handle={card} payload="more" nativeButton>
						<Button {...TRIGGER} testId="more">
							More services
						</Button>
					</Popover.Trigger>
				</div>
				<Popover
					handle={card}
					side="bottom"
					align="start"
					aria-label="More services"
					testId="mixed"
				>
					{(shown) =>
						shown === 'more' ? (
							<div className={styles.serviceCard}>
								{SERVICES.slice(2).map((service) => (
									<span key={service.id}>{serviceLink(service)}</span>
								))}
							</div>
						) : (
							<ServiceCard service={shown} />
						)
					}
				</Popover>
			</div>
		);
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		await waitForEffects();

		await userEvent.click(canvas.getByTestId('more'));
		const dialog = await within(document.body).findByRole('dialog', { name: 'More services' });
		await expect(dialog).not.toHaveAttribute('data-preview');

		fireEvent.click(canvas.getByRole('link', { name: 'frontend' }));
		await waitFor(() =>
			expect(within(document.body).queryByRole('dialog', { name: 'More services' })).toBeNull(),
		);
	},
};

/**
 * `handle.openTrigger(id)` opens the popup for a trigger from code, as a hover or a press on it
 * would: a guided tour, an alert that points at the service it is about, a keyboard shortcut. The
 * id is the one on the trigger's element.
 */
export const OpenFromCode: StoryObj = {
	render: function OpenFromCodeStory() {
		const card = usePopoverHandle<Service>();

		return (
			<div className={styles.roomBelow}>
				<Hint>
					The buttons on top call handle.openTrigger with the id of a service link. The card opens
					at that link, with its payload, and the link is marked data-popup-open.
				</Hint>
				<div className={styles.serviceRow}>
					{SERVICES.map((service) => (
						<Button
							key={service.id}
							{...TRIGGER}
							testId={`point-${service.id}`}
							onClick={() => card.openTrigger(`service-${service.id}`)}
						>
							Point at {service.name}
						</Button>
					))}
				</div>
				<div className={styles.serviceRow}>
					{SERVICES.map((service) => (
						<Popover.Trigger
							key={service.id}
							handle={card}
							payload={service}
							nativeButton={false}
							preview
						>
							{serviceLink(service, `service-${service.id}`)}
						</Popover.Trigger>
					))}
				</div>
				<Popover handle={card} side="bottom" align="start" testId="code">
					{(service) => <ServiceCard service={service} />}
				</Popover>
			</div>
		);
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		await waitForEffects();

		fireEvent.click(canvas.getByTestId('point-cart'));
		await waitFor(() => expect(popup('code')).toHaveTextContent('47ms p99'));
		await expect(canvas.getByRole('link', { name: 'cart' })).toHaveAttribute('data-popup-open');
	},
};

const SPIKE: Service = {
	id: 'spike',
	name: 'Latency spike',
	owner: 'checkout, 12:04',
	latency: '1.8s p99',
};

/**
 * Triggers and `showAt` on one handle. The service links are triggers, and a press on the chart
 * shows the popup at that point with a payload of its own. The next trigger takes the popup back
 * to itself.
 */
export const TriggersAndShowAt: StoryObj = {
	render: function TriggersAndShowAtStory() {
		const card = usePopoverHandle<Service>();

		return (
			<div className={styles.roomBelow}>
				<Hint>
					Hover a service for its card. Press anywhere on the chart and the same popup shows the
					spike at that point. Hover a service again and the popup goes back to it.
				</Hint>
				<div className={styles.serviceRow}>
					{SERVICES.map((service) => (
						<Popover.Trigger
							key={service.id}
							handle={card}
							payload={service}
							nativeButton={false}
							preview
							closeDelay={150}
						>
							{serviceLink(service)}
						</Popover.Trigger>
					))}
				</div>
				<button
					type="button"
					className={styles.chart}
					data-testid="chart"
					aria-label="Latency chart"
					onClick={(event) => card.showAt({ x: event.clientX, y: event.clientY }, SPIKE)}
				/>
				<Popover handle={card} side="bottom" align="start" testId="mixed-sources">
					{(service) => <ServiceCard service={service} />}
				</Popover>
			</div>
		);
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		await waitForEffects();

		restPointerOn(canvas.getByRole('link', { name: 'frontend' }));
		await waitFor(() => expect(popup('mixed-sources')).toHaveTextContent('web team'));

		const chart = canvas.getByTestId('chart');
		const box = chart.getBoundingClientRect();
		fireEvent.click(chart, { clientX: box.left + 40, clientY: box.top + 20 });
		await waitFor(() => expect(popup('mixed-sources')).toHaveTextContent('1.8s p99'));
		// `showAt` places the popup apart from any trigger, so it does not slide after one.
		await expect(popup('mixed-sources')).not.toHaveAttribute('data-shared');

		restPointerOn(canvas.getByRole('link', { name: 'checkout' }));
		await waitFor(() => expect(popup('mixed-sources')).toHaveTextContent('payments team'));
	},
};

/**
 * Without a `children` function the content is the same for every trigger, and there is no
 * viewport: only the place of the popup changes. Help that several controls point to is the case.
 */
export const SameContentForEveryTrigger: StoryObj = {
	render: function SameContentStory() {
		const help = usePopoverHandle();

		return (
			<div className={styles.roomBelow}>
				<Hint>
					Both buttons open the same help. Press one, then the other: the popup moves, and its
					content stays.
				</Hint>
				<div className={styles.serviceRow}>
					{['Sampling', 'Retention'].map((label) => (
						<Popover.Trigger key={label} handle={help} nativeButton>
							<Button {...TRIGGER} testId={`help-${label}`}>
								{label} help
							</Button>
						</Popover.Trigger>
					))}
				</div>
				<Popover handle={help} side="bottom" align="start" aria-label="Help" testId="help">
					<div className={styles.serviceCard}>
						<Typography
							variant="paragraph"
							size="small"
							weight="regular"
							color="secondary"
							as="p"
							textOverflow="wrap"
						>
							Settings apply to new data only.
						</Typography>
					</div>
				</Popover>
			</div>
		);
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		await waitForEffects();

		await userEvent.click(canvas.getByTestId('help-Sampling'));
		const shown = await findPopup('help');
		await expect(shown.querySelector('[data-slot="popover-viewport"]')).toBeNull();

		await userEvent.click(canvas.getByTestId('help-Retention'));
		await waitFor(() =>
			expect(canvas.getByTestId('help-Retention')).toHaveAttribute('data-popup-open'),
		);
		await expect(popup('help')).toBe(shown);
	},
};

/**
 * Triggers inside a `Dialog`. The popup goes into the panel of the dialog, where its focus trap
 * lets the keyboard in, and stacks above it.
 */
export const InsideDialog: StoryObj = {
	render: function InsideDialogStory() {
		const [open, setOpen] = useState(true);
		const card = usePopoverHandle<Service>();

		return (
			<div className={styles.roomBelow}>
				<Button {...TRIGGER} onClick={() => setOpen(true)}>
					Open the dialog
				</Button>
				<Dialog
					open={open}
					onClose={() => setOpen(false)}
					title="Services"
					width="base"
					testId="trigger-dialog"
				>
					<div className={styles.dialogBody}>
						<Hint>
							Hover a service, or Tab to it: its card opens inside the dialog panel, above the
							dialog.
						</Hint>
						<div className={styles.serviceRow}>
							{SERVICES.map((service) => (
								<Popover.Trigger
									key={service.id}
									handle={card}
									payload={service}
									nativeButton={false}
									preview
									closeDelay={150}
								>
									{serviceLink(service)}
								</Popover.Trigger>
							))}
						</div>
						<Popover handle={card} side="bottom" align="start" testId="in-dialog">
							{(service) => <ServiceCard service={service} />}
						</Popover>
					</div>
				</Dialog>
			</div>
		);
	},
	play: async () => {
		const body = within(document.body);
		await waitForEffects();

		const link = await body.findByRole('link', { name: 'checkout' });
		restPointerOn(link);
		const card = await findPopup('in-dialog');

		await expect(card).toHaveTextContent('payments team');
		await expect(card.closest('[data-slot="dialog-popup"]')).not.toBeNull();
	},
};

function HeldGroup({
	label,
	children,
}: {
	label: string;
	children: (handle: PopoverHandleType<Service>) => ReactNode;
}): ReactElement {
	const handle = usePopoverHandle<Service>();

	return (
		<div className={styles.heldGroup}>
			<Typography
				variant="label"
				size="small"
				weight="medium"
				color="tertiary"
				as="p"
				textOverflow="wrap"
			>
				{label}
			</Typography>
			{children(handle)}
		</div>
	);
}

/**
 * Every state at once, for the visual snapshot. `ForceOpenProvider` holds each popover open on its
 * first trigger. On the left a preview card: no role, and its link marked `data-popup-open`. On the
 * right the dialog a press trigger opened.
 */
export const TriggerShowcase: StoryObj = {
	parameters: {
		chromatic: { disableSnapshot: false, modes: allModes },
	},
	render: function TriggerShowcaseStory() {
		return (
			<ForceOpenProvider>
				<Hint>
					Held open with ForceOpenProvider, which opens a popover on its first trigger. Left: a
					preview card for the first link. Right: the dialog of the first button.
				</Hint>
				<div className={styles.heldGroups}>
					<HeldGroup label="preview">
						{(handle) => (
							<>
								<div className={styles.serviceRow}>
									{SERVICES.map((service) => (
										<Popover.Trigger
											key={service.id}
											handle={handle}
											payload={service}
											nativeButton={false}
											preview
										>
											{serviceLink(service)}
										</Popover.Trigger>
									))}
								</div>
								<Popover handle={handle} side="bottom" align="start" testId="held-preview">
									{(service) => <ServiceCard service={service} />}
								</Popover>
							</>
						)}
					</HeldGroup>
					<HeldGroup label="press">
						{(handle) => (
							<>
								<div className={styles.serviceRow}>
									{SERVICES.map((service) => (
										<Popover.Trigger
											key={service.id}
											handle={handle}
											payload={service}
											nativeButton
										>
											<Button {...TRIGGER}>{service.name}</Button>
										</Popover.Trigger>
									))}
								</div>
								<Popover
									handle={handle}
									side="bottom"
									align="start"
									aria-label="Service"
									testId="held-press"
								>
									{(service) => <ServiceCard service={service} />}
								</Popover>
							</>
						)}
					</HeldGroup>
				</div>
			</ForceOpenProvider>
		);
	},
	play: async () => {
		await waitForEffects();

		const preview = await findPopup('held-preview');
		await expect(preview).toHaveAttribute('data-preview');
		await waitFor(() => expect(preview).toHaveTextContent('web team'));

		const press = await findPopup('held-press');
		await expect(press).toHaveAttribute('role', 'dialog');
		await waitFor(() => expect(press).toHaveTextContent('web team'));
	},
};
