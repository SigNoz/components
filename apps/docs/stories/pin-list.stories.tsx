import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import {
	FileText,
	BarChart,
	GitBranch,
	Server,
	Hexagon,
	List,
	Globe,
	Bug,
} from 'lucide-react';
import { PinList, type PinListItem } from '@signozhq/pin-list';
import { generateDocs } from '../utils/generateDocs';

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
	} = {},
): PinListItem => ({
	key,
	itemKey: key,
	label,
	icon,
	isPinned: options.isPinned ?? false,
	isEnabled: options.isEnabled ?? true,
	active: options.active ?? false,
});

const PinListExamples = [
	`import { PinList } from '@signozhq/pin-list';
import { FileText, BarChart } from 'lucide-react';

export default function MyComponent() {
  const items = [
    { 
      key: '1', 
      itemKey: '1',
      label: 'Logs', 
      icon: <FileText />, 
      isPinned: true, 
      active: true,
      isEnabled: true,
    },
    { 
      key: '2', 
      itemKey: '2',
      label: 'Metrics', 
      icon: <BarChart />, 
      isPinned: false,
      isEnabled: true,
    },
  ];

  return (
    <PinList
      items={items}
      onItemClick={(item) => console.log('Clicked:', item.label)}
      onPinToggle={(item) => console.log('Pin toggled:', item.label)}
    />
  );
}`,
];

const PinListDocs = generateDocs({
	packageName: '@signozhq/pin-list',
	description:
		'A pin list component with smooth animations for managing pinned and unpinned items. Supports hover states, tooltips, and active item indicators. The component uses Framer Motion for smooth layout animations and provides a collapsible "MORE" section for unpinned items.',
	examples: PinListExamples,
});

const meta: Meta<typeof PinList> = {
	title: 'Components/PinList',
	component: PinList,
	parameters: {
		layout: 'fullscreen',
		docs: {
			description: {
				component: PinListDocs,
			},
		},
		design: {
			type: 'figma',
			url: 'https://www.figma.com/design/NthLbcN3oStPosxLkCI8Mt/Periscope---Composites?node-id=276-2244',
		},
	},
	argTypes: {
		items: {
			control: { disable: true },
			description:
				'Array of items to display in the pin list. Each item must have key, itemKey, label, icon (ReactElement), isPinned, isEnabled, and optionally active.',
		},
		onItemClick: {
			action: 'item-clicked',
			description:
				'Callback fired when an item is clicked. Receives the clicked PinListItem.',
		},
		onPinToggle: {
			action: 'pin-toggled',
			description:
				'Callback fired when an item is pinned or unpinned. Receives the toggled PinListItem with updated isPinned state.',
		},
		shortcutsLabel: {
			control: 'text',
			description: 'Label for the pinned items section. Defaults to "SHORTCUTS".',
			defaultValue: 'SHORTCUTS',
		},
		moreLabel: {
			control: 'text',
			description: 'Label for the unpinned items section. Defaults to "MORE".',
			defaultValue: 'MORE',
		},
		className: {
			control: 'text',
			description: 'Additional CSS classes to apply to the container.',
		},
		isDocked: {
			control: 'boolean',
			description:
				'Whether the component is in a docked state, which may apply different styling.',
			defaultValue: false,
		},
		transition: {
			control: { disable: true },
			description:
				'Framer Motion transition configuration for animations. Uses spring animation by default.',
		},
	},
	decorators: [
		(Story) => (
			<div className="p-8 bg-background min-h-screen">
				<div className="max-w-[360px]">
					<Story />
				</div>
			</div>
		),
	],
	tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof PinList>;

// ============================================================================
// Default Items - Standard dataset used across multiple stories
// ============================================================================

const defaultItems: PinListItem[] = [
	createPinListItem('1', 'Logs', <FileText />, { isPinned: true, active: true }),
	createPinListItem('2', 'Metrics', <BarChart />, { isPinned: false }),
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
			createPinListItem('2', 'Metrics', <BarChart />, { isPinned: false }),
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
			createPinListItem('2', 'Metrics', <BarChart />, { isPinned: true }),
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
