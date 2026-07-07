import { Avatar, Typography, type AvatarColor, type AvatarSize } from '@signozhq/ui';
import type { Meta, StoryObj } from '@storybook/react-vite';
import styles from './avatar.stories.module.css';

const meta: Meta<typeof Avatar> = {
	title: 'Primitive Components/Avatar',
	component: Avatar,
	parameters: {
		layout: 'fullscreen',
		docs: {
			description: {
				component:
					'A versatile avatar component for displaying user profile images, initials, or icons. Supports multiple sizes, shapes, color themes, image loading with fallback, and a skeleton loading state.',
			},
		},
	},
	argTypes: {
		size: {
			control: 'inline-radio',
			options: ['sm', 'md', 'lg', 'xl'],
			description: 'The size of the avatar.',
			table: { category: 'Appearance', defaultValue: { summary: 'md' } },
		},
		shape: {
			control: 'inline-radio',
			options: ['circle', 'square'],
			description: 'The shape of the avatar.',
			table: { category: 'Appearance', defaultValue: { summary: 'circle' } },
		},
		color: {
			control: 'select',
			options: [
				'primary',
				'secondary',
				'success',
				'error',
				'warning',
				'robin',
				'forest',
				'amber',
				'sienna',
				'cherry',
				'sakura',
				'aqua',
				'vanilla',
			],
			description: 'The color theme of the avatar background.',
			table: { category: 'Appearance' },
		},
		src: {
			control: 'text',
			description: 'Image URL for the avatar.',
			table: { category: 'Content' },
		},
		alt: {
			control: 'text',
			description: 'Alt text for the avatar image.',
			table: { category: 'Accessibility' },
		},
		loading: {
			control: 'boolean',
			description: 'When true, renders a shimmer skeleton placeholder.',
			table: { category: 'Behavior', defaultValue: { summary: 'false' } },
		},
		children: {
			control: 'text',
			description: 'Fallback content (initials, icon) when no image is provided.',
			table: { category: 'Content' },
		},
		testId: {
			control: 'text',
			description: 'Test ID for the avatar.',
			table: { category: 'Testing', type: { summary: 'string' } },
		},
		className: {
			control: 'text',
			description: 'Additional CSS classes.',
			table: { category: 'Styling', type: { summary: 'string' } },
		},
	},
};

export default meta;

type Story = StoryObj<typeof Avatar>;

export const Playground: Story = {
	args: {
		size: 'md',
		shape: 'circle',
		children: 'AB',
		color: 'robin',
		loading: false,
	},
};

export const AllSizes: Story = {
	parameters: {
		docs: {
			description: {
				story: 'Avatar comes in four sizes: sm (24px), md (32px), lg (40px), and xl (48px).',
			},
		},
	},
	render: () => {
		const sizes: AvatarSize[] = ['sm', 'md', 'lg', 'xl'];
		return (
			<div className={`story-row-lg ${styles.flexRowAlignEnd}`}>
				{sizes.map((size) => (
					<div key={size} className="story-column">
						<Avatar size={size} color="robin">
							{size.toUpperCase()}
						</Avatar>
						<Typography size="xs" color="muted">
							{size}
						</Typography>
					</div>
				))}
			</div>
		);
	},
};

export const Shapes: Story = {
	parameters: {
		docs: {
			description: {
				story: 'Avatars can be circular (default) or square with rounded corners.',
			},
		},
	},
	render: () => (
		<div className="story-row-lg">
			<div className="story-column">
				<Avatar size="lg" shape="circle" color="robin">
					AB
				</Avatar>
				<Typography size="xs" color="muted">
					circle
				</Typography>
			</div>
			<div className="story-column">
				<Avatar size="lg" shape="square" color="robin">
					AB
				</Avatar>
				<Typography size="xs" color="muted">
					square
				</Typography>
			</div>
		</div>
	),
};

export const AllColors: Story = {
	parameters: {
		docs: {
			description: {
				story: 'All available color themes for avatars with initials.',
			},
		},
	},
	render: () => {
		const colors: AvatarColor[] = [
			'robin',
			'forest',
			'amber',
			'sienna',
			'cherry',
			'sakura',
			'aqua',
			'vanilla',
		];
		return (
			<div className="story-grid-lg">
				{colors.map((color) => (
					<div key={color} className="story-column">
						<Avatar size="lg" color={color}>
							{color.slice(0, 2).toUpperCase()}
						</Avatar>
						<Typography size="xs" color="muted">
							{color}
						</Typography>
					</div>
				))}
			</div>
		);
	},
};

export const WithImage: Story = {
	parameters: {
		docs: {
			description: {
				story:
					'When a `src` prop is provided, the avatar displays an image. If the image fails to load, it falls back to `children`.',
			},
		},
	},
	render: () => (
		<div className="story-row-lg">
			<Avatar size="xl" src="https://i.pravatar.cc/96?u=1" alt="User avatar" />
			<Avatar size="lg" src="https://i.pravatar.cc/80?u=2" alt="User avatar" />
			<Avatar size="md" src="https://i.pravatar.cc/64?u=3" alt="User avatar" />
			<Avatar size="sm" src="https://i.pravatar.cc/48?u=4" alt="User avatar" />
		</div>
	),
};

export const ImageFallback: Story = {
	parameters: {
		docs: {
			description: {
				story:
					'When an image fails to load, the avatar falls back to displaying the `children` content (e.g., initials).',
			},
		},
	},
	render: () => (
		<div className="story-row-lg">
			<Avatar size="lg" src="https://broken-url.invalid/avatar.png" color="cherry">
				JD
			</Avatar>
			<Typography size="sm" color="muted">
				Broken image URL → falls back to initials
			</Typography>
		</div>
	),
};

export const Loading: Story = {
	parameters: {
		docs: {
			description: {
				story:
					'Set `loading` to render a shimmer skeleton placeholder. Useful while fetching user data.',
			},
		},
	},
	render: () => (
		<div className="story-row-lg">
			<Avatar size="xl" shape="circle" loading />
			<Avatar size="lg" shape="circle" loading />
			<Avatar size="lg" shape="square" loading />
			<Avatar size="md" shape="circle" loading />
			<Avatar size="sm" shape="circle" loading />
		</div>
	),
};
