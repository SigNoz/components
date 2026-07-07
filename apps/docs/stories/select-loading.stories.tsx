import {
	Select,
	SelectContent,
	SelectItem,
	SelectLoading,
	SelectTrigger,
	Typography,
} from '@signozhq/ui';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { useEffect, useState } from 'react';
import styles from './select-loading.stories.module.css';

const meta: Meta<typeof SelectLoading> = {
	title: 'Primitive Components/Select/SelectLoading',
	component: SelectLoading,
	argTypes: {
		children: {
			control: 'text',
			description: 'Loading message displayed to the user.',
			table: { category: 'Content', type: { summary: 'React.ReactNode' } },
		},
		className: {
			control: 'text',
			description: 'Additional CSS classes.',
			table: { category: 'Styling', type: { summary: 'string' } },
		},
		style: {
			control: 'object',
			description: 'Inline styles for the loading container.',
			table: { category: 'Styling', type: { summary: 'React.CSSProperties' } },
		},
		id: {
			control: 'text',
			description: 'Unique identifier for the element.',
			table: { category: 'Accessibility', type: { summary: 'string' } },
		},
		testId: {
			control: 'text',
			description: 'Test identifier for testing libraries.',
			table: { category: 'Testing', type: { summary: 'string' } },
		},
	},
	parameters: {
		layout: 'fullscreen',
	},
	tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof SelectLoading>;

const frameworks = [
	{ value: 'react', label: 'React' },
	{ value: 'vue', label: 'Vue' },
	{ value: 'angular', label: 'Angular' },
];

export const Default: Story = {
	args: {
		children: 'Loading options...',
	},
	render: (args) => (
		<div className="story-container">
			<Select defaultOpen>
				<SelectTrigger placeholder="Select a framework..." />
				<SelectContent>
					<SelectLoading {...args} />
				</SelectContent>
			</Select>
		</div>
	),
};

export const Variations: Story = {
	render: () => (
		<div className={`story-container-full ${styles.variationsContainer}`}>
			<div className="story-section">
				<div>
					<Typography size="sm" weight="medium" className={styles.sectionHeading}>
						Infinite Loading
					</Typography>
					<InfiniteLoadingExample />
				</div>
				<div>
					<Typography size="sm" weight="medium" className={styles.sectionHeading}>
						Loading with Delay (5s)
					</Typography>
					<DelayedLoadingExample />
				</div>
			</div>
		</div>
	),
};

function InfiniteLoadingExample() {
	return (
		<Select>
			<SelectTrigger placeholder="Select a framework..." />
			<SelectContent>
				<SelectLoading>Fetching options...</SelectLoading>
			</SelectContent>
		</Select>
	);
}

function DelayedLoadingExample() {
	const [isLoading, setIsLoading] = useState(true);
	const [items, setItems] = useState<typeof frameworks>([]);

	useEffect(() => {
		const timer = setTimeout(() => {
			setItems(frameworks);
			setIsLoading(false);
		}, 5000);
		return () => clearTimeout(timer);
	}, []);

	return (
		<Select>
			<SelectTrigger placeholder="Select a framework..." />
			<SelectContent>
				{isLoading ? (
					<SelectLoading>Loading options...</SelectLoading>
				) : (
					items.map((f) => (
						<SelectItem key={f.value} value={f.value}>
							{f.label}
						</SelectItem>
					))
				)}
			</SelectContent>
		</Select>
	);
}
