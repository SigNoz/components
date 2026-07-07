import {
	Button,
	ButtonColor,
	ButtonVariant,
	TooltipContent,
	TooltipProvider,
	TooltipRoot,
	TooltipSimple,
	TooltipTrigger,
	Typography,
} from '@signozhq/ui';
import type { Meta, StoryObj } from '@storybook/react-vite';
import styles from './tooltip.stories.module.css';

const SIDES = ['top', 'right', 'bottom', 'left'] as const;
const ALIGNS = ['start', 'center', 'end'] as const;

const meta: Meta<typeof TooltipRoot> = {
	title: 'Primitive Components/Tooltip',
	component: TooltipRoot,
	argTypes: {
		open: {
			control: 'boolean',
			description: 'The controlled open state of the tooltip.',
			table: { category: 'State', type: { summary: 'boolean' } },
		},
		defaultOpen: {
			control: 'boolean',
			description: 'The open state of the tooltip when it is initially rendered.',
			table: { category: 'State', type: { summary: 'boolean' } },
		},
		onOpenChange: {
			control: false,
			description: 'Event handler called when the open state of the tooltip changes.',
			table: { category: 'Events', type: { summary: '(open: boolean) => void' } },
		},
		delayDuration: {
			control: 'number',
			description:
				'The duration from when the pointer enters the trigger until the tooltip gets opened. This will override the prop with the same name passed to Provider.',
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
		testId: {
			control: 'text',
			description: 'The test id of the tooltip root.',
			table: { category: 'Testing', type: { summary: 'string' } },
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
type Story = StoryObj<typeof TooltipRoot>;

export const Default: Story = {
	render: () => (
		<TooltipProvider delayDuration={0}>
			<div className={`story-center ${styles.demoArea}`}>
				<TooltipSimple title="I'm a basic tooltip" arrow>
					<Button variant={ButtonVariant.Solid} color={ButtonColor.Secondary}>
						Hover me
					</Button>
				</TooltipSimple>
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
			<div className={`story-container-full ${styles.showcaseContainer}`}>
				<div className={styles.showcaseContent}>
					<div className="story-section">
						<Typography size="base" weight="semibold">
							Positions
						</Typography>
						<div className={styles.positionsContainer}>
							{SIDES.map((side) => (
								<TooltipRoot key={side}>
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
								</TooltipRoot>
							))}
						</div>
					</div>

					<div className="story-section">
						<Typography size="base" weight="semibold">
							Align variations
						</Typography>
						<div className={styles.alignContainer}>
							{ALIGNS.map((align) => (
								<TooltipRoot key={align}>
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
								</TooltipRoot>
							))}
						</div>
					</div>

					<div className="story-section">
						<Typography size="base" weight="semibold">
							With / without arrow
						</Typography>
						<div className="story-row-lg">
							<TooltipSimple title="No arrow" arrow={false}>
								<Button variant={ButtonVariant.Solid} color={ButtonColor.Secondary}>
									Without arrow
								</Button>
							</TooltipSimple>
							<TooltipSimple title="With arrow" arrow>
								<Button variant={ButtonVariant.Solid} color={ButtonColor.Secondary}>
									With arrow
								</Button>
							</TooltipSimple>
						</div>
					</div>

					<div className="story-section">
						<Typography size="base" weight="semibold">
							Delay variations
						</Typography>
						<div className="story-grid">
							<TooltipSimple title="No delay (0ms)" delayDuration={0}>
								<Button variant={ButtonVariant.Solid} color={ButtonColor.Secondary}>
									0ms
								</Button>
							</TooltipSimple>
							<TooltipSimple title="300ms delay" delayDuration={300}>
								<Button variant={ButtonVariant.Solid} color={ButtonColor.Secondary}>
									300ms
								</Button>
							</TooltipSimple>
							<TooltipSimple title="500ms delay" delayDuration={500}>
								<Button variant={ButtonVariant.Solid} color={ButtonColor.Secondary}>
									500ms
								</Button>
							</TooltipSimple>
							<TooltipSimple title="700ms delay (default)" delayDuration={700}>
								<Button variant={ButtonVariant.Solid} color={ButtonColor.Secondary}>
									700ms
								</Button>
							</TooltipSimple>
						</div>
					</div>

					<div className="story-section">
						<Typography size="base" weight="semibold">
							Default open
						</Typography>
						<TooltipSimple defaultOpen title="I am open by default">
							<Button variant={ButtonVariant.Solid} color={ButtonColor.Secondary}>
								Hover or focus to see tooltip
							</Button>
						</TooltipSimple>
					</div>

					<div className="story-section">
						<Typography size="base" weight="semibold">
							Custom content (composition)
						</Typography>
						<TooltipRoot>
							<TooltipTrigger asChild>
								<Button variant={ButtonVariant.Solid} color={ButtonColor.Primary}>
									Rich content
								</Button>
							</TooltipTrigger>
							<TooltipContent side="top" arrow>
								<Typography as="span" weight="medium">
									Custom tooltip
								</Typography>
								<br />
								<Typography as="span" size="sm" className={styles.multilineOpacity}>
									With multiple lines
								</Typography>
							</TooltipContent>
						</TooltipRoot>
					</div>
				</div>
			</div>
		</TooltipProvider>
	),
};
