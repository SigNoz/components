import type { TooltipSimpleProps } from '@signozhq/ui';
import {
	Button,
	ButtonColor,
	ButtonVariant,
	Checkbox,
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSimple,
	DropdownMenuTrigger,
	Input,
	Select,
	SelectContent,
	SelectItem,
	SelectSimple,
	SelectTrigger,
	SelectValue,
	Switch,
	TooltipProvider,
	TooltipSimple,
} from '@signozhq/ui';
import type { Meta, StoryObj } from '@storybook/react-vite';

const meta: Meta<typeof TooltipSimple> = {
	title: 'Composed Components/TooltipSimple',
	component: TooltipSimple,
	argTypes: {
		title: {
			control: 'text',
			description: 'The content of the tooltip.',
			table: { category: 'Content', type: { summary: 'React.ReactNode' } },
		},
		arrow: {
			control: 'boolean',
			description: 'Whether to show the arrow.',
			table: {
				category: 'Appearance',
				type: { summary: 'boolean' },
				defaultValue: { summary: 'false' },
			},
		},
		side: {
			control: 'select',
			options: ['top', 'right', 'bottom', 'left'],
			description: 'The preferred side of the trigger to render against when open.',
			table: {
				category: 'Position',
				type: { summary: "'top' | 'right' | 'bottom' | 'left'" },
				defaultValue: { summary: "'top'" },
			},
		},
		align: {
			control: 'select',
			options: ['start', 'center', 'end'],
			description: 'The preferred alignment against the trigger.',
			table: {
				category: 'Position',
				type: { summary: "'start' | 'center' | 'end'" },
				defaultValue: { summary: "'center'" },
			},
		},
		sideOffset: {
			control: 'number',
			description: 'The distance in pixels from the trigger.',
			table: {
				category: 'Position',
				type: { summary: 'number' },
				defaultValue: { summary: '4' },
			},
		},
		alignOffset: {
			control: 'number',
			description: 'An offset in pixels from the "start" or "end" alignment options.',
			table: { category: 'Position', type: { summary: 'number' } },
		},
		avoidCollisions: {
			control: 'boolean',
			description: 'When true, overrides the side and align preferences to prevent collisions.',
			table: {
				category: 'Position',
				type: { summary: 'boolean' },
				defaultValue: { summary: 'true' },
			},
		},
		withPortal: {
			control: 'boolean',
			description: 'Whether to render in a portal. Set to false when inside modals/dialogs.',
			table: {
				category: 'Behavior',
				type: { summary: 'boolean' },
				defaultValue: { summary: 'true' },
			},
		},
		delayDuration: {
			control: 'number',
			description: 'The duration from when the pointer enters the trigger until the tooltip opens.',
			table: {
				category: 'Behavior',
				type: { summary: 'number' },
				defaultValue: { summary: '700' },
			},
		},
		open: {
			control: 'boolean',
			description: 'The controlled open state of the tooltip.',
			table: { category: 'State', type: { summary: 'boolean' } },
		},
		defaultOpen: {
			control: 'boolean',
			description: 'The open state of the tooltip when initially rendered.',
			table: { category: 'State', type: { summary: 'boolean' } },
		},
		onOpenChange: {
			control: false,
			description: 'Event handler called when the open state changes.',
			table: { category: 'Events', type: { summary: '(open: boolean) => void' } },
		},
		testId: {
			control: 'text',
			description: 'Test ID for the tooltip.',
			table: { category: 'Testing', type: { summary: 'string' } },
		},
		tooltipContentProps: {
			control: false,
			description:
				'Additional props passed to the underlying TooltipContent. Use to set className, arrowPadding, or other TooltipContent props without breaking the preset composition.',
			table: {
				category: 'Advanced',
				type: { summary: 'TooltipContentProps (positioning/arrow props excluded)' },
			},
		},
	},
	parameters: {
		layout: 'fullscreen',
		design: {
			type: 'figma',
			url: 'https://www.figma.com/design/egMidgk6VJDXTumxcCYUl1/Periscope---Primitives?node-id=12-746&m=dev',
		},
	},
	tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof TooltipSimple>;

export const Default: Story = {
	args: {
		title: "I'm a basic tooltip",
		arrow: false,
		side: 'top',
		align: 'center',
	},
	render: (args: Partial<TooltipSimpleProps>) => (
		<TooltipProvider delayDuration={0}>
			<div className="p-20 flex items-center justify-center">
				<TooltipSimple {...(args as TooltipSimpleProps)}>
					<Button variant={ButtonVariant.Solid} color={ButtonColor.Secondary}>
						Hover me
					</Button>
				</TooltipSimple>
			</div>
		</TooltipProvider>
	),
};

export const WithArrow: Story = {
	args: {
		title: 'Tooltip with arrow',
		arrow: true,
		side: 'top',
	},
	render: (args: Partial<TooltipSimpleProps>) => (
		<TooltipProvider delayDuration={0}>
			<div className="p-20 flex items-center justify-center">
				<TooltipSimple {...(args as TooltipSimpleProps)}>
					<Button variant={ButtonVariant.Solid} color={ButtonColor.Secondary}>
						Hover me
					</Button>
				</TooltipSimple>
			</div>
		</TooltipProvider>
	),
};

export const Positions: Story = {
	render: () => (
		<TooltipProvider delayDuration={0}>
			<div className="p-20 flex flex-wrap gap-8 items-center justify-center">
				{(['top', 'right', 'bottom', 'left'] as const).map((side) => (
					<TooltipSimple key={side} title={`Tooltip on ${side}`} side={side} arrow>
						<Button
							variant={ButtonVariant.Solid}
							color={ButtonColor.Secondary}
							className="capitalize"
						>
							{side}
						</Button>
					</TooltipSimple>
				))}
			</div>
		</TooltipProvider>
	),
};

export const Alignments: Story = {
	render: () => (
		<TooltipProvider delayDuration={0}>
			<div className="p-20 flex flex-wrap gap-8 items-center justify-center">
				{(['start', 'center', 'end'] as const).map((align) => (
					<TooltipSimple key={align} title={`Align ${align}`} side="top" align={align} arrow>
						<Button
							variant={ButtonVariant.Solid}
							color={ButtonColor.Secondary}
							className="capitalize w-30"
						>
							{align}
						</Button>
					</TooltipSimple>
				))}
			</div>
		</TooltipProvider>
	),
};

export const WithDisabledComponents: Story = {
	args: {
		title: 'This component is disabled',
		arrow: true,
		side: 'top',
	},
	render: (args: Partial<TooltipSimpleProps>) => (
		<TooltipProvider delayDuration={0}>
			<div className="p-20 flex flex-col gap-8">
				<div className="flex flex-col gap-2">
					<span className="text-xs text-vanilla-400">Button</span>
					<TooltipSimple {...(args as TooltipSimpleProps)}>
						<Button
							onClick={() => alert('Should not be called')}
							variant={ButtonVariant.Solid}
							color={ButtonColor.Secondary}
							disabled
						>
							Disabled Button
						</Button>
					</TooltipSimple>
				</div>
				<div className="flex flex-col gap-2">
					<span className="text-xs text-vanilla-400">Input</span>
					<TooltipSimple {...(args as TooltipSimpleProps)} title="Input is disabled">
						<Input placeholder="Disabled input" disabled />
					</TooltipSimple>
				</div>
				<div className="flex flex-col gap-2">
					<span className="text-xs text-vanilla-400">Switch</span>
					<TooltipSimple {...(args as TooltipSimpleProps)} title="Switch is disabled">
						<Switch disabled />
					</TooltipSimple>
				</div>
				<div className="flex flex-col gap-2">
					<span className="text-xs text-vanilla-400">Checkbox</span>
					<TooltipSimple {...(args as TooltipSimpleProps)} title="Checkbox is disabled">
						<Checkbox disabled />
					</TooltipSimple>
				</div>
				<div className="flex flex-col gap-2">
					<span className="text-xs text-vanilla-400">Select (primitive)</span>
					<Select disabled>
						<TooltipSimple {...(args as TooltipSimpleProps)} title="Select is disabled">
							<SelectTrigger className="w-[180px]">
								<SelectValue placeholder="Disabled select" />
							</SelectTrigger>
						</TooltipSimple>
						<SelectContent>
							<SelectItem value="1">Option 1</SelectItem>
							<SelectItem value="2">Option 2</SelectItem>
						</SelectContent>
					</Select>
				</div>
				<div className="flex flex-col gap-2">
					<span className="text-xs text-vanilla-400">SelectSimple</span>
					<TooltipSimple {...(args as TooltipSimpleProps)} title="Select is disabled">
						<SelectSimple
							items={[
								{ value: '1', label: 'Option 1' },
								{ value: '2', label: 'Option 2' },
							]}
							placeholder="Disabled select"
							disabled
						/>
					</TooltipSimple>
				</div>
				<div className="flex flex-col gap-2">
					<span className="text-xs text-vanilla-400">DropdownMenu (primitive)</span>
					<DropdownMenu>
						<TooltipSimple {...(args as TooltipSimpleProps)} title="Dropdown is disabled">
							<DropdownMenuTrigger asChild disabled>
								<Button variant={ButtonVariant.Outlined} color={ButtonColor.Secondary}>
									Disabled Dropdown
								</Button>
							</DropdownMenuTrigger>
						</TooltipSimple>
						<DropdownMenuContent>
							<DropdownMenuItem>Action 1</DropdownMenuItem>
							<DropdownMenuItem>Action 2</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
				<div className="flex flex-col gap-2">
					<span className="text-xs text-vanilla-400">DropdownMenuSimple</span>
					<TooltipSimple {...(args as TooltipSimpleProps)} title="Dropdown is disabled">
						<DropdownMenuSimple
							disabled
							menu={{
								items: [
									{ key: '1', label: 'Action 1' },
									{ key: '2', label: 'Action 2' },
								],
							}}
						>
							<Button variant={ButtonVariant.Outlined} color={ButtonColor.Secondary} disabled>
								Disabled Dropdown
							</Button>
						</DropdownMenuSimple>
					</TooltipSimple>
				</div>
			</div>
		</TooltipProvider>
	),
};
