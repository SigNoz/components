import { Kbd, Typography } from '@signozhq/ui';
import type { Meta, StoryObj } from '@storybook/react-vite';
import styles from './kbd.stories.module.css';

const meta: Meta<typeof Kbd> = {
	title: 'Primitive Components/Kbd',
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
		<div className={styles.container}>
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
		<div className={`story-row ${styles.containerWithGap}`}>
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
		<div className={`story-grid ${styles.container}`}>
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
		<div className={`story-section ${styles.container}`}>
			<div>
				<Typography as="h3" size="sm" weight="medium" className={styles.headerMargin}>
					Common Shortcuts
				</Typography>
				<div className="story-section-sm">
					{[
						{ label: 'Save', keys: ['⌘', 'S'] },
						{ label: 'Copy', keys: ['⌘', 'C'] },
						{ label: 'Paste', keys: ['⌘', 'V'] },
						{ label: 'Undo', keys: ['⌘', 'Z'] },
						{ label: 'Find', keys: ['⌘', 'F'] },
						{ label: 'Command palette', keys: ['⌘', 'K'] },
					].map(({ label, keys }) => (
						<div key={label} className={styles.shortcutRow}>
							<Typography size="sm">{label}</Typography>
							<div className={`story-row ${styles.keysContainer}`}>
								{keys.map((key, i) => (
									<Kbd key={i}>{key}</Kbd>
								))}
							</div>
						</div>
					))}
				</div>
			</div>
			<div>
				<Typography as="h3" size="sm" weight="medium" className={styles.headerMargin}>
					Multi-modifier
				</Typography>
				<div className="story-section-sm">
					{[
						{ label: 'Redo', keys: ['⌘', '⇧', 'Z'] },
						{ label: 'Force quit', keys: ['⌘', '⌥', 'Esc'] },
					].map(({ label, keys }) => (
						<div key={label} className={styles.shortcutRow}>
							<Typography size="sm">{label}</Typography>
							<div className={`story-row ${styles.keysContainer}`}>
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
		<div className={`story-section ${styles.container} ${styles.maxWidthMd}`}>
			<Typography size="sm">
				Press <Kbd size="sm">⌘</Kbd> <Kbd size="sm">K</Kbd> to open the command palette.
			</Typography>
			<Typography size="sm">
				Use <Kbd size="sm">↑</Kbd> and <Kbd size="sm">↓</Kbd> to navigate results, then{' '}
				<Kbd size="sm">↵</Kbd> to confirm.
			</Typography>
			<Typography size="sm">
				Hold <Kbd size="sm">⇧</Kbd> while clicking to select a range.
			</Typography>
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
		<div className={`story-section ${styles.container}`}>
			<div>
				<Typography as="h3" size="sm" weight="medium" className={styles.headerMargin}>
					Default vs Active
				</Typography>
				<div className="story-row">
					<Kbd>⌘</Kbd>
					<Kbd active>⌘</Kbd>
				</div>
			</div>
			<div>
				<Typography as="h3" size="sm" weight="medium" className={styles.headerMargin}>
					All Sizes
				</Typography>
				<div className="story-row">
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
				<Typography as="h3" size="sm" weight="medium" className={styles.headerMargin}>
					Active Key in a Shortcut
				</Typography>
				<div className={`story-row ${styles.keysContainer}`}>
					<Kbd active>⌘</Kbd>
					<Kbd>K</Kbd>
				</div>
			</div>
		</div>
	),
};
