import { ChartBar, Code, Database, FileText, Settings, Terminal } from '@signozhq/icons';
import {
	ResizableHandle,
	ResizablePanel,
	ResizablePanelGroup,
	Typography,
	useDefaultLayout,
} from '@signozhq/ui';
import type { Meta, StoryObj } from '@storybook/react-vite';
import styles from './resizable.stories.module.css';

const meta: Meta<typeof ResizablePanelGroup> = {
	title: 'Primitive Components/Resizable',
	component: ResizablePanelGroup,
	parameters: {
		layout: 'fullscreen',
	},
	argTypes: {
		orientation: {
			control: 'select',
			options: ['horizontal', 'vertical'],
			description:
				'Specifies the resizable orientation ("horizontal" or "vertical"); defaults to "horizontal"',
			table: {
				category: 'Layout',
				type: { summary: "'horizontal' | 'vertical'" },
				defaultValue: { summary: 'horizontal' },
			},
		},
		defaultLayout: {
			control: false,
			description:
				'Default layout for the Group. This value allows layouts to be remembered between page reloads.',
			table: { category: 'Layout', type: { summary: 'Layout' } },
		},
		onLayoutChange: {
			control: false,
			description:
				"Called when the Group's layout is changing. ⚠️ For layout changes caused by pointer events, this method is called each time the pointer is moved. For most cases, it is recommended to use the `onLayoutChanged` callback instead.",
			table: { category: 'Events', type: { summary: '(layout: Layout) => void' } },
		},
		onLayoutChanged: {
			control: false,
			description:
				"Called after the Group's layout has been changed. For layout changes caused by pointer events, this method is not called until the pointer has been released. This method is recommended when saving layouts to some storage api.",
			table: { category: 'Events', type: { summary: '(layout: Layout) => void' } },
		},
		disabled: {
			control: 'boolean',
			description: 'Disable resize functionality.',
			table: {
				category: 'Behavior',
				type: { summary: 'boolean' },
				defaultValue: { summary: 'false' },
			},
		},
		disableCursor: {
			control: 'boolean',
			description:
				'This library sets custom mouse cursor styles to indicate drag state. Use this prop to disable that behavior for Panels and Separators in this group.',
			table: {
				category: 'Behavior',
				type: { summary: 'boolean' },
				defaultValue: { summary: 'false' },
			},
		},
		resizeTargetMinimumSize: {
			control: false,
			description:
				'Minimum size of the resizable hit target area (either Separator or Panel edge). This threshold ensures are large enough to avoid mis-clicks.',
			table: { category: 'Behavior', type: { summary: '{ coarse: number; fine: number }' } },
		},
		groupRef: {
			control: false,
			description:
				'Exposes the following imperative API: getLayout(): Layout and setLayout(layout: Layout): void. The useGroupRef and useGroupCallbackRef hooks are exported for convenience use in TypeScript projects.',
			table: { category: 'Advanced', type: { summary: 'Ref<GroupImperativeHandle | null>' } },
		},
		style: {
			control: false,
			description:
				'CSS properties. ⚠️ The following styles cannot be overridden: display, flex-direction, flex-wrap, and overflow.',
			table: { category: 'Styling', type: { summary: 'CSSProperties' } },
		},
		id: {
			control: 'text',
			description:
				'Uniquely identifies this group within an application. Falls back to useId when not provided. This value will also be assigned to the data-group attribute.',
			table: { category: 'Accessibility', type: { summary: 'string' } },
		},
		className: {
			control: 'text',
			description: 'Additional CSS classes to apply to the panel group',
			table: { category: 'Styling', type: { summary: 'string' } },
		},
		children: {
			control: false,
			description: 'Panel and Separator components that comprise this group.',
			table: { category: 'Content', type: { summary: 'ReactNode' } },
		},
		testId: {
			control: 'text',
			description: 'The testId associated with the panel group for testing purposes.',
			table: { category: 'Testing', type: { summary: 'string' } },
		},
	},
};

export default meta;
type Story = StoryObj<typeof ResizablePanelGroup>;

export const Default: Story = {
	render: () => (
		<div className={`story-section ${styles.sectionContainer}`}>
			<div>
				<Typography size="lg" weight="semibold" className={styles.sectionTitle}>
					Horizontal Layout
				</Typography>
				<div className="story-resizable">
					<ResizablePanelGroup orientation="horizontal">
						<ResizablePanel defaultSize="25%" minSize="20%">
							<div className="story-center story-muted">
								<div className={styles.textCenter}>
									<FileText className={styles.iconMuted} />
									<Typography size="sm" weight="medium">
										File Explorer
									</Typography>
								</div>
							</div>
						</ResizablePanel>
						<ResizableHandle withHandle />
						<ResizablePanel defaultSize="50%">
							<div className="story-center">
								<div className={styles.textCenter}>
									<Code className={styles.iconMuted} />
									<Typography size="sm" weight="medium">
										Code Editor
									</Typography>
								</div>
							</div>
						</ResizablePanel>
						<ResizableHandle withHandle />
						<ResizablePanel defaultSize="25%" minSize="20%">
							<div className="story-center story-muted">
								<div className={styles.textCenter}>
									<Settings className={styles.iconMuted} />
									<Typography size="sm" weight="medium">
										Properties
									</Typography>
								</div>
							</div>
						</ResizablePanel>
					</ResizablePanelGroup>
				</div>
			</div>

			<div>
				<Typography size="lg" weight="semibold" className={styles.sectionTitle}>
					Vertical Layout
				</Typography>
				<div className="story-resizable">
					<ResizablePanelGroup orientation="vertical">
						<ResizablePanel defaultSize="70%">
							<div className="story-center">
								<div className={styles.textCenter}>
									<ChartBar className={styles.iconMuted} />
									<Typography size="sm" weight="medium">
										Main Dashboard
									</Typography>
								</div>
							</div>
						</ResizablePanel>
						<ResizableHandle withHandle />
						<ResizablePanel defaultSize="30%" minSize="25%">
							<div className="story-center story-muted">
								<div className={styles.textCenter}>
									<Terminal className={styles.iconMuted} />
									<Typography size="sm" weight="medium">
										Console Output
									</Typography>
								</div>
							</div>
						</ResizablePanel>
					</ResizablePanelGroup>
				</div>
			</div>
		</div>
	),
};

export const HorizontalLayout: Story = {
	render: () => (
		<div className={`story-section ${styles.sectionContainer}`}>
			<div>
				<Typography size="lg" weight="semibold" className={styles.sectionTitle}>
					Two Panel Layout
				</Typography>
				<div className={`story-resizable ${styles.resizableVerticalSmall}`}>
					<ResizablePanelGroup orientation="horizontal">
						<ResizablePanel defaultSize="30%" minSize="20%" maxSize="50%">
							<div className={styles.panelContent}>
								<Typography weight="medium" className={styles.panelTitle}>
									Sidebar
								</Typography>
								<Typography size="sm" color="muted">
									Navigation and tools
								</Typography>
							</div>
						</ResizablePanel>
						<ResizableHandle withHandle />
						<ResizablePanel defaultSize="70%">
							<div className={styles.panelContentMain}>
								<Typography weight="medium" className={styles.panelTitle}>
									Main Content
								</Typography>
								<Typography size="sm" color="muted">
									Primary workspace area
								</Typography>
							</div>
						</ResizablePanel>
					</ResizablePanelGroup>
				</div>
			</div>

			<div>
				<Typography size="lg" weight="semibold" className={styles.sectionTitle}>
					Three Panel Layout
				</Typography>
				<div className={`story-resizable ${styles.resizableVerticalSmall}`}>
					<ResizablePanelGroup orientation="horizontal">
						<ResizablePanel defaultSize="25%" minSize="15%" maxSize="40%">
							<div className={styles.panelContent}>
								<FileText className={`icon-md ${styles.iconMargin}`} />
								<Typography weight="medium" className={styles.panelTitle}>
									Explorer
								</Typography>
								<div className="story-section-sm">
									<Typography size="xs" color="muted">
										src/
									</Typography>
									<Typography size="xs" color="muted" className={styles.fileTreeIndent}>
										index.ts
									</Typography>
									<Typography size="xs" color="muted" className={styles.fileTreeIndent}>
										app.tsx
									</Typography>
								</div>
							</div>
						</ResizablePanel>
						<ResizableHandle withHandle />
						<ResizablePanel defaultSize="50%">
							<div className={styles.panelContentMain}>
								<Code className={`icon-md ${styles.iconMargin}`} />
								<Typography weight="medium" className={styles.panelTitle}>
									Editor
								</Typography>
								<div className={styles.editorContent}>
									<div>function App() {'{'}</div>
									<div className={styles.codeIndent}>return &lt;h1&gt;Hello World&lt;/h1&gt;;</div>
									<div>{'}'}</div>
								</div>
							</div>
						</ResizablePanel>
						<ResizableHandle withHandle />
						<ResizablePanel defaultSize="25%" minSize="20%" maxSize="40%">
							<div className={styles.panelContent}>
								<Settings className={`icon-md ${styles.iconMargin}`} />
								<Typography weight="medium" className={styles.panelTitle}>
									Properties
								</Typography>
								<div className="story-section-sm">
									<Typography size="xs" color="muted">
										Type: Component
									</Typography>
									<Typography size="xs" color="muted">
										Props: 3
									</Typography>
									<Typography size="xs" color="muted">
										State: Active
									</Typography>
								</div>
							</div>
						</ResizablePanel>
					</ResizablePanelGroup>
				</div>
			</div>

			<div>
				<Typography size="lg" weight="semibold" className={styles.sectionTitle}>
					Dashboard Layout
				</Typography>
				<div className={`story-resizable ${styles.resizableVerticalSmall}`}>
					<ResizablePanelGroup orientation="horizontal">
						<ResizablePanel defaultSize="20%" minSize="15%" maxSize="30%">
							<div className={styles.panelContent}>
								<ChartBar className={`icon-md ${styles.iconMargin}`} />
								<Typography weight="medium" className={styles.panelTitle}>
									Metrics
								</Typography>
								<div className="story-section-sm">
									<Typography size="xs" color="muted">
										CPU: 45%
									</Typography>
									<Typography size="xs" color="muted">
										Memory: 2.1GB
									</Typography>
									<Typography size="xs" color="muted">
										Disk: 67%
									</Typography>
								</div>
							</div>
						</ResizablePanel>
						<ResizableHandle />
						<ResizablePanel defaultSize="60%">
							<div className="story-center">
								<div className={styles.textCenter}>
									<div className={styles.chartPlaceholder}>
										<span className={styles.chartText}>CHART</span>
									</div>
									<Typography size="sm" weight="medium">
										Performance Graph
									</Typography>
								</div>
							</div>
						</ResizablePanel>
						<ResizableHandle />
						<ResizablePanel defaultSize="20%" minSize="15%" maxSize="30%">
							<div className={styles.panelContent}>
								<Database className={`icon-md ${styles.iconMargin}`} />
								<Typography weight="medium" className={styles.panelTitle}>
									Status
								</Typography>
								<div className="story-section-sm">
									<Typography size="xs" color="muted">
										API Online
									</Typography>
									<Typography size="xs" color="muted">
										DB Connected
									</Typography>
									<Typography size="xs" color="muted">
										Cache Warming
									</Typography>
								</div>
							</div>
						</ResizablePanel>
					</ResizablePanelGroup>
				</div>
			</div>
		</div>
	),
};

export const VerticalLayout: Story = {
	render: () => (
		<div className={`story-section ${styles.sectionContainer}`}>
			<div>
				<Typography size="lg" weight="semibold" className={styles.sectionTitle}>
					Application Layout
				</Typography>
				<div className={`story-resizable ${styles.resizableVertical}`}>
					<ResizablePanelGroup orientation="vertical">
						<ResizablePanel defaultSize="15%" minSize="10%" maxSize="25%">
							<div className={styles.navBar}>
								<Typography weight="medium">Navigation Bar</Typography>
								<div className="story-row">
									<div className={`${styles.statusDot} ${styles.statusGreen}`}></div>
									<div className={`${styles.statusDot} ${styles.statusYellow}`}></div>
									<div className={`${styles.statusDot} ${styles.statusRed}`}></div>
								</div>
							</div>
						</ResizablePanel>
						<ResizableHandle withHandle />
						<ResizablePanel defaultSize="65%">
							<div className={styles.mainContent}>
								<Typography weight="medium" className={styles.contentTitle}>
									Main Content Area
								</Typography>
								<div className={styles.gradientContent}>
									<Typography size="lg" color="muted">
										Primary workspace content
									</Typography>
								</div>
							</div>
						</ResizablePanel>
						<ResizableHandle withHandle />
						<ResizablePanel defaultSize="20%" minSize="15%" maxSize="30%">
							<div className={styles.footerContent}>
								<Terminal className={`icon-md ${styles.iconMargin}`} />
								<Typography weight="medium" className={styles.chatTitle}>
									Footer / Status Bar
								</Typography>
								<div className="story-section-sm">
									<Typography size="xs" color="muted">
										Ready - Line 42, Col 12
									</Typography>
									<Typography size="xs" color="muted">
										UTF-8 - TypeScript - Git:main
									</Typography>
								</div>
							</div>
						</ResizablePanel>
					</ResizablePanelGroup>
				</div>
			</div>

			<div>
				<Typography size="lg" weight="semibold" className={styles.sectionTitle}>
					Chat Interface
				</Typography>
				<div className="story-resizable">
					<ResizablePanelGroup orientation="vertical">
						<ResizablePanel defaultSize="75%">
							<div className={styles.panelContentMain}>
								<Typography weight="medium" className={styles.chatTitle}>
									Messages
								</Typography>
								<div className={styles.messagesContainer}>
									<div className={styles.messageLeft}>
										<div className={styles.messageBubble}>
											<Typography size="sm">Hello! How can I help you today?</Typography>
										</div>
									</div>
									<div className={styles.messageRight}>
										<div className={styles.messageBubblePrimary}>
											<Typography size="sm">I need help with the resizable panels.</Typography>
										</div>
									</div>
									<div className={styles.messageLeft}>
										<div className={styles.messageBubble}>
											<Typography size="sm">
												Sure! You can drag the handles to resize panels.
											</Typography>
										</div>
									</div>
								</div>
							</div>
						</ResizablePanel>
						<ResizableHandle withHandle />
						<ResizablePanel defaultSize="25%" minSize="20%" maxSize="40%">
							<div className={styles.inputAreaContent}>
								<Typography weight="medium" className={styles.chatTitle}>
									Input Area
								</Typography>
								<div className={styles.inputContainer}>
									<div className={styles.inputField}>
										<Typography size="sm" color="muted">
											Type your message...
										</Typography>
									</div>
									<div className={styles.sendButtonContainer}>
										<button type="button" className={styles.sendButton}>
											Send
										</button>
									</div>
								</div>
							</div>
						</ResizablePanel>
					</ResizablePanelGroup>
				</div>
			</div>

			<div>
				<Typography size="lg" weight="semibold" className={styles.sectionTitle}>
					Development Environment
				</Typography>
				<div className="story-resizable">
					<ResizablePanelGroup orientation="vertical">
						<ResizablePanel defaultSize="60%">
							<div className={styles.panelContentMain}>
								<div className={`story-row ${styles.chatTitle}`}>
									<Code className={`icon-md ${styles.iconMutedForeground}`} />
									<Typography weight="medium">Code Editor</Typography>
									<span className={styles.codeTag}>main.tsx</span>
								</div>
								<div className={styles.editorContentLarge}>
									<div className={styles.codeLineNumber}>1</div>
									<div className={styles.codeLineNumber}>2</div>
									<div className={styles.codeLineNumber}>3</div>
									<div className={styles.codeLineNumber}>4</div>
									<div className={styles.codeLineNumber}>5</div>
								</div>
							</div>
						</ResizablePanel>
						<ResizableHandle withHandle />
						<ResizablePanel defaultSize="25%" minSize="20%">
							<div className={styles.panelContent}>
								<div className={`story-row ${styles.chatTitle}`}>
									<Terminal className={`icon-md ${styles.iconMutedForeground}`} />
									<Typography weight="medium">Terminal</Typography>
								</div>
								<div className={styles.editorContent}>
									<div>$ npm run dev</div>
									<div className={styles.terminalOutput}>
										Server running on http://localhost:3000
									</div>
									<div className={styles.cursorBlink}>|</div>
								</div>
							</div>
						</ResizablePanel>
						<ResizableHandle withHandle />
						<ResizablePanel defaultSize="15%" minSize="10%" maxSize="25%">
							<div className={styles.statusBar}>
								<Typography size="xs" color="muted">
									Problems: 0 - Warnings: 2 - Info: 5
								</Typography>
								<Typography size="xs" color="muted">
									Ln 42, Col 12
								</Typography>
							</div>
						</ResizablePanel>
					</ResizablePanelGroup>
				</div>
			</div>
		</div>
	),
};

export const CollapsiblePanels: Story = {
	render: () => (
		<div className={`story-section ${styles.sectionContainer}`}>
			<div>
				<Typography size="lg" weight="semibold" className={styles.sectionTitle}>
					Collapsible Sidebar
				</Typography>
				<div className="story-resizable">
					<ResizablePanelGroup orientation="horizontal">
						<ResizablePanel defaultSize="25%" minSize="15%" maxSize="40%" collapsible={true}>
							<div className={styles.panelContent}>
								<div className={`story-row ${styles.contentTitle}`}>
									<FileText className={`icon-md ${styles.iconMutedForeground}`} />
									<Typography weight="medium">File Explorer</Typography>
								</div>
								<div className="story-section-sm">
									<Typography size="xs" color="muted">
										src/
									</Typography>
									<Typography size="xs" color="muted" className={styles.fileIndent}>
										App.tsx
									</Typography>
									<Typography size="xs" color="muted" className={styles.fileIndent}>
										index.ts
									</Typography>
									<Typography size="xs" color="muted">
										components/
									</Typography>
									<Typography size="xs" color="muted" className={styles.fileIndent}>
										Button.tsx
									</Typography>
								</div>
							</div>
						</ResizablePanel>
						<ResizableHandle withHandle />
						<ResizablePanel defaultSize="75%">
							<div className={styles.mainContent}>
								<Typography weight="medium" className={styles.contentTitle}>
									Code Editor
								</Typography>
								<div className={styles.editorContentLarge}>
									<div>import React from &apos;react&apos;;</div>
									<div></div>
									<div>function App() {'{'}</div>
									<div className={styles.fileIndent}>return &lt;div&gt;Hello World&lt;/div&gt;</div>
									<div>{'}'}</div>
									<div></div>
									<div>export default App;</div>
								</div>
								<Typography size="sm" color="muted" className={styles.infoSubtitle}>
									Try dragging the left panel all the way to collapse it!
								</Typography>
							</div>
						</ResizablePanel>
					</ResizablePanelGroup>
				</div>
			</div>

			<div>
				<Typography size="lg" weight="semibold" className={styles.sectionTitle}>
					Collapsible Bottom Panel
				</Typography>
				<div className="story-resizable">
					<ResizablePanelGroup orientation="vertical">
						<ResizablePanel defaultSize="70%">
							<div className={styles.mainContent}>
								<Typography weight="medium" className={styles.contentTitle}>
									Main Workspace
								</Typography>
								<div className={styles.gradientBlue}>
									<div className={styles.textCenter}>
										<ChartBar className={styles.iconLgBlue} />
										<Typography size="lg" weight="medium">
											Dashboard Content
										</Typography>
									</div>
								</div>
							</div>
						</ResizablePanel>
						<ResizableHandle withHandle />
						<ResizablePanel defaultSize="30%" minSize="20%" maxSize="50%" collapsible={true}>
							<div className={styles.panelContent}>
								<div className={`story-row ${styles.chatTitle}`}>
									<Terminal className={`icon-md ${styles.iconMutedForeground}`} />
									<Typography weight="medium">Console</Typography>
								</div>
								<div className={styles.editorContent}>
									<div>$ npm run dev</div>
									<div className={styles.terminalOutput}>Local server running</div>
									<div className={styles.terminalWarning}>2 warnings found</div>
									<div className={styles.terminalHint}>Watching for changes...</div>
									<div className={styles.cursorBlink}>|</div>
								</div>
								<Typography size="xs" color="muted" className={styles.infoSubtitle}>
									Drag this panel down to collapse it
								</Typography>
							</div>
						</ResizablePanel>
					</ResizablePanelGroup>
				</div>
			</div>

			<div>
				<Typography size="lg" weight="semibold" className={styles.sectionTitle}>
					Multiple Collapsible Panels
				</Typography>
				<div className="story-resizable">
					<ResizablePanelGroup orientation="horizontal">
						<ResizablePanel defaultSize="20%" minSize="15%" maxSize="35%" collapsible={true}>
							<div className={styles.panelContent}>
								<div className={`story-row ${styles.chatTitle}`}>
									<Settings className={`icon-md ${styles.iconMutedForeground}`} />
									<Typography weight="medium">Tools</Typography>
								</div>
								<div className="story-section-sm">
									<Typography size="sm" color="muted">
										Settings
									</Typography>
									<Typography size="sm" color="muted">
										Analytics
									</Typography>
									<Typography size="sm" color="muted">
										Themes
									</Typography>
									<Typography size="sm" color="muted">
										Plugins
									</Typography>
								</div>
							</div>
						</ResizablePanel>
						<ResizableHandle withHandle />
						<ResizablePanel defaultSize="60%">
							<div className={`story-center ${styles.gradientBlueConfig}`}>
								<div className={styles.textCenter}>
									<Code className={styles.iconLarge} />
									<Typography size="lg" weight="medium">
										Main Editor
									</Typography>
									<Typography size="sm" color="muted" className={styles.infoSubtitle}>
										Both side panels can be collapsed
									</Typography>
								</div>
							</div>
						</ResizablePanel>
						<ResizableHandle withHandle />
						<ResizablePanel defaultSize="20%" minSize="15%" maxSize="35%" collapsible={true}>
							<div className={styles.panelContent}>
								<div className={`story-row ${styles.chatTitle}`}>
									<Database className={`icon-md ${styles.iconMutedForeground}`} />
									<Typography weight="medium">Inspector</Typography>
								</div>
								<div className="story-section-sm">
									<Typography size="sm" color="muted">
										Properties
									</Typography>
									<Typography size="sm" color="muted">
										Details
									</Typography>
									<Typography size="sm" color="muted">
										Metadata
									</Typography>
									<Typography size="sm" color="muted">
										Relations
									</Typography>
								</div>
							</div>
						</ResizablePanel>
					</ResizablePanelGroup>
				</div>
			</div>
		</div>
	),
};

export const PanelGroupPlayground: Story = {
	parameters: {
		controls: { disable: false },
	},
	args: {
		orientation: 'horizontal',
	},
	argTypes: {
		orientation: {
			control: 'select',
			options: ['horizontal', 'vertical'],
			description: 'Layout orientation of the panel group',
		},
	},
	render: (args) => (
		<div className={styles.sectionContainer}>
			<Typography size="lg" weight="semibold" className={styles.sectionTitle}>
				Interactive Panel Group
			</Typography>
			<div className="story-resizable">
				<ResizablePanelGroup {...args}>
					<ResizablePanel defaultSize="25%" minSize="20%">
						<div className="story-center story-muted">
							<div className={styles.textCenter}>
								<FileText className={styles.iconMd} />
								<Typography size="sm" weight="medium">
									Panel 1
								</Typography>
								<Typography size="xs" color="muted" className={styles.panelSubtitle}>
									25% default size
								</Typography>
							</div>
						</div>
					</ResizablePanel>
					<ResizableHandle withHandle />
					<ResizablePanel defaultSize="50%">
						<div className="story-center">
							<div className={styles.textCenter}>
								<Code className={styles.iconMd} />
								<Typography size="sm" weight="medium">
									Panel 2
								</Typography>
								<Typography size="xs" color="muted" className={styles.panelSubtitle}>
									50% default size
								</Typography>
							</div>
						</div>
					</ResizablePanel>
					<ResizableHandle withHandle />
					<ResizablePanel defaultSize="25%">
						<div className="story-center story-muted">
							<div className={styles.textCenter}>
								<Settings className={styles.iconMd} />
								<Typography size="sm" weight="medium">
									Panel 3
								</Typography>
								<Typography size="xs" color="muted" className={styles.panelSubtitle}>
									25% default size
								</Typography>
							</div>
						</div>
					</ResizablePanel>
				</ResizablePanelGroup>
			</div>
			<div className={`story-panel ${styles.instructionPanel}`}>
				<Typography weight="medium" className={styles.panelTitle}>
					Instructions:
				</Typography>
				<ul className="story-section-sm">
					<li>
						<Typography size="sm" color="muted">
							Change the orientation to see horizontal vs vertical layouts
						</Typography>
					</li>
					<li>
						<Typography size="sm" color="muted">
							Use useDefaultLayout with groupId for persistent layouts (see Persistent Layout story)
						</Typography>
					</li>
					<li>
						<Typography size="sm" color="muted">
							Drag the resize handles to adjust panel sizes
						</Typography>
					</li>
				</ul>
			</div>
		</div>
	),
};

export const PanelPlayground: Story = {
	parameters: {
		controls: { disable: false },
	},
	args: {},
	argTypes: {},
	render: () => (
		<div className={styles.sectionContainer}>
			<Typography size="lg" weight="semibold" className={styles.sectionTitle}>
				Interactive Panel Properties
			</Typography>
			<div className="story-resizable">
				<ResizablePanelGroup orientation="horizontal">
					<ResizablePanel defaultSize="30%" minSize="20%" maxSize="60%" collapsible={false}>
						<div className={`story-center ${styles.gradientBlueConfig}`}>
							<div className={styles.textCenter}>
								<ChartBar className={styles.iconMdBlue} />
								<Typography size="sm" weight="medium">
									Configurable Panel
								</Typography>
								<div className={`story-section-sm ${styles.infoSubtitle}`}>
									<Typography size="xs" color="muted">
										Default: 30%
									</Typography>
									<Typography size="xs" color="muted">
										Min: 20%
									</Typography>
									<Typography size="xs" color="muted">
										Max: 60%
									</Typography>
									<Typography size="xs" color="muted">
										Collapsible: No
									</Typography>
								</div>
							</div>
						</div>
					</ResizablePanel>
					<ResizableHandle withHandle />
					<ResizablePanel defaultSize="70%">
						<div className="story-center">
							<div className={styles.textCenter}>
								<Code className={styles.iconMd} />
								<Typography size="sm" weight="medium">
									Fixed Panel
								</Typography>
								<Typography size="xs" color="muted" className={styles.panelSubtitle}>
									Responds to left panel changes
								</Typography>
							</div>
						</div>
					</ResizablePanel>
				</ResizablePanelGroup>
			</div>
			<div className={`story-panel ${styles.instructionPanel}`}>
				<Typography weight="medium" className={styles.panelTitle}>
					Try these interactions:
				</Typography>
				<ul className="story-section-sm">
					<li>
						<Typography size="sm" color="muted">
							Adjust the sliders to see how constraints affect resizing
						</Typography>
					</li>
					<li>
						<Typography size="sm" color="muted">
							Enable collapsible and try dragging the panel to minimum size
						</Typography>
					</li>
					<li>
						<Typography size="sm" color="muted">
							Notice how minSize and maxSize limit the resize range
						</Typography>
					</li>
				</ul>
			</div>
		</div>
	),
};

export const ResizeHandlePlayground: Story = {
	parameters: {
		controls: { disable: false },
	},
	args: {},
	argTypes: {},
	render: () => (
		<div className={styles.sectionContainer}>
			<Typography size="lg" weight="semibold" className={styles.sectionTitle}>
				Interactive Resize Handle
			</Typography>
			<div className="story-resizable">
				<ResizablePanelGroup orientation="horizontal">
					<ResizablePanel defaultSize="40%">
						<div className="story-center story-muted">
							<div className={styles.textCenter}>
								<FileText className={styles.iconMd} />
								<Typography size="sm" weight="medium">
									Left Panel
								</Typography>
								<Typography size="xs" color="muted" className={styles.panelSubtitle}>
									Drag the handle to resize
								</Typography>
							</div>
						</div>
					</ResizablePanel>
					<ResizableHandle withHandle={true} disabled={false} />
					<ResizablePanel defaultSize="60%">
						<div className="story-center">
							<div className={styles.textCenter}>
								<Settings className={styles.iconMd} />
								<Typography size="sm" weight="medium">
									Right Panel
								</Typography>
								<div className={`story-section-sm ${styles.infoSubtitle}`}>
									<Typography size="xs" color="muted">
										Handle visible: Yes
									</Typography>
									<Typography size="xs" color="muted">
										Disabled: No
									</Typography>
								</div>
							</div>
						</div>
					</ResizablePanel>
				</ResizablePanelGroup>
			</div>
			<div className={`story-panel ${styles.instructionPanel}`}>
				<Typography weight="medium" className={styles.panelTitle}>
					Handle Options:
				</Typography>
				<ul className="story-section-sm">
					<li>
						<Typography size="sm" color="muted">
							<strong>withHandle:</strong> Shows/hides the visual drag indicator
						</Typography>
					</li>
					<li>
						<Typography size="sm" color="muted">
							<strong>disabled:</strong> Prevents resizing when enabled
						</Typography>
					</li>
					<li>
						<Typography size="sm" color="muted">
							Handle is still functional even when visual indicator is hidden
						</Typography>
					</li>
				</ul>
			</div>
		</div>
	),
};

function PersistentLayoutContent({ groupId }: { groupId: string }) {
	const { defaultLayout, onLayoutChange } = useDefaultLayout({
		groupId: groupId || 'demo-layout',
		storage: typeof localStorage !== 'undefined' ? localStorage : undefined,
	});
	return (
		<div className={styles.sectionContainer}>
			<Typography size="lg" weight="semibold" className={styles.sectionTitle}>
				Persistent Layout Demo
			</Typography>
			<div className="story-resizable">
				<ResizablePanelGroup
					orientation="horizontal"
					defaultLayout={defaultLayout}
					onLayoutChange={onLayoutChange}
				>
					<ResizablePanel defaultSize="25%" collapsible>
						<div className={styles.panelContent}>
							<div className={`story-row ${styles.chatTitle}`}>
								<Database className={`icon-md ${styles.iconMutedForeground}`} />
								<Typography weight="medium">Persistent Sidebar</Typography>
							</div>
							<div className="story-section-sm">
								<Typography size="xs" color="muted">
									This layout persists!
								</Typography>
								<Typography size="xs" color="muted">
									Resize panels and refresh the page
								</Typography>
								<Typography size="xs" color="muted">
									Your layout will be restored
								</Typography>
							</div>
						</div>
					</ResizablePanel>
					<ResizableHandle withHandle />
					<ResizablePanel defaultSize="50%">
						<div className={styles.persistentMainContent}>
							<Typography weight="medium" className={styles.chatTitle}>
								Main Content
							</Typography>
							<div className={styles.gradientGreen}>
								<div className={styles.textCenter}>
									<Code className={styles.iconLgGreen} />
									<Typography weight="medium">Layout Memory</Typography>
									<Typography size="sm" color="muted" className={styles.infoSubtitle}>
										groupId: &quot;{groupId || 'demo-layout'}&quot;
									</Typography>
								</div>
							</div>
						</div>
					</ResizablePanel>
					<ResizableHandle withHandle />
					<ResizablePanel defaultSize="25%" collapsible>
						<div className={styles.panelContent}>
							<div className={`story-row ${styles.chatTitle}`}>
								<Settings className={`icon-md ${styles.iconMutedForeground}`} />
								<Typography weight="medium">Properties Panel</Typography>
							</div>
							<div className="story-section-sm">
								<Typography size="xs" color="muted">
									Change the groupId to create different saved layouts
								</Typography>
								<Typography size="xs" color="muted">
									Each ID maintains its own layout state
								</Typography>
							</div>
						</div>
					</ResizablePanel>
				</ResizablePanelGroup>
			</div>
			<div className={`story-panel ${styles.instructionPanel}`}>
				<Typography weight="medium" className={styles.panelTitle}>
					Persistence Features:
				</Typography>
				<ul className="story-section-sm">
					<li>
						<Typography size="sm" color="muted">
							Layout automatically saved to localStorage (useDefaultLayout)
						</Typography>
					</li>
					<li>
						<Typography size="sm" color="muted">
							Restore layout on page refresh or revisit
						</Typography>
					</li>
					<li>
						<Typography size="sm" color="muted">
							Different groupId values create separate saved layouts
						</Typography>
					</li>
					<li>
						<Typography size="sm" color="muted">
							Try resizing panels, then refresh the page to see persistence in action
						</Typography>
					</li>
				</ul>
			</div>
		</div>
	);
}

export const PersistentLayout: StoryObj<typeof PersistentLayoutContent> = {
	parameters: {
		controls: { disable: false },
	},
	args: {
		groupId: 'demo-layout',
	},
	argTypes: {
		groupId: {
			control: 'text',
			description: 'Unique ID for saving layout to localStorage (useDefaultLayout)',
		},
	},
	render: (args) => <PersistentLayoutContent groupId={args.groupId} />,
};
