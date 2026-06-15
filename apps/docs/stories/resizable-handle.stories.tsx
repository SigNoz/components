import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@signozhq/ui';
import type { Meta, StoryObj } from '@storybook/react-vite';

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
	render: (_args) => (
		<div
			style={{
				height: '400px',
				border: '1px solid var(--border)',
				borderRadius: '0.5rem',
				overflow: 'hidden',
				margin: '1.5rem',
			}}
		>
			<ResizablePanelGroup orientation="horizontal">
				<ResizablePanel defaultSize="50%">
					<div
						style={{
							display: 'flex',
							height: '100%',
							alignItems: 'center',
							justifyContent: 'center',
							backgroundColor: 'var(--muted)',
						}}
					>
						<span style={{ fontSize: '0.875rem', fontWeight: 500 }}>Panel 1</span>
					</div>
				</ResizablePanel>
				<ResizableHandle withHandle disabled={false} />
				<ResizablePanel defaultSize="50%">
					<div
						style={{
							display: 'flex',
							height: '100%',
							alignItems: 'center',
							justifyContent: 'center',
						}}
					>
						<span style={{ fontSize: '0.875rem', fontWeight: 500 }}>Panel 2</span>
					</div>
				</ResizablePanel>
			</ResizablePanelGroup>
		</div>
	),
};

export const Preview: Story = {
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
					With Visible Handle
				</h3>
				<div style={{ margin: '1.5rem' }}>
					<div
						style={{
							marginBottom: '1rem',
							padding: '1rem',
							backgroundColor: 'var(--muted)',
							borderRadius: '0.5rem',
						}}
					>
						<h3 style={{ fontWeight: 500, marginBottom: '0.5rem' }}>Visible Handle:</h3>
						<p style={{ fontSize: '0.875rem', color: 'var(--muted-foreground)' }}>
							The dots icon makes the draggable area more discoverable for users
						</p>
					</div>
					<div
						style={{
							height: '400px',
							border: '1px solid var(--border)',
							borderRadius: '0.5rem',
							overflow: 'hidden',
						}}
					>
						<ResizablePanelGroup orientation="horizontal">
							<ResizablePanel defaultSize="50%">
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
										<span style={{ fontSize: '0.875rem', fontWeight: 500 }}>Left Panel</span>
										<p
											style={{
												fontSize: '0.75rem',
												color: 'var(--muted-foreground)',
												marginTop: '0.25rem',
											}}
										>
											Drag the dots to resize
										</p>
									</div>
								</div>
							</ResizablePanel>
							<ResizableHandle withHandle disabled={false} />
							<ResizablePanel defaultSize="50%">
								<div
									style={{
										display: 'flex',
										height: '100%',
										alignItems: 'center',
										justifyContent: 'center',
									}}
								>
									<span style={{ fontSize: '0.875rem', fontWeight: 500 }}>Right Panel</span>
								</div>
							</ResizablePanel>
						</ResizablePanelGroup>
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
					Disabled
				</h3>
				<div style={{ margin: '1.5rem' }}>
					<div
						style={{
							marginBottom: '1rem',
							padding: '1rem',
							backgroundColor: 'var(--muted)',
							borderRadius: '0.5rem',
						}}
					>
						<h3 style={{ fontWeight: 500, marginBottom: '0.5rem' }}>Disabled Handle:</h3>
						<p style={{ fontSize: '0.875rem', color: 'var(--muted-foreground)' }}>
							This handle cannot be dragged. Try dragging it - nothing will happen!
						</p>
					</div>
					<div
						style={{
							height: '400px',
							border: '1px solid var(--border)',
							borderRadius: '0.5rem',
							overflow: 'hidden',
						}}
					>
						<ResizablePanelGroup orientation="horizontal">
							<ResizablePanel defaultSize="30%">
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
										<span style={{ fontSize: '0.875rem', fontWeight: 500 }}>Fixed Panel</span>
										<p
											style={{
												fontSize: '0.75rem',
												color: 'var(--muted-foreground)',
												marginTop: '0.25rem',
											}}
										>
											30% width
										</p>
									</div>
								</div>
							</ResizablePanel>
							<ResizableHandle withHandle disabled={true} />
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
										<span style={{ fontSize: '0.875rem', fontWeight: 500 }}>Fixed Panel</span>
										<p
											style={{
												fontSize: '0.75rem',
												color: 'var(--muted-foreground)',
												marginTop: '0.25rem',
											}}
										>
											70% width
										</p>
									</div>
								</div>
							</ResizablePanel>
						</ResizablePanelGroup>
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
					Vertical Handle
				</h3>
				<div style={{ margin: '1.5rem' }}>
					<div
						style={{
							marginBottom: '1rem',
							padding: '1rem',
							backgroundColor: 'var(--muted)',
							borderRadius: '0.5rem',
						}}
					>
						<h3 style={{ fontWeight: 500, marginBottom: '0.5rem' }}>Vertical Handle:</h3>
						<p style={{ fontSize: '0.875rem', color: 'var(--muted-foreground)' }}>
							Handles work the same way in vertical layouts
						</p>
					</div>
					<div
						style={{
							height: '500px',
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
										alignItems: 'center',
										justifyContent: 'center',
									}}
								>
									<span style={{ fontSize: '0.875rem', fontWeight: 500 }}>Top Panel</span>
								</div>
							</ResizablePanel>
							<ResizableHandle withHandle disabled={false} />
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
									<span style={{ fontSize: '0.875rem', fontWeight: 500 }}>Bottom Panel</span>
								</div>
							</ResizablePanel>
						</ResizablePanelGroup>
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
					Multiple Handles
				</h3>
				<div style={{ margin: '1.5rem' }}>
					<div
						style={{
							marginBottom: '1rem',
							padding: '1rem',
							backgroundColor: 'var(--muted)',
							borderRadius: '0.5rem',
						}}
					>
						<h3 style={{ fontWeight: 500, marginBottom: '0.5rem' }}>Multiple Handles:</h3>
						<p style={{ fontSize: '0.875rem', color: 'var(--muted-foreground)' }}>
							Each handle can have different configurations
						</p>
					</div>
					<div
						style={{
							height: '400px',
							border: '1px solid var(--border)',
							borderRadius: '0.5rem',
							overflow: 'hidden',
						}}
					>
						<ResizablePanelGroup orientation="horizontal">
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
										<span style={{ fontSize: '0.875rem', fontWeight: 500 }}>Panel 1</span>
									</div>
								</div>
							</ResizablePanel>
							<ResizableHandle withHandle={false} />
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
										<span style={{ fontSize: '0.875rem', fontWeight: 500 }}>Panel 2</span>
										<p
											style={{
												fontSize: '0.75rem',
												color: 'var(--muted-foreground)',
												marginTop: '0.25rem',
											}}
										>
											Left: no visible handle
										</p>
										<p style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)' }}>
											Right: with visible handle
										</p>
									</div>
								</div>
							</ResizablePanel>
							<ResizableHandle withHandle={true} />
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
										<span style={{ fontSize: '0.875rem', fontWeight: 500 }}>Panel 3</span>
									</div>
								</div>
							</ResizablePanel>
						</ResizablePanelGroup>
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
					Mixed Handles
				</h3>
				<div style={{ margin: '1.5rem' }}>
					<div
						style={{
							marginBottom: '1rem',
							padding: '1rem',
							backgroundColor: 'var(--muted)',
							borderRadius: '0.5rem',
						}}
					>
						<h3 style={{ fontWeight: 500, marginBottom: '0.5rem' }}>Mixed Handle Configuration:</h3>
						<ul
							style={{
								fontSize: '0.875rem',
								color: 'var(--muted-foreground)',
								display: 'flex',
								flexDirection: 'column',
								gap: '0.25rem',
							}}
						>
							<li>• First handle: Active with visible indicator</li>
							<li>• Second handle: Disabled (cannot drag)</li>
						</ul>
					</div>
					<div
						style={{
							height: '400px',
							border: '1px solid var(--border)',
							borderRadius: '0.5rem',
							overflow: 'hidden',
						}}
					>
						<ResizablePanelGroup orientation="horizontal">
							<ResizablePanel defaultSize="33%">
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
										<span style={{ fontSize: '0.875rem', fontWeight: 500 }}>Resizable</span>
										<p
											style={{
												fontSize: '0.75rem',
												color: 'var(--muted-foreground)',
												marginTop: '0.25rem',
											}}
										>
											Can resize right
										</p>
									</div>
								</div>
							</ResizablePanel>
							<ResizableHandle withHandle={true} disabled={false} />
							<ResizablePanel defaultSize="34%">
								<div
									style={{
										display: 'flex',
										height: '100%',
										alignItems: 'center',
										justifyContent: 'center',
									}}
								>
									<div style={{ textAlign: 'center' }}>
										<span style={{ fontSize: '0.875rem', fontWeight: 500 }}>Flexible</span>
										<p
											style={{
												fontSize: '0.75rem',
												color: 'var(--muted-foreground)',
												marginTop: '0.25rem',
											}}
										>
											Can resize left
										</p>
										<p style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)' }}>
											Cannot resize right
										</p>
									</div>
								</div>
							</ResizablePanel>
							<ResizableHandle withHandle={true} disabled={true} />
							<ResizablePanel defaultSize="33%">
								<div
									style={{
										display: 'flex',
										height: '100%',
										alignItems: 'center',
										justifyContent: 'center',
										backgroundImage: 'linear-gradient(to bottom right, #fffbeb, #ffedd5)',
									}}
								>
									<div style={{ textAlign: 'center' }}>
										<span style={{ fontSize: '0.875rem', fontWeight: 500 }}>Fixed</span>
										<p
											style={{
												fontSize: '0.75rem',
												color: 'var(--muted-foreground)',
												marginTop: '0.25rem',
											}}
										>
											Cannot resize
										</p>
									</div>
								</div>
							</ResizablePanel>
						</ResizablePanelGroup>
					</div>
				</div>
			</section>
		</div>
	),
};
