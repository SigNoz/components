import { Kbd } from '@signozhq/ui';
import type { Meta, StoryObj } from '@storybook/react-vite';

const meta: Meta<typeof Kbd> = {
	title: 'Components/Kbd',
	component: Kbd,
	parameters: {
		layout: 'fullscreen',
		docs: {
			description: {
				component:
					'A keyboard key component for displaying keyboard shortcuts and key bindings. Renders as a semantic `<kbd>` element with a key-like appearance. Supports three sizes and composes with any element via `asChild`.',
			},
		},
	},
	argTypes: {
		testId: {
			control: 'text',
			description: 'Test ID for the kbd element.',
			table: { category: 'Testing', type: { summary: 'string' } },
		},
		id: {
			control: 'text',
			description: 'A unique identifier for the element.',
			table: { category: 'Accessibility', type: { summary: 'string' } },
		},
		className: {
			control: 'text',
			description: 'Additional CSS classes for custom styling.',
			table: { category: 'Styling', type: { summary: 'string' } },
		},
		children: {
			control: 'text',
			description: 'The key label or content.',
			table: { category: 'Content' },
		},
		size: {
			control: 'inline-radio',
			options: ['sm', 'default', 'lg'],
			description: 'Controls the size of the key.',
			table: { category: 'Appearance', defaultValue: { summary: 'default' } },
		},
		asChild: {
			control: 'boolean',
			description: 'Use Radix Slot to compose as a different element.',
			table: { category: 'Composition', defaultValue: { summary: 'false' } },
		},
		active: {
			control: 'boolean',
			description: 'Highlights the key with a subtle primary color tint.',
			table: { category: 'Appearance', defaultValue: { summary: 'false' } },
		},
	},
};

export default meta;

type Story = StoryObj<typeof Kbd>;

export const Playground: Story = {
	args: {
		children: '⌘K',
		size: 'default',
		asChild: false,
		active: false,
	},
	render: (props) => (
		<div className="p-4">
			<Kbd {...props} />
		</div>
	),
};

export const AllSizes: Story = {
	parameters: {
		docs: {
			description: {
				story: 'Three sizes are available: `sm`, `default`, and `lg`.',
			},
		},
	},
	argTypes: {
		children: { control: false },
		size: { control: false },
		asChild: { control: false },
	},
	render: () => (
		<div className="flex items-center gap-3 p-4">
			<Kbd size="sm">⌘K</Kbd>
			<Kbd size="default">⌘K</Kbd>
			<Kbd size="lg">⌘K</Kbd>
		</div>
	),
};

export const CommonKeys: Story = {
	parameters: {
		docs: {
			description: {
				story: 'Common keyboard keys and symbols.',
			},
		},
	},
	argTypes: {
		children: { control: false },
		size: { control: false },
		asChild: { control: false },
	},
	render: () => (
		<div className="flex flex-wrap items-center gap-2 p-4">
			{['⌘', '⌥', '⇧', '⌃', '↵', '⌫', '⇥', 'Esc', 'Space', '↑', '↓', '←', '→'].map((key) => (
				<Kbd key={key}>{key}</Kbd>
			))}
		</div>
	),
};

export const KeyboardShortcuts: Story = {
	parameters: {
		docs: {
			description: {
				story:
					'Display keyboard shortcuts inline. Combine multiple `Kbd` elements to show modifier+key combinations.',
			},
		},
	},
	argTypes: {
		children: { control: false },
		size: { control: false },
		asChild: { control: false },
	},
	render: () => (
		<div className="space-y-4 p-4">
			<div>
				<h3 className="text-sm font-medium mb-3 text-vanilla-800 dark:text-vanilla-300">
					Common Shortcuts
				</h3>
				<div className="space-y-2">
					{[
						{ label: 'Save', keys: ['⌘', 'S'] },
						{ label: 'Copy', keys: ['⌘', 'C'] },
						{ label: 'Paste', keys: ['⌘', 'V'] },
						{ label: 'Undo', keys: ['⌘', 'Z'] },
						{ label: 'Find', keys: ['⌘', 'F'] },
						{ label: 'Command palette', keys: ['⌘', 'K'] },
					].map(({ label, keys }) => (
						<div key={label} className="flex items-center justify-between max-w-xs">
							<span className="text-sm text-vanilla-800 dark:text-vanilla-300">{label}</span>
							<div className="flex items-center gap-1">
								{keys.map((key, i) => (
									<Kbd key={i}>{key}</Kbd>
								))}
							</div>
						</div>
					))}
				</div>
			</div>
			<div>
				<h3 className="text-sm font-medium mb-3 text-vanilla-800 dark:text-vanilla-300">
					Multi-modifier
				</h3>
				<div className="space-y-2">
					{[
						{ label: 'Redo', keys: ['⌘', '⇧', 'Z'] },
						{ label: 'Force quit', keys: ['⌘', '⌥', 'Esc'] },
					].map(({ label, keys }) => (
						<div key={label} className="flex items-center justify-between max-w-xs">
							<span className="text-sm text-vanilla-800 dark:text-vanilla-300">{label}</span>
							<div className="flex items-center gap-1">
								{keys.map((key, i) => (
									<Kbd key={i}>{key}</Kbd>
								))}
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	),
};

export const InlineText: Story = {
	parameters: {
		docs: {
			description: {
				story:
					'Use `Kbd` inline within text to reference key bindings in documentation or tooltips.',
			},
		},
	},
	argTypes: {
		children: { control: false },
		size: { control: false },
		asChild: { control: false },
	},
	render: () => (
		<div className="space-y-3 p-4 text-sm text-vanilla-800 dark:text-vanilla-300 max-w-md">
			<p>
				Press <Kbd size="sm">⌘</Kbd> <Kbd size="sm">K</Kbd> to open the command palette.
			</p>
			<p>
				Use <Kbd size="sm">↑</Kbd> and <Kbd size="sm">↓</Kbd> to navigate results, then{' '}
				<Kbd size="sm">↵</Kbd> to confirm.
			</p>
			<p>
				Hold <Kbd size="sm">⇧</Kbd> while clicking to select a range.
			</p>
		</div>
	),
};

export const ActiveState: Story = {
	parameters: {
		docs: {
			description: {
				story:
					'Use `active` to highlight a key with a subtle primary color tint and solid primary border.',
			},
		},
	},
	argTypes: {
		children: { control: false },
		size: { control: false },
		asChild: { control: false },
		active: { control: false },
	},
	render: () => (
		<div className="space-y-4 p-4">
			<div>
				<h3 className="text-sm font-medium mb-3 text-vanilla-800 dark:text-vanilla-300">
					Default vs Active
				</h3>
				<div className="flex items-center gap-2">
					<Kbd>⌘</Kbd>
					<Kbd active>⌘</Kbd>
				</div>
			</div>
			<div>
				<h3 className="text-sm font-medium mb-3 text-vanilla-800 dark:text-vanilla-300">
					All Sizes
				</h3>
				<div className="flex items-center gap-2">
					<Kbd size="sm" active>
						⌘
					</Kbd>
					<Kbd size="default" active>
						⌘
					</Kbd>
					<Kbd size="lg" active>
						⌘
					</Kbd>
				</div>
			</div>
			<div>
				<h3 className="text-sm font-medium mb-3 text-vanilla-800 dark:text-vanilla-300">
					Active Key in a Shortcut
				</h3>
				<div className="flex items-center gap-1">
					<Kbd active>⌘</Kbd>
					<Kbd>K</Kbd>
				</div>
			</div>
		</div>
	),
};
