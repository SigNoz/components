import {
	Button,
	ButtonColor,
	ButtonVariant,
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from '@signozhq/ui';
import type { Meta, StoryObj } from '@storybook/react-vite';

const SIDES = ['top', 'right', 'bottom', 'left'] as const;
const ALIGNS = ['start', 'center', 'end'] as const;

const meta: Meta<typeof Tooltip> = {
	title: 'Components/Tooltip',
	component: Tooltip,
	argTypes: {
		testId: {
			control: 'text',
			description: 'Test ID for the tooltip.',
			table: { category: 'Testing', type: { summary: 'string' } },
		},
		id: {
			control: 'text',
			description: 'A unique identifier for the tooltip.',
			table: { category: 'Accessibility', type: { summary: 'string' } },
		},
		className: {
			control: 'text',
			description: 'Additional CSS classes for custom styling.',
			table: { category: 'Styling', type: { summary: 'string' } },
		},
		open: {
			control: 'boolean',
			description:
				'The controlled open state of the tooltip. Must be used in conjunction with onOpenChange.',
			table: { category: 'State', type: { summary: 'boolean' } },
		},
		defaultOpen: {
			control: 'boolean',
			description:
				'The open state of the tooltip when it is initially rendered. Use when you do not need to control its open state.',
			table: { category: 'State', type: { summary: 'boolean' } },
		},
		delayDuration: {
			control: 'number',
			description:
				'The duration from when the pointer enters the trigger until the tooltip gets opened. Overrides the prop passed to Provider.',
			table: {
				category: 'Behavior',
				type: { summary: 'number' },
				defaultValue: { summary: '700' },
			},
		},
		disableHoverableContent: {
			control: 'boolean',
			description:
				'When true, trying to hover the content will result in the tooltip closing as the pointer leaves the trigger.',
			table: {
				category: 'Behavior',
				type: { summary: 'boolean' },
				defaultValue: { summary: 'false' },
			},
		},
		title: {
			control: 'text',
			description:
				'The content of the tooltip. Otherwise, the children will be used as the tooltip content.',
			table: { category: 'Content', type: { summary: 'React.ReactNode' } },
		},
		arrow: {
			control: 'boolean',
			description: 'Whether to show the arrow.',
			table: { category: 'Appearance', type: { summary: 'boolean' } },
		},
		onOpenChange: {
			control: false,
			description: 'Event handler called when the open state of the tooltip changes.',
			table: { category: 'Events', type: { summary: '(open: boolean) => void' } },
		},
	},
	parameters: {
		layout: 'fullscreen',
		design: {
			type: 'figma',
			url: 'https://www.figma.com/design/egMidgk6VJDXTumxcCYUl1/Periscope---Primitives?node-id=12-746&m=dev',
		},
	},
};

export default meta;
type Story = StoryObj<typeof Tooltip>;

export const Default: Story = {
	args: {
		title: "I'm a basic tooltip",
		arrow: false,
		delayDuration: 0,
	},
	render: (args) => (
		<TooltipProvider delayDuration={args.delayDuration ?? 0}>
			<div className="p-20 flex items-center justify-center">
				<Tooltip {...args}>
					<Button variant={ButtonVariant.Solid} color={ButtonColor.Secondary}>
						Hover me
					</Button>
				</Tooltip>
			</div>
		</TooltipProvider>
	),
};

export const TooltipShowcase: Story = {
	parameters: {
		docs: { story: { autoplay: true } },
	},
	render: () => (
		<TooltipProvider delayDuration={0}>
			<div className="p-8 rounded-lg bg-vanilla-100 dark:bg-background min-h-[600px]">
				<div className="space-y-16">
					<div className="space-y-4">
						<h2 className="text-base font-semibold text-foreground">Positions</h2>
						<div className="flex flex-wrap gap-8 items-center">
							{SIDES.map((side) => (
								<Tooltip key={side}>
									<TooltipTrigger asChild>
										<Button
											variant={ButtonVariant.Solid}
											color={ButtonColor.Secondary}
											className="capitalize"
										>
											{side}
										</Button>
									</TooltipTrigger>
									<TooltipContent side={side} arrow>
										Tooltip on {side}
									</TooltipContent>
								</Tooltip>
							))}
						</div>
					</div>

					<div className="space-y-4">
						<h2 className="text-base font-semibold text-foreground">Align variations</h2>
						<div className="flex flex-wrap gap-8">
							{ALIGNS.map((align) => (
								<Tooltip key={align}>
									<TooltipTrigger asChild>
										<Button
											variant={ButtonVariant.Solid}
											color={ButtonColor.Secondary}
											className="capitalize"
										>
											{align}
										</Button>
									</TooltipTrigger>
									<TooltipContent side="top" align={align} arrow>
										Align {align}
									</TooltipContent>
								</Tooltip>
							))}
						</div>
					</div>

					<div className="space-y-4">
						<h2 className="text-base font-semibold text-foreground">With / without arrow</h2>
						<div className="flex gap-4">
							<Tooltip title="No arrow" arrow={false}>
								<Button variant={ButtonVariant.Solid} color={ButtonColor.Secondary}>
									Without arrow
								</Button>
							</Tooltip>
							<Tooltip title="With arrow" arrow>
								<Button variant={ButtonVariant.Solid} color={ButtonColor.Secondary}>
									With arrow
								</Button>
							</Tooltip>
						</div>
					</div>

					<div className="space-y-4">
						<h2 className="text-base font-semibold text-foreground">Delay variations</h2>
						<div className="flex gap-4 flex-wrap">
							<Tooltip title="No delay (0ms)" delayDuration={0}>
								<Button variant={ButtonVariant.Solid} color={ButtonColor.Secondary}>
									0ms
								</Button>
							</Tooltip>
							<Tooltip title="300ms delay" delayDuration={300}>
								<Button variant={ButtonVariant.Solid} color={ButtonColor.Secondary}>
									300ms
								</Button>
							</Tooltip>
							<Tooltip title="500ms delay" delayDuration={500}>
								<Button variant={ButtonVariant.Solid} color={ButtonColor.Secondary}>
									500ms
								</Button>
							</Tooltip>
							<Tooltip title="700ms delay (default)" delayDuration={700}>
								<Button variant={ButtonVariant.Solid} color={ButtonColor.Secondary}>
									700ms
								</Button>
							</Tooltip>
						</div>
					</div>

					<div className="space-y-4">
						<h2 className="text-base font-semibold text-foreground">Default open</h2>
						<Tooltip defaultOpen title="I am open by default">
							<Button variant={ButtonVariant.Solid} color={ButtonColor.Secondary}>
								Hover or focus to see tooltip
							</Button>
						</Tooltip>
					</div>

					<div className="space-y-4">
						<h2 className="text-base font-semibold text-foreground">Custom content</h2>
						<Tooltip>
							<TooltipTrigger asChild>
								<Button variant={ButtonVariant.Solid} color={ButtonColor.Primary}>
									Rich content
								</Button>
							</TooltipTrigger>
							<TooltipContent side="top" arrow>
								<span className="font-medium">Custom tooltip</span>
								<br />
								<span className="text-sm opacity-90">With multiple lines</span>
							</TooltipContent>
						</Tooltip>
					</div>
				</div>
			</div>
		</TooltipProvider>
	),
};
