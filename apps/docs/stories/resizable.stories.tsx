import { ChartBar, Code, Database, FileText, Settings, Terminal } from '@signozhq/icons';
import {
	ResizableHandle,
	ResizablePanel,
	ResizablePanelGroup,
	useDefaultLayout,
} from '@signozhq/ui';
import type { Meta, StoryObj } from '@storybook/react-vite';

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
		<div
			style={{
				display: 'flex',
				flexDirection: 'column',
				gap: '2rem',
				padding: '1.5rem',
				backgroundColor: 'var(--background)',
			}}
		>
			<div>
				<h2
					style={{
						fontSize: '1.125rem',
						fontWeight: 600,
						marginBottom: '1rem',
						color: 'var(--foreground)',
					}}
				>
					Horizontal Layout
				</h2>
				<div
					style={{
						height: '400px',
						border: '1px solid var(--border)',
						borderRadius: '0.5rem',
						overflow: 'hidden',
					}}
				>
					<ResizablePanelGroup orientation="horizontal">
						<ResizablePanel defaultSize="25%" minSize="20%">
							<div
								style={{
									display: 'flex',
									height: '100%',
									alignItems: 'center',
									justifyContent: 'center',
									backgroundColor: 'var(--muted)',
								}}
							>
								<div style={{ textAlign: 'center' }}>
									<FileText
										size={32}
										style={{
											marginLeft: 'auto',
											marginRight: 'auto',
											display: 'block',
											marginBottom: '0.5rem',
											color: 'var(--muted-foreground)',
										}}
									/>
									<span style={{ fontSize: '0.875rem', fontWeight: 500 }}>File Explorer</span>
								</div>
							</div>
						</ResizablePanel>
						<ResizableHandle withHandle />
						<ResizablePanel defaultSize="50%">
							<div
								style={{
									display: 'flex',
									height: '100%',
									alignItems: 'center',
									justifyContent: 'center',
								}}
							>
								<div style={{ textAlign: 'center' }}>
									<Code
										size={32}
										style={{
											marginLeft: 'auto',
											marginRight: 'auto',
											display: 'block',
											marginBottom: '0.5rem',
											color: 'var(--muted-foreground)',
										}}
									/>
									<span style={{ fontSize: '0.875rem', fontWeight: 500 }}>Code Editor</span>
								</div>
							</div>
						</ResizablePanel>
						<ResizableHandle withHandle />
						<ResizablePanel defaultSize="25%" minSize="20%">
							<div
								style={{
									display: 'flex',
									height: '100%',
									alignItems: 'center',
									justifyContent: 'center',
									backgroundColor: 'var(--muted)',
								}}
							>
								<div style={{ textAlign: 'center' }}>
									<Settings
										size={32}
										style={{
											marginLeft: 'auto',
											marginRight: 'auto',
											display: 'block',
											marginBottom: '0.5rem',
											color: 'var(--muted-foreground)',
										}}
									/>
									<span style={{ fontSize: '0.875rem', fontWeight: 500 }}>Properties</span>
								</div>
							</div>
						</ResizablePanel>
					</ResizablePanelGroup>
				</div>
			</div>

			<div>
				<h2
					style={{
						fontSize: '1.125rem',
						fontWeight: 600,
						marginBottom: '1rem',
						color: 'var(--foreground)',
					}}
				>
					Vertical Layout
				</h2>
				<div
					style={{
						height: '400px',
						border: '1px solid var(--border)',
						borderRadius: '0.5rem',
						overflow: 'hidden',
					}}
				>
					<ResizablePanelGroup orientation="vertical">
						<ResizablePanel defaultSize="70%">
							<div
								style={{
									display: 'flex',
									height: '100%',
									alignItems: 'center',
									justifyContent: 'center',
								}}
							>
								<div style={{ textAlign: 'center' }}>
									<ChartBar
										size={32}
										style={{
											marginLeft: 'auto',
											marginRight: 'auto',
											display: 'block',
											marginBottom: '0.5rem',
											color: 'var(--muted-foreground)',
										}}
									/>
									<span style={{ fontSize: '0.875rem', fontWeight: 500 }}>Main Dashboard</span>
								</div>
							</div>
						</ResizablePanel>
						<ResizableHandle withHandle />
						<ResizablePanel defaultSize="30%" minSize="25%">
							<div
								style={{
									display: 'flex',
									height: '100%',
									alignItems: 'center',
									justifyContent: 'center',
									backgroundColor: 'var(--muted)',
								}}
							>
								<div style={{ textAlign: 'center' }}>
									<Terminal
										size={32}
										style={{
											marginLeft: 'auto',
											marginRight: 'auto',
											display: 'block',
											marginBottom: '0.5rem',
											color: 'var(--muted-foreground)',
										}}
									/>
									<span style={{ fontSize: '0.875rem', fontWeight: 500 }}>Console Output</span>
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
		<div
			style={{
				display: 'flex',
				flexDirection: 'column',
				gap: '1.5rem',
				padding: '1.5rem',
				backgroundColor: 'var(--background)',
			}}
		>
			<div>
				<h2
					style={{
						fontSize: '1.125rem',
						fontWeight: 600,
						marginBottom: '1rem',
						color: 'var(--foreground)',
					}}
				>
					Two Panel Layout
				</h2>
				<div
					style={{
						height: '300px',
						border: '1px solid var(--border)',
						borderRadius: '0.5rem',
						overflow: 'hidden',
					}}
				>
					<ResizablePanelGroup orientation="horizontal">
						<ResizablePanel defaultSize="30%" minSize="20%" maxSize="50%">
							<div
								style={{
									display: 'flex',
									height: '100%',
									flexDirection: 'column',
									padding: '1rem',
									backgroundColor: 'var(--muted)',
								}}
							>
								<h3 style={{ fontWeight: 500, marginBottom: '0.5rem' }}>Sidebar</h3>
								<p style={{ fontSize: '0.875rem', color: 'var(--muted-foreground)' }}>
									Navigation and tools
								</p>
							</div>
						</ResizablePanel>
						<ResizableHandle withHandle />
						<ResizablePanel defaultSize="70%">
							<div
								style={{
									display: 'flex',
									height: '100%',
									flexDirection: 'column',
									padding: '1rem',
								}}
							>
								<h3 style={{ fontWeight: 500, marginBottom: '0.5rem' }}>Main Content</h3>
								<p style={{ fontSize: '0.875rem', color: 'var(--muted-foreground)' }}>
									Primary workspace area
								</p>
							</div>
						</ResizablePanel>
					</ResizablePanelGroup>
				</div>
			</div>

			<div>
				<h2
					style={{
						fontSize: '1.125rem',
						fontWeight: 600,
						marginBottom: '1rem',
						color: 'var(--foreground)',
					}}
				>
					Three Panel Layout
				</h2>
				<div
					style={{
						height: '300px',
						border: '1px solid var(--border)',
						borderRadius: '0.5rem',
						overflow: 'hidden',
					}}
				>
					<ResizablePanelGroup orientation="horizontal">
						<ResizablePanel defaultSize="25%" minSize="15%" maxSize="40%">
							<div
								style={{
									display: 'flex',
									height: '100%',
									flexDirection: 'column',
									padding: '1rem',
									backgroundColor: 'var(--muted)',
								}}
							>
								<FileText
									size={20}
									style={{ marginBottom: '0.5rem', color: 'var(--muted-foreground)' }}
								/>
								<h3 style={{ fontWeight: 500, marginBottom: '0.5rem' }}>Explorer</h3>
								<div
									style={{
										fontSize: '0.75rem',
										color: 'var(--muted-foreground)',
										display: 'flex',
										flexDirection: 'column',
										gap: '0.25rem',
									}}
								>
									<div>📁 src/</div>
									<div style={{ marginLeft: '0.75rem' }}>📄 index.ts</div>
									<div style={{ marginLeft: '0.75rem' }}>📄 app.tsx</div>
								</div>
							</div>
						</ResizablePanel>
						<ResizableHandle withHandle />
						<ResizablePanel defaultSize="50%">
							<div
								style={{
									display: 'flex',
									height: '100%',
									flexDirection: 'column',
									padding: '1rem',
								}}
							>
								<Code
									size={20}
									style={{ marginBottom: '0.5rem', color: 'var(--muted-foreground)' }}
								/>
								<h3 style={{ fontWeight: 500, marginBottom: '0.5rem' }}>Editor</h3>
								<div
									style={{
										flex: '1 1 0%',
										backgroundColor: 'var(--bg-slate-950)',
										borderRadius: '0.25rem',
										padding: '0.75rem',
										fontFamily: 'monospace',
										fontSize: '0.75rem',
										color: '#4ade80',
									}}
								>
									<div>function App() {'{'}</div>
									<div style={{ marginLeft: '0.5rem' }}>
										return &lt;h1&gt;Hello World&lt;/h1&gt;;
									</div>
									<div>{'}'}</div>
								</div>
							</div>
						</ResizablePanel>
						<ResizableHandle withHandle />
						<ResizablePanel defaultSize="25%" minSize="20%" maxSize="40%">
							<div
								style={{
									display: 'flex',
									height: '100%',
									flexDirection: 'column',
									padding: '1rem',
									backgroundColor: 'var(--muted)',
								}}
							>
								<Settings
									size={20}
									style={{ marginBottom: '0.5rem', color: 'var(--muted-foreground)' }}
								/>
								<h3 style={{ fontWeight: 500, marginBottom: '0.5rem' }}>Properties</h3>
								<div
									style={{
										fontSize: '0.75rem',
										color: 'var(--muted-foreground)',
										display: 'flex',
										flexDirection: 'column',
										gap: '0.5rem',
									}}
								>
									<div>Type: Component</div>
									<div>Props: 3</div>
									<div>State: Active</div>
								</div>
							</div>
						</ResizablePanel>
					</ResizablePanelGroup>
				</div>
			</div>

			<div>
				<h2
					style={{
						fontSize: '1.125rem',
						fontWeight: 600,
						marginBottom: '1rem',
						color: 'var(--foreground)',
					}}
				>
					Dashboard Layout
				</h2>
				<div
					style={{
						height: '300px',
						border: '1px solid var(--border)',
						borderRadius: '0.5rem',
						overflow: 'hidden',
					}}
				>
					<ResizablePanelGroup orientation="horizontal">
						<ResizablePanel defaultSize="20%" minSize="15%" maxSize="30%">
							<div
								style={{
									display: 'flex',
									height: '100%',
									flexDirection: 'column',
									padding: '1rem',
									backgroundColor: 'var(--muted)',
								}}
							>
								<ChartBar
									size={20}
									style={{ marginBottom: '0.5rem', color: 'var(--muted-foreground)' }}
								/>
								<h3 style={{ fontWeight: 500, marginBottom: '0.5rem' }}>Metrics</h3>
								<div
									style={{
										fontSize: '0.75rem',
										color: 'var(--muted-foreground)',
										display: 'flex',
										flexDirection: 'column',
										gap: '0.25rem',
									}}
								>
									<div>CPU: 45%</div>
									<div>Memory: 2.1GB</div>
									<div>Disk: 67%</div>
								</div>
							</div>
						</ResizablePanel>
						<ResizableHandle />
						<ResizablePanel defaultSize="60%">
							<div
								style={{
									display: 'flex',
									height: '100%',
									alignItems: 'center',
									justifyContent: 'center',
								}}
							>
								<div style={{ textAlign: 'center' }}>
									<div
										style={{
											height: '8rem',
											width: '8rem',
											marginLeft: 'auto',
											marginRight: 'auto',
											marginBottom: '1rem',
											borderRadius: '0.5rem',
											display: 'flex',
											alignItems: 'center',
											justifyContent: 'center',
											backgroundImage: 'linear-gradient(to bottom right, #60a5fa, #a855f7)',
										}}
									>
										<span style={{ color: '#ffffff', fontWeight: 700 }}>CHART</span>
									</div>
									<span style={{ fontSize: '0.875rem', fontWeight: 500 }}>Performance Graph</span>
								</div>
							</div>
						</ResizablePanel>
						<ResizableHandle />
						<ResizablePanel defaultSize="20%" minSize="15%" maxSize="30%">
							<div
								style={{
									display: 'flex',
									height: '100%',
									flexDirection: 'column',
									padding: '1rem',
									backgroundColor: 'var(--muted)',
								}}
							>
								<Database
									size={20}
									style={{ marginBottom: '0.5rem', color: 'var(--muted-foreground)' }}
								/>
								<h3 style={{ fontWeight: 500, marginBottom: '0.5rem' }}>Status</h3>
								<div
									style={{
										fontSize: '0.75rem',
										color: 'var(--muted-foreground)',
										display: 'flex',
										flexDirection: 'column',
										gap: '0.25rem',
									}}
								>
									<div>🟢 API Online</div>
									<div>🟢 DB Connected</div>
									<div>🟡 Cache Warming</div>
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
		<div
			style={{
				display: 'flex',
				flexDirection: 'column',
				gap: '1.5rem',
				padding: '1.5rem',
				backgroundColor: 'var(--background)',
			}}
		>
			<div>
				<h2
					style={{
						fontSize: '1.125rem',
						fontWeight: 600,
						marginBottom: '1rem',
						color: 'var(--foreground)',
					}}
				>
					Application Layout
				</h2>
				<div
					style={{
						height: '500px',
						border: '1px solid var(--border)',
						borderRadius: '0.5rem',
						overflow: 'hidden',
					}}
				>
					<ResizablePanelGroup orientation="vertical">
						<ResizablePanel defaultSize="15%" minSize="10%" maxSize="25%">
							<div
								style={{
									display: 'flex',
									height: '100%',
									alignItems: 'center',
									justifyContent: 'space-between',
									paddingLeft: '1.5rem',
									paddingRight: '1.5rem',
									paddingTop: '0.75rem',
									paddingBottom: '0.75rem',
									backgroundColor: 'var(--muted)',
									borderBottom: '1px solid var(--border)',
								}}
							>
								<h3 style={{ fontWeight: 500 }}>Navigation Bar</h3>
								<div style={{ display: 'flex', gap: '0.5rem' }}>
									<div
										style={{
											width: '0.5rem',
											height: '0.5rem',
											borderRadius: '9999px',
											backgroundColor: '#22c55e',
										}}
									></div>
									<div
										style={{
											width: '0.5rem',
											height: '0.5rem',
											borderRadius: '9999px',
											backgroundColor: '#eab308',
										}}
									></div>
									<div
										style={{
											width: '0.5rem',
											height: '0.5rem',
											borderRadius: '9999px',
											backgroundColor: '#ef4444',
										}}
									></div>
								</div>
							</div>
						</ResizablePanel>
						<ResizableHandle withHandle />
						<ResizablePanel defaultSize="65%">
							<div
								style={{
									display: 'flex',
									height: '100%',
									flexDirection: 'column',
									padding: '1.5rem',
								}}
							>
								<h3 style={{ fontWeight: 500, marginBottom: '1rem' }}>Main Content Area</h3>
								<div
									style={{
										flex: '1 1 0%',
										borderRadius: '0.5rem',
										display: 'flex',
										alignItems: 'center',
										justifyContent: 'center',
										backgroundImage: 'linear-gradient(to bottom right, #f8fafc, #f1f5f9)',
									}}
								>
									<span style={{ fontSize: '1.125rem', color: 'var(--muted-foreground)' }}>
										Primary workspace content
									</span>
								</div>
							</div>
						</ResizablePanel>
						<ResizableHandle withHandle />
						<ResizablePanel defaultSize="20%" minSize="15%" maxSize="30%">
							<div
								style={{
									display: 'flex',
									height: '100%',
									flexDirection: 'column',
									padding: '1rem',
									backgroundColor: 'var(--muted)',
									borderTop: '1px solid var(--border)',
								}}
							>
								<Terminal
									size={20}
									style={{ marginBottom: '0.5rem', color: 'var(--muted-foreground)' }}
								/>
								<h3 style={{ fontWeight: 500, marginBottom: '0.75rem' }}>Footer / Status Bar</h3>
								<div
									style={{
										fontSize: '0.75rem',
										color: 'var(--muted-foreground)',
										display: 'flex',
										flexDirection: 'column',
										gap: '0.25rem',
									}}
								>
									<div>Ready • Line 42, Col 12</div>
									<div>UTF-8 • TypeScript • Git:main</div>
								</div>
							</div>
						</ResizablePanel>
					</ResizablePanelGroup>
				</div>
			</div>

			<div>
				<h2
					style={{
						fontSize: '1.125rem',
						fontWeight: 600,
						marginBottom: '1rem',
						color: 'var(--foreground)',
					}}
				>
					Chat Interface
				</h2>
				<div
					style={{
						height: '400px',
						border: '1px solid var(--border)',
						borderRadius: '0.5rem',
						overflow: 'hidden',
					}}
				>
					<ResizablePanelGroup orientation="vertical">
						<ResizablePanel defaultSize="75%">
							<div
								style={{
									display: 'flex',
									height: '100%',
									flexDirection: 'column',
									padding: '1rem',
								}}
							>
								<h3 style={{ fontWeight: 500, marginBottom: '0.75rem' }}>Messages</h3>
								<div
									style={{
										flex: '1 1 0%',
										display: 'flex',
										flexDirection: 'column',
										gap: '0.75rem',
									}}
								>
									<div style={{ display: 'flex', justifyContent: 'flex-start' }}>
										<div
											style={{
												backgroundColor: 'var(--muted)',
												paddingLeft: '0.75rem',
												paddingRight: '0.75rem',
												paddingTop: '0.5rem',
												paddingBottom: '0.5rem',
												borderRadius: '0.5rem',
												maxWidth: '20rem',
											}}
										>
											<p style={{ fontSize: '0.875rem' }}>Hello! How can I help you today?</p>
										</div>
									</div>
									<div style={{ display: 'flex', justifyContent: 'flex-end' }}>
										<div
											style={{
												backgroundColor: 'var(--primary)',
												color: 'var(--primary-foreground)',
												paddingLeft: '0.75rem',
												paddingRight: '0.75rem',
												paddingTop: '0.5rem',
												paddingBottom: '0.5rem',
												borderRadius: '0.5rem',
												maxWidth: '20rem',
											}}
										>
											<p style={{ fontSize: '0.875rem' }}>I need help with the resizable panels.</p>
										</div>
									</div>
									<div style={{ display: 'flex', justifyContent: 'flex-start' }}>
										<div
											style={{
												backgroundColor: 'var(--muted)',
												paddingLeft: '0.75rem',
												paddingRight: '0.75rem',
												paddingTop: '0.5rem',
												paddingBottom: '0.5rem',
												borderRadius: '0.5rem',
												maxWidth: '20rem',
											}}
										>
											<p style={{ fontSize: '0.875rem' }}>
												Sure! You can drag the handles to resize panels.
											</p>
										</div>
									</div>
								</div>
							</div>
						</ResizablePanel>
						<ResizableHandle withHandle />
						<ResizablePanel defaultSize="25%" minSize="20%" maxSize="40%">
							<div
								style={{
									display: 'flex',
									height: '100%',
									flexDirection: 'column',
									padding: '1rem',
									backgroundColor: 'var(--muted)',
								}}
							>
								<h3 style={{ fontWeight: 500, marginBottom: '0.75rem' }}>Input Area</h3>
								<div style={{ flex: '1 1 0%', display: 'flex', flexDirection: 'column' }}>
									<div
										style={{
											flex: '1 1 0%',
											backgroundColor: 'var(--background)',
											borderRadius: '0.25rem',
											border: '1px solid var(--border)',
											padding: '0.5rem',
											fontSize: '0.875rem',
											color: 'var(--muted-foreground)',
										}}
									>
										Type your message...
									</div>
									<div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
										<button
											type="button"
											style={{
												backgroundColor: 'var(--primary)',
												color: 'var(--primary-foreground)',
												paddingLeft: '0.75rem',
												paddingRight: '0.75rem',
												paddingTop: '0.25rem',
												paddingBottom: '0.25rem',
												borderRadius: '0.25rem',
												fontSize: '0.875rem',
											}}
										>
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
				<h2
					style={{
						fontSize: '1.125rem',
						fontWeight: 600,
						marginBottom: '1rem',
						color: 'var(--foreground)',
					}}
				>
					Development Environment
				</h2>
				<div
					style={{
						height: '400px',
						border: '1px solid var(--border)',
						borderRadius: '0.5rem',
						overflow: 'hidden',
					}}
				>
					<ResizablePanelGroup orientation="vertical">
						<ResizablePanel defaultSize="60%">
							<div
								style={{
									display: 'flex',
									height: '100%',
									flexDirection: 'column',
									padding: '1rem',
								}}
							>
								<div
									style={{
										display: 'flex',
										alignItems: 'center',
										gap: '0.5rem',
										marginBottom: '0.75rem',
									}}
								>
									<Code size={16} style={{ color: 'var(--muted-foreground)' }} />
									<h3 style={{ fontWeight: 500 }}>Code Editor</h3>
									<span
										style={{
											fontSize: '0.75rem',
											backgroundColor: 'var(--muted)',
											paddingLeft: '0.5rem',
											paddingRight: '0.5rem',
											paddingTop: '0.25rem',
											paddingBottom: '0.25rem',
											borderRadius: '0.25rem',
										}}
									>
										main.tsx
									</span>
								</div>
								<div
									style={{
										flex: '1 1 0%',
										backgroundColor: 'var(--bg-slate-950)',
										borderRadius: '0.25rem',
										padding: '1rem',
										fontFamily: 'monospace',
										fontSize: '0.875rem',
										overflow: 'auto',
										color: '#4ade80',
									}}
								>
									<div style={{ color: '#6b7280' }}>1</div>
									<div style={{ color: '#6b7280' }}>2</div>
									<div style={{ color: '#6b7280' }}>3</div>
									<div style={{ color: '#6b7280' }}>4</div>
									<div style={{ color: '#6b7280' }}>5</div>
								</div>
							</div>
						</ResizablePanel>
						<ResizableHandle withHandle />
						<ResizablePanel defaultSize="25%" minSize="20%">
							<div
								style={{
									display: 'flex',
									height: '100%',
									flexDirection: 'column',
									padding: '1rem',
									backgroundColor: 'var(--muted)',
								}}
							>
								<div
									style={{
										display: 'flex',
										alignItems: 'center',
										gap: '0.5rem',
										marginBottom: '0.75rem',
									}}
								>
									<Terminal size={16} style={{ color: 'var(--muted-foreground)' }} />
									<h3 style={{ fontWeight: 500 }}>Terminal</h3>
								</div>
								<div
									style={{
										flex: '1 1 0%',
										backgroundColor: 'var(--bg-slate-950)',
										borderRadius: '0.25rem',
										padding: '0.75rem',
										fontFamily: 'monospace',
										fontSize: '0.75rem',
										color: '#4ade80',
									}}
								>
									<div>$ npm run dev</div>
									<div style={{ color: '#60a5fa' }}>Server running on http://localhost:3000</div>
									<div>█</div>
								</div>
							</div>
						</ResizablePanel>
						<ResizableHandle withHandle />
						<ResizablePanel defaultSize="15%" minSize="10%" maxSize="25%">
							<div
								style={{
									display: 'flex',
									height: '100%',
									alignItems: 'center',
									justifyContent: 'space-between',
									paddingLeft: '1rem',
									paddingRight: '1rem',
									paddingTop: '0.5rem',
									paddingBottom: '0.5rem',
									backgroundColor: 'var(--muted)',
									borderTop: '1px solid var(--border)',
								}}
							>
								<div style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)' }}>
									Problems: 0 • Warnings: 2 • Info: 5
								</div>
								<div style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)' }}>
									Ln 42, Col 12
								</div>
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
		<div
			style={{
				display: 'flex',
				flexDirection: 'column',
				gap: '1.5rem',
				padding: '1.5rem',
				backgroundColor: 'var(--background)',
			}}
		>
			<div>
				<h2
					style={{
						fontSize: '1.125rem',
						fontWeight: 600,
						marginBottom: '1rem',
						color: 'var(--foreground)',
					}}
				>
					Collapsible Sidebar
				</h2>
				<div
					style={{
						height: '400px',
						border: '1px solid var(--border)',
						borderRadius: '0.5rem',
						overflow: 'hidden',
					}}
				>
					<ResizablePanelGroup orientation="horizontal">
						<ResizablePanel defaultSize="25%" minSize="15%" maxSize="40%" collapsible={true}>
							<div
								style={{
									display: 'flex',
									height: '100%',
									flexDirection: 'column',
									padding: '1rem',
									backgroundColor: 'var(--muted)',
								}}
							>
								<div
									style={{
										display: 'flex',
										alignItems: 'center',
										gap: '0.5rem',
										marginBottom: '1rem',
									}}
								>
									<FileText size={20} style={{ color: 'var(--muted-foreground)' }} />
									<h3 style={{ fontWeight: 500 }}>File Explorer</h3>
								</div>
								<div
									style={{
										fontSize: '0.75rem',
										color: 'var(--muted-foreground)',
										display: 'flex',
										flexDirection: 'column',
										gap: '0.5rem',
									}}
								>
									<div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
										<span>📁</span> src/
									</div>
									<div
										style={{
											display: 'flex',
											alignItems: 'center',
											gap: '0.25rem',
											marginLeft: '1rem',
										}}
									>
										<span>📄</span> App.tsx
									</div>
									<div
										style={{
											display: 'flex',
											alignItems: 'center',
											gap: '0.25rem',
											marginLeft: '1rem',
										}}
									>
										<span>📄</span> index.ts
									</div>
									<div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
										<span>📁</span> components/
									</div>
									<div
										style={{
											display: 'flex',
											alignItems: 'center',
											gap: '0.25rem',
											marginLeft: '1rem',
										}}
									>
										<span>📄</span> Button.tsx
									</div>
								</div>
							</div>
						</ResizablePanel>
						<ResizableHandle withHandle />
						<ResizablePanel defaultSize="75%">
							<div
								style={{
									display: 'flex',
									height: '100%',
									flexDirection: 'column',
									padding: '1.5rem',
								}}
							>
								<h3 style={{ fontWeight: 500, marginBottom: '1rem' }}>Code Editor</h3>
								<div
									style={{
										flex: '1 1 0%',
										backgroundColor: 'var(--bg-slate-950)',
										borderRadius: '0.25rem',
										padding: '1rem',
										fontFamily: 'monospace',
										fontSize: '0.875rem',
										color: '#4ade80',
									}}
								>
									<div>import React from &apos;react&apos;;</div>
									<div></div>
									<div>function App() {'{'}</div>
									<div style={{ marginLeft: '1rem' }}>
										return &lt;div&gt;Hello World&lt;/div&gt;
									</div>
									<div>{'}'}</div>
									<div></div>
									<div>export default App;</div>
								</div>
								<p
									style={{
										fontSize: '0.875rem',
										color: 'var(--muted-foreground)',
										marginTop: '0.5rem',
									}}
								>
									Try dragging the left panel all the way to collapse it!
								</p>
							</div>
						</ResizablePanel>
					</ResizablePanelGroup>
				</div>
			</div>

			<div>
				<h2
					style={{
						fontSize: '1.125rem',
						fontWeight: 600,
						marginBottom: '1rem',
						color: 'var(--foreground)',
					}}
				>
					Collapsible Bottom Panel
				</h2>
				<div
					style={{
						height: '400px',
						border: '1px solid var(--border)',
						borderRadius: '0.5rem',
						overflow: 'hidden',
					}}
				>
					<ResizablePanelGroup orientation="vertical">
						<ResizablePanel defaultSize="70%">
							<div
								style={{
									display: 'flex',
									height: '100%',
									flexDirection: 'column',
									padding: '1.5rem',
								}}
							>
								<h3 style={{ fontWeight: 500, marginBottom: '1rem' }}>Main Workspace</h3>
								<div
									style={{
										flex: '1 1 0%',
										borderRadius: '0.5rem',
										display: 'flex',
										alignItems: 'center',
										justifyContent: 'center',
										backgroundImage: 'linear-gradient(to bottom right, #eff6ff, #e0e7ff)',
									}}
								>
									<div style={{ textAlign: 'center' }}>
										<ChartBar
											size={48}
											style={{
												marginLeft: 'auto',
												marginRight: 'auto',
												display: 'block',
												marginBottom: '0.5rem',
												color: '#3b82f6',
											}}
										/>
										<span style={{ fontSize: '1.125rem', fontWeight: 500 }}>Dashboard Content</span>
									</div>
								</div>
							</div>
						</ResizablePanel>
						<ResizableHandle withHandle />
						<ResizablePanel defaultSize="30%" minSize="20%" maxSize="50%" collapsible={true}>
							<div
								style={{
									display: 'flex',
									height: '100%',
									flexDirection: 'column',
									padding: '1rem',
									backgroundColor: 'var(--muted)',
								}}
							>
								<div
									style={{
										display: 'flex',
										alignItems: 'center',
										gap: '0.5rem',
										marginBottom: '0.75rem',
									}}
								>
									<Terminal size={20} style={{ color: 'var(--muted-foreground)' }} />
									<h3 style={{ fontWeight: 500 }}>Console</h3>
								</div>
								<div
									style={{
										flex: '1 1 0%',
										backgroundColor: 'var(--bg-slate-950)',
										borderRadius: '0.25rem',
										padding: '0.75rem',
										fontFamily: 'monospace',
										fontSize: '0.75rem',
										color: '#4ade80',
									}}
								>
									<div>$ npm run dev</div>
									<div style={{ color: '#60a5fa' }}>✓ Local server running</div>
									<div style={{ color: '#facc15' }}>⚠ 2 warnings found</div>
									<div style={{ color: '#6b7280' }}>Watching for changes...</div>
									<div>█</div>
								</div>
								<p
									style={{
										fontSize: '0.75rem',
										color: 'var(--muted-foreground)',
										marginTop: '0.5rem',
									}}
								>
									Drag this panel down to collapse it
								</p>
							</div>
						</ResizablePanel>
					</ResizablePanelGroup>
				</div>
			</div>

			<div>
				<h2
					style={{
						fontSize: '1.125rem',
						fontWeight: 600,
						marginBottom: '1rem',
						color: 'var(--foreground)',
					}}
				>
					Multiple Collapsible Panels
				</h2>
				<div
					style={{
						height: '400px',
						border: '1px solid var(--border)',
						borderRadius: '0.5rem',
						overflow: 'hidden',
					}}
				>
					<ResizablePanelGroup orientation="horizontal">
						<ResizablePanel defaultSize="20%" minSize="15%" maxSize="35%" collapsible={true}>
							<div
								style={{
									display: 'flex',
									height: '100%',
									flexDirection: 'column',
									padding: '1rem',
									backgroundColor: 'var(--muted)',
								}}
							>
								<div
									style={{
										display: 'flex',
										alignItems: 'center',
										gap: '0.5rem',
										marginBottom: '0.75rem',
									}}
								>
									<Settings size={20} style={{ color: 'var(--muted-foreground)' }} />
									<h3 style={{ fontWeight: 500 }}>Tools</h3>
								</div>
								<div
									style={{
										fontSize: '0.875rem',
										color: 'var(--muted-foreground)',
										display: 'flex',
										flexDirection: 'column',
										gap: '0.5rem',
									}}
								>
									<div>🔧 Settings</div>
									<div>📊 Analytics</div>
									<div>🎨 Themes</div>
									<div>🔌 Plugins</div>
								</div>
							</div>
						</ResizablePanel>
						<ResizableHandle withHandle />
						<ResizablePanel defaultSize="60%">
							<div
								style={{
									display: 'flex',
									height: '100%',
									alignItems: 'center',
									justifyContent: 'center',
								}}
							>
								<div style={{ textAlign: 'center' }}>
									<Code
										size={48}
										style={{
											marginLeft: 'auto',
											marginRight: 'auto',
											display: 'block',
											marginBottom: '0.5rem',
											color: 'var(--muted-foreground)',
										}}
									/>
									<span style={{ fontSize: '1.125rem', fontWeight: 500 }}>Main Editor</span>
									<p
										style={{
											fontSize: '0.875rem',
											color: 'var(--muted-foreground)',
											marginTop: '0.5rem',
										}}
									>
										Both side panels can be collapsed
									</p>
								</div>
							</div>
						</ResizablePanel>
						<ResizableHandle withHandle />
						<ResizablePanel defaultSize="20%" minSize="15%" maxSize="35%" collapsible={true}>
							<div
								style={{
									display: 'flex',
									height: '100%',
									flexDirection: 'column',
									padding: '1rem',
									backgroundColor: 'var(--muted)',
								}}
							>
								<div
									style={{
										display: 'flex',
										alignItems: 'center',
										gap: '0.5rem',
										marginBottom: '0.75rem',
									}}
								>
									<Database size={20} style={{ color: 'var(--muted-foreground)' }} />
									<h3 style={{ fontWeight: 500 }}>Inspector</h3>
								</div>
								<div
									style={{
										fontSize: '0.875rem',
										color: 'var(--muted-foreground)',
										display: 'flex',
										flexDirection: 'column',
										gap: '0.5rem',
									}}
								>
									<div>🏷️ Properties</div>
									<div>🔍 Details</div>
									<div>📝 Metadata</div>
									<div>🔗 Relations</div>
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
		<div style={{ padding: '1.5rem', backgroundColor: 'var(--background)' }}>
			<h2
				style={{
					fontSize: '1.125rem',
					fontWeight: 600,
					marginBottom: '1rem',
					color: 'var(--foreground)',
				}}
			>
				Interactive Panel Group
			</h2>
			<div
				style={{
					height: '400px',
					border: '1px solid var(--border)',
					borderRadius: '0.5rem',
					overflow: 'hidden',
				}}
			>
				<ResizablePanelGroup {...args}>
					<ResizablePanel defaultSize="25%" minSize="20%">
						<div
							style={{
								display: 'flex',
								height: '100%',
								alignItems: 'center',
								justifyContent: 'center',
								backgroundColor: 'var(--muted)',
							}}
						>
							<div style={{ textAlign: 'center' }}>
								<FileText
									size={32}
									style={{
										marginLeft: 'auto',
										marginRight: 'auto',
										display: 'block',
										marginBottom: '0.5rem',
										color: 'var(--muted-foreground)',
									}}
								/>
								<span style={{ fontSize: '0.875rem', fontWeight: 500 }}>Panel 1</span>
								<p
									style={{
										fontSize: '0.75rem',
										color: 'var(--muted-foreground)',
										marginTop: '0.25rem',
									}}
								>
									25% default size
								</p>
							</div>
						</div>
					</ResizablePanel>
					<ResizableHandle withHandle />
					<ResizablePanel defaultSize="50%">
						<div
							style={{
								display: 'flex',
								height: '100%',
								alignItems: 'center',
								justifyContent: 'center',
							}}
						>
							<div style={{ textAlign: 'center' }}>
								<Code
									size={32}
									style={{
										marginLeft: 'auto',
										marginRight: 'auto',
										display: 'block',
										marginBottom: '0.5rem',
										color: 'var(--muted-foreground)',
									}}
								/>
								<span style={{ fontSize: '0.875rem', fontWeight: 500 }}>Panel 2</span>
								<p
									style={{
										fontSize: '0.75rem',
										color: 'var(--muted-foreground)',
										marginTop: '0.25rem',
									}}
								>
									50% default size
								</p>
							</div>
						</div>
					</ResizablePanel>
					<ResizableHandle withHandle />
					<ResizablePanel defaultSize="25%">
						<div
							style={{
								display: 'flex',
								height: '100%',
								alignItems: 'center',
								justifyContent: 'center',
								backgroundColor: 'var(--muted)',
							}}
						>
							<div style={{ textAlign: 'center' }}>
								<Settings
									size={32}
									style={{
										marginLeft: 'auto',
										marginRight: 'auto',
										display: 'block',
										marginBottom: '0.5rem',
										color: 'var(--muted-foreground)',
									}}
								/>
								<span style={{ fontSize: '0.875rem', fontWeight: 500 }}>Panel 3</span>
								<p
									style={{
										fontSize: '0.75rem',
										color: 'var(--muted-foreground)',
										marginTop: '0.25rem',
									}}
								>
									25% default size
								</p>
							</div>
						</div>
					</ResizablePanel>
				</ResizablePanelGroup>
			</div>
			<div
				style={{
					marginTop: '1rem',
					padding: '1rem',
					backgroundColor: 'var(--muted)',
					borderRadius: '0.5rem',
				}}
			>
				<h3 style={{ fontWeight: 500, marginBottom: '0.5rem' }}>Instructions:</h3>
				<ul
					style={{
						fontSize: '0.875rem',
						color: 'var(--muted-foreground)',
						display: 'flex',
						flexDirection: 'column',
						gap: '0.25rem',
					}}
				>
					<li>• Change the orientation to see horizontal vs vertical layouts</li>
					<li>
						• Use useDefaultLayout with groupId for persistent layouts (see Persistent Layout story)
					</li>
					<li>• Drag the resize handles to adjust panel sizes</li>
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
		<div style={{ padding: '1.5rem', backgroundColor: 'var(--background)' }}>
			<h2
				style={{
					fontSize: '1.125rem',
					fontWeight: 600,
					marginBottom: '1rem',
					color: 'var(--foreground)',
				}}
			>
				Interactive Panel Properties
			</h2>
			<div
				style={{
					height: '400px',
					border: '1px solid var(--border)',
					borderRadius: '0.5rem',
					overflow: 'hidden',
				}}
			>
				<ResizablePanelGroup orientation="horizontal">
					<ResizablePanel defaultSize="30%" minSize="20%" maxSize="60%" collapsible={false}>
						<div
							style={{
								display: 'flex',
								height: '100%',
								alignItems: 'center',
								justifyContent: 'center',
								backgroundImage: 'linear-gradient(to bottom right, #eff6ff, #e0e7ff)',
							}}
						>
							<div style={{ textAlign: 'center' }}>
								<ChartBar
									size={32}
									style={{
										marginLeft: 'auto',
										marginRight: 'auto',
										display: 'block',
										marginBottom: '0.5rem',
										color: '#2563eb',
									}}
								/>
								<span style={{ fontSize: '0.875rem', fontWeight: 500 }}>Configurable Panel</span>
								<div
									style={{
										fontSize: '0.75rem',
										color: 'var(--muted-foreground)',
										marginTop: '0.5rem',
										display: 'flex',
										flexDirection: 'column',
										gap: '0.25rem',
									}}
								>
									<div>Default: 30%</div>
									<div>Min: 20%</div>
									<div>Max: 60%</div>
									<div>Collapsible: No</div>
								</div>
							</div>
						</div>
					</ResizablePanel>
					<ResizableHandle withHandle />
					<ResizablePanel defaultSize="70%">
						<div
							style={{
								display: 'flex',
								height: '100%',
								alignItems: 'center',
								justifyContent: 'center',
							}}
						>
							<div style={{ textAlign: 'center' }}>
								<Code
									size={32}
									style={{
										marginLeft: 'auto',
										marginRight: 'auto',
										display: 'block',
										marginBottom: '0.5rem',
										color: 'var(--muted-foreground)',
									}}
								/>
								<span style={{ fontSize: '0.875rem', fontWeight: 500 }}>Fixed Panel</span>
								<p
									style={{
										fontSize: '0.75rem',
										color: 'var(--muted-foreground)',
										marginTop: '0.25rem',
									}}
								>
									Responds to left panel changes
								</p>
							</div>
						</div>
					</ResizablePanel>
				</ResizablePanelGroup>
			</div>
			<div
				style={{
					marginTop: '1rem',
					padding: '1rem',
					backgroundColor: 'var(--muted)',
					borderRadius: '0.5rem',
				}}
			>
				<h3 style={{ fontWeight: 500, marginBottom: '0.5rem' }}>Try these interactions:</h3>
				<ul
					style={{
						fontSize: '0.875rem',
						color: 'var(--muted-foreground)',
						display: 'flex',
						flexDirection: 'column',
						gap: '0.25rem',
					}}
				>
					<li>• Adjust the sliders to see how constraints affect resizing</li>
					<li>• Enable collapsible and try dragging the panel to minimum size</li>
					<li>• Notice how minSize and maxSize limit the resize range</li>
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
		<div style={{ padding: '1.5rem', backgroundColor: 'var(--background)' }}>
			<h2
				style={{
					fontSize: '1.125rem',
					fontWeight: 600,
					marginBottom: '1rem',
					color: 'var(--foreground)',
				}}
			>
				Interactive Resize Handle
			</h2>
			<div
				style={{
					height: '400px',
					border: '1px solid var(--border)',
					borderRadius: '0.5rem',
					overflow: 'hidden',
				}}
			>
				<ResizablePanelGroup orientation="horizontal">
					<ResizablePanel defaultSize="40%">
						<div
							style={{
								display: 'flex',
								height: '100%',
								alignItems: 'center',
								justifyContent: 'center',
								backgroundColor: 'var(--muted)',
							}}
						>
							<div style={{ textAlign: 'center' }}>
								<FileText
									size={32}
									style={{
										marginLeft: 'auto',
										marginRight: 'auto',
										display: 'block',
										marginBottom: '0.5rem',
										color: 'var(--muted-foreground)',
									}}
								/>
								<span style={{ fontSize: '0.875rem', fontWeight: 500 }}>Left Panel</span>
								<p
									style={{
										fontSize: '0.75rem',
										color: 'var(--muted-foreground)',
										marginTop: '0.25rem',
									}}
								>
									Drag the handle to resize
								</p>
							</div>
						</div>
					</ResizablePanel>
					<ResizableHandle withHandle={true} disabled={false} />
					<ResizablePanel defaultSize="60%">
						<div
							style={{
								display: 'flex',
								height: '100%',
								alignItems: 'center',
								justifyContent: 'center',
							}}
						>
							<div style={{ textAlign: 'center' }}>
								<Settings
									size={32}
									style={{
										marginLeft: 'auto',
										marginRight: 'auto',
										display: 'block',
										marginBottom: '0.5rem',
										color: 'var(--muted-foreground)',
									}}
								/>
								<span style={{ fontSize: '0.875rem', fontWeight: 500 }}>Right Panel</span>
								<div
									style={{
										fontSize: '0.75rem',
										color: 'var(--muted-foreground)',
										marginTop: '0.5rem',
										display: 'flex',
										flexDirection: 'column',
										gap: '0.25rem',
									}}
								>
									<div>Handle visible: Yes</div>
									<div>Disabled: No</div>
								</div>
							</div>
						</div>
					</ResizablePanel>
				</ResizablePanelGroup>
			</div>
			<div
				style={{
					marginTop: '1rem',
					padding: '1rem',
					backgroundColor: 'var(--muted)',
					borderRadius: '0.5rem',
				}}
			>
				<h3 style={{ fontWeight: 500, marginBottom: '0.5rem' }}>Handle Options:</h3>
				<ul
					style={{
						fontSize: '0.875rem',
						color: 'var(--muted-foreground)',
						display: 'flex',
						flexDirection: 'column',
						gap: '0.25rem',
					}}
				>
					<li>
						• <strong>withHandle:</strong> Shows/hides the visual drag indicator
					</li>
					<li>
						• <strong>disabled:</strong> Prevents resizing when enabled
					</li>
					<li>• Handle is still functional even when visual indicator is hidden</li>
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
		<div style={{ padding: '1.5rem', backgroundColor: 'var(--background)' }}>
			<h2
				style={{
					fontSize: '1.125rem',
					fontWeight: 600,
					marginBottom: '1rem',
					color: 'var(--foreground)',
				}}
			>
				Persistent Layout Demo
			</h2>
			<div
				style={{
					height: '400px',
					border: '1px solid var(--border)',
					borderRadius: '0.5rem',
					overflow: 'hidden',
				}}
			>
				<ResizablePanelGroup
					orientation="horizontal"
					defaultLayout={defaultLayout}
					onLayoutChange={onLayoutChange}
				>
					<ResizablePanel defaultSize="25%" collapsible>
						<div
							style={{
								display: 'flex',
								height: '100%',
								flexDirection: 'column',
								padding: '1rem',
								backgroundColor: 'var(--muted)',
							}}
						>
							<div
								style={{
									display: 'flex',
									alignItems: 'center',
									gap: '0.5rem',
									marginBottom: '0.75rem',
								}}
							>
								<Database size={20} style={{ color: 'var(--muted-foreground)' }} />
								<h3 style={{ fontWeight: 500 }}>Persistent Sidebar</h3>
							</div>
							<div
								style={{
									fontSize: '0.75rem',
									color: 'var(--muted-foreground)',
									display: 'flex',
									flexDirection: 'column',
									gap: '0.5rem',
								}}
							>
								<div>This layout persists!</div>
								<div>Resize panels and refresh the page</div>
								<div>Your layout will be restored</div>
							</div>
						</div>
					</ResizablePanel>
					<ResizableHandle withHandle />
					<ResizablePanel defaultSize="50%">
						<div
							style={{ display: 'flex', height: '100%', flexDirection: 'column', padding: '1rem' }}
						>
							<h3 style={{ fontWeight: 500, marginBottom: '0.75rem' }}>Main Content</h3>
							<div
								style={{
									flex: '1 1 0%',
									borderRadius: '0.5rem',
									display: 'flex',
									alignItems: 'center',
									justifyContent: 'center',
									backgroundImage: 'linear-gradient(to bottom right, #f0fdf4, #d1fae5)',
								}}
							>
								<div style={{ textAlign: 'center' }}>
									<Code
										size={32}
										style={{
											marginLeft: 'auto',
											marginRight: 'auto',
											display: 'block',
											marginBottom: '0.5rem',
											color: '#16a34a',
										}}
									/>
									<span style={{ fontWeight: 500 }}>Layout Memory</span>
									<p
										style={{
											fontSize: '0.875rem',
											color: 'var(--muted-foreground)',
											marginTop: '0.5rem',
										}}
									>
										groupId: &quot;{groupId || 'demo-layout'}&quot;
									</p>
								</div>
							</div>
						</div>
					</ResizablePanel>
					<ResizableHandle withHandle />
					<ResizablePanel defaultSize="25%" collapsible>
						<div
							style={{
								display: 'flex',
								height: '100%',
								flexDirection: 'column',
								padding: '1rem',
								backgroundColor: 'var(--muted)',
							}}
						>
							<div
								style={{
									display: 'flex',
									alignItems: 'center',
									gap: '0.5rem',
									marginBottom: '0.75rem',
								}}
							>
								<Settings size={20} style={{ color: 'var(--muted-foreground)' }} />
								<h3 style={{ fontWeight: 500 }}>Properties Panel</h3>
							</div>
							<div
								style={{
									fontSize: '0.75rem',
									color: 'var(--muted-foreground)',
									display: 'flex',
									flexDirection: 'column',
									gap: '0.5rem',
								}}
							>
								<div>Change the groupId to create different saved layouts</div>
								<div>Each ID maintains its own layout state</div>
							</div>
						</div>
					</ResizablePanel>
				</ResizablePanelGroup>
			</div>
			<div
				style={{
					marginTop: '1rem',
					padding: '1rem',
					backgroundColor: 'var(--muted)',
					borderRadius: '0.5rem',
				}}
			>
				<h3 style={{ fontWeight: 500, marginBottom: '0.5rem' }}>Persistence Features:</h3>
				<ul
					style={{
						fontSize: '0.875rem',
						color: 'var(--muted-foreground)',
						display: 'flex',
						flexDirection: 'column',
						gap: '0.25rem',
					}}
				>
					<li>• Layout automatically saved to localStorage (useDefaultLayout)</li>
					<li>• Restore layout on page refresh or revisit</li>
					<li>• Different groupId values create separate saved layouts</li>
					<li>• Try resizing panels, then refresh the page to see persistence in action</li>
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
