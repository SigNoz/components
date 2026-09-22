import { Bookmark, Ellipsis, FileDown, Pencil, Trash } from '@signozhq/icons';
import {
	Button,
	ButtonColor,
	ButtonVariant,
	Dropdown,
	type DropdownItemType,
	Toaster,
	Typography,
} from '@signozhq/ui';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { type ReactElement, useState } from 'react';
import { fn } from 'storybook/test';
import { allModes } from '../.storybook/modes.js';
import styles from './dropdown.stories.module.css';

const meta: Meta<typeof Dropdown> = {
	title: 'Composed Components/Dropdown',
	component: Dropdown,
	args: {
		side: 'bottom',
		align: 'start',
		loading: false,
	},
	argTypes: {
		items: {
			control: false,
			description:
				'The rows, in render order. Six kinds, told apart by a required `type`: `item`, `checkbox`, `radio-group`, `submenu`, `group` and `separator`. An empty list renders the `<No content>` row and warns.',
			table: { category: 'Content', type: { summary: 'DropdownItemType[]' } },
		},
		children: {
			control: false,
			description:
				'The trigger. Rendered as the element you pass, with the menu props merged into it, so it keeps its own type, `disabled` and tooltip.',
			table: { category: 'Content', type: { summary: 'ReactNode' } },
		},
		side: {
			control: 'select',
			options: ['top', 'bottom', 'left', 'right', 'inline-start', 'inline-end'],
			description:
				'Which side of the trigger the popup opens against. Required: placement is never incidental. The logical values mirror under RTL.',
			table: { category: 'Layout', type: { summary: 'Side' } },
		},
		align: {
			control: 'select',
			options: ['start', 'center', 'end'],
			description:
				'How the popup is aligned along that side. Required, for the same reason as `side`.',
			table: { category: 'Layout', type: { summary: 'Align' } },
		},
		contentMaxWidth: {
			control: 'text',
			description:
				'How wide the popup may get, written as `--dropdown-internal-max-inline-size`. A number is read as pixels.',
			table: {
				category: 'Layout',
				type: { summary: 'number | string' },
				defaultValue: { summary: '20rem' },
			},
		},
		contentMaxHeight: {
			control: 'text',
			description:
				'How tall the scrolling part may get. Caps the rows alone: the search row stays pinned above them.',
			table: {
				category: 'Layout',
				type: { summary: 'number | string' },
				defaultValue: { summary: '20rem' },
			},
		},
		container: {
			control: false,
			description:
				'The element the popup is portalled into. Pass the dialog or drawer element to keep the menu inside it.',
			table: { category: 'Layout', type: { summary: 'HTMLElement | RefObject' } },
		},
		loading: {
			control: 'boolean',
			description:
				'Replaces the rows with `loadingContent` or a spinner. The search row survives, so a query can still be typed.',
			table: {
				category: 'State',
				type: { summary: 'boolean' },
				defaultValue: { summary: 'false' },
			},
		},
		loadingContent: {
			control: false,
			description: 'What to show in place of the rows while `loading`. Defaults to a spinner.',
			table: { category: 'State', type: { summary: 'ReactNode' } },
		},
		searchInputProps: {
			control: false,
			description:
				'The pinned search row. Passing the object is what renders it, so `{}` is a search row with every default. Holds `placeholder`, `prefix`, `suffix`, `loading`, `filter` and `onChange`.',
			table: { category: 'Behavior', type: { summary: 'DropdownSearchInputProps' } },
		},
		id: { control: 'text', table: { category: 'Styling' } },
		className: { control: 'text', table: { category: 'Styling' } },
		style: { control: false, table: { category: 'Styling' } },
		testId: { control: 'text', table: { category: 'Testing' } },
	},
	parameters: {
		layout: 'padded',
		docs: {
			description: {
				component:
					'A menu built from an `items` array, hung off a trigger you provide. It filters itself, truncates long labels into a tooltip, and decides when to close from what `onClick` returns.',
			},
		},
		design: {
			type: 'figma',
			url: 'https://www.figma.com/design/eyORbfrXMWCz9w0xEFdgWe/Periscope-%E2%80%93-Primitives-v2?node-id=12-745',
		},
	},
};

export default meta;
type Story = StoryObj<typeof Dropdown>;

function Trigger({ children = 'Actions' }: { children?: string }): ReactElement {
	return (
		<Button variant={ButtonVariant.Outlined} color={ButtonColor.Secondary} size="md">
			{children}
		</Button>
	);
}

const ACTION_ITEMS: DropdownItemType[] = [
	{ type: 'item', value: 'rename', label: 'Rename', prefix: <Pencil />, shortcut: 'R' },
	{ type: 'item', value: 'pin', label: 'Pin to the top', prefix: <Bookmark /> },
	{ type: 'separator', value: 'before-danger' },
	{ type: 'item', value: 'delete', label: 'Delete', prefix: <Trash />, destructive: true },
];

export const Playground: Story = {
	args: {
		items: ACTION_ITEMS,
		testId: 'dropdown-playground',
		children: <Trigger />,
	},
	parameters: { chromatic: { disableSnapshot: false, modes: allModes } },
	decorators: [
		(Story): ReactElement => (
			<div className={styles.roomBelow}>
				<Story />
			</div>
		),
	],
};

/**
 * One menu per kind of row, so each shape can be read next to the others.
 */
export const Kinds: Story = {
	render: function KindsStory(): ReactElement {
		const [pinned, setPinned] = useState(true);
		const [sort, setSort] = useState('name');

		return (
			<div className={styles.showcaseContainer}>
				<section>
					<Typography.Text className={styles.sectionNote}>
						Actions, a shortcut, a separator and a destructive row.
					</Typography.Text>
					<div className={styles.exampleRow}>
						<Dropdown side="bottom" align="start" items={ACTION_ITEMS}>
							<Trigger />
						</Dropdown>
					</div>
				</section>

				<section>
					<Typography.Text className={styles.sectionNote}>
						A checkbox and a radio group, each owning its own control.
					</Typography.Text>
					<div className={styles.exampleRow}>
						<Dropdown
							side="bottom"
							align="start"
							items={[
								{
									type: 'checkbox',
									value: 'pinned',
									label: 'Pinned to the top',
									checked: pinned,
									onChange: setPinned,
								},
								{ type: 'separator', value: 'rule' },
								{
									type: 'radio-group',
									value: 'sort',
									selectedValue: sort,
									onChange: setSort,
									items: [
										{ label: 'Sort by name', value: 'name' },
										{ label: 'Sort by last edited', value: 'edited' },
									],
								},
							]}
						>
							<Trigger>View</Trigger>
						</Dropdown>
					</div>
				</section>

				<section>
					<Typography.Text className={styles.sectionNote}>
						Groups, and a submenu inside one. A group is a heading, not a nesting level, so the
						submenu is still one level deep.
					</Typography.Text>
					<div className={styles.exampleRow}>
						<Dropdown
							side="bottom"
							align="start"
							items={[
								{
									type: 'group',
									value: 'edit',
									label: 'Edit',
									items: [
										{ type: 'item', value: 'rename', label: 'Rename', prefix: <Pencil /> },
										{
											type: 'submenu',
											value: 'export',
											label: 'Export',
											prefix: <FileDown />,
											items: [
												{ type: 'item', value: 'csv', label: 'As CSV' },
												{ type: 'item', value: 'json', label: 'As JSON' },
											],
										},
									],
								},
								{
									type: 'group',
									value: 'danger',
									label: 'Danger zone',
									items: [
										{
											type: 'item',
											value: 'delete',
											label: 'Delete',
											prefix: <Trash />,
											destructive: true,
										},
									],
								},
							]}
						>
							<Trigger>Dashboard</Trigger>
						</Dropdown>
					</div>
				</section>
			</div>
		);
	},
};

/**
 * The pinned search row, and what filtering does to the tree.
 */
export const Search: Story = {
	args: {
		items: [
			{
				type: 'group',
				value: 'signals',
				label: 'Signals',
				items: [
					{ type: 'item', value: 'logs', label: 'Logs', searchMetadata: 'records lines' },
					{ type: 'item', value: 'traces', label: 'Traces', searchMetadata: 'spans' },
				],
			},
			{
				type: 'group',
				value: 'resources',
				label: 'Resources',
				items: [
					{ type: 'item', value: 'hosts', label: 'Hosts' },
					{ type: 'item', value: 'pods', label: 'Kubernetes pods' },
				],
			},
		],
		searchInputProps: { placeholder: 'Find a signal', onChange: fn() },
		children: <Trigger>Signals</Trigger>,
	},
	decorators: [
		(Story): ReactElement => (
			<div className={styles.roomBelow}>
				<Story />
			</div>
		),
	],
};

/**
 * Every state a row can be in, and the two that outrank the others.
 */
export const RowStates: Story = {
	args: {
		items: [
			{ type: 'item', value: 'plain', label: 'A plain row' },
			{
				type: 'item',
				value: 'blocked',
				label: 'Blocked, with a reason',
				disabled: true,
				disabledTooltip: 'Ask an admin for write access',
			},
			{
				type: 'item',
				value: 'waiting',
				label: 'Waiting on something',
				loading: true,
				loadingTooltip: 'Fetching the latest version',
			},
			{
				type: 'item',
				value: 'both',
				label: 'Waiting outranks blocked',
				disabled: true,
				disabledTooltip: 'This reason never shows',
				loading: true,
				loadingTooltip: 'This one does',
			},
			{ type: 'separator', value: 'rule' },
			{
				type: 'item',
				value: 'long',
				label: 'A label long enough that it truncates and shows in full on hover',
			},
		],
		contentMaxWidth: 240,
		children: <Trigger>States</Trigger>,
	},
	decorators: [
		(Story): ReactElement => (
			<div className={styles.roomBelow}>
				<Story />
			</div>
		),
	],
};

/**
 * What `onClick` returns decides whether the menu closes. A rejection raises a toast, which needs a
 * `<Toaster />` in the app.
 */
export const AsyncActions: Story = {
	render: function AsyncActionsStory(): ReactElement {
		const wait = (ms: number): Promise<void> =>
			new Promise((resolve) => {
				setTimeout(resolve, ms);
			});

		return (
			<div className={styles.roomBelow}>
				<Toaster />
				<Dropdown
					side="bottom"
					align="start"
					items={[
						{
							type: 'item',
							value: 'archive',
							label: 'Archive (resolves, then closes)',
							onClick: () => wait(1200),
						},
						{
							type: 'item',
							value: 'validate',
							label: 'Validate (resolves false, stays open)',
							onClick: async () => {
								await wait(1200);
								return false;
							},
						},
						{
							type: 'item',
							value: 'publish',
							label: 'Publish (rejects, raises a toast)',
							onClick: async () => {
								await wait(1200);
								throw new Error('The workspace is read only');
							},
						},
						{
							type: 'item',
							value: 'copy',
							label: 'Copy link (returns false)',
							onClick: () => false,
						},
					]}
				>
					<Trigger>Run something</Trigger>
				</Dropdown>
			</div>
		);
	},
};

/**
 * More rows than the popup has room for, so the list scrolls and its clipped edge fades.
 */
export const Overflow: Story = {
	args: {
		items: Array.from({ length: 24 }, (_, index) => ({
			type: 'item' as const,
			value: `service-${index}`,
			label: `checkout-service-${index}`,
		})),
		contentMaxHeight: 240,
		searchInputProps: { placeholder: 'Find a service' },
		children: <Trigger>Services</Trigger>,
	},
	decorators: [
		(Story): ReactElement => (
			<div className={styles.roomBelow}>
				<Story />
			</div>
		),
	],
};

/**
 * An icon-only trigger has no text to name the popup from, so the menu is named through
 * `aria-label` on `Dropdown`.
 */
export const IconOnlyTrigger: Story = {
	args: {
		items: ACTION_ITEMS,
		'aria-label': 'Row actions',
		align: 'end',
		children: (
			<Button
				icon
				variant={ButtonVariant.Ghost}
				color={ButtonColor.Secondary}
				size="md"
				aria-label="Row actions"
			>
				<Ellipsis />
			</Button>
		),
	},
	decorators: [
		(Story): ReactElement => (
			<div className={styles.roomBelow}>
				<Story />
			</div>
		),
	],
};

/**
 * The two states where there are no rows to show: one on its way, one that is a consumer bug.
 */
export const NoRows: Story = {
	render: (): ReactElement => (
		<div className={styles.showcaseContainer}>
			<section>
				<Typography.Text className={styles.sectionNote}>
					Loading. The search row survives, so a query can be typed while the rows arrive.
				</Typography.Text>
				<div className={styles.exampleRow}>
					<Dropdown side="bottom" align="start" loading items={ACTION_ITEMS} searchInputProps={{}}>
						<Trigger>Loading</Trigger>
					</Dropdown>
				</div>
			</section>

			<section>
				<Typography.Text className={styles.sectionNote}>
					Nothing matched the query. The same row appears for an empty `items`, which also logs a
					warning.
				</Typography.Text>
				<div className={styles.exampleRow}>
					<Dropdown
						side="bottom"
						align="start"
						items={ACTION_ITEMS}
						searchInputProps={{ placeholder: 'Type something that matches nothing' }}
					>
						<Trigger>Empty</Trigger>
					</Dropdown>
				</div>
			</section>
		</div>
	),
};
