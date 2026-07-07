import { Progress, type ProgressProps, Typography } from '@signozhq/ui';
import type { Meta, StoryFn } from '@storybook/react-vite';
import styles from './progress.stories.module.css';

const meta: Meta<typeof Progress> = {
	title: 'Primitive Components/Progress',
	component: Progress,
	argTypes: {
		percent: {
			control: { type: 'range', min: 0, max: 100 },
			description: 'The completion value of the progress bar, from 0 to 100.',
			table: { category: 'Data', type: { summary: 'number' }, defaultValue: { summary: '0' } },
		},
		steps: {
			control: 'number',
			description:
				'If provided, divides the progress bar into equal visual segments instead of a continuous bar.',
			table: { category: 'Appearance', type: { summary: 'number | undefined' } },
		},
		strokeLinecap: {
			control: 'select',
			options: ['butt', 'round'],
			description: 'Controls the edge styling of the progress indicator.',
			table: {
				category: 'Appearance',
				type: { summary: "'butt' | 'round'" },
				defaultValue: { summary: "'butt'" },
			},
		},
		strokeColor: {
			control: 'color',
			description: "A CSS color value to dynamically override the indicator's background color.",
			table: { category: 'Appearance', type: { summary: 'string' } },
		},
		size: {
			control: 'select',
			options: ['small', 'default'],
			description: 'The vertical thickness of the progress bar.',
			table: {
				category: 'Appearance',
				type: { summary: "'small' | 'default'" },
				defaultValue: { summary: "'default'" },
			},
		},
		showInfo: {
			control: 'boolean',
			description: 'If true, renders the percent value as text next to the progress bar.',
			table: {
				category: 'Content',
				type: { summary: 'boolean' },
				defaultValue: { summary: 'false' },
			},
		},
		status: {
			control: 'select',
			options: ['normal', 'active'],
			description: "If 'active', applies a subtle striped animation to the progress bar.",
			table: {
				category: 'State',
				type: { summary: "'normal' | 'active'" },
				defaultValue: { summary: "'normal'" },
			},
		},
		className: {
			control: 'text',
			description: 'Additional CSS classes for custom styling.',
			table: { category: 'Styling', type: { summary: 'string' } },
		},
		style: {
			control: 'object',
			description: 'Inline styles applied to the progress wrapper.',
			table: { category: 'Styling', type: { summary: 'React.CSSProperties' } },
		},
		id: {
			control: 'text',
			description: 'A unique identifier for the progress bar.',
			table: { category: 'Accessibility', type: { summary: 'string' } },
		},
		testId: {
			control: 'text',
			description: 'Test ID for the progress bar.',
			table: { category: 'Testing', type: { summary: 'string' } },
		},
	},
	parameters: {
		layout: 'padded',
		backgrounds: {
			default: 'dark',
			values: [{ name: 'dark', value: '#1a1a1a' }],
		},
	},
};

export default meta;

// Default Template
const Template: StoryFn<typeof Progress> = (args: ProgressProps) => (
	<div className={styles.progressContainer}>
		<Progress {...args} />
	</div>
);

// 1. Default: A basic continuous progress bar
export const Default = Template.bind({});
Default.args = {
	percent: 50,
};

// 2. Sizes: Show both default and small sizes
export const Sizes: StoryFn = () => (
	<div className={`story-section ${styles.progressContainer}`}>
		<div>
			<Typography as="h3" size="sm" weight="medium" className={styles.sectionHeading}>
				Small Size
			</Typography>
			<Progress percent={70} size="small" />
		</div>
		<div>
			<Typography as="h3" size="sm" weight="medium" className={styles.sectionHeading}>
				Default Size
			</Typography>
			<Progress percent={70} size="default" />
		</div>
	</div>
);

// 3. Dynamic Colors: custom hex values or design tokens
export const DynamicColors: StoryFn = () => (
	<div className={`story-section ${styles.progressContainer}`}>
		<div>
			<Typography as="h3" size="sm" weight="medium" className={styles.sectionHeading}>
				Critical (Red)
			</Typography>
			<Progress percent={80} strokeColor="#ef4444" />
		</div>
		<div>
			<Typography as="h3" size="sm" weight="medium" className={styles.sectionHeading}>
				Warning (Yellow)
			</Typography>
			<Progress percent={60} strokeColor="#eab308" />
		</div>
		<div>
			<Typography as="h3" size="sm" weight="medium" className={styles.sectionHeading}>
				Success (Green)
			</Typography>
			<Progress percent={100} strokeColor="#22c55e" />
		</div>
	</div>
);

// 4. Segmented (Steps)
export const Segmented: StoryFn = () => (
	<div className={`story-section ${styles.progressContainer}`}>
		<div>
			<Typography as="h3" size="sm" weight="medium" className={styles.sectionHeading}>
				5 Steps, 40%
			</Typography>
			<Progress percent={40} steps={5} />
		</div>
		<div>
			<Typography as="h3" size="sm" weight="medium" className={styles.sectionHeading}>
				10 Steps, 70%
			</Typography>
			<Progress percent={70} steps={10} strokeColor="#10b981" />
		</div>
	</div>
);

// 5. With Info
export const WithInfo: StoryFn = () => (
	<div className={`story-section ${styles.progressContainer}`}>
		<div>
			<Typography as="h3" size="sm" weight="medium" className={styles.sectionHeading}>
				Showing Info Text
			</Typography>
			<Progress percent={45} showInfo />
		</div>
		<div>
			<Typography as="h3" size="sm" weight="medium" className={styles.sectionHeading}>
				Active Status with Info
			</Typography>
			<Progress percent={85} showInfo status="active" />
		</div>
	</div>
);

// 6. Stroke Linecap (Extra)
export const StrokeLinecap: StoryFn = () => (
	<div className={`story-section ${styles.progressContainer}`}>
		<div>
			<Typography as="h3" size="sm" weight="medium" className={styles.sectionHeading}>
				Round (Default for track, butt for indicator usually, but let us test)
			</Typography>
			<Progress percent={50} strokeLinecap="round" />
		</div>
		<div>
			<Typography as="h3" size="sm" weight="medium" className={styles.sectionHeading}>
				Butt
			</Typography>
			<Progress percent={50} strokeLinecap="butt" />
		</div>
	</div>
);
