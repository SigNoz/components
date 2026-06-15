import { RadioGroup, RadioGroupItem, RadioGroupLabel } from '@signozhq/ui';
import type { Meta, StoryObj } from '@storybook/react-vite';

const meta: Meta<typeof RadioGroupLabel> = {
	title: 'Primitive Components/RadioGroup/RadioGroupLabel',
	component: RadioGroupLabel,
	argTypes: {
		htmlFor: {
			control: 'text',
			description:
				'The id of the radio item this label is associated with. Links the label to its radio button.',
			table: { category: 'Accessibility', type: { summary: 'string' } },
		},
		id: {
			control: 'text',
			description: 'A unique identifier for the label element.',
			table: { category: 'Accessibility' },
		},
		className: {
			control: 'text',
			description: 'Additional CSS classes to apply to the label.',
			table: { category: 'Styling', type: { summary: 'string' } },
		},
		children: {
			control: 'text',
			description: 'The label text or content to display.',
			table: { category: 'Content' },
		},
	},
	parameters: {
		layout: 'fullscreen',
	},
	tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof RadioGroupLabel>;

export const Default: Story = {
	args: {
		htmlFor: 'radio-label-example',
		children: 'Option Label',
	},
	render: (args) => (
		<RadioGroup defaultValue="option1">
			<div style={{ display: 'flex', alignItems: 'center', flexDirection: 'row', gap: '0.5rem' }}>
				<RadioGroupItem value="option1" id="radio-label-example" />
				<RadioGroupLabel {...args} />
			</div>
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
					With Disabled Radio
				</h3>
				<RadioGroup>
					<div
						style={{ display: 'flex', alignItems: 'center', flexDirection: 'row', gap: '0.5rem' }}
					>
						<RadioGroupItem value="disabled" id="disabled-radio-label" disabled />
						<RadioGroupLabel htmlFor="disabled-radio-label" aria-disabled="true">
							Disabled Option
						</RadioGroupLabel>
					</div>
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
					Multiple Labels
				</h3>
				<RadioGroup defaultValue="option1">
					<div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
						<div
							style={{ display: 'flex', alignItems: 'center', flexDirection: 'row', gap: '0.5rem' }}
						>
							<RadioGroupItem value="option1" id="opt1" />
							<RadioGroupLabel htmlFor="opt1">First Option</RadioGroupLabel>
						</div>
						<div
							style={{ display: 'flex', alignItems: 'center', flexDirection: 'row', gap: '0.5rem' }}
						>
							<RadioGroupItem value="option2" id="opt2" />
							<RadioGroupLabel htmlFor="opt2">Second Option</RadioGroupLabel>
						</div>
						<div
							style={{ display: 'flex', alignItems: 'center', flexDirection: 'row', gap: '0.5rem' }}
						>
							<RadioGroupItem value="option3" id="opt3" disabled />
							<RadioGroupLabel htmlFor="opt3" aria-disabled="true">
								Disabled Option
							</RadioGroupLabel>
						</div>
					</div>
				</RadioGroup>
			</section>
		</div>
	),
};
