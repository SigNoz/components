import { Bold, Italic, LayoutGrid, List, Underline } from '@signozhq/icons';
import { ToggleGroupSimple, type ToggleGroupSimpleItem } from '@signozhq/ui';
import type { Meta, StoryObj } from '@storybook/react-vite';

const meta: Meta<typeof ToggleGroupSimple> = {
	title: 'Composed Components/ToggleGroupSimple',
	component: ToggleGroupSimple,
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
			table: { category: 'Form', type: { summary: 'string | string[]' } },
		},
		value: {
			control: false,
			description: 'The controlled value(s). Use with onChange.',
			table: { category: 'Form', type: { summary: 'string | string[]' } },
		},
		onChange: {
			control: false,
			description: 'Callback when the value changes.',
			table: {
				category: 'Events',
				type: { summary: '(value: string) => void | (value: string[]) => void' },
			},
		},
		items: {
			control: false,
			description: 'List of items to display.',
			table: { category: 'Content', type: { summary: 'ToggleGroupSimpleItem[]' } },
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
		disabled: {
			control: 'boolean',
			description: 'Whether the group is disabled.',
			table: { category: 'Behavior', defaultValue: { summary: 'false' } },
		},
		orientation: {
			control: 'select',
			options: ['horizontal', 'vertical'],
			description: 'The orientation of the toggle group.',
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
type Story = StoryObj<typeof ToggleGroupSimple>;

const labelItems: ToggleGroupSimpleItem[] = [
	{ value: 'left', label: 'Left' },
	{ value: 'center', label: 'Center' },
	{ value: 'right', label: 'Right' },
];

const iconItems: ToggleGroupSimpleItem[] = [
	{ value: 'bold', label: <Bold size={12} />, 'aria-label': 'Bold' },
	{ value: 'italic', label: <Italic size={12} />, 'aria-label': 'Italic' },
	{ value: 'underline', label: <Underline size={12} />, 'aria-label': 'Underline' },
];

const iconAndLabelItems: ToggleGroupSimpleItem[] = [
	{
		value: 'grid',
		label: (
			<>
				<LayoutGrid size={24} /> Grid
			</>
		),
	},
	{
		value: 'list',
		label: (
			<>
				<List size={24} /> List
			</>
		),
	},
];

export const Default: Story = {
	args: {
		type: 'single',
		defaultValue: 'center',
		size: 'default',
		color: 'secondary',
		disabled: false,
		items: labelItems,
	},
	render: (args) => <ToggleGroupSimple {...args} />,
};

export const Preview: Story = {
	parameters: { chromatic: { disableSnapshot: false } },
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
					Single With Labels
				</h3>
				<ToggleGroupSimple type="single" defaultValue="center" items={labelItems} />
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
					Multiple With Icons
				</h3>
				<ToggleGroupSimple type="multiple" defaultValue={['bold']} items={iconItems} />
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
					Single With Icon And Label
				</h3>
				<ToggleGroupSimple type="single" defaultValue="grid" items={iconAndLabelItems} />
			</section>
		</div>
	),
};
