import { Bug, ChartBar, FileText, GitBranch, Globe, Hexagon, List, Server } from '@signozhq/icons';
import { PinList, type PinListItem } from '@signozhq/ui';
import type { Meta, StoryObj } from '@storybook/react-vite';
import type React from 'react';

/**
 * Helper function to create properly formatted PinList items
 * The component expects icon as React.ReactElement, not a component type
 */
const createPinListItem = (
	key: string,
	label: string | React.ReactNode,
	icon: React.ReactElement,
	options: {
		isPinned?: boolean;
		isEnabled?: boolean;
		active?: boolean;
		className?: string;
	} = {}
): PinListItem => ({
	key,
	itemKey: key,
	label,
	icon,
	isPinned: options.isPinned ?? false,
	isEnabled: options.isEnabled ?? true,
	active: options.active ?? false,
	className: options.className,
});

const meta: Meta<typeof PinList> = {
	title: 'Components/PinList',
	component: PinList,
	argTypes: {
		items: {
			control: false,
			description:
				'Array of items to display in the pin list. Items are automatically separated into pinned (shortcuts) and unpinned (more) sections. Each item must have key, itemKey, label, icon (ReactElement), isPinned, isEnabled, and optionally active.',
			table: { category: 'Content', type: { summary: 'PinListItem[]' } },
		},
		onItemClick: {
			control: false,
			action: 'item-clicked',
			description: 'Callback fired when an item is clicked. Receives the clicked PinListItem.',
			table: { category: 'Events', type: { summary: '(item: PinListItem) => void' } },
		},
		onPinToggle: {
			control: false,
			action: 'pin-toggled',
			description:
				"Callback fired when an item's pin state is toggled. Receives the item with its new isPinned state (already toggled).",
			table: { category: 'Events', type: { summary: '(item: PinListItem) => void' } },
		},
		shortcutsLabel: {
			control: 'text',
			description: 'Label text for the pinned items section header.',
			table: {
				category: 'Content',
				type: { summary: 'string' },
				defaultValue: { summary: '"SHORTCUTS"' },
			},
		},
		moreLabel: {
			control: 'text',
			description: 'Label text for the unpinned items section header.',
			table: {
				category: 'Content',
				type: { summary: 'string' },
				defaultValue: { summary: '"MORE"' },
			},
		},
		className: {
			control: 'text',
			description: 'Additional CSS class names to apply to the container element.',
			table: { category: 'Styling', type: { summary: 'string' } },
		},
		itemClassName: {
			control: 'text',
			description: 'Additional CSS class names to apply to all item elements.',
			table: { category: 'Styling', type: { summary: 'string' } },
		},
		labelClassName: {
			control: 'text',
			description:
				'Additional CSS class names to apply to section label elements (shortcuts and more headers).',
			table: { category: 'Styling', type: { summary: 'string' } },
		},
		transition: {
			control: false,
			description:
				'Framer Motion transition configuration for item animations. Uses spring animation by default.',
			table: { category: 'Styling', type: { summary: 'Transition' } },
		},
		isDocked: {
			control: 'boolean',
			description:
				'Whether the component is in a docked/collapsed state. Can be used to apply different styling when the sidebar is collapsed.',
			table: {
				category: 'State',
				type: { summary: 'boolean' },
				defaultValue: { summary: 'false' },
			},
		},
	},
	parameters: {
		layout: 'fullscreen',
		design: {
			type: 'figma',
			url: 'https://www.figma.com/design/NthLbcN3oStPosxLkCI8Mt/Periscope---Composites?node-id=276-2244',
		},
	},
	decorators: [
		(Story) => (
			<div className="p-8 bg-background min-h-[360px]">
				<div className="max-w-[360px]">
					<Story />
				</div>
			</div>
		),
	],
};

export default meta;
type Story = StoryObj<typeof PinList>;

// ============================================================================
// Default Items - Standard dataset used across multiple stories
// ============================================================================

const defaultItems: PinListItem[] = [
	createPinListItem('1', 'Logs', <FileText />, { isPinned: true, active: true }),
	createPinListItem('2', 'Metrics', <ChartBar />, { isPinned: false }),
	createPinListItem('3', 'Traces', <GitBranch />, { isPinned: false }),
	createPinListItem('4', 'Services', <Server />, { isPinned: false }),
	createPinListItem('5', 'Infrastructure', <Hexagon />, { isPinned: false }),
	createPinListItem('6', 'Messaging Queues', <List />, { isPinned: false }),
	createPinListItem('7', 'External APIs', <Globe />, { isPinned: false }),
	createPinListItem('8', 'Exceptions', <Bug />, { isPinned: false }),
];

// ============================================================================
// Story: Default - Getting Started Example
// ============================================================================
/**
 * **Default / Getting Started Story**
 *
 * This is the standard example showing the PinList component with a typical mix
 * of pinned and unpinned items. This serves as the primary reference for how
 * to use the component. Notice how:
 * - One item is pinned and active (Logs)
 * - The "MORE" section is collapsible and contains unpinned items
 * - Items can be clicked to trigger onItemClick
 * - Pin icons appear on hover to allow pinning/unpinning
 */
export const Default: Story = {
	args: {
		items: defaultItems,
		shortcutsLabel: 'SHORTCUTS',
		moreLabel: 'MORE',
	},
};

// ============================================================================
// Story: Empty State - No Pinned Items
// ============================================================================
/**
 * **Empty State: No Pinned Items**
 *
 * When there are no pinned items, the component displays a helpful empty state
 * message: "You have not added any shortcuts yet." This is important for user
 * guidance when the component first loads or after clearing all pins.
 */
export const EmptyShortcuts: Story = {
	args: {
		items: [
			createPinListItem('1', 'Logs', <FileText />, { isPinned: false }),
			createPinListItem('2', 'Metrics', <ChartBar />, { isPinned: false }),
			createPinListItem('3', 'Traces', <GitBranch />, { isPinned: false }),
			createPinListItem('4', 'Services', <Server />, { isPinned: false }),
			createPinListItem('5', 'Infrastructure', <Hexagon />, { isPinned: false }),
		],
		shortcutsLabel: 'SHORTCUTS',
		moreLabel: 'MORE',
	},
	name: 'Empty Shortcuts',
};

// ============================================================================
// Story: All Pinned
// ============================================================================
/**
 * **All Items Pinned**
 *
 * When all items are pinned, the SHORTCUTS section is populated and the MORE
 * section is hidden (since there are no unpinned items). This demonstrates
 * the component's ability to handle the scenario where users have pinned
 * everything they need.
 */
export const AllPinned: Story = {
	args: {
		items: [
			createPinListItem('1', 'Logs', <FileText />, {
				isPinned: true,
				active: true,
			}),
			createPinListItem('2', 'Metrics', <ChartBar />, { isPinned: true }),
			createPinListItem('3', 'Traces', <GitBranch />, { isPinned: true }),
			createPinListItem('4', 'Services', <Server />, { isPinned: true }),
			createPinListItem('5', 'Infrastructure', <Hexagon />, { isPinned: true }),
		],
		shortcutsLabel: 'SHORTCUTS',
		moreLabel: 'MORE',
	},
	name: 'All Pinned',
};

// ============================================================================
// Story: Custom Labels
// ============================================================================
/**
 * **Custom Section Labels**
 *
 * Demonstrates the ability to customize the section labels. This is useful for
 * internationalization (i18n) or contextual naming (e.g., "FAVORITES" instead
 * of "SHORTCUTS").
 */
export const CustomLabels: Story = {
	args: {
		items: defaultItems,
		shortcutsLabel: 'FAVORITES',
		moreLabel: 'OTHER ITEMS',
	},
	name: 'Custom Labels',
};

// ============================================================================
// Story: Single Item
// ============================================================================
/**
 * **Single Item**
 *
 * Edge case: Component with just one item. Tests minimal state rendering
 * and ensures the component handles the single-item scenario correctly.
 */
export const SingleItem: Story = {
	args: {
		items: [
			createPinListItem('1', 'Logs', <FileText />, {
				isPinned: true,
				active: true,
			}),
		],
		shortcutsLabel: 'SHORTCUTS',
		moreLabel: 'MORE',
	},
	name: 'Single Item',
};

// ============================================================================
// Story: With Custom ClassNames
// ============================================================================
/**
 * **Custom ClassNames**
 *
 * Demonstrates the ability to pass custom class names to specific parts of the
 * component. This allows for fine-grained styling of the container, items,
 * and labels.
 */
export const WithCustomClassNames: Story = {
	args: {
		items: [
			createPinListItem('1', 'Logs', <FileText />, {
				isPinned: true,
				active: true,
				className: 'bg-primary/10',
			}),
			createPinListItem('2', 'Metrics', <ChartBar />, { isPinned: false }),
		],
		shortcutsLabel: 'SHORTCUTS',
		moreLabel: 'MORE',
		className: 'bg-muted/30 p-4 rounded-lg border border-border/50',
		itemClassName: 'hover:shadow-sm transition-all duration-200',
		labelClassName: 'text-primary font-headers tracking-widest',
	},
	name: 'With Custom ClassNames',
};
