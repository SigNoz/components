import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@signozhq/ui';
import type { Meta, StoryObj } from '@storybook/react-vite';

const meta: Meta<typeof ResizableHandle> = {
	title: 'Components/Resizable/ResizableHandle',
	component: ResizableHandle,
	argTypes: {
		withHandle: {
			control: 'boolean',
			description: 'Show a visible drag indicator.',
			table: {
				category: 'Appearance',
				type: { summary: 'boolean' },
				defaultValue: { summary: 'false' },
			},
		},
		disabled: {
			control: 'boolean',
			description:
				'When disabled, the separator cannot be used to resize its neighboring panels. ℹ️ The panels may still be resized indirectly (while other panels are being resized). To prevent a panel from being resized at all, it needs to also be disabled.',
			table: {
				category: 'Behavior',
				type: { summary: 'boolean' },
				defaultValue: { summary: 'false' },
			},
		},
		style: {
			control: false,
			description:
				'CSS properties. ℹ️ Use the data-separator attribute for custom hover and active styles. ⚠️ The following properties cannot be overridden: flex-grow, flex-shrink.',
			table: { category: 'Styling', type: { summary: 'CSSProperties' } },
		},
		id: {
			control: 'text',
			description:
				'Uniquely identifies the separator within the parent group. Falls back to useId when not provided. This value will also be assigned to the data-separator attribute.',
			table: { category: 'Accessibility', type: { summary: 'string' } },
		},
		className: {
			control: 'text',
			description:
				'CSS class name. ℹ️ Use the data-separator attribute for custom hover and active styles. ⚠️ The following properties cannot be overridden: flex-grow, flex-shrink.',
			table: { category: 'Styling', type: { summary: 'string' } },
		},
		children: {
			control: false,
			description: 'Custom content to be rendered inside the handle.',
			table: { category: 'Content', type: { summary: 'ReactNode' } },
		},
		testId: {
			control: 'text',
			description: 'The testId associated with the handle for testing purposes.',
			table: { category: 'Testing', type: { summary: 'string' } },
		},
		ref: {
			control: false,
			description: 'Ref attached to the root `HTMLDivElement`.',
			table: { category: 'Advanced', type: { summary: 'Ref<HTMLDivElement> | undefined' } },
		},
	},
	parameters: {
		layout: 'fullscreen',
	},
	tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof ResizableHandle>;

export const Default: Story = {
	args: {
		withHandle: false,
		disabled: false,
	},
	render: (args) => (
		<div className="h-[400px] border rounded-lg overflow-hidden m-6">
			<ResizablePanelGroup orientation="horizontal">
				<ResizablePanel defaultSize="50%">
					<div className="flex h-full items-center justify-center bg-muted">
						<span className="text-sm font-medium">Panel 1</span>
					</div>
				</ResizablePanel>
				<ResizableHandle {...args} />
				<ResizablePanel defaultSize="50%">
					<div className="flex h-full items-center justify-center">
						<span className="text-sm font-medium">Panel 2</span>
					</div>
				</ResizablePanel>
			</ResizablePanelGroup>
		</div>
	),
};

export const WithVisibleHandle: Story = {
	args: {
		withHandle: true,
		disabled: false,
	},
	render: (args) => (
		<div className="m-6">
			<div className="mb-4 p-4 bg-muted rounded-lg">
				<h3 className="font-medium mb-2">Visible Handle:</h3>
				<p className="text-sm text-muted-foreground">
					The dots icon makes the draggable area more discoverable for users
				</p>
			</div>
			<div className="h-[400px] border rounded-lg overflow-hidden">
				<ResizablePanelGroup orientation="horizontal">
					<ResizablePanel defaultSize="50%">
						<div className="flex h-full items-center justify-center bg-muted">
							<div className="text-center">
								<span className="text-sm font-medium">Left Panel</span>
								<p className="text-xs text-muted-foreground mt-1">Drag the dots to resize</p>
							</div>
						</div>
					</ResizablePanel>
					<ResizableHandle {...args} />
					<ResizablePanel defaultSize="50%">
						<div className="flex h-full items-center justify-center">
							<span className="text-sm font-medium">Right Panel</span>
						</div>
					</ResizablePanel>
				</ResizablePanelGroup>
			</div>
		</div>
	),
};

export const Disabled: Story = {
	args: {
		withHandle: true,
		disabled: true,
	},
	render: (args) => (
		<div className="m-6">
			<div className="mb-4 p-4 bg-muted rounded-lg">
				<h3 className="font-medium mb-2">Disabled Handle:</h3>
				<p className="text-sm text-muted-foreground">
					This handle cannot be dragged. Try dragging it - nothing will happen!
				</p>
			</div>
			<div className="h-[400px] border rounded-lg overflow-hidden">
				<ResizablePanelGroup orientation="horizontal">
					<ResizablePanel defaultSize="30%">
						<div className="flex h-full items-center justify-center bg-muted">
							<div className="text-center">
								<span className="text-sm font-medium">Fixed Panel</span>
								<p className="text-xs text-muted-foreground mt-1">30% width</p>
							</div>
						</div>
					</ResizablePanel>
					<ResizableHandle {...args} />
					<ResizablePanel defaultSize="70%">
						<div className="flex h-full items-center justify-center">
							<div className="text-center">
								<span className="text-sm font-medium">Fixed Panel</span>
								<p className="text-xs text-muted-foreground mt-1">70% width</p>
							</div>
						</div>
					</ResizablePanel>
				</ResizablePanelGroup>
			</div>
		</div>
	),
};

export const VerticalHandle: Story = {
	args: {
		withHandle: true,
		disabled: false,
	},
	render: (args) => (
		<div className="m-6">
			<div className="mb-4 p-4 bg-muted rounded-lg">
				<h3 className="font-medium mb-2">Vertical Handle:</h3>
				<p className="text-sm text-muted-foreground">
					Handles work the same way in vertical layouts
				</p>
			</div>
			<div className="h-[500px] border rounded-lg overflow-hidden">
				<ResizablePanelGroup orientation="vertical">
					<ResizablePanel defaultSize="60%">
						<div className="flex h-full items-center justify-center">
							<span className="text-sm font-medium">Top Panel</span>
						</div>
					</ResizablePanel>
					<ResizableHandle {...args} />
					<ResizablePanel defaultSize="40%">
						<div className="flex h-full items-center justify-center bg-muted">
							<span className="text-sm font-medium">Bottom Panel</span>
						</div>
					</ResizablePanel>
				</ResizablePanelGroup>
			</div>
		</div>
	),
};

export const MultipleHandles: Story = {
	render: () => (
		<div className="m-6">
			<div className="mb-4 p-4 bg-muted rounded-lg">
				<h3 className="font-medium mb-2">Multiple Handles:</h3>
				<p className="text-sm text-muted-foreground">
					Each handle can have different configurations
				</p>
			</div>
			<div className="h-[400px] border rounded-lg overflow-hidden">
				<ResizablePanelGroup orientation="horizontal">
					<ResizablePanel defaultSize="25%">
						<div className="flex h-full items-center justify-center bg-muted">
							<div className="text-center">
								<span className="text-sm font-medium">Panel 1</span>
							</div>
						</div>
					</ResizablePanel>
					<ResizableHandle withHandle={false} />
					<ResizablePanel defaultSize="50%">
						<div className="flex h-full items-center justify-center">
							<div className="text-center">
								<span className="text-sm font-medium">Panel 2</span>
								<p className="text-xs text-muted-foreground mt-1">Left: no visible handle</p>
								<p className="text-xs text-muted-foreground">Right: with visible handle</p>
							</div>
						</div>
					</ResizablePanel>
					<ResizableHandle withHandle={true} />
					<ResizablePanel defaultSize="25%">
						<div className="flex h-full items-center justify-center bg-muted">
							<div className="text-center">
								<span className="text-sm font-medium">Panel 3</span>
							</div>
						</div>
					</ResizablePanel>
				</ResizablePanelGroup>
			</div>
		</div>
	),
};

export const MixedHandles: Story = {
	render: () => (
		<div className="m-6">
			<div className="mb-4 p-4 bg-muted rounded-lg">
				<h3 className="font-medium mb-2">Mixed Handle Configuration:</h3>
				<ul className="text-sm text-muted-foreground space-y-1">
					<li>• First handle: Active with visible indicator</li>
					<li>• Second handle: Disabled (cannot drag)</li>
				</ul>
			</div>
			<div className="h-[400px] border rounded-lg overflow-hidden">
				<ResizablePanelGroup orientation="horizontal">
					<ResizablePanel defaultSize="33%">
						<div className="flex h-full items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-900/20">
							<div className="text-center">
								<span className="text-sm font-medium">Resizable</span>
								<p className="text-xs text-muted-foreground mt-1">Can resize right</p>
							</div>
						</div>
					</ResizablePanel>
					<ResizableHandle withHandle={true} disabled={false} />
					<ResizablePanel defaultSize="34%">
						<div className="flex h-full items-center justify-center">
							<div className="text-center">
								<span className="text-sm font-medium">Flexible</span>
								<p className="text-xs text-muted-foreground mt-1">Can resize left</p>
								<p className="text-xs text-muted-foreground">Cannot resize right</p>
							</div>
						</div>
					</ResizablePanel>
					<ResizableHandle withHandle={true} disabled={true} />
					<ResizablePanel defaultSize="33%">
						<div className="flex h-full items-center justify-center bg-gradient-to-br from-amber-50 to-orange-100 dark:from-amber-900/20 dark:to-orange-900/20">
							<div className="text-center">
								<span className="text-sm font-medium">Fixed</span>
								<p className="text-xs text-muted-foreground mt-1">Cannot resize</p>
							</div>
						</div>
					</ResizablePanel>
				</ResizablePanelGroup>
			</div>
		</div>
	),
};
