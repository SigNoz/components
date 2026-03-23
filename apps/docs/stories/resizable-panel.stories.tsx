import { Code, Settings } from '@signozhq/icons';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@signozhq/ui';
import type { Meta, StoryObj } from '@storybook/react-vite';

const meta: Meta<typeof ResizablePanel> = {
	title: 'Components/Resizable/ResizablePanel',
	component: ResizablePanel,
	argTypes: {
		defaultSize: {
			control: 'text',
			description:
				'Default size of Panel within its parent group; default is auto-assigned based on the total number of Panels.',
			table: { category: 'Layout', type: { summary: 'string | number' } },
		},
		minSize: {
			control: 'text',
			description: 'Minimum size of Panel within its parent group; defaults to 0%.',
			table: { category: 'Layout', type: { summary: 'string | number' } },
		},
		maxSize: {
			control: 'text',
			description: 'Maximum size of Panel within its parent group; defaults to 100%.',
			table: { category: 'Layout', type: { summary: 'string | number' } },
		},
		collapsible: {
			control: 'boolean',
			description:
				"This panel can be collapsed. ℹ️ A collapsible panel will collapse when it's size is less than of the specified minSize.",
			table: {
				category: 'Behavior',
				type: { summary: 'boolean' },
				defaultValue: { summary: 'false' },
			},
		},
		collapsedSize: {
			control: 'text',
			description: 'Panel size when collapsed; defaults to 0%.',
			table: { category: 'Layout', type: { summary: 'string | number' } },
		},
		disabled: {
			control: 'boolean',
			description:
				'When disabled, a panel cannot be resized either directly or indirectly (by resizing another panel).',
			table: {
				category: 'Behavior',
				type: { summary: 'boolean' },
				defaultValue: { summary: 'false' },
			},
		},
		groupResizeBehavior: {
			control: 'select',
			options: ['preserve-relative-size', 'preserve-pixel-size'],
			description:
				'How should this Panel behave if the parent Group is resized? Defaults to preserve-relative-size. ⚠️ A Group must contain at least one Panel with preserve-relative-size resize behavior.',
			table: {
				category: 'Behavior',
				type: { summary: "'preserve-relative-size' | 'preserve-pixel-size'" },
				defaultValue: { summary: 'preserve-relative-size' },
			},
		},
		onResize: {
			control: false,
			description:
				'Called when panel sizes change. Receives panelSize (both as a percentage of the parent Group and in pixels), id (if one was provided as a prop), and prevPanelSize (will be undefined on mount).',
			table: {
				category: 'Events',
				type: {
					summary:
						'(panelSize: PanelSize, id: string | number | undefined, prevPanelSize: PanelSize | undefined) => void',
				},
			},
		},
		panelRef: {
			control: false,
			description:
				'Exposes the following imperative API: collapse(): void, expand(): void, getSize(): number, isCollapsed(): boolean, resize(size: number): void. The usePanelRef and usePanelCallbackRef hooks are exported for convenience use in TypeScript projects.',
			table: { category: 'Advanced', type: { summary: 'Ref<PanelImperativeHandle | null>' } },
		},
		style: {
			control: false,
			description:
				'CSS properties. ⚠️ Style is applied to nested HTMLDivElement to avoid styles that interfere with Flex layout.',
			table: { category: 'Styling', type: { summary: 'CSSProperties' } },
		},
		id: {
			control: 'text',
			description:
				'Uniquely identifies this panel within the parent group. Falls back to useId when not provided. This prop is used to associate persisted group layouts with the original panel. This value will also be assigned to the data-panel attribute.',
			table: { category: 'Accessibility', type: { summary: 'string' } },
		},
		className: {
			control: 'text',
			description:
				'CSS class name. ⚠️ Class is applied to nested HTMLDivElement to avoid styles that interfere with Flex layout.',
			table: { category: 'Styling', type: { summary: 'string' } },
		},
		children: {
			control: false,
			description: 'The content to be rendered inside the panel.',
			table: { category: 'Content', type: { summary: 'ReactNode' } },
		},
		testId: {
			control: 'text',
			description: 'The testId associated with the panel for testing purposes.',
			table: { category: 'Testing', type: { summary: 'string' } },
		},
	},
	parameters: {
		layout: 'fullscreen',
	},
	tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof ResizablePanel>;

export const Default: Story = {
	args: {
		defaultSize: '50%',
		collapsible: false,
	},
	render: (args) => (
		<div className="h-[400px] border rounded-lg overflow-hidden m-6">
			<ResizablePanelGroup orientation="horizontal">
				<ResizablePanel {...args}>
					<div className="flex h-full items-center justify-center bg-muted">
						<div className="text-center">
							<Code className="mx-auto mb-2 h-6 w-6 text-muted-foreground" />
							<span className="text-sm font-medium">Resizable Panel</span>
							<p className="text-xs text-muted-foreground mt-1">50% default size</p>
						</div>
					</div>
				</ResizablePanel>
				<ResizableHandle withHandle />
				<ResizablePanel defaultSize="50%">
					<div className="flex h-full items-center justify-center">
						<span className="text-sm font-medium">Fixed Panel</span>
					</div>
				</ResizablePanel>
			</ResizablePanelGroup>
		</div>
	),
};

export const WithMinMaxConstraints: Story = {
	args: {
		defaultSize: '30%',
		minSize: '20%',
		maxSize: '60%',
		collapsible: false,
	},
	render: (args) => (
		<div className="m-6">
			<div className="mb-4 p-4 bg-muted rounded-lg">
				<h3 className="font-medium mb-2">Size Constraints:</h3>
				<ul className="text-sm text-muted-foreground space-y-1">
					<li>• Default: 30%</li>
					<li>• Minimum: 20%</li>
					<li>• Maximum: 60%</li>
					<li>• Try resizing - it won't go beyond these limits!</li>
				</ul>
			</div>
			<div className="h-[400px] border rounded-lg overflow-hidden">
				<ResizablePanelGroup orientation="horizontal">
					<ResizablePanel {...args}>
						<div className="flex h-full items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-900/20">
							<div className="text-center">
								<Settings className="mx-auto mb-2 h-6 w-6 text-blue-600" />
								<span className="text-sm font-medium">Constrained Panel</span>
								<div className="text-xs text-muted-foreground mt-2">
									<div>Min: 20% • Max: 60%</div>
								</div>
							</div>
						</div>
					</ResizablePanel>
					<ResizableHandle withHandle />
					<ResizablePanel defaultSize="70%">
						<div className="flex h-full items-center justify-center">
							<span className="text-sm font-medium">Flexible Panel</span>
						</div>
					</ResizablePanel>
				</ResizablePanelGroup>
			</div>
		</div>
	),
};

export const Collapsible: Story = {
	args: {
		defaultSize: '25%',
		minSize: '15%',
		maxSize: '40%',
		collapsible: true,
	},
	render: (args) => (
		<div className="m-6">
			<div className="mb-4 p-4 bg-muted rounded-lg">
				<h3 className="font-medium mb-2">Collapsible Panel:</h3>
				<ul className="text-sm text-muted-foreground space-y-1">
					<li>• Drag the left panel to its minimum size to collapse it</li>
					<li>• Click the resize handle to restore it</li>
					<li>• Great for sidebars and tool panels!</li>
				</ul>
			</div>
			<div className="h-[400px] border rounded-lg overflow-hidden">
				<ResizablePanelGroup orientation="horizontal">
					<ResizablePanel {...args}>
						<div className="flex h-full flex-col p-4 bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-900/20 dark:to-emerald-900/20">
							<Code className="h-5 w-5 mb-2 text-green-600" />
							<h3 className="font-medium mb-2">Collapsible Sidebar</h3>
							<p className="text-xs text-muted-foreground">Drag me to the edge!</p>
						</div>
					</ResizablePanel>
					<ResizableHandle withHandle />
					<ResizablePanel defaultSize="75%">
						<div className="flex h-full items-center justify-center">
							<div className="text-center">
								<span className="text-sm font-medium">Main Content</span>
								<p className="text-xs text-muted-foreground mt-1">Expands when sidebar collapses</p>
							</div>
						</div>
					</ResizablePanel>
				</ResizablePanelGroup>
			</div>
		</div>
	),
};

export const MultipleCollapsiblePanels: Story = {
	render: () => (
		<div className="m-6">
			<div className="mb-4 p-4 bg-muted rounded-lg">
				<h3 className="font-medium mb-2">Both side panels are collapsible:</h3>
				<p className="text-sm text-muted-foreground">
					Drag either side panel to its edge to collapse it
				</p>
			</div>
			<div className="h-[400px] border rounded-lg overflow-hidden">
				<ResizablePanelGroup orientation="horizontal">
					<ResizablePanel defaultSize="20%" minSize="15%" maxSize="35%" collapsible={true}>
						<div className="flex h-full flex-col p-4 bg-muted">
							<Settings className="h-5 w-5 mb-2 text-muted-foreground" />
							<h3 className="font-medium mb-2">Left Sidebar</h3>
							<p className="text-xs text-muted-foreground">Collapsible</p>
						</div>
					</ResizablePanel>
					<ResizableHandle withHandle />
					<ResizablePanel defaultSize="60%">
						<div className="flex h-full items-center justify-center">
							<div className="text-center">
								<Code className="mx-auto mb-2 h-8 w-8 text-muted-foreground" />
								<span className="text-sm font-medium">Main Editor</span>
								<p className="text-xs text-muted-foreground mt-1">Always visible</p>
							</div>
						</div>
					</ResizablePanel>
					<ResizableHandle withHandle />
					<ResizablePanel defaultSize="20%" minSize="15%" maxSize="35%" collapsible={true}>
						<div className="flex h-full flex-col p-4 bg-muted">
							<Settings className="h-5 w-5 mb-2 text-muted-foreground" />
							<h3 className="font-medium mb-2">Right Sidebar</h3>
							<p className="text-xs text-muted-foreground">Collapsible</p>
						</div>
					</ResizablePanel>
				</ResizablePanelGroup>
			</div>
		</div>
	),
};

export const VerticalPanels: Story = {
	args: {
		defaultSize: '30%',
		minSize: '20%',
		collapsible: true,
	},
	render: (args) => (
		<div className="m-6">
			<div className="mb-4 p-4 bg-muted rounded-lg">
				<h3 className="font-medium mb-2">Vertical collapsible panel:</h3>
				<p className="text-sm text-muted-foreground">Drag the bottom panel down to collapse it</p>
			</div>
			<div className="h-[500px] border rounded-lg overflow-hidden">
				<ResizablePanelGroup orientation="vertical">
					<ResizablePanel defaultSize="70%">
						<div className="flex h-full items-center justify-center">
							<div className="text-center">
								<Code className="mx-auto mb-2 h-8 w-8 text-muted-foreground" />
								<span className="text-sm font-medium">Editor Area</span>
							</div>
						</div>
					</ResizablePanel>
					<ResizableHandle withHandle />
					<ResizablePanel {...args}>
						<div className="flex h-full flex-col p-4 bg-muted">
							<Settings className="h-5 w-5 mb-2 text-muted-foreground" />
							<h3 className="font-medium mb-2">Terminal</h3>
							<p className="text-xs text-muted-foreground">Drag down to collapse</p>
						</div>
					</ResizablePanel>
				</ResizablePanelGroup>
			</div>
		</div>
	),
};
