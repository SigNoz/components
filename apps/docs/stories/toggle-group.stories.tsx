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
import { ToggleGroup, ToggleGroupItem, Typography } from '@signozhq/ui';
import type { Meta, StoryObj } from '@storybook/react-vite';
import styles from './toggle-group.stories.module.css';

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
				<AlignLeft className="icon-sm" />
			</ToggleGroupItem>
			<ToggleGroupItem value="center" aria-label="Align center">
				<AlignCenter className="icon-sm" />
			</ToggleGroupItem>
			<ToggleGroupItem value="right" aria-label="Align right">
				<AlignRight className="icon-sm" />
			</ToggleGroupItem>
			<ToggleGroupItem value="justify" aria-label="Justify">
				<AlignJustify className="icon-sm" />
			</ToggleGroupItem>
		</ToggleGroup>
	),
};

export const ToggleGroupShowcase: Story = {
	parameters: {
		docs: { story: { autoplay: true } },
	},
	render: () => (
		<div className="story-container-full">
			<div className={styles.showcaseContainer}>
				{COLORS.map((color) => (
					<div key={color} className="story-section">
						<Typography size="base" weight="semibold" className={styles.capitalize}>
							{color}
						</Typography>
						<div className={styles.colorSection}>
							{SIZES.map((size) => (
								<div key={size} className="story-section-sm">
									<Typography size="sm" weight="medium" className={styles.capitalize}>
										{size}
									</Typography>
									<ToggleGroup type="single" defaultValue="center" color={color} size={size}>
										<ToggleGroupItem value="left" aria-label="Align left">
											<AlignLeft className="icon-sm" />
										</ToggleGroupItem>
										<ToggleGroupItem value="center" aria-label="Align center">
											<AlignCenter className="icon-sm" />
										</ToggleGroupItem>
										<ToggleGroupItem value="right" aria-label="Align right">
											<AlignRight className="icon-sm" />
										</ToggleGroupItem>
										<ToggleGroupItem value="justify" aria-label="Justify">
											<AlignJustify className="icon-sm" />
										</ToggleGroupItem>
									</ToggleGroup>
								</div>
							))}
							<div className="story-section-sm">
								<Typography size="sm" weight="medium">
									Disabled
								</Typography>
								<ToggleGroup
									type="single"
									defaultValue="center"
									color={color}
									size="default"
									disabled
								>
									<ToggleGroupItem value="left" aria-label="Align left">
										<AlignLeft className="icon-sm" />
									</ToggleGroupItem>
									<ToggleGroupItem value="center" aria-label="Align center">
										<AlignCenter className="icon-sm" />
									</ToggleGroupItem>
									<ToggleGroupItem value="right" aria-label="Align right">
										<AlignRight className="icon-sm" />
									</ToggleGroupItem>
									<ToggleGroupItem value="justify" aria-label="Justify">
										<AlignJustify className="icon-sm" />
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
				<AlignLeft className="icon-sm" />
			</ToggleGroupItem>
			<ToggleGroupItem value="center" aria-label="Align center">
				<AlignCenter className="icon-sm" />
			</ToggleGroupItem>
			<ToggleGroupItem value="right" aria-label="Align right">
				<AlignRight className="icon-sm" />
			</ToggleGroupItem>
			<ToggleGroupItem value="justify" aria-label="Justify">
				<AlignJustify className="icon-sm" />
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
				<Bold className="icon-sm" />
			</ToggleGroupItem>
			<ToggleGroupItem value="italic" aria-label="Italic">
				<Italic className="icon-sm" />
			</ToggleGroupItem>
			<ToggleGroupItem value="underline" aria-label="Underline">
				<Underline className="icon-sm" />
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
				<LayoutGrid className={styles.iconLarge} /> Label
			</ToggleGroupItem>
			<ToggleGroupItem value="second">
				<LayoutGrid className={styles.iconLarge} /> Label
			</ToggleGroupItem>
			<ToggleGroupItem value="third">
				<LayoutGrid className={styles.iconLarge} /> Label
			</ToggleGroupItem>
		</ToggleGroup>
	),
};
