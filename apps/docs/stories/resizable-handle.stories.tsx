import { ResizableHandle, ResizablePanel, ResizablePanelGroup, Typography } from '@signozhq/ui';
import type { Meta, StoryObj } from '@storybook/react-vite';
import styles from './resizable-handle.stories.module.css';

const meta: Meta<typeof ResizableHandle> = {
	title: 'Primitive Components/Resizable/ResizableHandle',
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
		<div className={`story-resizable ${styles.storyContainer}`}>
			<ResizablePanelGroup orientation="horizontal">
				<ResizablePanel defaultSize="50%">
					<div className="story-center story-muted">
						<Typography size="sm" weight="medium">
							Panel 1
						</Typography>
					</div>
				</ResizablePanel>
				<ResizableHandle {...args} />
				<ResizablePanel defaultSize="50%">
					<div className="story-center">
						<Typography size="sm" weight="medium">
							Panel 2
						</Typography>
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
		<div className={styles.storyContainer}>
			<div className={`story-panel ${styles.descriptionPanel}`}>
				<Typography weight="medium" display="block" className={styles.descriptionTitle}>
					Visible Handle:
				</Typography>
				<Typography size="sm" color="muted" display="block">
					The dots icon makes the draggable area more discoverable for users
				</Typography>
			</div>
			<div className="story-resizable">
				<ResizablePanelGroup orientation="horizontal">
					<ResizablePanel defaultSize="50%">
						<div className="story-center story-muted">
							<div className={styles.textCenter}>
								<Typography size="sm" weight="medium">
									Left Panel
								</Typography>
								<Typography
									size="xs"
									color="muted"
									display="block"
									className={styles.descriptionSubtitle}
								>
									Drag the dots to resize
								</Typography>
							</div>
						</div>
					</ResizablePanel>
					<ResizableHandle {...args} />
					<ResizablePanel defaultSize="50%">
						<div className="story-center">
							<Typography size="sm" weight="medium">
								Right Panel
							</Typography>
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
		<div className={styles.storyContainer}>
			<div className={`story-panel ${styles.descriptionPanel}`}>
				<Typography weight="medium" display="block" className={styles.descriptionTitle}>
					Disabled Handle:
				</Typography>
				<Typography size="sm" color="muted" display="block">
					This handle cannot be dragged. Try dragging it - nothing will happen!
				</Typography>
			</div>
			<div className="story-resizable">
				<ResizablePanelGroup orientation="horizontal">
					<ResizablePanel defaultSize="30%">
						<div className="story-center story-muted">
							<div className={styles.textCenter}>
								<Typography size="sm" weight="medium">
									Fixed Panel
								</Typography>
								<Typography
									size="xs"
									color="muted"
									display="block"
									className={styles.descriptionSubtitle}
								>
									30% width
								</Typography>
							</div>
						</div>
					</ResizablePanel>
					<ResizableHandle {...args} />
					<ResizablePanel defaultSize="70%">
						<div className="story-center">
							<div className={styles.textCenter}>
								<Typography size="sm" weight="medium">
									Fixed Panel
								</Typography>
								<Typography
									size="xs"
									color="muted"
									display="block"
									className={styles.descriptionSubtitle}
								>
									70% width
								</Typography>
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
		<div className={styles.storyContainer}>
			<div className={`story-panel ${styles.descriptionPanel}`}>
				<Typography weight="medium" display="block" className={styles.descriptionTitle}>
					Vertical Handle:
				</Typography>
				<Typography size="sm" color="muted" display="block">
					Handles work the same way in vertical layouts
				</Typography>
			</div>
			<div className={`story-resizable ${styles.resizableVertical}`}>
				<ResizablePanelGroup orientation="vertical">
					<ResizablePanel defaultSize="60%">
						<div className="story-center">
							<Typography size="sm" weight="medium">
								Top Panel
							</Typography>
						</div>
					</ResizablePanel>
					<ResizableHandle {...args} />
					<ResizablePanel defaultSize="40%">
						<div className="story-center story-muted">
							<Typography size="sm" weight="medium">
								Bottom Panel
							</Typography>
						</div>
					</ResizablePanel>
				</ResizablePanelGroup>
			</div>
		</div>
	),
};

export const MultipleHandles: Story = {
	render: () => (
		<div className={styles.storyContainer}>
			<div className={`story-panel ${styles.descriptionPanel}`}>
				<Typography weight="medium" display="block" className={styles.descriptionTitle}>
					Multiple Handles:
				</Typography>
				<Typography size="sm" color="muted" display="block">
					Each handle can have different configurations
				</Typography>
			</div>
			<div className="story-resizable">
				<ResizablePanelGroup orientation="horizontal">
					<ResizablePanel defaultSize="25%">
						<div className="story-center story-muted">
							<div className={styles.textCenter}>
								<Typography size="sm" weight="medium">
									Panel 1
								</Typography>
							</div>
						</div>
					</ResizablePanel>
					<ResizableHandle withHandle={false} />
					<ResizablePanel defaultSize="50%">
						<div className="story-center">
							<div className={styles.textCenter}>
								<Typography size="sm" weight="medium">
									Panel 2
								</Typography>
								<Typography
									size="xs"
									color="muted"
									display="block"
									className={styles.descriptionSubtitle}
								>
									Left: no visible handle
								</Typography>
								<Typography size="xs" color="muted">
									Right: with visible handle
								</Typography>
							</div>
						</div>
					</ResizablePanel>
					<ResizableHandle withHandle={true} />
					<ResizablePanel defaultSize="25%">
						<div className="story-center story-muted">
							<div className={styles.textCenter}>
								<Typography size="sm" weight="medium">
									Panel 3
								</Typography>
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
		<div className={styles.storyContainer}>
			<div className={`story-panel ${styles.descriptionPanel}`}>
				<Typography weight="medium" display="block" className={styles.descriptionTitle}>
					Mixed Handle Configuration:
				</Typography>
				<ul className="story-section-sm">
					<li>
						<Typography size="sm" color="muted" display="block">
							First handle: Active with visible indicator
						</Typography>
					</li>
					<li>
						<Typography size="sm" color="muted" display="block">
							Second handle: Disabled (cannot drag)
						</Typography>
					</li>
				</ul>
			</div>
			<div className="story-resizable">
				<ResizablePanelGroup orientation="horizontal">
					<ResizablePanel defaultSize="33%">
						<div className={`story-center ${styles.gradientBlueIndigo}`}>
							<div className={styles.textCenter}>
								<Typography size="sm" weight="medium">
									Resizable
								</Typography>
								<Typography
									size="xs"
									color="muted"
									display="block"
									className={styles.descriptionSubtitle}
								>
									Can resize right
								</Typography>
							</div>
						</div>
					</ResizablePanel>
					<ResizableHandle withHandle={true} disabled={false} />
					<ResizablePanel defaultSize="34%">
						<div className="story-center">
							<div className={styles.textCenter}>
								<Typography size="sm" weight="medium">
									Flexible
								</Typography>
								<Typography
									size="xs"
									color="muted"
									display="block"
									className={styles.descriptionSubtitle}
								>
									Can resize left
								</Typography>
								<Typography size="xs" color="muted">
									Cannot resize right
								</Typography>
							</div>
						</div>
					</ResizablePanel>
					<ResizableHandle withHandle={true} disabled={true} />
					<ResizablePanel defaultSize="33%">
						<div className={`story-center ${styles.gradientAmberOrange}`}>
							<div className={styles.textCenter}>
								<Typography size="sm" weight="medium">
									Fixed
								</Typography>
								<Typography
									size="xs"
									color="muted"
									display="block"
									className={styles.descriptionSubtitle}
								>
									Cannot resize
								</Typography>
							</div>
						</div>
					</ResizablePanel>
				</ResizablePanelGroup>
			</div>
		</div>
	),
};
