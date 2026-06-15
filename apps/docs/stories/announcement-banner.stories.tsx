import { AnnouncementBanner, type AnnouncementBannerType } from '@signozhq/ui';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';

const meta: Meta<typeof AnnouncementBanner> = {
	title: 'Composed Components/AnnouncementBanner',
	component: AnnouncementBanner,
	parameters: {
		layout: 'fullscreen',
	},
	argTypes: {
		id: {
			control: 'text',
			description: 'A unique identifier for the announcement banner.',
			table: { category: 'Accessibility', type: { summary: 'string' } },
		},
		type: {
			control: 'select',
			options: ['warning', 'info', 'error', 'success'] satisfies AnnouncementBannerType[],
			description: 'The type of banner to display.',
			table: { category: 'Appearance', defaultValue: { summary: 'warning' } },
		},
		icon: {
			control: false,
			description: 'Custom icon. Pass null to hide the default icon.',
			table: { category: 'Appearance' },
		},
		action: {
			control: false,
			description: 'Optional action button with label and onClick.',
			table: { category: 'Content', type: { summary: 'AnnouncementBannerAction' } },
		},
		onClose: {
			control: false,
			description: 'When provided, shows a dismiss button. Callback when dismissed.',
			table: { category: 'Events', type: { summary: '() => void' } },
		},
		children: {
			control: 'text',
			description: 'The message content.',
			table: { category: 'Content' },
		},
		testId: {
			control: 'text',
			description: 'Test id for the banner.',
			table: { category: 'Testing' },
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
	args: {
		type: 'warning',
		children: 'This is an important announcement. Please review before proceeding.',
	},
};

export default meta;
type Story = StoryObj<typeof AnnouncementBanner>;

export const Default: Story = {
	args: {
		type: 'warning',
		children: 'This is an important announcement. Please review before proceeding.',
	},
};

export const Preview: Story = {
	parameters: {
		chromatic: { disableSnapshot: false },
	},
	render: () => {
		const [dismissibleVisible, setDismissibleVisible] = useState(true);
		const [actionDismissVisible, setActionDismissVisible] = useState(true);

		return (
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
						With Action
					</h3>
					<AnnouncementBanner
						type="info"
						action={{
							label: 'Learn more',
							onClick: () => window.alert('Action clicked'),
						}}
					>
						New feature available. Check it out now.
					</AnnouncementBanner>
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
						Dismissible
					</h3>
					{dismissibleVisible ? (
						<AnnouncementBanner type="warning" onClose={() => setDismissibleVisible(false)}>
							This banner can be dismissed. Click the X to close.
						</AnnouncementBanner>
					) : null}
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
						All Types
					</h3>
					<div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
						<AnnouncementBanner type="warning">
							Warning: Please review your configuration before continuing.
						</AnnouncementBanner>
						<AnnouncementBanner type="info">
							Info: We have updated our terms of service.
						</AnnouncementBanner>
						<AnnouncementBanner type="error">
							Error: Something went wrong. Please try again.
						</AnnouncementBanner>
						<AnnouncementBanner type="success">
							Success: Your changes have been saved.
						</AnnouncementBanner>
					</div>
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
						With Action And Dismiss
					</h3>
					{actionDismissVisible ? (
						<AnnouncementBanner
							type="info"
							onClose={() => setActionDismissVisible(false)}
							action={{
								label: 'View details',
								onClick: () => window.alert('Viewing details'),
							}}
						>
							New update available. You can view details or dismiss this banner.
						</AnnouncementBanner>
					) : null}
				</section>
			</div>
		);
	},
};
