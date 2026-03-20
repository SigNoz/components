import type {
	Popover,
	PopoverAnchor,
	PopoverContent,
	PopoverSimple,
	PopoverTrigger,
} from '@signozhq/ui';
import type { Meta } from '@storybook/react-vite';

export const popoverArgTypes: Meta<typeof Popover>['argTypes'] = {
	open: {
		control: 'boolean',
		description: 'The controlled open state. Must be used together with onOpenChange.',
		table: { category: 'State', type: { summary: 'boolean' } },
	},
	defaultOpen: {
		control: 'boolean',
		description:
			'The open state when initially rendered. Use when you do not need to control its open state.',
		table: { category: 'State', type: { summary: 'boolean' } },
	},
	modal: {
		control: 'boolean',
		description:
			'The modality. When true, interaction with outside elements is disabled and only popover content is visible to screen readers.',
		table: {
			category: 'Behavior',
			type: { summary: 'boolean' },
		},
	},
	onOpenChange: {
		control: false,
		description: 'Event handler called when the open state changes.',
		table: {
			category: 'Events',
			type: { summary: '(open: boolean) => void' },
		},
	},
	children: {
		control: false,
		table: { category: 'Content', type: { summary: 'React.ReactNode' } },
	},
	testId: {
		control: 'text',
		description: 'Test ID for the popover.',
		table: { category: 'Testing', type: { summary: 'string' } },
	},
};

export const triggerArgTypes: Meta<typeof PopoverTrigger>['argTypes'] = {
	asChild: {
		control: 'boolean',
		description:
			'When true, the child element will be treated as the trigger (no extra DOM wrapper).',
		table: {
			category: 'Behavior',
			type: { summary: 'boolean' },
		},
	},
	testId: {
		control: 'text',
		description: 'Test ID for the popover trigger.',
		table: { category: 'Testing', type: { summary: 'string' } },
	},
	children: {
		control: false,
		table: { category: 'Content', type: { summary: 'React.ReactNode' } },
	},
};

export const anchorArgTypes: Meta<typeof PopoverAnchor>['argTypes'] = {
	asChild: {
		control: 'boolean',
		description:
			'When true, the child element will be treated as the anchor (no extra DOM wrapper).',
		table: { category: 'Behavior', type: { summary: 'boolean' } },
	},
	testId: {
		control: 'text',
		description: 'Test ID for the popover anchor.',
		table: { category: 'Testing', type: { summary: 'string' } },
	},
	children: {
		control: false,
		table: { category: 'Content', type: { summary: 'React.ReactNode' } },
	},
};

export const contentArgTypes: Meta<typeof PopoverContent>['argTypes'] = {
	side: {
		control: 'select',
		options: ['top', 'right', 'bottom', 'left'],
		description:
			'The preferred side of the trigger to render against. Reversed when collisions occur.',
		table: {
			category: 'Layout',
			type: { summary: "'top' | 'right' | 'bottom' | 'left'" },
		},
	},
	align: {
		control: 'select',
		options: ['start', 'center', 'end'],
		description: 'The preferred alignment against the trigger.',
		table: {
			category: 'Layout',
			type: { summary: "'start' | 'center' | 'end'" },
			defaultValue: { summary: 'center' },
		},
	},
	sideOffset: {
		control: 'number',
		description: 'The distance in pixels from the trigger.',
		table: {
			category: 'Layout',
			type: { summary: 'number' },
			defaultValue: { summary: '4' },
		},
	},
	alignOffset: {
		control: 'number',
		description: 'Offset in pixels from the start/end alignment.',
		table: { category: 'Layout', type: { summary: 'number' } },
	},
	arrow: {
		control: 'boolean',
		description: 'Whether to show the arrow.',
		table: {
			category: 'Appearance',
			type: { summary: 'boolean' },
			defaultValue: { summary: 'false' },
		},
	},
	avoidCollisions: {
		control: 'boolean',
		description: 'When true, overrides side/align to prevent collisions with boundary edges.',
		table: { category: 'Behavior', type: { summary: 'boolean' } },
	},
	forceMount: {
		control: 'boolean',
		description: 'When true, keeps content mounted even when closed. Useful for animation control.',
		table: { category: 'Behavior', type: { summary: 'boolean' } },
	},
	disableOutsidePointerEvents: {
		control: 'boolean',
		description:
			'When true, hover/focus/click interactions will be disabled on elements outside the DismissableLayer. Users will need to click twice on outside elements to interact with them: once to close the DismissableLayer, and again to trigger the element.',
		table: { category: 'Behavior', type: { summary: 'boolean' } },
	},
	className: {
		control: 'text',
		description: 'Additional CSS classes to apply to the content.',
		table: { category: 'Styling', type: { summary: 'string' } },
	},
	testId: {
		control: 'text',
		description: 'Test ID for the popover content.',
		table: { category: 'Testing', type: { summary: 'string' } },
	},
	onOpenAutoFocus: {
		control: false,
		description: 'Event handler called when auto-focusing on open. Can be prevented.',
		table: { category: 'Events' },
	},
	onCloseAutoFocus: {
		control: false,
		description: 'Event handler called when auto-focusing on close. Can be prevented.',
		table: { category: 'Events' },
	},
	onEscapeKeyDown: {
		control: false,
		description: 'Event handler called when the escape key is down. Can be prevented.',
		table: { category: 'Events' },
	},
	onPointerDownOutside: {
		control: false,
		description:
			'Event handler called when a pointerdown event happens outside of the DismissableLayer. Can be prevented.',
		table: { category: 'Events' },
	},
	onFocusOutside: {
		control: false,
		description:
			'Event handler called when the focus moves outside of the DismissableLayer. Can be prevented.',
		table: { category: 'Events' },
	},
	onInteractOutside: {
		control: false,
		description:
			'Event handler called when an interaction happens outside the DismissableLayer. Specifically, when a pointerdown event happens outside or focus moves outside of it. Can be prevented.',
		table: { category: 'Events' },
	},
	children: {
		control: false,
		table: { category: 'Content', type: { summary: 'React.ReactNode' } },
	},
};

export const simpleArgTypes: Meta<typeof PopoverSimple>['argTypes'] = {
	open: {
		control: 'boolean',
		description: 'The controlled open state. Use together with onOpenChange.',
		table: { category: 'State', type: { summary: 'boolean' } },
	},
	defaultOpen: {
		control: 'boolean',
		description: 'The open state when initially rendered.',
		table: { category: 'State', type: { summary: 'boolean' } },
	},
	modal: {
		control: 'boolean',
		description: 'The modality of the popover.',
		table: { category: 'Behavior', type: { summary: 'boolean' } },
	},
	trigger: {
		control: false,
		description: 'The element that opens the popover when clicked.',
		table: { category: 'Content', type: { summary: 'React.ReactNode' } },
	},
	children: {
		control: false,
		description: 'The content of the popover.',
		table: { category: 'Content', type: { summary: 'React.ReactNode' } },
	},
	className: {
		control: 'text',
		description: 'Additional CSS classes for the content.',
		table: { category: 'Styling', type: { summary: 'string' } },
	},
	side: {
		control: 'select',
		options: ['top', 'right', 'bottom', 'left'],
		description: 'The preferred side to render against.',
		table: { category: 'Layout', type: { summary: "'top' | 'right' | 'bottom' | 'left'" } },
	},
	align: {
		control: 'select',
		options: ['start', 'center', 'end'],
		description: 'The preferred alignment.',
		table: { category: 'Layout', type: { summary: "'start' | 'center' | 'end'" } },
	},
	sideOffset: {
		control: 'number',
		description: 'Distance in pixels from the trigger.',
		table: { category: 'Layout', type: { summary: 'number' } },
	},
	alignOffset: {
		control: 'number',
		description: 'Offset in pixels from alignment.',
		table: { category: 'Layout', type: { summary: 'number' } },
	},
	arrow: {
		control: 'boolean',
		description: 'Whether to show the arrow.',
		table: { category: 'Appearance', type: { summary: 'boolean' } },
	},
	forceMount: {
		control: 'boolean',
		description: 'When true, keeps content mounted when closed.',
		table: { category: 'Behavior', type: { summary: 'boolean' } },
	},
	avoidCollisions: {
		control: 'boolean',
		description: 'When true, prevents collisions with boundary edges.',
		table: { category: 'Behavior', type: { summary: 'boolean' } },
	},
	onOpenChange: {
		control: false,
		description: 'Event handler called when the open state changes.',
		table: { category: 'Events', type: { summary: '(open: boolean) => void' } },
	},
};
