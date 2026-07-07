import { ChevronDown, ChevronsUpDown, ChevronUp } from '@signozhq/icons';
import {
	Select,
	SelectContent,
	SelectIcon,
	SelectItem,
	SelectTrigger,
	Typography,
} from '@signozhq/ui';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import styles from './select-icon.stories.module.css';

const meta: Meta<typeof SelectIcon> = {
	title: 'Primitive Components/Select/SelectIcon',
	component: SelectIcon,
	argTypes: {
		asChild: {
			control: 'boolean',
			description: 'Render as child element instead of default.',
			table: {
				category: 'Behavior',
				type: { summary: 'boolean' },
				defaultValue: { summary: 'false' },
			},
		},
		className: {
			control: 'text',
			description: 'Additional CSS classes.',
			table: { category: 'Styling', type: { summary: 'string' } },
		},
	},
	parameters: {
		layout: 'fullscreen',
	},
	tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof SelectIcon>;

const frameworks = [
	{ value: 'react', label: 'React' },
	{ value: 'vue', label: 'Vue' },
	{ value: 'angular', label: 'Angular' },
];

export const Default: Story = {
	render: () => {
		const [value, setValue] = useState('');

		return (
			<div className="story-container">
				<Typography size="sm" color="muted" className={styles.descriptionText}>
					SelectIcon is typically used internally by SelectTrigger. This example shows the default
					chevron icon.
				</Typography>
				<Select value={value} onChange={(v) => setValue(v as string)}>
					<SelectTrigger placeholder="Select a framework..." />
					<SelectContent>
						{frameworks.map((f) => (
							<SelectItem key={f.value} value={f.value}>
								{f.label}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</div>
		);
	},
};

export const StandaloneUsage: Story = {
	render: () => {
		return (
			<div className={`story-container ${styles.standaloneContainer}`}>
				<Typography size="sm" color="muted">
					SelectIcon is primarily an internal component used by SelectTrigger. These examples show
					the icon styling when rendered standalone.
				</Typography>

				<div className="story-section">
					<div className="story-row-lg">
						<Typography size="sm" className={styles.labelWidth}>
							ChevronDown:
						</Typography>
						<SelectIcon asChild>
							<ChevronDown className="icon-md" />
						</SelectIcon>
					</div>

					<div className="story-row-lg">
						<Typography size="sm" className={styles.labelWidth}>
							ChevronUp:
						</Typography>
						<SelectIcon asChild>
							<ChevronUp className="icon-md" />
						</SelectIcon>
					</div>

					<div className="story-row-lg">
						<Typography size="sm" className={styles.labelWidth}>
							ChevronsUpDown:
						</Typography>
						<SelectIcon asChild>
							<ChevronsUpDown className="icon-md" />
						</SelectIcon>
					</div>
				</div>
			</div>
		);
	},
};
