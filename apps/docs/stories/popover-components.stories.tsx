import { Ellipsis } from '@signozhq/icons';
import {
	Button,
	ButtonColor,
	ButtonVariant,
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
 * `Trigger` is the controls story and `TriggerShowcase` the one Chromatic snapshots. `HoverTriggers`
 * and `PreviewRows` are for trying by hand, with Motion set to Live to watch the content swap, and
 * take no snapshot, like every story here but the showcase. The rest of the behaviour is covered by
 * `popover.handle-trigger.test.tsx`.
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
