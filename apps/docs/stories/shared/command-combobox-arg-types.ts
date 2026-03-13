import type {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
	CommandSeparator,
	CommandShortcut,
} from '@signozhq/ui';
import type { Meta } from '@storybook/react-vite';

export const commandArgTypes: Meta<typeof Command>['argTypes'] = {
	value: {
		control: 'text',
		description: 'The current search query value for the command palette.',
		table: { category: 'State', type: { summary: 'string' } },
	},
	onValueChange: {
		control: false,
		description: 'Callback fired when the search query changes.',
		table: {
			category: 'Events',
			type: { summary: '(value: string) => void' },
		},
	},
	className: {
		control: 'text',
		description: 'Additional CSS classes to apply to the command container.',
		table: { category: 'Styling', type: { summary: 'string' } },
	},
	children: {
		control: false,
		table: { category: 'Content', type: { summary: 'React.ReactNode' } },
	},
};

export const inputArgTypes: Meta<typeof CommandInput>['argTypes'] = {
	placeholder: {
		control: 'text',
		description: 'Placeholder text displayed inside the input.',
		table: { category: 'Content', type: { summary: 'string' } },
	},
	autoFocus: {
		control: 'boolean',
		description: 'When true, focuses the input when it is mounted.',
		table: { category: 'Behavior', type: { summary: 'boolean' } },
	},
	disabled: {
		control: 'boolean',
		description: 'When true, disables user interaction with the input.',
		table: { category: 'State', type: { summary: 'boolean' } },
	},
	onValueChange: {
		control: false,
		description: 'Callback fired when the input value changes.',
		table: {
			category: 'Events',
			type: { summary: '(value: string) => void' },
		},
	},
	className: {
		control: 'text',
		description: 'Additional CSS classes to apply to the input.',
		table: { category: 'Styling', type: { summary: 'string' } },
	},
};

export const listArgTypes: Meta<typeof CommandList>['argTypes'] = {
	className: {
		control: 'text',
		description: 'Additional CSS classes to apply to the list container.',
		table: { category: 'Styling', type: { summary: 'string' } },
	},
	children: {
		control: false,
		table: { category: 'Content', type: { summary: 'React.ReactNode' } },
	},
};

export const emptyArgTypes: Meta<typeof CommandEmpty>['argTypes'] = {
	children: {
		control: 'text',
		description: 'Content shown when there are no matching results.',
		table: { category: 'Content', type: { summary: 'React.ReactNode' } },
	},
	className: {
		control: 'text',
		description: 'Additional CSS classes to apply to the empty state.',
		table: { category: 'Styling', type: { summary: 'string' } },
	},
};

export const groupArgTypes: Meta<typeof CommandGroup>['argTypes'] = {
	heading: {
		control: 'text',
		description: 'Optional visual heading displayed above the group items.',
		table: { category: 'Content', type: { summary: 'string' } },
	},
	className: {
		control: 'text',
		description: 'Additional CSS classes to apply to the group wrapper.',
		table: { category: 'Styling', type: { summary: 'string' } },
	},
	children: {
		control: false,
		table: { category: 'Content', type: { summary: 'React.ReactNode' } },
	},
};

export const itemArgTypes: Meta<typeof CommandItem>['argTypes'] = {
	disabled: {
		control: 'boolean',
		description: 'When true, prevents the item from being selected.',
		table: { category: 'State', type: { summary: 'boolean' } },
	},
	onSelect: {
		control: false,
		description: 'Callback fired when the item is selected.',
		table: {
			category: 'Events',
			type: { summary: '(value: string) => void' },
		},
	},
	className: {
		control: 'text',
		description: 'Additional CSS classes to apply to the item.',
		table: { category: 'Styling', type: { summary: 'string' } },
	},
	children: {
		control: 'text',
		description: 'Item label displayed in the list.',
		table: { category: 'Content', type: { summary: 'React.ReactNode' } },
	},
};

export const separatorArgTypes: Meta<typeof CommandSeparator>['argTypes'] = {
	className: {
		control: 'text',
		description: 'Additional CSS classes to apply to the separator element.',
		table: { category: 'Styling', type: { summary: 'string' } },
	},
};

export const shortcutArgTypes: Meta<typeof CommandShortcut>['argTypes'] = {
	children: {
		control: 'text',
		description: 'Shortcut text shown to the right of the item label.',
		table: { category: 'Content', type: { summary: 'React.ReactNode' } },
	},
	className: {
		control: 'text',
		description: 'Additional CSS classes to apply to the shortcut span.',
		table: { category: 'Styling', type: { summary: 'string' } },
	},
};
