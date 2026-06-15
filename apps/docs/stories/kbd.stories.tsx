import { Kbd } from '@signozhq/ui';
import type { Meta, StoryObj } from '@storybook/react-vite';

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
		style: {
			control: false,
			description: 'Inline styles applied to custom styling.',
			table: { category: 'Styling', type: { summary: 'React.CSSProperties' } },
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

export const Default: Story = {
	args: {
		children: '⌘K',
		size: 'default',
		asChild: false,
		active: false,
	},
	render: (props) => (
		<div style={{ padding: '1rem' }}>
			<Kbd {...props} />
		</div>
	),
};

export const Preview: Story = {
	parameters: {
		chromatic: { disableSnapshot: false },
	},
	render: () => (
		<div
			style={{
				padding: '2rem',
				display: 'flex',
				flexDirection: 'column',
				gap: '2.5rem',
				backgroundColor: 'var(--background)',
			}}
		>
			<section>
				<h3
					style={{
						fontSize: '0.875rem',
						fontWeight: 500,
						marginBottom: '0.75rem',
						color: 'var(--muted-foreground)',
					}}
				>
					All Sizes
				</h3>
				<div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '1rem' }}>
					<Kbd size="sm">⌘K</Kbd>
					<Kbd size="default">⌘K</Kbd>
					<Kbd size="lg">⌘K</Kbd>
				</div>
			</section>
			<section>
				<h3
					style={{
						fontSize: '0.875rem',
						fontWeight: 500,
						marginBottom: '0.75rem',
						color: 'var(--muted-foreground)',
					}}
				>
					Common Keys
				</h3>
				<div
					style={{
						display: 'flex',
						flexWrap: 'wrap',
						alignItems: 'center',
						gap: '0.5rem',
						padding: '1rem',
					}}
				>
					{['⌘', '⌥', '⇧', '⌃', '↵', '⌫', '⇥', 'Esc', 'Space', '↑', '↓', '←', '→'].map((key) => (
						<Kbd key={key}>{key}</Kbd>
					))}
				</div>
			</section>
			<section>
				<h3
					style={{
						fontSize: '0.875rem',
						fontWeight: 500,
						marginBottom: '0.75rem',
						color: 'var(--muted-foreground)',
					}}
				>
					Keyboard Shortcuts
				</h3>
				<div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', padding: '1rem' }}>
					<div>
						<h3
							style={{
								fontSize: '0.875rem',
								fontWeight: 500,
								marginBottom: '0.75rem',
								color: 'var(--muted-foreground)',
							}}
						>
							Common Shortcuts
						</h3>
						<div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
							{[
								{ label: 'Save', keys: ['⌘', 'S'] },
								{ label: 'Copy', keys: ['⌘', 'C'] },
								{ label: 'Paste', keys: ['⌘', 'V'] },
								{ label: 'Undo', keys: ['⌘', 'Z'] },
								{ label: 'Find', keys: ['⌘', 'F'] },
								{ label: 'Command palette', keys: ['⌘', 'K'] },
							].map(({ label, keys }) => (
								<div
									key={label}
									style={{
										display: 'flex',
										alignItems: 'center',
										justifyContent: 'space-between',
										maxWidth: '20rem',
									}}
								>
									<span style={{ fontSize: '0.875rem', color: 'var(--muted-foreground)' }}>
										{label}
									</span>
									<div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
										{keys.map((key, i) => (
											<Kbd key={i}>{key}</Kbd>
										))}
									</div>
								</div>
							))}
						</div>
					</div>
					<div>
						<h3
							style={{
								fontSize: '0.875rem',
								fontWeight: 500,
								marginBottom: '0.75rem',
								color: 'var(--muted-foreground)',
							}}
						>
							Multi-modifier
						</h3>
						<div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
							{[
								{ label: 'Redo', keys: ['⌘', '⇧', 'Z'] },
								{ label: 'Force quit', keys: ['⌘', '⌥', 'Esc'] },
							].map(({ label, keys }) => (
								<div
									key={label}
									style={{
										display: 'flex',
										alignItems: 'center',
										justifyContent: 'space-between',
										maxWidth: '20rem',
									}}
								>
									<span style={{ fontSize: '0.875rem', color: 'var(--muted-foreground)' }}>
										{label}
									</span>
									<div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
										{keys.map((key, i) => (
											<Kbd key={i}>{key}</Kbd>
										))}
									</div>
								</div>
							))}
						</div>
					</div>
				</div>
			</section>
			<section>
				<h3
					style={{
						fontSize: '0.875rem',
						fontWeight: 500,
						marginBottom: '0.75rem',
						color: 'var(--muted-foreground)',
					}}
				>
					Inline Text
				</h3>
				<div
					style={{
						display: 'flex',
						flexDirection: 'column',
						gap: '0.75rem',
						padding: '1rem',
						fontSize: '0.875rem',
						color: 'var(--muted-foreground)',
						maxWidth: '28rem',
					}}
				>
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
			</section>
			<section>
				<h3
					style={{
						fontSize: '0.875rem',
						fontWeight: 500,
						marginBottom: '0.75rem',
						color: 'var(--muted-foreground)',
					}}
				>
					Active State
				</h3>
				<div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', padding: '1rem' }}>
					<div>
						<h3
							style={{
								fontSize: '0.875rem',
								fontWeight: 500,
								marginBottom: '0.75rem',
								color: 'var(--muted-foreground)',
							}}
						>
							Default vs Active
						</h3>
						<div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
							<Kbd>⌘</Kbd>
							<Kbd active>⌘</Kbd>
						</div>
					</div>
					<div>
						<h3
							style={{
								fontSize: '0.875rem',
								fontWeight: 500,
								marginBottom: '0.75rem',
								color: 'var(--muted-foreground)',
							}}
						>
							All Sizes
						</h3>
						<div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
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
						<h3
							style={{
								fontSize: '0.875rem',
								fontWeight: 500,
								marginBottom: '0.75rem',
								color: 'var(--muted-foreground)',
							}}
						>
							Active Key in a Shortcut
						</h3>
						<div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
							<Kbd active>⌘</Kbd>
							<Kbd>K</Kbd>
						</div>
					</div>
				</div>
			</section>
		</div>
	),
};
