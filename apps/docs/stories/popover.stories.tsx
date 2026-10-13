import { Search } from '@signozhq/icons';
import {
	Button,
	ButtonColor,
	ButtonVariant,
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	Input,
	Popover,
	Typography,
} from '@signozhq/ui';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { type ReactElement, useRef, useState } from 'react';
import { expect, fireEvent, waitFor, within } from 'storybook/test';
import { allModes } from '../.storybook/modes.js';
import styles from './popover.stories.module.css';
import { waitForEffects } from './shared/play.js';

const VIEWS = [
	{ name: 'Checkout latency', owner: 'You' },
	{ name: 'Error budget', owner: 'Platform' },
	{ name: 'Deploy markers', owner: 'You' },
];

const VARIABLES = [
	'service.name',
	'deployment.environment',
	'http.status_code',
	'k8s.namespace.name',
];

const TRIGGER = {
	variant: ButtonVariant.Outlined,
	color: ButtonColor.Secondary,
	size: 'md',
} as const;

const meta: Meta<typeof Popover> = {
	title: 'Composed Components/Popover',
	component: Popover,
	args: {
		side: 'bottom',
		align: 'start',
		nativeButton: true,
	},
	argTypes: {
		children: {
			control: false,
			description:
				'The popup content. The shell has no padding, so the content owns all of it, edge to edge.',
			table: { category: 'Content', type: { summary: 'ReactNode' } },
		},
		trigger: {
			control: false,
			description:
				'The trigger. Rendered as the element you pass, with the popover props merged into it. A popover always hangs off a trigger and opens on a click.',
			table: { category: 'Content', type: { summary: 'ReactNode' } },
		},
		side: {
			control: 'select',
			options: ['top', 'bottom', 'left', 'right'],
			description:
				'Which side of the anchor the popup opens against. Required. May change on its own to avoid the edges of the viewport.',
			table: { category: 'Appearance', type: { summary: 'top | bottom | left | right' } },
		},
		align: {
			control: 'select',
			options: ['start', 'center', 'end'],
			description:
				'How the popup is aligned along that side. Required, for the same reason as `side`.',
			table: { category: 'Appearance', type: { summary: 'start | center | end' } },
		},
		nativeButton: {
			control: 'boolean',
			description:
				'Whether the trigger renders a native `<button>`. Required: the value has to match the element, and a default of `true` is silently wrong for anything that is not a button.',
			table: { category: 'Content', type: { summary: 'boolean' } },
		},
		open: {
			control: 'boolean',
			description:
				'The controlled open state. Leave it unset and the popover owns its state. Set it when a form closes only after a save succeeds.',
			table: { category: 'State', type: { summary: 'boolean' } },
		},
		width: {
			control: 'text',
			description:
				'The popup width, written as `--popover-internal-inline-size`. A number is read as pixels.',
			table: {
				category: 'Appearance',
				type: { summary: 'number | string' },
				defaultValue: { summary: 'fit-content' },
			},
		},
		maxWidth: {
			control: 'text',
			description: 'How wide the popup may get.',
			table: {
				category: 'Appearance',
				type: { summary: 'number | string' },
				defaultValue: { summary: '25rem' },
			},
		},
		maxHeight: {
			control: 'text',
			description: 'How tall the popup may get. Past it, the content scrolls.',
			table: { category: 'Appearance', type: { summary: 'number | string' } },
		},
		anchor: { control: false, table: { category: 'Behavior' } },
		container: { control: false, table: { category: 'Behavior' } },
		initialFocus: { control: false, table: { category: 'Behavior' } },
		finalFocus: { control: false, table: { category: 'Behavior' } },
		onOpenChange: { control: false, table: { category: 'Events' } },
		testId: { control: 'text', table: { category: 'Testing' } },
	},
	parameters: {
		layout: 'padded',
		docs: {
			description: {
				component:
					'A floating panel hung off a trigger. It opens on a click; the popup is a `role="dialog"` that moves focus in, traps nothing, and closes on Escape. The shell carries zero padding: the content owns all of it, edge to edge.',
			},
		},
		design: {
			type: 'figma',
			url: 'https://www.figma.com/design/eyORbfrXMWCz9w0xEFdgWe/Periscope-%E2%80%93-Primitives-v2?node-id=7067-6&m=dev',
		},
	},
};

export default meta;
type Story = StoryObj<typeof Popover>;

function popup(testId: string): HTMLElement {
	const node = document.querySelector<HTMLElement>(`[data-testid="${testId}-popup"]`);

	if (node === null) {
		throw new Error(`Popover: no popup named "${testId}-popup".`);
	}

	return node;
}

/**
 * The click panel from the Figma example: a pinned search, rows, and an action, in a shell that
 * has no padding of its own.
 */
function ClickPanel(): ReactElement {
	const [query, setQuery] = useState('');
	const views = VIEWS.filter((view) => view.name.toLowerCase().includes(query.toLowerCase()));

	return (
		<div className={styles.panel}>
			<div className={styles.search}>
				<Input
					aria-label="Find a view"
					placeholder="Find a view"
					prefix={<Search />}
					value={query}
					onChange={(event) => setQuery(event.target.value)}
				/>
			</div>
			<ul className={styles.list}>
				{views.map((view) => (
					<li key={view.name} className={styles.row}>
						<Typography size="sm">{view.name}</Typography>
						<Typography size="sm" className={styles.rowMeta}>
							{view.owner}
						</Typography>
					</li>
				))}
			</ul>
			<div className={styles.footer}>
				<Button variant={ButtonVariant.Ghost} color={ButtonColor.Secondary} size="md">
					Create view
				</Button>
			</div>
		</div>
	);
}

/**
 * The playground the Controls table drives.
 */
export const Playground: Story = {
	args: {
		testId: 'popover-playground',
		'aria-label': 'Saved views',
		trigger: (
			<Button {...TRIGGER} prefix={<Search />}>
				Saved views
			</Button>
		),
		children: <ClickPanel />,
	},
	parameters: {
		chromatic: { disableSnapshot: false, modes: allModes },
	},
	decorators: [
		(Story): ReactElement => (
			<div className={styles.roomBelow}>
				<Story />
			</div>
		),
	],
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);

		await waitForEffects();
		fireEvent.click(canvas.getByTestId('popover-playground'));

		await waitFor(() => expect(popup('popover-playground')).toBeVisible());
		expect(
			within(popup('popover-playground')).getByRole('textbox', { name: 'Find a view' }),
		).toBeVisible();

		// The shell resolves its tokens: an unstyled transparent popup means the
		// `--popover-*` hooks are missing from the loaded theme.
		const shell = getComputedStyle(popup('popover-playground'));
		expect(shell.backgroundColor).not.toBe('rgba(0, 0, 0, 0)');
		expect(shell.boxShadow).not.toBe('none');
		expect(shell.borderBottomWidth).toBe('1px');
		expect(shell.paddingTop).toBe('0px');
	},
};

/**
 * A form that closes only when the save succeeds. The popover cannot know that on its own, so
 * `open` stays controlled.
 */
export const SaveViewForm: Story = {
	parameters: {
		chromatic: { disableSnapshot: false, modes: allModes },
	},
	render: function SaveViewFormStory() {
		const [open, setOpen] = useState(false);
		const [name, setName] = useState('Checkout latency');

		return (
			<div className={styles.roomBelow}>
				<Popover
					nativeButton
					side="bottom"
					align="end"
					open={open}
					onOpenChange={setOpen}
					aria-label="Save view"
					testId="popover-save-view"
					trigger={<Button {...TRIGGER}>Save view</Button>}
				>
					<form
						className={styles.form}
						onSubmit={(event) => {
							event.preventDefault();
							setOpen(false);
						}}
					>
						<label className={styles.field}>
							<Typography size="sm">Name</Typography>
							<Input
								aria-label="View name"
								value={name}
								onChange={(event) => setName(event.target.value)}
							/>
						</label>
						<div className={styles.actions}>
							<Button
								variant={ButtonVariant.Ghost}
								color={ButtonColor.Secondary}
								size="md"
								type="button"
								onClick={() => setOpen(false)}
							>
								Cancel
							</Button>
							<Button
								variant={ButtonVariant.Solid}
								color={ButtonColor.Primary}
								size="md"
								type="submit"
							>
								Save
							</Button>
						</div>
					</form>
				</Popover>
			</div>
		);
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);

		await waitForEffects();
		fireEvent.click(canvas.getByTestId('popover-save-view'));

		const panel = await waitFor(() => popup('popover-save-view'));
		fireEvent.click(within(panel).getByRole('button', { name: 'Save' }));

		await waitFor(() =>
			expect(document.querySelector('[data-testid="popover-save-view-popup"]')).toBeNull(),
		);
	},
};

/**
 * Opened from somewhere other than the trigger. Escape still closes it, and the state comes back
 * through `onOpenChange`.
 */
export const ControlledOpen: Story = {
	parameters: {
		chromatic: { disableSnapshot: true },
	},
	render: function ControlledOpenStory() {
		const [open, setOpen] = useState(false);

		return (
			<div className={styles.roomBelow}>
				<Button
					variant={ButtonVariant.Ghost}
					color={ButtonColor.Secondary}
					size="md"
					type="button"
					onClick={() => setOpen(true)}
				>
					Open from outside
				</Button>
				<Popover
					nativeButton
					side="bottom"
					align="start"
					open={open}
					onOpenChange={setOpen}
					aria-label="Notice"
					testId="popover-controlled"
					trigger={<Button {...TRIGGER}>Details</Button>}
				>
					<p className={styles.row}>Held open by the controlled `open` prop.</p>
				</Popover>
			</div>
		);
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);

		await waitForEffects();
		fireEvent.click(canvas.getByRole('button', { name: 'Open from outside' }));

		await waitFor(() => expect(popup('popover-controlled')).toBeVisible());
	},
};

/**
 * Inside a dialog the popup portals into the panel, so the dialog's focus trap can reach it.
 */
export const InsideDialog: Story = {
	parameters: {
		chromatic: { disableSnapshot: false, modes: allModes },
	},
	render: () => (
		<Dialog defaultOpen>
			<DialogContent width="base">
				<DialogHeader>
					<DialogTitle>Panel settings</DialogTitle>
				</DialogHeader>
				<div className={styles.dialogBody}>
					<Popover
						nativeButton
						side="bottom"
						align="start"
						aria-label="Threshold"
						testId="popover-in-dialog"
						trigger={<Button {...TRIGGER}>Set threshold</Button>}
					>
						<p className={styles.row}>The popup is portalled into the dialog panel.</p>
					</Popover>
				</div>
			</DialogContent>
		</Dialog>
	),
	play: async () => {
		await waitForEffects();
		// The dialog portals out of the story canvas and marks that canvas aria-hidden.
		const trigger = document.querySelector<HTMLElement>('[data-testid="popover-in-dialog"]');

		if (trigger === null) {
			throw new Error('Popover: no trigger named "popover-in-dialog".');
		}

		fireEvent.click(trigger);

		await waitFor(() => expect(popup('popover-in-dialog')).toBeVisible());
	},
};

const SERVICES = Array.from(
	{ length: 24 },
	(_, index) => `checkout-service-${String(index).padStart(2, '0')}`,
);

/**
 * Past `maxHeight` the shell scrolls. The content does not have to know the cap.
 */
export const MaxHeightScrolling: Story = {
	parameters: {
		chromatic: { disableSnapshot: false, modes: allModes },
	},
	render: () => (
		<div className={styles.roomBelow}>
			<Popover
				nativeButton
				side="bottom"
				align="start"
				maxHeight={160}
				aria-label="Services"
				testId="popover-scroll"
				trigger={<Button {...TRIGGER}>Services</Button>}
			>
				<ul className={styles.list}>
					{SERVICES.map((service) => (
						<li key={service} className={styles.row}>
							<Typography size="sm">{service}</Typography>
						</li>
					))}
				</ul>
			</Popover>
		</div>
	),
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);

		await waitForEffects();
		fireEvent.click(canvas.getByTestId('popover-scroll'));

		const panel = await waitFor(() => popup('popover-scroll'));
		expect(panel).toBeVisible();
		expect(getComputedStyle(panel).maxBlockSize).not.toBe('none');
	},
};

/**
 * The popup is positioned against the whole input row, while the button stays the thing you click.
 * `initialFocus` stays false so the caret in the field is not stolen.
 */
export const AnchoredTypeahead: Story = {
	parameters: {
		chromatic: { disableSnapshot: false, modes: allModes },
	},
	render: function AnchoredTypeaheadStory() {
		const row = useRef<HTMLDivElement>(null);

		return (
			<div className={styles.roomBelow}>
				<div ref={row} className={styles.inputRow}>
					<Input aria-label="Query" placeholder="service.name" />
					<Popover
						nativeButton
						side="bottom"
						align="start"
						anchor={row}
						initialFocus={false}
						width={360}
						aria-label="Variables"
						testId="popover-typeahead"
						trigger={<Button {...TRIGGER}>Variables</Button>}
					>
						<ul className={styles.list}>
							{VARIABLES.map((variable) => (
								<li key={variable} className={styles.row}>
									<Typography size="sm">{variable}</Typography>
								</li>
							))}
						</ul>
					</Popover>
				</div>
			</div>
		);
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);

		await waitForEffects();
		expect(canvas.getByRole('textbox', { name: 'Query' })).not.toHaveFocus();
		fireEvent.click(canvas.getByTestId('popover-typeahead'));

		await waitFor(() => expect(popup('popover-typeahead')).toBeVisible());
		expect(canvas.getByRole('textbox', { name: 'Query' })).not.toHaveFocus();
	},
};
