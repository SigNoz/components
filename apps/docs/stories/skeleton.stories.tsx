import { Skeleton } from '@signozhq/ui';
import type { Meta, StoryObj } from '@storybook/react-vite';
import styles from './skeleton.stories.module.css';

const meta: Meta<typeof Skeleton> = {
	title: 'Primitive Components/Skeleton',
	component: Skeleton,
	argTypes: {
		active: {
			control: 'boolean',
			description: 'Whether to show an animated pulse effect.',
		},
		title: {
			control: 'object',
			description: 'Show/hide the title placeholder or configure its width.',
		},
		paragraph: {
			control: 'object',
			description: 'Configure paragraph rows and widths.',
		},
		className: {
			control: 'text',
			description: 'Additional CSS classes.',
		},
	},
};

export default meta;
type Story = StoryObj<typeof Skeleton>;

export const Default: Story = {
	args: {
		active: true,
		title: { width: '40%' },
		paragraph: { rows: 3 },
	},
};

export const Overview: Story = {
	render: () => (
		<div className={styles.container}>
			{/* Base variants */}
			<div>
				<p className={styles.sectionLabel}>Base — with title & paragraph</p>
				<Skeleton active title={{ width: '40%' }} paragraph={{ rows: 3 }} />
			</div>

			<div>
				<p className={styles.sectionLabel}>Base — variable row widths</p>
				<Skeleton active paragraph={{ rows: 4, width: ['100%', '95%', '80%', '60%'] }} />
			</div>

			<div>
				<p className={styles.sectionLabel}>Base — no animation</p>
				<Skeleton active={false} title={{ width: '40%' }} paragraph={{ rows: 3 }} />
			</div>

			{/* Skeleton.Input */}
			<div>
				<p className={styles.sectionLabel}>Skeleton.Input — small</p>
				<Skeleton.Input active size="small" />
			</div>

			<div>
				<p className={styles.sectionLabel}>Skeleton.Input — default</p>
				<Skeleton.Input active />
			</div>

			<div>
				<p className={styles.sectionLabel}>Skeleton.Input — large & block</p>
				<Skeleton.Input active size="large" block />
			</div>

			{/* Skeleton.Button */}
			<div>
				<p className={styles.sectionLabel}>Skeleton.Button — small</p>
				<Skeleton.Button active size="small" />
			</div>

			<div>
				<p className={styles.sectionLabel}>Skeleton.Button — block</p>
				<Skeleton.Button active block />
			</div>

			{/* Skeleton.Avatar */}
			<div className={styles.avatarRow}>
				<div>
					<p className={styles.sectionLabel}>Avatar — circle</p>
					<Skeleton.Avatar active shape="circle" size={36} />
				</div>
				<div>
					<p className={styles.sectionLabel}>Avatar — square</p>
					<Skeleton.Avatar active shape="square" size={36} />
				</div>
			</div>

			{/* Composed */}
			<div>
				<p className={styles.sectionLabel}>Composed — avatar + content</p>
				<div className={styles.composedRow}>
					<Skeleton.Avatar active shape="circle" size={48} />
					<div className={styles.composedContent}>
						<Skeleton active title={{ width: '40%' }} paragraph={{ rows: 3 }} />
					</div>
				</div>
			</div>
		</div>
	),
};
