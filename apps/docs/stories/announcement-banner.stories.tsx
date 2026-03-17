import { AnnouncementBanner, type AnnouncementBannerType } from '@signozhq/ui';
import type { Meta, StoryObj } from '@storybook/react-vite';
import React from 'react';

const meta: Meta<typeof AnnouncementBanner> = {
	title: 'Components/AnnouncementBanner',
	component: AnnouncementBanner,
	parameters: {
		layout: 'fullscreen',
	},
	argTypes: {
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

export const WithAction: Story = {
	args: {
		type: 'info',
		children: 'New feature available. Check it out now.',
	},
	render: (args) => (
		<AnnouncementBanner
			{...args}
			action={{
				label: 'Learn more',
				onClick: () => window.alert('Action clicked'),
			}}
		/>
	),
};

export const Dismissible: Story = {
	render: () => {
		const [visible, setVisible] = React.useState(true);
		if (!visible) return <></>;
		return (
			<AnnouncementBanner type="warning" onClose={() => setVisible(false)}>
				This banner can be dismissed. Click the X to close.
			</AnnouncementBanner>
		);
	},
};

export const AllTypes: Story = {
	render: () => (
		<div className="flex flex-col gap-4 p-6">
			<AnnouncementBanner type="warning">
				Warning: Please review your configuration before continuing.
			</AnnouncementBanner>
			<AnnouncementBanner type="info">
				Info: We have updated our terms of service.
			</AnnouncementBanner>
			<AnnouncementBanner type="error">
				Error: Something went wrong. Please try again.
			</AnnouncementBanner>
			<AnnouncementBanner type="success">Success: Your changes have been saved.</AnnouncementBanner>
		</div>
	),
};

export const WithActionAndDismiss: Story = {
	render: () => {
		const [visible, setVisible] = React.useState(true);
		if (!visible) return <></>;
		return (
			<AnnouncementBanner
				type="info"
				onClose={() => setVisible(false)}
				action={{
					label: 'View details',
					onClick: () => window.alert('Viewing details'),
				}}
			>
				New update available. You can view details or dismiss this banner.
			</AnnouncementBanner>
		);
	},
};
