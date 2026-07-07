import { Code, Settings } from '@signozhq/icons';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup, Typography } from '@signozhq/ui';
import type { Meta, StoryObj } from '@storybook/react-vite';
import styles from './resizable-panel.stories.module.css';

const meta: Meta<typeof ResizablePanel> = {
	title: 'Primitive Components/Resizable/ResizablePanel',
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
		<div className={`story-resizable ${styles.storyContainer}`}>
			<ResizablePanelGroup orientation="horizontal">
				<ResizablePanel {...args}>
					<div className="story-center story-muted">
						<div className={styles.textCenter}>
							<Code className={`icon-md ${styles.iconCentered}`} />
							<Typography size="sm" weight="medium">
								Resizable Panel
							</Typography>
							<Typography
								size="xs"
								color="muted"
								display="block"
								className={styles.descriptionSubtitle}
							>
								50% default size
							</Typography>
						</div>
					</div>
				</ResizablePanel>
				<ResizableHandle withHandle />
				<ResizablePanel defaultSize="50%">
					<div className="story-center">
						<Typography size="sm" weight="medium">
							Fixed Panel
						</Typography>
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
		<div className={styles.storyContainer}>
			<div className={`story-panel ${styles.descriptionPanel}`}>
				<Typography weight="medium" display="block" className={styles.descriptionTitle}>
					Size Constraints:
				</Typography>
				<ul className="story-section-sm">
					<li>
						<Typography size="sm" color="muted" display="block">
							Default: 30%
						</Typography>
					</li>
					<li>
						<Typography size="sm" color="muted" display="block">
							Minimum: 20%
						</Typography>
					</li>
					<li>
						<Typography size="sm" color="muted" display="block">
							Maximum: 60%
						</Typography>
					</li>
					<li>
						<Typography size="sm" color="muted" display="block">
							Try resizing - it won't go beyond these limits!
						</Typography>
					</li>
				</ul>
			</div>
			<div className="story-resizable">
				<ResizablePanelGroup orientation="horizontal">
					<ResizablePanel {...args}>
						<div className={`story-center ${styles.gradientBlueIndigo}`}>
							<div className={styles.textCenter}>
								<Settings className={`icon-md ${styles.iconBlue}`} />
								<Typography size="sm" weight="medium">
									Constrained Panel
								</Typography>
								<Typography size="xs" color="muted" className={styles.constraintInfo}>
									Min: 20% - Max: 60%
								</Typography>
							</div>
						</div>
					</ResizablePanel>
					<ResizableHandle withHandle />
					<ResizablePanel defaultSize="70%">
						<div className="story-center">
							<Typography size="sm" weight="medium">
								Flexible Panel
							</Typography>
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
		<div className={styles.storyContainer}>
			<div className={`story-panel ${styles.descriptionPanel}`}>
				<Typography weight="medium" display="block" className={styles.descriptionTitle}>
					Collapsible Panel:
				</Typography>
				<ul className="story-section-sm">
					<li>
						<Typography size="sm" color="muted" display="block">
							Drag the left panel to its minimum size to collapse it
						</Typography>
					</li>
					<li>
						<Typography size="sm" color="muted" display="block">
							Click the resize handle to restore it
						</Typography>
					</li>
					<li>
						<Typography size="sm" color="muted" display="block">
							Great for sidebars and tool panels!
						</Typography>
					</li>
				</ul>
			</div>
			<div className="story-resizable">
				<ResizablePanelGroup orientation="horizontal">
					<ResizablePanel {...args}>
						<div className={`${styles.panelContent} ${styles.gradientGreenEmerald}`}>
							<Code className={`icon-md ${styles.iconGreen}`} />
							<Typography weight="medium" className={styles.panelTitle}>
								Collapsible Sidebar
							</Typography>
							<Typography size="xs" color="muted">
								Drag me to the edge!
							</Typography>
						</div>
					</ResizablePanel>
					<ResizableHandle withHandle />
					<ResizablePanel defaultSize="75%">
						<div className="story-center">
							<div className={styles.textCenter}>
								<Typography size="sm" weight="medium">
									Main Content
								</Typography>
								<Typography size="xs" color="muted" className={styles.contentSubtitle}>
									Expands when sidebar collapses
								</Typography>
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
		<div className={styles.storyContainer}>
			<div className={`story-panel ${styles.descriptionPanel}`}>
				<Typography weight="medium" display="block" className={styles.descriptionTitle}>
					Both side panels are collapsible:
				</Typography>
				<Typography size="sm" color="muted" display="block">
					Drag either side panel to its edge to collapse it
				</Typography>
			</div>
			<div className="story-resizable">
				<ResizablePanelGroup orientation="horizontal">
					<ResizablePanel defaultSize="20%" minSize="15%" maxSize="35%" collapsible={true}>
						<div className={`story-center ${styles.sidebarPanel}`}>
							<Settings className={`icon-md ${styles.iconStyle}`} />
							<Typography weight="medium" className={styles.panelTitle}>
								Left Sidebar
							</Typography>
							<Typography size="xs" color="muted">
								Collapsible
							</Typography>
						</div>
					</ResizablePanel>
					<ResizableHandle withHandle />
					<ResizablePanel defaultSize="60%">
						<div className="story-center">
							<div className={styles.textCenter}>
								<Code className={styles.iconLarge} />
								<Typography size="sm" weight="medium">
									Main Editor
								</Typography>
								<Typography size="xs" color="muted" className={styles.contentSubtitle}>
									Always visible
								</Typography>
							</div>
						</div>
					</ResizablePanel>
					<ResizableHandle withHandle />
					<ResizablePanel defaultSize="20%" minSize="15%" maxSize="35%" collapsible={true}>
						<div className={`story-center ${styles.sidebarPanel}`}>
							<Settings className={`icon-md ${styles.iconStyle}`} />
							<Typography weight="medium" className={styles.panelTitle}>
								Right Sidebar
							</Typography>
							<Typography size="xs" color="muted">
								Collapsible
							</Typography>
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
		<div className={styles.storyContainer}>
			<div className={`story-panel ${styles.descriptionPanel}`}>
				<Typography weight="medium" display="block" className={styles.descriptionTitle}>
					Vertical collapsible panel:
				</Typography>
				<Typography size="sm" color="muted" display="block">
					Drag the bottom panel down to collapse it
				</Typography>
			</div>
			<div className={`story-resizable ${styles.resizableVertical}`}>
				<ResizablePanelGroup orientation="vertical">
					<ResizablePanel defaultSize="70%">
						<div className="story-center">
							<div className={styles.textCenter}>
								<Code className={styles.iconLarge} />
								<Typography size="sm" weight="medium">
									Editor Area
								</Typography>
							</div>
						</div>
					</ResizablePanel>
					<ResizableHandle withHandle />
					<ResizablePanel {...args}>
						<div className={`story-center ${styles.sidebarPanel}`}>
							<Settings className={`icon-md ${styles.iconStyle}`} />
							<Typography weight="medium" className={styles.panelTitle}>
								Terminal
							</Typography>
							<Typography size="xs" color="muted">
								Drag down to collapse
							</Typography>
						</div>
					</ResizablePanel>
				</ResizablePanelGroup>
			</div>
		</div>
	),
};
