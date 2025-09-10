import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import {
	ResizablePanelGroup,
	ResizablePanel,
	ResizableHandle,
} from '@signozhq/resizable';
import { generateDocs } from '../utils/generateDocs';
import {
	Code,
	FileText,
	Settings,
	BarChart3,
	Database,
	Terminal,
} from 'lucide-react';

const ResizableExamples = [
	`import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@signozhq/resizable';

export default function MyComponent() {
  return (
    <div className="h-screen">
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel defaultSize={25}>
          <div className="flex h-full items-center justify-center">
            <span>Sidebar</span>
          </div>
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel defaultSize={75}>
          <div className="flex h-full items-center justify-center">
            <span>Main Content</span>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}`,
	`import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@signozhq/resizable';

// Vertical layout with collapsible panels
export default function VerticalLayout() {
  return (
    <div className="h-screen">
      <ResizablePanelGroup direction="vertical">
        <ResizablePanel defaultSize={70}>
          <div className="flex h-full items-center justify-center">
            <span>Main Content Area</span>
          </div>
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel defaultSize={30} collapsible>
          <div className="flex h-full items-center justify-center">
            <span>Bottom Panel (Collapsible)</span>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}`,
	`import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@signozhq/resizable';

// Complex nested layout
export default function NestedLayout() {
  return (
    <div className="h-screen">
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel defaultSize={20} minSize={15} maxSize={40}>
          <div className="h-full p-4">
            <h3>File Explorer</h3>
          </div>
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel defaultSize={60}>
          <ResizablePanelGroup direction="vertical">
            <ResizablePanel defaultSize={70}>
              <div className="h-full p-4">
                <h3>Code Editor</h3>
              </div>
            </ResizablePanel>
            <ResizableHandle />
            <ResizablePanel defaultSize={30}>
              <div className="h-full p-4">
                <h3>Terminal</h3>
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel defaultSize={20} collapsible>
          <div className="h-full p-4">
            <h3>Properties</h3>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}`,
];

const ResizableDocs = generateDocs({
	packageName: '@signozhq/resizable',
	description:
		'A flexible resizable panel system for creating split layouts with draggable dividers. Perfect for building code editors, dashboards, and multi-panel interfaces with persistent layouts.',
	examples: ResizableExamples,
});

const meta: Meta<typeof ResizablePanelGroup> = {
	title: 'Components/Resizable',
	component: ResizablePanelGroup,
	parameters: {
		layout: 'fullscreen',
		docs: {
			description: {
				component: ResizableDocs,
			},
		},
	},
	argTypes: {
		direction: {
			control: 'select',
			options: ['horizontal', 'vertical'],
			description: 'The direction of the panel group layout',
		},
		autoSaveId: {
			control: 'text',
			description: 'Unique ID for persisting layout state in localStorage',
		},
	},
	tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof ResizablePanelGroup>;

export const Default: Story = {
	render: () => (
		<div className="space-y-8 p-6 bg-background">
			<div>
				<h2 className="text-lg font-semibold mb-4 text-foreground">
					Horizontal Layout
				</h2>
				<div className="h-[400px] border rounded-lg overflow-hidden">
					<ResizablePanelGroup direction="horizontal">
						<ResizablePanel defaultSize={25} minSize={20}>
							<div className="flex h-full items-center justify-center bg-muted">
								<div className="text-center">
									<FileText className="mx-auto mb-2 h-8 w-8 text-muted-foreground" />
									<span className="text-sm font-medium">File Explorer</span>
								</div>
							</div>
						</ResizablePanel>
						<ResizableHandle withHandle />
						<ResizablePanel defaultSize={50}>
							<div className="flex h-full items-center justify-center">
								<div className="text-center">
									<Code className="mx-auto mb-2 h-8 w-8 text-muted-foreground" />
									<span className="text-sm font-medium">Code Editor</span>
								</div>
							</div>
						</ResizablePanel>
						<ResizableHandle withHandle />
						<ResizablePanel defaultSize={25} minSize={20}>
							<div className="flex h-full items-center justify-center bg-muted">
								<div className="text-center">
									<Settings className="mx-auto mb-2 h-8 w-8 text-muted-foreground" />
									<span className="text-sm font-medium">Properties</span>
								</div>
							</div>
						</ResizablePanel>
					</ResizablePanelGroup>
				</div>
			</div>

			<div>
				<h2 className="text-lg font-semibold mb-4 text-foreground">
					Vertical Layout
				</h2>
				<div className="h-[400px] border rounded-lg overflow-hidden">
					<ResizablePanelGroup direction="vertical">
						<ResizablePanel defaultSize={70}>
							<div className="flex h-full items-center justify-center">
								<div className="text-center">
									<BarChart3 className="mx-auto mb-2 h-8 w-8 text-muted-foreground" />
									<span className="text-sm font-medium">Main Dashboard</span>
								</div>
							</div>
						</ResizablePanel>
						<ResizableHandle withHandle />
						<ResizablePanel defaultSize={30} minSize={25}>
							<div className="flex h-full items-center justify-center bg-muted">
								<div className="text-center">
									<Terminal className="mx-auto mb-2 h-8 w-8 text-muted-foreground" />
									<span className="text-sm font-medium">Console Output</span>
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
		<div className="space-y-6 p-6 bg-background">
			<div>
				<h2 className="text-lg font-semibold mb-4 text-foreground">
					Two Panel Layout
				</h2>
				<div className="h-[300px] border rounded-lg overflow-hidden">
					<ResizablePanelGroup direction="horizontal">
						<ResizablePanel defaultSize={30} minSize={20} maxSize={50}>
							<div className="flex h-full flex-col p-4 bg-muted">
								<h3 className="font-medium mb-2">Sidebar</h3>
								<p className="text-sm text-muted-foreground">Navigation and tools</p>
							</div>
						</ResizablePanel>
						<ResizableHandle withHandle />
						<ResizablePanel defaultSize={70}>
							<div className="flex h-full flex-col p-4">
								<h3 className="font-medium mb-2">Main Content</h3>
								<p className="text-sm text-muted-foreground">Primary workspace area</p>
							</div>
						</ResizablePanel>
					</ResizablePanelGroup>
				</div>
			</div>

			<div>
				<h2 className="text-lg font-semibold mb-4 text-foreground">
					Three Panel Layout
				</h2>
				<div className="h-[300px] border rounded-lg overflow-hidden">
					<ResizablePanelGroup direction="horizontal">
						<ResizablePanel defaultSize={25} minSize={15} maxSize={40}>
							<div className="flex h-full flex-col p-4 bg-muted">
								<FileText className="h-5 w-5 mb-2 text-muted-foreground" />
								<h3 className="font-medium mb-2">Explorer</h3>
								<div className="text-xs text-muted-foreground space-y-1">
									<div>📁 src/</div>
									<div className="ml-3">📄 index.ts</div>
									<div className="ml-3">📄 app.tsx</div>
								</div>
							</div>
						</ResizablePanel>
						<ResizableHandle withHandle />
						<ResizablePanel defaultSize={50}>
							<div className="flex h-full flex-col p-4">
								<Code className="h-5 w-5 mb-2 text-muted-foreground" />
								<h3 className="font-medium mb-2">Editor</h3>
								<div className="flex-1 bg-slate-950 rounded text-green-400 p-3 font-mono text-xs">
									<div>function App() {'{'}</div>
									<div className="ml-2">return &lt;h1&gt;Hello World&lt;/h1&gt;;</div>
									<div>{'}'}</div>
								</div>
							</div>
						</ResizablePanel>
						<ResizableHandle withHandle />
						<ResizablePanel defaultSize={25} minSize={20} maxSize={40}>
							<div className="flex h-full flex-col p-4 bg-muted">
								<Settings className="h-5 w-5 mb-2 text-muted-foreground" />
								<h3 className="font-medium mb-2">Properties</h3>
								<div className="text-xs text-muted-foreground space-y-2">
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
				<h2 className="text-lg font-semibold mb-4 text-foreground">
					Dashboard Layout
				</h2>
				<div className="h-[300px] border rounded-lg overflow-hidden">
					<ResizablePanelGroup direction="horizontal">
						<ResizablePanel defaultSize={20} minSize={15} maxSize={30}>
							<div className="flex h-full flex-col p-4 bg-muted">
								<BarChart3 className="h-5 w-5 mb-2 text-muted-foreground" />
								<h3 className="font-medium mb-2">Metrics</h3>
								<div className="text-xs text-muted-foreground space-y-1">
									<div>CPU: 45%</div>
									<div>Memory: 2.1GB</div>
									<div>Disk: 67%</div>
								</div>
							</div>
						</ResizablePanel>
						<ResizableHandle />
						<ResizablePanel defaultSize={60}>
							<div className="flex h-full items-center justify-center">
								<div className="text-center">
									<div className="h-32 w-32 mx-auto mb-4 bg-gradient-to-br from-blue-400 to-purple-500 rounded-lg flex items-center justify-center">
										<span className="text-white font-bold">CHART</span>
									</div>
									<span className="text-sm font-medium">Performance Graph</span>
								</div>
							</div>
						</ResizablePanel>
						<ResizableHandle />
						<ResizablePanel defaultSize={20} minSize={15} maxSize={30}>
							<div className="flex h-full flex-col p-4 bg-muted">
								<Database className="h-5 w-5 mb-2 text-muted-foreground" />
								<h3 className="font-medium mb-2">Status</h3>
								<div className="text-xs text-muted-foreground space-y-1">
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
		<div className="space-y-6 p-6 bg-background">
			<div>
				<h2 className="text-lg font-semibold mb-4 text-foreground">
					Application Layout
				</h2>
				<div className="h-[500px] border rounded-lg overflow-hidden">
					<ResizablePanelGroup direction="vertical">
						<ResizablePanel defaultSize={15} minSize={10} maxSize={25}>
							<div className="flex h-full items-center justify-between px-6 py-3 bg-muted border-b">
								<h3 className="font-medium">Navigation Bar</h3>
								<div className="flex gap-2">
									<div className="w-2 h-2 bg-green-500 rounded-full"></div>
									<div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
									<div className="w-2 h-2 bg-red-500 rounded-full"></div>
								</div>
							</div>
						</ResizablePanel>
						<ResizableHandle withHandle />
						<ResizablePanel defaultSize={65}>
							<div className="flex h-full flex-col p-6">
								<h3 className="font-medium mb-4">Main Content Area</h3>
								<div className="flex-1 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 rounded-lg flex items-center justify-center">
									<span className="text-lg text-muted-foreground">
										Primary workspace content
									</span>
								</div>
							</div>
						</ResizablePanel>
						<ResizableHandle withHandle />
						<ResizablePanel defaultSize={20} minSize={15} maxSize={30}>
							<div className="flex h-full flex-col p-4 bg-muted border-t">
								<Terminal className="h-5 w-5 mb-2 text-muted-foreground" />
								<h3 className="font-medium mb-3">Footer / Status Bar</h3>
								<div className="text-xs text-muted-foreground space-y-1">
									<div>Ready • Line 42, Col 12</div>
									<div>UTF-8 • TypeScript • Git:main</div>
								</div>
							</div>
						</ResizablePanel>
					</ResizablePanelGroup>
				</div>
			</div>

			<div>
				<h2 className="text-lg font-semibold mb-4 text-foreground">
					Chat Interface
				</h2>
				<div className="h-[400px] border rounded-lg overflow-hidden">
					<ResizablePanelGroup direction="vertical">
						<ResizablePanel defaultSize={75}>
							<div className="flex h-full flex-col p-4">
								<h3 className="font-medium mb-3">Messages</h3>
								<div className="flex-1 space-y-3">
									<div className="flex justify-start">
										<div className="bg-muted px-3 py-2 rounded-lg max-w-xs">
											<p className="text-sm">Hello! How can I help you today?</p>
										</div>
									</div>
									<div className="flex justify-end">
										<div className="bg-primary text-primary-foreground px-3 py-2 rounded-lg max-w-xs">
											<p className="text-sm">I need help with the resizable panels.</p>
										</div>
									</div>
									<div className="flex justify-start">
										<div className="bg-muted px-3 py-2 rounded-lg max-w-xs">
											<p className="text-sm">
												Sure! You can drag the handles to resize panels.
											</p>
										</div>
									</div>
								</div>
							</div>
						</ResizablePanel>
						<ResizableHandle withHandle />
						<ResizablePanel defaultSize={25} minSize={20} maxSize={40}>
							<div className="flex h-full flex-col p-4 bg-muted">
								<h3 className="font-medium mb-3">Input Area</h3>
								<div className="flex-1 flex flex-col">
									<div className="flex-1 bg-background rounded border p-2 text-sm text-muted-foreground">
										Type your message...
									</div>
									<div className="flex justify-end mt-2">
										<button className="bg-primary text-primary-foreground px-3 py-1 rounded text-sm">
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
				<h2 className="text-lg font-semibold mb-4 text-foreground">
					Development Environment
				</h2>
				<div className="h-[400px] border rounded-lg overflow-hidden">
					<ResizablePanelGroup direction="vertical">
						<ResizablePanel defaultSize={60}>
							<div className="flex h-full flex-col p-4">
								<div className="flex items-center gap-2 mb-3">
									<Code className="h-4 w-4 text-muted-foreground" />
									<h3 className="font-medium">Code Editor</h3>
									<span className="text-xs bg-muted px-2 py-1 rounded">main.tsx</span>
								</div>
								<div className="flex-1 bg-slate-950 rounded text-green-400 p-4 font-mono text-sm overflow-auto">
									<div className="text-gray-500">1</div>
									<div className="text-gray-500">2</div>
									<div className="text-gray-500">3</div>
									<div className="text-gray-500">4</div>
									<div className="text-gray-500">5</div>
								</div>
							</div>
						</ResizablePanel>
						<ResizableHandle withHandle />
						<ResizablePanel defaultSize={25} minSize={20}>
							<div className="flex h-full flex-col p-4 bg-muted">
								<div className="flex items-center gap-2 mb-3">
									<Terminal className="h-4 w-4 text-muted-foreground" />
									<h3 className="font-medium">Terminal</h3>
								</div>
								<div className="flex-1 bg-slate-950 rounded text-green-400 p-3 font-mono text-xs">
									<div>$ npm run dev</div>
									<div className="text-blue-400">
										Server running on http://localhost:3000
									</div>
									<div className="animate-pulse">█</div>
								</div>
							</div>
						</ResizablePanel>
						<ResizableHandle withHandle />
						<ResizablePanel defaultSize={15} minSize={10} maxSize={25}>
							<div className="flex h-full items-center justify-between px-4 py-2 bg-slate-100 dark:bg-slate-800 border-t">
								<div className="text-xs text-muted-foreground">
									Problems: 0 • Warnings: 2 • Info: 5
								</div>
								<div className="text-xs text-muted-foreground">Ln 42, Col 12</div>
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
		<div className="space-y-6 p-6 bg-background">
			<div>
				<h2 className="text-lg font-semibold mb-4 text-foreground">
					Collapsible Sidebar
				</h2>
				<div className="h-[400px] border rounded-lg overflow-hidden">
					<ResizablePanelGroup direction="horizontal">
						<ResizablePanel
							defaultSize={25}
							minSize={15}
							maxSize={40}
							collapsible={true}
						>
							<div className="flex h-full flex-col p-4 bg-muted">
								<div className="flex items-center gap-2 mb-4">
									<FileText className="h-5 w-5 text-muted-foreground" />
									<h3 className="font-medium">File Explorer</h3>
								</div>
								<div className="text-xs text-muted-foreground space-y-2">
									<div className="flex items-center gap-1">
										<span>📁</span> src/
									</div>
									<div className="flex items-center gap-1 ml-4">
										<span>📄</span> App.tsx
									</div>
									<div className="flex items-center gap-1 ml-4">
										<span>📄</span> index.ts
									</div>
									<div className="flex items-center gap-1">
										<span>📁</span> components/
									</div>
									<div className="flex items-center gap-1 ml-4">
										<span>📄</span> Button.tsx
									</div>
								</div>
							</div>
						</ResizablePanel>
						<ResizableHandle withHandle />
						<ResizablePanel defaultSize={75}>
							<div className="flex h-full flex-col p-6">
								<h3 className="font-medium mb-4">Code Editor</h3>
								<div className="flex-1 bg-slate-950 rounded text-green-400 p-4 font-mono text-sm">
									<div>import React from &apos;react&apos;;</div>
									<div></div>
									<div>function App() {'{'}</div>
									<div className="ml-4">return &lt;div&gt;Hello World&lt;/div&gt;</div>
									<div>{'}'}</div>
									<div></div>
									<div>export default App;</div>
								</div>
								<p className="text-sm text-muted-foreground mt-2">
									Try dragging the left panel all the way to collapse it!
								</p>
							</div>
						</ResizablePanel>
					</ResizablePanelGroup>
				</div>
			</div>

			<div>
				<h2 className="text-lg font-semibold mb-4 text-foreground">
					Collapsible Bottom Panel
				</h2>
				<div className="h-[400px] border rounded-lg overflow-hidden">
					<ResizablePanelGroup direction="vertical">
						<ResizablePanel defaultSize={70}>
							<div className="flex h-full flex-col p-6">
								<h3 className="font-medium mb-4">Main Workspace</h3>
								<div className="flex-1 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg flex items-center justify-center">
									<div className="text-center">
										<BarChart3 className="mx-auto mb-2 h-12 w-12 text-blue-500" />
										<span className="text-lg font-medium">Dashboard Content</span>
									</div>
								</div>
							</div>
						</ResizablePanel>
						<ResizableHandle withHandle />
						<ResizablePanel
							defaultSize={30}
							minSize={20}
							maxSize={50}
							collapsible={true}
						>
							<div className="flex h-full flex-col p-4 bg-muted">
								<div className="flex items-center gap-2 mb-3">
									<Terminal className="h-5 w-5 text-muted-foreground" />
									<h3 className="font-medium">Console</h3>
								</div>
								<div className="flex-1 bg-slate-950 rounded text-green-400 p-3 font-mono text-xs">
									<div>$ npm run dev</div>
									<div className="text-blue-400">✓ Local server running</div>
									<div className="text-yellow-400">⚠ 2 warnings found</div>
									<div className="text-gray-500">Watching for changes...</div>
									<div className="animate-pulse">█</div>
								</div>
								<p className="text-xs text-muted-foreground mt-2">
									Drag this panel down to collapse it
								</p>
							</div>
						</ResizablePanel>
					</ResizablePanelGroup>
				</div>
			</div>

			<div>
				<h2 className="text-lg font-semibold mb-4 text-foreground">
					Multiple Collapsible Panels
				</h2>
				<div className="h-[400px] border rounded-lg overflow-hidden">
					<ResizablePanelGroup direction="horizontal">
						<ResizablePanel
							defaultSize={20}
							minSize={15}
							maxSize={35}
							collapsible={true}
						>
							<div className="flex h-full flex-col p-4 bg-muted">
								<div className="flex items-center gap-2 mb-3">
									<Settings className="h-5 w-5 text-muted-foreground" />
									<h3 className="font-medium">Tools</h3>
								</div>
								<div className="text-sm text-muted-foreground space-y-2">
									<div>🔧 Settings</div>
									<div>📊 Analytics</div>
									<div>🎨 Themes</div>
									<div>🔌 Plugins</div>
								</div>
							</div>
						</ResizablePanel>
						<ResizableHandle withHandle />
						<ResizablePanel defaultSize={60}>
							<div className="flex h-full items-center justify-center">
								<div className="text-center">
									<Code className="mx-auto mb-2 h-12 w-12 text-muted-foreground" />
									<span className="text-lg font-medium">Main Editor</span>
									<p className="text-sm text-muted-foreground mt-2">
										Both side panels can be collapsed
									</p>
								</div>
							</div>
						</ResizablePanel>
						<ResizableHandle withHandle />
						<ResizablePanel
							defaultSize={20}
							minSize={15}
							maxSize={35}
							collapsible={true}
						>
							<div className="flex h-full flex-col p-4 bg-muted">
								<div className="flex items-center gap-2 mb-3">
									<Database className="h-5 w-5 text-muted-foreground" />
									<h3 className="font-medium">Inspector</h3>
								</div>
								<div className="text-sm text-muted-foreground space-y-2">
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
		direction: 'horizontal',
		autoSaveId: '',
	},
	argTypes: {
		direction: {
			control: 'select',
			options: ['horizontal', 'vertical'],
			description: 'Layout direction of the panel group',
		},
		autoSaveId: {
			control: 'text',
			description: 'Unique ID for persisting layout state (optional)',
		},
	},
	render: (args) => (
		<div className="p-6 bg-background">
			<h2 className="text-lg font-semibold mb-4 text-foreground">
				Interactive Panel Group
			</h2>
			<div className="h-[400px] border rounded-lg overflow-hidden">
				<ResizablePanelGroup {...args}>
					<ResizablePanel defaultSize={25} minSize={20}>
						<div className="flex h-full items-center justify-center bg-muted">
							<div className="text-center">
								<FileText className="mx-auto mb-2 h-8 w-8 text-muted-foreground" />
								<span className="text-sm font-medium">Panel 1</span>
								<p className="text-xs text-muted-foreground mt-1">25% default size</p>
							</div>
						</div>
					</ResizablePanel>
					<ResizableHandle withHandle />
					<ResizablePanel defaultSize={50}>
						<div className="flex h-full items-center justify-center">
							<div className="text-center">
								<Code className="mx-auto mb-2 h-8 w-8 text-muted-foreground" />
								<span className="text-sm font-medium">Panel 2</span>
								<p className="text-xs text-muted-foreground mt-1">50% default size</p>
							</div>
						</div>
					</ResizablePanel>
					<ResizableHandle withHandle />
					<ResizablePanel defaultSize={25}>
						<div className="flex h-full items-center justify-center bg-muted">
							<div className="text-center">
								<Settings className="mx-auto mb-2 h-8 w-8 text-muted-foreground" />
								<span className="text-sm font-medium">Panel 3</span>
								<p className="text-xs text-muted-foreground mt-1">25% default size</p>
							</div>
						</div>
					</ResizablePanel>
				</ResizablePanelGroup>
			</div>
			<div className="mt-4 p-4 bg-muted rounded-lg">
				<h3 className="font-medium mb-2">Instructions:</h3>
				<ul className="text-sm text-muted-foreground space-y-1">
					<li>• Change the direction to see horizontal vs vertical layouts</li>
					<li>• Add an autoSaveId to persist panel sizes across page reloads</li>
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
		<div className="p-6 bg-background">
			<h2 className="text-lg font-semibold mb-4 text-foreground">
				Interactive Panel Properties
			</h2>
			<div className="h-[400px] border rounded-lg overflow-hidden">
				<ResizablePanelGroup direction="horizontal">
					<ResizablePanel
						defaultSize={30}
						minSize={20}
						maxSize={60}
						collapsible={false}
					>
						<div className="flex h-full items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-900/20">
							<div className="text-center">
								<BarChart3 className="mx-auto mb-2 h-8 w-8 text-blue-600" />
								<span className="text-sm font-medium">Configurable Panel</span>
								<div className="text-xs text-muted-foreground mt-2 space-y-1">
									<div>Default: 30%</div>
									<div>Min: 20%</div>
									<div>Max: 60%</div>
									<div>Collapsible: No</div>
								</div>
							</div>
						</div>
					</ResizablePanel>
					<ResizableHandle withHandle />
					<ResizablePanel defaultSize={70}>
						<div className="flex h-full items-center justify-center">
							<div className="text-center">
								<Code className="mx-auto mb-2 h-8 w-8 text-muted-foreground" />
								<span className="text-sm font-medium">Fixed Panel</span>
								<p className="text-xs text-muted-foreground mt-1">
									Responds to left panel changes
								</p>
							</div>
						</div>
					</ResizablePanel>
				</ResizablePanelGroup>
			</div>
			<div className="mt-4 p-4 bg-muted rounded-lg">
				<h3 className="font-medium mb-2">Try these interactions:</h3>
				<ul className="text-sm text-muted-foreground space-y-1">
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
		<div className="p-6 bg-background">
			<h2 className="text-lg font-semibold mb-4 text-foreground">
				Interactive Resize Handle
			</h2>
			<div className="h-[400px] border rounded-lg overflow-hidden">
				<ResizablePanelGroup direction="horizontal">
					<ResizablePanel defaultSize={40}>
						<div className="flex h-full items-center justify-center bg-muted">
							<div className="text-center">
								<FileText className="mx-auto mb-2 h-8 w-8 text-muted-foreground" />
								<span className="text-sm font-medium">Left Panel</span>
								<p className="text-xs text-muted-foreground mt-1">
									Drag the handle to resize
								</p>
							</div>
						</div>
					</ResizablePanel>
					<ResizableHandle withHandle={true} disabled={false} />
					<ResizablePanel defaultSize={60}>
						<div className="flex h-full items-center justify-center">
							<div className="text-center">
								<Settings className="mx-auto mb-2 h-8 w-8 text-muted-foreground" />
								<span className="text-sm font-medium">Right Panel</span>
								<div className="text-xs text-muted-foreground mt-2 space-y-1">
									<div>Handle visible: Yes</div>
									<div>Disabled: No</div>
								</div>
							</div>
						</div>
					</ResizablePanel>
				</ResizablePanelGroup>
			</div>
			<div className="mt-4 p-4 bg-muted rounded-lg">
				<h3 className="font-medium mb-2">Handle Options:</h3>
				<ul className="text-sm text-muted-foreground space-y-1">
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

export const PersistentLayout: Story = {
	parameters: {
		controls: { disable: false },
	},
	args: {
		autoSaveId: 'demo-layout',
	},
	argTypes: {
		autoSaveId: {
			control: 'text',
			description: 'Unique ID for saving layout to localStorage',
		},
	},
	render: (args) => (
		<div className="p-6 bg-background">
			<h2 className="text-lg font-semibold mb-4 text-foreground">
				Persistent Layout Demo
			</h2>
			<div className="h-[400px] border rounded-lg overflow-hidden">
				<ResizablePanelGroup direction="horizontal" autoSaveId={args.autoSaveId}>
					<ResizablePanel defaultSize={25} collapsible>
						<div className="flex h-full flex-col p-4 bg-muted">
							<div className="flex items-center gap-2 mb-3">
								<Database className="h-5 w-5 text-muted-foreground" />
								<h3 className="font-medium">Persistent Sidebar</h3>
							</div>
							<div className="text-xs text-muted-foreground space-y-2">
								<div>This layout persists!</div>
								<div>Resize panels and refresh the page</div>
								<div>Your layout will be restored</div>
							</div>
						</div>
					</ResizablePanel>
					<ResizableHandle withHandle />
					<ResizablePanel defaultSize={50}>
						<div className="flex h-full flex-col p-4">
							<h3 className="font-medium mb-3">Main Content</h3>
							<div className="flex-1 bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg flex items-center justify-center">
								<div className="text-center">
									<Code className="mx-auto mb-2 h-8 w-8 text-green-600" />
									<span className="font-medium">Layout Memory</span>
									<p className="text-sm text-muted-foreground mt-2">
										autoSaveId: &quot;{args.autoSaveId}&quot;
									</p>
								</div>
							</div>
						</div>
					</ResizablePanel>
					<ResizableHandle withHandle />
					<ResizablePanel defaultSize={25} collapsible>
						<div className="flex h-full flex-col p-4 bg-muted">
							<div className="flex items-center gap-2 mb-3">
								<Settings className="h-5 w-5 text-muted-foreground" />
								<h3 className="font-medium">Properties Panel</h3>
							</div>
							<div className="text-xs text-muted-foreground space-y-2">
								<div>Change the autoSaveId to create different saved layouts</div>
								<div>Each ID maintains its own layout state</div>
							</div>
						</div>
					</ResizablePanel>
				</ResizablePanelGroup>
			</div>
			<div className="mt-4 p-4 bg-muted rounded-lg">
				<h3 className="font-medium mb-2">Persistence Features:</h3>
				<ul className="text-sm text-muted-foreground space-y-1">
					<li>• Layout automatically saved to localStorage</li>
					<li>• Restore layout on page refresh or revisit</li>
					<li>• Different autoSaveId values create separate saved layouts</li>
					<li>
						• Try resizing panels, then refresh the page to see persistence in action
					</li>
				</ul>
			</div>
		</div>
	),
};
