import { RadioGroup, RadioGroupItem } from '@signozhq/ui';
import type { Meta, StoryObj } from '@storybook/react-vite';

const meta: Meta<typeof RadioGroupItem> = {
	title: 'Primitive Components/RadioGroup/RadioGroupItem',
	component: RadioGroupItem,
	argTypes: {
		value: {
			control: 'text',
			description: 'The value given as data when submitted with a name.',
			table: { category: 'Form', type: { summary: 'string' } },
		},
		id: {
			control: 'text',
			description:
				'A unique identifier for the radio item. Links the radio with its label for accessibility.',
			table: { category: 'Accessibility' },
		},
		required: {
			control: 'boolean',
			description:
				'When true, indicates that the user must check the radio item before the owning form can be submitted.',
			table: { category: 'Behavior', defaultValue: { summary: 'false' } },
		},
		disabled: {
			control: 'boolean',
			description: 'When true, prevents the user from interacting with the radio item.',
			table: { category: 'Behavior', defaultValue: { summary: 'false' } },
		},
		testId: {
			control: 'text',
			description: 'The testId associated with the radio item for testing purposes.',
			table: { category: 'Testing', type: { summary: 'string' } },
		},
		className: {
			control: 'text',
			description: 'Additional CSS classes to apply to the radio item.',
			table: { category: 'Styling', type: { summary: 'string' } },
		},
		style: {
			control: false,
			description: 'Inline styles applied to the radio item.',
			table: { category: 'Styling', type: { summary: 'React.CSSProperties' } },
		},
		children: {
			control: 'text',
			description:
				'The content inside the radio item. Typically used for adding text or other elements as an inline label.',
			table: { category: 'Content' },
		},
		onCheck: {
			control: false,
			description: 'The callback invoked when the value state of the radio item changes.',
			table: { category: 'Events', type: { summary: '() => void' } },
		},
	},
	parameters: {
		layout: 'fullscreen',
	},
	tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof RadioGroupItem>;

export const Default: Story = {
	args: {
		value: 'option1',
		id: 'radio-item-default',
		children: 'Option 1',
		disabled: false,
	},
	render: (args) => (
		<RadioGroup defaultValue="option1">
			<RadioGroupItem {...args} />
		</RadioGroup>
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
					Checked
				</h3>
				<RadioGroup defaultValue="checked">
					<RadioGroupItem value="checked" id="radio-item-checked" disabled={false}>
						Checked option
					</RadioGroupItem>
				</RadioGroup>
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
				<RadioGroup>
					<RadioGroupItem value="disabled" id="radio-item-disabled" disabled={true}>
						Disabled option
					</RadioGroupItem>
				</RadioGroup>
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
					Disabled Checked
				</h3>
				<RadioGroup defaultValue="disabled-checked">
					<RadioGroupItem value="disabled-checked" id="radio-item-disabled-checked" disabled={true}>
						Disabled checked option
					</RadioGroupItem>
				</RadioGroup>
			</section>
		</div>
	),
};
