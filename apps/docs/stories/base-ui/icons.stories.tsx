import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
	CommandSeparator,
	CommandShortcut,
	ResizableHandle,
	ResizablePanel,
	ResizablePanelGroup,
	Typography,
} from '@signozhq/ui';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { BaseUIPanel, Demo } from './panel.js';

const meta: Meta = {
	title: 'Base UI/Icon swap',
	parameters: {
		layout: 'padded',
		docs: {
			description: {
				component:
					'resizable, command and typography never used a Radix primitive — their only Radix import was @radix-ui/react-icons. This entry shows the three icon call sites now rendering from @signozhq/icons.',
			},
		},
	},
};

export default meta;

export const Overview: StoryObj = {
	name: 'Overview',
	render: () => (
		<BaseUIPanel
			parts="@signozhq/icons — no Base UI primitive involved"
			notes={[
				'These three components were the last importers of @radix-ui/react-icons; dropping it is what removed the final Radix package.',
				'resizable still renders react-resizable-panels; DragHandleDots2Icon became GripVertical on the withHandle grip.',
				'command still renders cmdk; MagnifyingGlassIcon became Search in CommandInput.',
				'typography is plain markup; CheckIcon / CopyIcon became Check / Copy on the copyable affordance.',
				'Nothing else in these components changed, so any visual difference here is an icon difference.',
			]}
		>
			<Demo title="Resizable" note="GripVertical on withHandle" wide block>
				<div style={{ height: 160 }}>
					<ResizablePanelGroup orientation="horizontal">
						<ResizablePanel defaultSize="35%" minSize="20%">
							<Typography.Text>Drag the grip →</Typography.Text>
						</ResizablePanel>
						<ResizableHandle withHandle />
						<ResizablePanel defaultSize="65%">
							<Typography.Text>Panel</Typography.Text>
						</ResizablePanel>
					</ResizablePanelGroup>
				</div>
			</Demo>

			<Demo title="Command" note="Search in CommandInput" block>
				<Command>
					<CommandInput placeholder="Search commands…" />
					<CommandList>
						<CommandEmpty>No results.</CommandEmpty>
						<CommandGroup heading="Navigate">
							<CommandItem>
								Open logs
								<CommandShortcut>⌘L</CommandShortcut>
							</CommandItem>
							<CommandItem>
								Open traces
								<CommandShortcut>⌘T</CommandShortcut>
							</CommandItem>
						</CommandGroup>
						<CommandSeparator />
						<CommandGroup heading="Actions">
							<CommandItem>Create dashboard</CommandItem>
						</CommandGroup>
					</CommandList>
				</Command>
			</Demo>

			<Demo title="Typography" note="Copy / Check on copyable" block>
				<Typography.Text copyable>Copy me — the icon flips to a check</Typography.Text>
			</Demo>
		</BaseUIPanel>
	),
};
