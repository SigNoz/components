import { Star, Sun, Zap } from '@signozhq/icons';
import { Callout } from '@signozhq/ui';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';

const meta: Meta<typeof Callout> = {
	title: 'Components/Callout',
	component: Callout,
	parameters: {
		layout: 'fullscreen',
		design: {
			type: 'figma',
			url: 'https://www.figma.com/design/egMidgk6VJDXTumxcCYUl1/Periscope---Primitives?node-id=12-749&m=dev',
		},
	},
	argTypes: {
		title: {
			control: 'text',
			description: 'The main title of the callout.',
			table: { category: 'Content' },
		},
		children: {
			control: 'text',
			description: 'Additional descriptive text for the callout.',
			table: { category: 'Content' },
		},
		type: {
			control: 'select',
			options: ['info', 'success', 'warning', 'error'],
			description: 'Determines the default color scheme and icon.',
			table: { category: 'Appearance', defaultValue: { summary: 'info' } },
		},
		showIcon: {
			control: 'boolean',
			description: 'Whether to show the default icon based on the type.',
			table: { category: 'Appearance', defaultValue: { summary: 'true' } },
		},
		icon: {
			control: false,
			description:
				'Custom ReactNode to use as the icon. Overrides default icon if `showIcon` is also true.',
			table: { category: 'Appearance' },
		},
		color: {
			control: 'select',
			options: ['robin', 'forest', 'amber', 'cherry', 'sienna', 'aqua'],
			description: 'Overrides the default color derived from `type`. Uses predefined color names.',
			table: { category: 'Appearance' },
		},
		size: {
			control: 'radio',
			options: ['small', 'medium'],
			description: 'The size of the callout component.',
			table: { category: 'Appearance', defaultValue: { summary: 'small' } },
		},
		className: {
			control: 'text',
			description: 'Additional CSS classes for custom styling.',
			table: { category: 'Customization' },
		},
		action: {
			control: 'radio',
			options: ['none', 'dismissible', 'expandable'],
			description:
				'Action button type: none (no button), dismissible (X button), or expandable (chevron toggle).',
			table: { category: 'Behavior', defaultValue: { summary: 'none' } },
		},
		onClick: {
			action: 'action-clicked',
			description: 'Function called when the action button (dismiss or expand) is clicked.',
			table: { category: 'Events', type: { summary: '() => void' } },
		},
	},
	args: {
		type: 'info',
		showIcon: true,
		size: 'medium',
		title: 'Important Information',
		children: 'This is additional information that provides more context about the callout.',
		action: 'none',
	},
	tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Callout>;

// Default story
export const Default: Story = {
	args: {
		type: 'info',
		showIcon: true,
		size: 'medium',
		title: 'Important Information',
		children: 'This is additional information that provides more context about the callout.',
		action: 'none',
	},
};

// All variants overview
export const AllVariants: Story = {
	render: () => (
		<div className="flex flex-col max-w-800px gap-6 p-6">
			{/* Type Variations */}
			<div className="space-y-4">
				<h3 className="text-lg font-semibold">Types</h3>
				<Callout type="info" size="medium" title="Info Callout">
					This is an informational message.
				</Callout>
				<Callout type="success" size="medium" title="Success Callout">
					Operation completed successfully.
				</Callout>
				<Callout type="warning" size="medium" title="Warning Callout">
					Please review your settings carefully.
				</Callout>
				<Callout type="error" size="medium" title="Error Callout">
					An unexpected error occurred.
				</Callout>
			</div>

			{/* Size Variations */}
			<div className="space-y-4">
				<h3 className="text-lg font-semibold">Sizes</h3>
				<Callout type="info" size="small" title="Small Callout">
					This is a small callout.
				</Callout>
				<Callout type="info" size="medium" title="Medium Callout">
					This is a medium callout with more space for content.
				</Callout>
			</div>

			{/* Content Variations */}
			<div className="space-y-4">
				<h3 className="text-lg font-semibold">Content Variations</h3>
				<Callout type="info" size="medium" title="Only Title" />
				<Callout type="info" size="medium" showIcon>
					Only description without a title.
				</Callout>
				<Callout type="info" size="medium" showIcon={false} title="No Icon">
					This callout has no icon.
				</Callout>
			</div>

			{/* Custom Icon */}
			<div className="space-y-4">
				<h3 className="text-lg font-semibold">Custom Icons</h3>
				<Callout type="info" size="medium" icon={<Star aria-hidden />} title="Star Icon">
					Custom star icon instead of default.
				</Callout>
				<Callout type="warning" size="medium" icon={<Zap aria-hidden />} title="Zap Icon">
					Custom zap icon with warning colors.
				</Callout>
				<Callout color="sienna" size="medium" icon={<Sun aria-hidden />} title="Sun Icon">
					Custom sun icon with sienna colors.
				</Callout>
			</div>

			{/* Custom Colors */}
			<div className="space-y-4">
				<h3 className="text-lg font-semibold">Custom Colors</h3>
				<Callout color="robin" size="medium" title="Robin Color">
					Using custom robin color.
				</Callout>
				<Callout color="forest" size="medium" title="Forest Color">
					Using custom forest color.
				</Callout>
				<Callout color="amber" size="medium" title="Amber Color">
					Using custom amber color.
				</Callout>
				<Callout color="cherry" size="medium" title="Cherry Color">
					Using custom cherry color.
				</Callout>
				<Callout color="sienna" size="medium" title="Sienna Color">
					Using custom sienna color.
				</Callout>
				<Callout color="aqua" size="medium" title="Aqua Color">
					Using custom aqua color.
				</Callout>
			</div>

			{/* Dismissible */}
			<div className="space-y-4">
				<h3 className="text-lg font-semibold">Dismissible</h3>
				<DismissibleExample type="info" title="Dismissible Info">
					Click the X to dismiss this callout.
				</DismissibleExample>
				<DismissibleExample type="success" title="Dismissible Success">
					This success message can be dismissed.
				</DismissibleExample>
			</div>

			{/* Expandable */}
			<div className="space-y-4">
				<h3 className="text-lg font-semibold">Expandable</h3>
				<Callout type="info" size="medium" title="Expandable Callout" action="expandable">
					Click the chevron to toggle this content.
				</Callout>
				<Callout
					type="warning"
					size="medium"
					showIcon
					title="Expandable Warning"
					action="expandable"
				>
					This warning can be expanded or collapsed.
				</Callout>
			</div>
		</div>
	),
};

// Helper component for dismissible examples
function DismissibleExample({
	type,
	title,
	children,
}: {
	type: 'info' | 'success' | 'warning' | 'error';
	title: string;
	children?: string;
}) {
	const [isVisible, setIsVisible] = useState(true);

	if (!isVisible) {
		return (
			<button
				onClick={() => setIsVisible(true)}
				className="px-4 py-2 text-sm bg-gray-200 dark:bg-gray-700 rounded hover:bg-gray-300 dark:hover:bg-gray-600"
			>
				Restore "{title}"
			</button>
		);
	}

	return (
		<Callout
			type={type}
			size="medium"
			showIcon
			title={title}
			action="dismissible"
			onClick={() => setIsVisible(false)}
		>
			{children}
		</Callout>
	);
}
