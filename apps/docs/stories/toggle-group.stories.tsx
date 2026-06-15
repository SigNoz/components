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
	title: 'Primitive Components/ToggleGroup',
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
		style: {
			control: false,
			description: 'Inline styles for custom styling.',
			table: { category: 'Styling', type: { summary: 'React.CSSProperties' } },
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
				<AlignLeft size={12} />
			</ToggleGroupItem>
			<ToggleGroupItem value="center" aria-label="Align center">
				<AlignCenter size={12} />
			</ToggleGroupItem>
			<ToggleGroupItem value="right" aria-label="Align right">
				<AlignRight size={12} />
			</ToggleGroupItem>
			<ToggleGroupItem value="justify" aria-label="Justify">
				<AlignJustify size={12} />
			</ToggleGroupItem>
		</ToggleGroup>
	),
};

export const ToggleGroupShowcase: Story = {
	parameters: {
		docs: { story: { autoplay: true } },
	},
	render: () => (
		<div style={{ padding: '2rem', borderRadius: '0.5rem', backgroundColor: 'var(--background)' }}>
			<div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
				{COLORS.map((color) => (
					<div key={color} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
						<h2
							style={{
								fontSize: '1rem',
								fontWeight: 600,
								textTransform: 'capitalize',
								color: 'var(--foreground)',
							}}
						>
							{color}
						</h2>
						<div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem' }}>
							{SIZES.map((size) => (
								<div key={size} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
									<h3
										style={{ fontSize: '0.875rem', fontWeight: 500, textTransform: 'capitalize' }}
									>
										{size}
									</h3>
									<ToggleGroup type="single" defaultValue="center" color={color} size={size}>
										<ToggleGroupItem value="left" aria-label="Align left">
											<AlignLeft size={12} />
										</ToggleGroupItem>
										<ToggleGroupItem value="center" aria-label="Align center">
											<AlignCenter size={12} />
										</ToggleGroupItem>
										<ToggleGroupItem value="right" aria-label="Align right">
											<AlignRight size={12} />
										</ToggleGroupItem>
										<ToggleGroupItem value="justify" aria-label="Justify">
											<AlignJustify size={12} />
										</ToggleGroupItem>
									</ToggleGroup>
								</div>
							))}
							<div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
								<h3 style={{ fontSize: '0.875rem', fontWeight: 500 }}>Disabled</h3>
								<ToggleGroup
									type="single"
									defaultValue="center"
									color={color}
									size="default"
									disabled
								>
									<ToggleGroupItem value="left" aria-label="Align left">
										<AlignLeft size={12} />
									</ToggleGroupItem>
									<ToggleGroupItem value="center" aria-label="Align center">
										<AlignCenter size={12} />
									</ToggleGroupItem>
									<ToggleGroupItem value="right" aria-label="Align right">
										<AlignRight size={12} />
									</ToggleGroupItem>
									<ToggleGroupItem value="justify" aria-label="Justify">
										<AlignJustify size={12} />
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
				<AlignLeft size={12} />
			</ToggleGroupItem>
			<ToggleGroupItem value="center" aria-label="Align center">
				<AlignCenter size={12} />
			</ToggleGroupItem>
			<ToggleGroupItem value="right" aria-label="Align right">
				<AlignRight size={12} />
			</ToggleGroupItem>
			<ToggleGroupItem value="justify" aria-label="Justify">
				<AlignJustify size={12} />
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
				<Bold size={12} />
			</ToggleGroupItem>
			<ToggleGroupItem value="italic" aria-label="Italic">
				<Italic size={12} />
			</ToggleGroupItem>
			<ToggleGroupItem value="underline" aria-label="Underline">
				<Underline size={12} />
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
				<LayoutGrid size={24} /> Label
			</ToggleGroupItem>
			<ToggleGroupItem value="second">
				<LayoutGrid size={24} /> Label
			</ToggleGroupItem>
			<ToggleGroupItem value="third">
				<LayoutGrid size={24} /> Label
			</ToggleGroupItem>
		</ToggleGroup>
	),
};
