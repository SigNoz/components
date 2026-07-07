import {
	Select,
	SelectContent,
	SelectItem,
	SelectPortal,
	SelectTrigger,
	Typography,
} from '@signozhq/ui';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import styles from './select-portal.stories.module.css';

const meta: Meta<typeof SelectPortal> = {
	title: 'Primitive Components/Select/SelectPortal',
	component: SelectPortal,
	argTypes: {
		container: {
			description: 'The container element to render the portal into.',
			table: {
				category: 'Behavior',
				type: { summary: 'HTMLElement' },
			},
		},
	},
	parameters: {
		layout: 'fullscreen',
	},
	tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof SelectPortal>;

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
					SelectPortal renders the content in a portal (by default to document.body). This is useful
					when the select is inside an overflow:hidden container. SelectContent uses this internally
					via the withPortal prop.
				</Typography>
				<div className={`story-panel ${styles.overflowPanel}`}>
					<Typography size="xs" color="muted" className={styles.panelHint}>
						This container has overflow:hidden, but the dropdown still shows outside.
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
			</div>
		);
	},
};
