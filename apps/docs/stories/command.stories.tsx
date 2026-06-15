import {
	Button,
	Command,
	CommandDialog,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
	CommandSeparator,
	CommandShortcut,
} from '@signozhq/ui';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { action } from 'storybook/actions';

const meta: Meta<any> = {
	title: 'Primitive Components/Command',
	component: Command,
	parameters: {
		controls: { expanded: true },
	},
	argTypes: {
		testId: {
			control: 'text',
			description: 'Test ID for the command component.',
			table: { category: 'Testing', type: { summary: 'string' } },
		},
		id: {
			control: 'text',
			description: 'A unique identifier for the command component.',
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
		placeholder: {
			control: 'text',
			description: 'Placeholder text shown in the command input box',
			table: { category: 'Playground' },
		},
		dialogOpen: {
			control: 'boolean',
			description:
				'Boolean. When true, opens the <CommandDialog />. Used to control the dialog visibility externally.',
			table: { category: 'Playground' },
		},
		onOpenChange: {
			action: 'onOpenChange',
			description:
				'Event handler called when the command dialog open/close state changes (e.g. user closes via backdrop or ESC).',
			table: { category: 'Events' },
			control: { disable: true },
		},
		onSelect: {
			action: 'onSelect',
			description:
				'Event handler invoked when a command item is selected (via click or keyboard). Receives the selected item value or label.',
			table: { category: 'Events' },
			control: { disable: true },
		},
	},
};

export default meta;
type Story = StoryObj<any>;

const ITEMS = [
	{ id: '1', label: 'Open settings', shortcut: '⌘S' },
	{ id: '2', label: 'Toggle sidebar', shortcut: 'T' },
	{ id: '3', label: 'Create report', shortcut: 'N' },
	{ id: '4', label: 'Switch workspace' },
];

export const Default: Story = {
	args: {
		placeholder: 'Search commands…',
	},
	render: (args: any) => (
		<div style={{ width: 520 }}>
			<Command>
				<CommandInput placeholder={args.placeholder} />
				<CommandList>
					<CommandGroup heading="General">
						{ITEMS.slice(0, 2).map((it) => (
							<CommandItem
								key={it.id}
								onSelect={() => {
									action('select')(it.label);
									args.onSelect?.(it);
								}}
							>
								{it.label}
								{it.shortcut && <CommandShortcut>{it.shortcut}</CommandShortcut>}
							</CommandItem>
						))}
					</CommandGroup>

					<CommandSeparator />

					<CommandGroup heading="More">
						{ITEMS.slice(2).map((it) => (
							<CommandItem
								key={it.id}
								onSelect={() => {
									action('select')(it.label);
									args.onSelect?.(it);
								}}
							>
								{it.label}
								{it.shortcut && <CommandShortcut>{it.shortcut}</CommandShortcut>}
							</CommandItem>
						))}
					</CommandGroup>

					<CommandEmpty>No results.</CommandEmpty>
				</CommandList>
			</Command>
		</div>
	),
};

export const Preview: Story = {
	parameters: {
		chromatic: { disableSnapshot: false },
	},
	render: () => {
		const placeholder = 'Search commands…';

		function DialogSection() {
			const [dialogOpen, setDialogOpen] = useState(false);

			return (
				<>
					<div style={{ margin: 12 }}>
						<Button type="button" variant="solid" onClick={() => setDialogOpen(true)}>
							Open Command Dialog
						</Button>
					</div>

					<CommandDialog open={dialogOpen} onOpenChange={setDialogOpen} position="top" offset={110}>
						<CommandInput placeholder={placeholder} autoFocus={false} />
						<CommandList>
							<CommandGroup heading="Quick actions">
								{ITEMS.map((it) => (
									<CommandItem
										key={it.id}
										onSelect={() => {
											action('select')(it.label);
											setDialogOpen(false);
										}}
									>
										{it.label}
										{it.shortcut && <CommandShortcut>{it.shortcut}</CommandShortcut>}
									</CommandItem>
								))}
							</CommandGroup>

							<CommandSeparator />

							<CommandEmpty>Try searching for &quot;report&quot;.</CommandEmpty>
						</CommandList>
					</CommandDialog>
				</>
			);
		}

		function CreateOrSearchSection() {
			const [createQuery, setCreateQuery] = useState('');
			const [createItems, setCreateItems] = useState(ITEMS);

			const results = createItems.filter((it) =>
				it.label.toLowerCase().includes(createQuery.toLowerCase())
			);

			const handleCreate = (name: string) => {
				const label = name.trim() || `untitled-${Date.now()}`;
				const newItem = { id: String(Date.now()), label };
				setCreateItems((prev) => [newItem, ...prev]);
				action('create')(label);
			};

			return (
				<div style={{ width: 520 }}>
					<Command>
						<CommandInput
							placeholder={placeholder}
							onValueChange={(v: string) => setCreateQuery(v)}
							onKeyDown={(e) => {
								if (e.key === 'Enter' && results.length === 0) {
									handleCreate(createQuery);
								}
							}}
						/>

						<CommandList>
							{results.length === 0 ? (
								<CommandEmpty>
									No results. Press <strong>Enter</strong> to create &quot;{createQuery}&quot;
								</CommandEmpty>
							) : (
								<CommandGroup heading="Results">
									{results.map((it) => (
										<CommandItem
											key={it.id}
											onSelect={() => {
												action('select')(it.label);
											}}
										>
											{it.label}
										</CommandItem>
									))}
								</CommandGroup>
							)}
						</CommandList>
					</Command>
				</div>
			);
		}

		return (
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
						Select With Alert
					</h3>
					<div style={{ width: 520 }}>
						<Command>
							<CommandInput placeholder={placeholder} />
							<CommandList>
								<CommandGroup heading="Selectable items">
									{ITEMS.map((it) => (
										<CommandItem
											key={it.id}
											onSelect={() => {
												action('select')(it.label);
												window.alert(`You selected: ${it.label}`);
											}}
										>
											{it.label}
											{it.shortcut && <CommandShortcut>{it.shortcut}</CommandShortcut>}
										</CommandItem>
									))}
								</CommandGroup>

								<CommandSeparator />

								<CommandEmpty>No results.</CommandEmpty>
							</CommandList>
						</Command>
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
						Dialog
					</h3>
					<DialogSection />
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
						Create Or Search
					</h3>
					<CreateOrSearchSection />
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
						Suggestions
					</h3>
					<div style={{ width: 520 }}>
						<Command>
							<CommandInput placeholder={placeholder} />
							<CommandList>
								<CommandEmpty>No results.</CommandEmpty>

								<CommandGroup heading="Suggestions">
									{['Calendar', 'Search Emoji', 'Calculator'].map((label) => (
										<CommandItem
											key={label}
											onSelect={() => {
												action('select')(label);
											}}
										>
											{label}
										</CommandItem>
									))}
								</CommandGroup>
							</CommandList>
						</Command>
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
						Separators
					</h3>
					<div style={{ width: 520 }}>
						<Command>
							<CommandInput placeholder={placeholder} />
							<CommandList>
								<CommandGroup heading="Top picks">
									<CommandItem
										onSelect={() => {
											action('select')('Alpha');
										}}
									>
										Alpha
									</CommandItem>
									<CommandItem
										onSelect={() => {
											action('select')('Beta');
										}}
									>
										Beta
									</CommandItem>
								</CommandGroup>

								<CommandSeparator />

								<CommandGroup heading="More suggestions">
									<CommandItem
										onSelect={() => {
											action('select')('Gamma');
										}}
									>
										Gamma
									</CommandItem>
									<CommandItem
										onSelect={() => {
											action('select')('Delta');
										}}
									>
										Delta
									</CommandItem>
								</CommandGroup>

								<CommandSeparator />

								<CommandGroup heading="Utilities">
									<CommandItem
										onSelect={() => {
											action('select')('Profile');
										}}
									>
										Profile
									</CommandItem>
									<CommandItem
										onSelect={() => {
											action('select')('Settings');
										}}
									>
										Settings
									</CommandItem>
								</CommandGroup>

								<CommandEmpty>No results.</CommandEmpty>
							</CommandList>
						</Command>
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
						Shortcuts Demo
					</h3>
					<div style={{ width: 520 }}>
						<Command>
							<CommandInput placeholder={placeholder} />
							<CommandList>
								<CommandGroup heading="Keyboard">
									<CommandItem
										onSelect={() => {
											action('select')('Open settings');
										}}
									>
										Open settings
										<CommandShortcut>⌘S</CommandShortcut>
									</CommandItem>

									<CommandItem
										onSelect={() => {
											action('select')('Toggle sidebar');
										}}
									>
										Toggle sidebar
										<CommandShortcut>Ctrl+K</CommandShortcut>
									</CommandItem>

									<CommandItem
										onSelect={() => {
											action('select')('New report');
										}}
									>
										Create report
										<CommandShortcut>⌘N</CommandShortcut>
									</CommandItem>
								</CommandGroup>

								<CommandEmpty>No results.</CommandEmpty>
							</CommandList>
						</Command>
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
						Empty State
					</h3>
					<div style={{ width: 420 }}>
						<Command>
							<CommandInput placeholder={placeholder} />
							<CommandList>
								<CommandEmpty>
									Nothing matched your search. Try different keywords or create a new command.
								</CommandEmpty>
							</CommandList>
						</Command>
					</div>
				</section>
			</div>
		);
	},
};
