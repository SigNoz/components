import {
	AlignCenter,
	AlignJustify,
	AlignLeft,
	AlignRight,
	Bold,
	Italic,
	LayoutGrid,
	Underline,
} from '@signozhq/icons';
import { ToggleGroup, ToggleGroupItem } from '@signozhq/ui';
import type { Meta, StoryObj } from '@storybook/react-vite';

const meta: Meta<typeof ToggleGroup> = {
	title: 'Components/ToggleGroup',
	component: ToggleGroup,
	subcomponents: {
		ToggleGroupItem: ToggleGroupItem as React.ComponentType<unknown>,
	},
	argTypes: {
		type: {
			control: 'radio',
			options: ['single', 'multiple'],
			description: 'Whether one or multiple items can be selected.',
			table: { category: 'Form', type: { summary: "'single' | 'multiple'" } },
		},
		defaultValue: {
			control: 'text',
			description: 'The value(s) of the item(s) that should be pressed when initially rendered.',
			table: { category: 'Form' },
		},
		value: {
			control: false,
			description: 'The controlled value(s). Use with onChange.',
			table: { category: 'Form' },
		},
		onChange: {
			control: false,
			description: 'Callback when the value changes.',
			table: { category: 'Events', type: { summary: '(value: string | string[]) => void' } },
		},
		disabled: {
			control: 'boolean',
			description: 'Whether the group is disabled from user interaction.',
			table: { category: 'Behavior', defaultValue: { summary: 'false' } },
		},
		size: {
			control: 'radio',
			options: ['default', 'sm', 'lg'],
			description: 'The size of the toggle group.',
			table: { category: 'Appearance', defaultValue: { summary: 'default' } },
		},
		color: {
			control: 'select',
			options: ['primary', 'destructive', 'warning', 'secondary', 'none'],
			description: 'The color of the toggle group.',
			table: { category: 'Appearance', defaultValue: { summary: 'secondary' } },
		},
		orientation: {
			control: 'select',
			options: ['horizontal', 'vertical'],
			description: 'The orientation of the toggle group.',
			table: { category: 'Layout' },
		},
		rovingFocus: {
			control: 'boolean',
			description: 'Whether the group should maintain roving focus of its buttons.',
			table: { category: 'Behavior', defaultValue: { summary: 'true' } },
		},
		loop: {
			control: 'boolean',
			description: 'When true, keyboard navigation will loop.',
			table: { category: 'Behavior' },
		},
		dir: {
			control: 'select',
			options: ['ltr', 'rtl'],
			description: 'The direction of the toggle group.',
			table: { category: 'Layout' },
		},
		className: {
			control: 'text',
			description: 'Additional CSS classes.',
			table: { category: 'Styling' },
		},
		testId: {
			control: 'text',
			description: 'The testId for testing purposes.',
			table: { category: 'Testing' },
		},
	},
	parameters: {
		layout: 'fullscreen',
		design: [
			{
				name: 'Figma',
				type: 'figma',
				url: 'https://www.figma.com/design/egMidgk6VJDXTumxcCYUl1/Periscope---Primitives?node-id=12-757&p=f&t=DqcgJjfI3A74mvM2-0',
			},
		],
	},
	tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof ToggleGroup>;

const COLORS = ['primary', 'destructive', 'warning', 'secondary', 'none'] as const;
const SIZES = ['default', 'sm', 'lg'] as const;

export const Default: Story = {
	args: {
		type: 'single',
		defaultValue: 'center',
		size: 'default',
		color: 'secondary',
		disabled: false,
	},
	render: (args) => (
		<ToggleGroup {...args}>
			<ToggleGroupItem value="left" aria-label="Align left">
				<AlignLeft className="h-3 w-3" />
			</ToggleGroupItem>
			<ToggleGroupItem value="center" aria-label="Align center">
				<AlignCenter className="h-3 w-3" />
			</ToggleGroupItem>
			<ToggleGroupItem value="right" aria-label="Align right">
				<AlignRight className="h-3 w-3" />
			</ToggleGroupItem>
			<ToggleGroupItem value="justify" aria-label="Justify">
				<AlignJustify className="h-3 w-3" />
			</ToggleGroupItem>
		</ToggleGroup>
	),
};

export const ToggleGroupShowcase: Story = {
	parameters: {
		docs: { story: { autoplay: true } },
	},
	render: () => (
		<div className="p-8 rounded-lg bg-vanilla-100 dark:bg-background">
			<div className="space-y-12">
				{COLORS.map((color) => (
					<div key={color} className="space-y-4">
						<h2 className="text-base font-semibold capitalize text-foreground">{color}</h2>
						<div className="flex flex-wrap gap-8">
							{SIZES.map((size) => (
								<div key={size} className="space-y-2">
									<h3 className="text-sm font-medium capitalize">{size}</h3>
									<ToggleGroup type="single" defaultValue="center" color={color} size={size}>
										<ToggleGroupItem value="left" aria-label="Align left">
											<AlignLeft className="h-3 w-3" />
										</ToggleGroupItem>
										<ToggleGroupItem value="center" aria-label="Align center">
											<AlignCenter className="h-3 w-3" />
										</ToggleGroupItem>
										<ToggleGroupItem value="right" aria-label="Align right">
											<AlignRight className="h-3 w-3" />
										</ToggleGroupItem>
										<ToggleGroupItem value="justify" aria-label="Justify">
											<AlignJustify className="h-3 w-3" />
										</ToggleGroupItem>
									</ToggleGroup>
								</div>
							))}
							<div className="space-y-2">
								<h3 className="text-sm font-medium">Disabled</h3>
								<ToggleGroup
									type="single"
									defaultValue="center"
									color={color}
									size="default"
									disabled
								>
									<ToggleGroupItem value="left" aria-label="Align left">
										<AlignLeft className="h-3 w-3" />
									</ToggleGroupItem>
									<ToggleGroupItem value="center" aria-label="Align center">
										<AlignCenter className="h-3 w-3" />
									</ToggleGroupItem>
									<ToggleGroupItem value="right" aria-label="Align right">
										<AlignRight className="h-3 w-3" />
									</ToggleGroupItem>
									<ToggleGroupItem value="justify" aria-label="Justify">
										<AlignJustify className="h-3 w-3" />
									</ToggleGroupItem>
								</ToggleGroup>
							</div>
						</div>
					</div>
				))}
			</div>
		</div>
	),
};

export const SingleChoice: Story = {
	args: {
		type: 'single',
		defaultValue: 'center',
		size: 'default',
		disabled: false,
	},
	render: (args) => (
		<ToggleGroup {...args}>
			<ToggleGroupItem value="left" aria-label="Align left">
				<AlignLeft className="h-3 w-3" />
			</ToggleGroupItem>
			<ToggleGroupItem value="center" aria-label="Align center">
				<AlignCenter className="h-3 w-3" />
			</ToggleGroupItem>
			<ToggleGroupItem value="right" aria-label="Align right">
				<AlignRight className="h-3 w-3" />
			</ToggleGroupItem>
			<ToggleGroupItem value="justify" aria-label="Justify">
				<AlignJustify className="h-3 w-3" />
			</ToggleGroupItem>
		</ToggleGroup>
	),
};

export const MultipleChoices: Story = {
	args: {
		type: 'multiple',
		defaultValue: ['bold'],
		size: 'default',
		disabled: false,
	},
	render: (args) => (
		<ToggleGroup {...args}>
			<ToggleGroupItem value="bold" aria-label="Bold">
				<Bold className="h-3 w-3" />
			</ToggleGroupItem>
			<ToggleGroupItem value="italic" aria-label="Italic">
				<Italic className="h-3 w-3" />
			</ToggleGroupItem>
			<ToggleGroupItem value="underline" aria-label="Underline">
				<Underline className="h-3 w-3" />
			</ToggleGroupItem>
		</ToggleGroup>
	),
};

export const WithLabels: Story = {
	args: {
		type: 'single',
		defaultValue: 'first',
		size: 'default',
		disabled: false,
	},
	render: (args) => (
		<ToggleGroup {...args}>
			<ToggleGroupItem value="first">
				<LayoutGrid className="h-6 w-6" /> Label
			</ToggleGroupItem>
			<ToggleGroupItem value="second">
				<LayoutGrid className="h-6 w-6" /> Label
			</ToggleGroupItem>
			<ToggleGroupItem value="third">
				<LayoutGrid className="h-6 w-6" /> Label
			</ToggleGroupItem>
		</ToggleGroup>
	),
};
