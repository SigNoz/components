import { PersistedAnnouncementBanner } from '@signozhq/ui';
import type { Meta, StoryObj } from '@storybook/react-vite';

const meta: Meta<typeof PersistedAnnouncementBanner> = {
	title: 'Components/AnnouncementBanner/PersistedAnnouncementBanner',
	component: PersistedAnnouncementBanner,
	parameters: {
		layout: 'fullscreen',
	},
	tags: ['autodocs'],
	argTypes: {
		storageKey: {
			control: 'text',
			description: 'localStorage key used to persist dismiss state.',
			table: { category: 'Behavior' },
		},
		type: {
			control: 'select',
			options: ['warning', 'info', 'error', 'success'],
			description: 'The type of banner.',
			table: { category: 'Appearance', defaultValue: { summary: 'warning' } },
		},
		children: {
			control: 'text',
			description: 'The message content.',
			table: { category: 'Content' },
		},
		onDismiss: {
			control: false,
			description: 'Called when the banner is dismissed.',
			table: { category: 'Events', type: { summary: '() => void' } },
		},
	},
	args: {
		storageKey: 'announcement-banner-story-demo',
		type: 'info',
		children:
			'This banner persists its dismiss state in localStorage. Dismiss it and refresh to see it stay hidden.',
	},
};

export default meta;
type Story = StoryObj<typeof PersistedAnnouncementBanner>;

export const Default: Story = {
	args: {
		storageKey: 'announcement-banner-story-demo',
		type: 'info',
		children:
			'This banner persists its dismiss state in localStorage. Dismiss it and refresh to see it stay hidden.',
	},
};
