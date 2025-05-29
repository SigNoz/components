import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Callout } from '@signozhq/callout';
import { generateDocs } from '../utils/generateDocs';
import { Info, XCircle, Star, Sun, Zap } from 'lucide-react'; // Added more icons for variety

const alertExamples = [
	`
	import { Callout } from '@signozhq/callout';
import { Info } from '@signozhq/icons';

export default function MyComponent() {
	return (
		<Callout
			type="info"
			size="medium"
			showIcon
			message="Important Information"
			description="This is additional information that provides more context about the callout."
		/>
	);
}`,
];

const alertDocs = generateDocs({
	packageName: '@signozhq/callout',
	description:
		'A versatile callout component to display important messages to the user, with various types, sizes, and custom styling options.',
	examples: alertExamples,
});

const meta: Meta<typeof Callout> = {
	title: 'Components/Callout',
	component: Callout,
	parameters: {
		docs: {
			description: {
				component: alertDocs,
			},
		},
		design: {
			type: 'figma',
			url: 'https://www.figma.com/design/egMidgk6VJDXTumxcCYUl1/Periscope---Primitives?node-id=12-749&m=dev',
		},
	},
	argTypes: {
		message: {
			control: 'text',
			description: 'The main message or title of the callout.',
			table: { category: 'Content' },
		},
		description: {
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
			table: { category: 'Appearance', defaultValue: { summary: 'false' } },
		},
		icon: {
			control: false,
			description:
				'Custom ReactNode to use as the icon. Overrides default icon if `showIcon` is also true.',
			table: { category: 'Appearance' },
		},
		color: {
			control: 'select',
			options: [null, 'robin', 'forest', 'amber', 'cherry', 'sienna', 'aqua'], // Added null to represent 'undefined' / default
			description:
				'Overrides the default color derived from `type`. Uses predefined color names.',
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
		dismissable: {
			control: 'boolean',
			description: 'Whether the callout can be dismissed with a close button.',
			table: { category: 'Behavior', defaultValue: { summary: 'false' } },
		},
		onClose: {
			action: 'closed',
			description: 'Function called when the close button is clicked.',
			table: { category: 'Events' },
		},
	},
	args: {
		type: 'info',
		showIcon: false,
		size: 'small',
		message: 'Default Callout Message',
		description:
			'This is the default callout description that can be quite long and should wrap nicely.',
		dismissable: false,
	},

	tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Callout>;

export const AllVariantsOverview: Story = {
	name: 'All Variants Overview',
	render: () => (
		<div className="flex flex-col max-w-800px gap-4">
			{/* Small Size Variations */}
			<h2 className="mt-5 mb-2.5 border-b border-gray-300 pb-2 text-2xl">
				Small Callouts
			</h2>
			<Callout
				type="info"
				size="small"
				showIcon
				message="Small Info"
				description="This is a small informational callout with its default icon."
			/>
			<Callout
				type="success"
				size="small"
				showIcon
				message="Small Success (No Description)"
			/>
			<Callout
				type="warning"
				size="small"
				showIcon={false}
				message="Small Warning (No Icon)"
				description="This callout is small, a warning, and has its icon explicitly hidden."
			/>
			<Callout
				type="error"
				size="small"
				showIcon
				message="Small Error"
				description="A small error message indicating something went wrong."
			/>
			<Callout
				type="info" // Base type for default icon
				color="aqua" // Custom color
				size="small"
				showIcon
				message="Small Custom Color (Aqua)"
				description="Small callout with a custom 'aqua' color, showing the default info icon."
			/>
			<Callout
				color="sienna" // Custom color
				size="small"
				icon={<Sun size={12} aria-hidden />} // Custom icon
				message="Small Custom Color (Sienna) & Custom Icon"
				description="Small callout with 'sienna' color and a custom Sun icon."
			/>

			{/* Medium Size Variations */}
			<h2 className="mt-8 mb-2.5 border-b pb-2 text-2xl">Medium Callouts</h2>
			<Callout
				type="info"
				size="medium"
				showIcon
				message="Medium Info Message"
				description="This is a medium informational callout with its default icon. It offers more space for detailed text and features a slightly larger icon for better visibility."
			/>
			<Callout
				type="success"
				size="medium"
				showIcon
				message="Medium Success (No Description)"
			/>
			<Callout
				type="warning"
				size="medium"
				showIcon={false}
				message="Medium Warning (No Icon)"
				description="This medium callout is a warning and explicitly has its icon hidden. Suitable for when the message is self-explanatory."
			/>
			<Callout
				type="error"
				size="medium"
				showIcon
				message="Medium Error Occurred"
				description="A medium-sized error message, providing more visual impact for critical issues."
			/>
			<Callout
				type="info" // Base type for default icon
				color="forest" // Custom color
				size="medium"
				showIcon
				message="Medium Custom Color (Forest)"
				description="Medium callout demonstrating a custom 'forest' color, using the default icon for the 'info' type."
			/>
			<Callout
				color="amber" // Custom color
				size="medium"
				icon={<Zap size={16} aria-hidden />} // Custom icon
				message="Medium Custom Color (Amber) & Custom Zap Icon"
				description="Medium callout showcasing the 'amber' color with a completely custom Zap icon."
			/>

			{/* Content & Icon Variations */}
			<h2 className="mt-8 mb-2.5 border-b pb-2 text-2xl">
				Content & Icon Variations
			</h2>
			<Callout
				type="info"
				size="small"
				showIcon
				message="Small Info - Only Message"
			/>
			<Callout
				type="success"
				size="medium"
				showIcon
				description="Medium success callout with only a description. The icon helps provide immediate context even without a title."
			/>
			<Callout
				type="warning"
				size="small"
				showIcon={false}
				message="Small Warning - Only Message, No Icon"
			/>
			<Callout
				type="error"
				size="medium"
				icon={<XCircle size={16} color="var(--bg-cherry-500)" aria-hidden />} // Custom icon with explicit color
				message="Error with Custom XCircle Icon (Medium)"
				description="Using a custom icon node directly with specific styling."
			/>
			<Callout
				type="info"
				size="small"
				icon={<Info size={12} className="text-blue-500" aria-hidden />} // Custom icon with Tailwind class for color
				message="Info with Custom Icon & Tailwind Color"
				description="Icon styling can also be done via className if preferred."
			/>

			{/* Dismissable Variations */}
			<h2 className="mt-8 mb-2.5 border-b pb-2 text-2xl">Dismissable Callouts</h2>
			<Callout
				type="info"
				size="small"
				showIcon
				message="Small Dismissable Info"
				description="This is a small informational callout that can be dismissed."
				dismissable
				onClose={() => console.log('Small info callout closed')}
			/>
			<Callout
				type="success"
				size="medium"
				showIcon
				message="Medium Dismissable Success"
				description="This is a medium success callout that can be dismissed."
				dismissable
				onClose={() => console.log('Medium success callout closed')}
			/>
			<Callout
				type="warning"
				size="small"
				showIcon={false}
				message="Small Warning (No Icon) with Close Button"
				description="This callout can be dismissed even without an icon."
				dismissable
				onClose={() => console.log('Warning callout closed')}
			/>
			<Callout
				type="error"
				size="medium"
				icon={<XCircle size={16} color="var(--bg-cherry-500)" aria-hidden />}
				message="Error with Custom Icon and Close Button"
				description="This callout has both a custom icon and a close button."
				dismissable
				onClose={() => console.log('Error callout closed')}
			/>
		</div>
	),
};

// --- Individual Stories for focused testing/documentation ---

export const DefaultInfo: Story = {
	name: 'Type: Info (Default)',
	args: {
		message: 'Informational Message',
		description: 'This is some additional information for the user.',
		type: 'info',
		showIcon: true,
		size: 'small',
	},
};

export const Success: Story = {
	name: 'Type: Success',
	args: {
		...DefaultInfo.args,
		message: 'Operation Successful!',
		description: 'Your changes have been saved.',
		type: 'success',
	},
};

export const Warning: Story = {
	name: 'Type: Warning',
	args: {
		...DefaultInfo.args,
		message: 'Potential Issue Detected',
		description: 'Please review your settings carefully.',
		type: 'warning',
		color: 'amber', // Example of using type and then overriding color
	},
};

export const Error: Story = {
	name: 'Type: Error',
	args: {
		...DefaultInfo.args,
		message: 'Action Failed',
		description: 'An unexpected error occurred. Please try again.',
		type: 'error',
	},
};

export const MediumSize: Story = {
	name: 'Size: Medium',
	args: {
		...DefaultInfo.args,
		message: 'Medium Sized Callout',
		description:
			'This callout is larger to accommodate more content or draw more attention.',
		size: 'medium',
	},
};

export const WithoutIcon: Story = {
	name: 'Appearance: Without Icon',
	args: {
		...DefaultInfo.args,
		message: 'Callout Without Any Icon',
		description: 'Sometimes, an icon might not be necessary.',
		showIcon: false,
	},
};

export const WithCustomIcon: Story = {
	name: 'Appearance: With Custom Star Icon',
	args: {
		...DefaultInfo.args,
		message: 'Callout With A Custom Icon',
		description: 'You can provide any React node as an icon.',
		type: 'info', // type still sets a base, but icon overrides
		icon: <Star aria-hidden />,
		showIcon: false, // Often set to false when `icon` prop is used, or ensure component logic handles `icon` taking precedence
	},
};

export const CustomColorSienna: Story = {
	name: 'Color: Custom Sienna',
	args: {
		...DefaultInfo.args,
		message: 'Sienna Colored Callout',
		description: 'This callout uses a specific "sienna" color theme.',
		type: 'info', // Base type for default icon if showIcon is true and no custom icon
		color: 'sienna',
		showIcon: true,
	},
};

export const OnlyMessage: Story = {
	name: 'Content: Only Message',
	args: {
		type: 'success',
		message: 'Quick update: All systems operational!',
		description: undefined, // Explicitly undefined
		showIcon: true,
		size: 'small',
	},
};

export const OnlyDescription: Story = {
	name: 'Content: Only Description',
	args: {
		type: 'warning',
		message: undefined, // Explicitly undefined
		description:
			'Please be aware that maintenance is scheduled for tonight from 10 PM to 11 PM JST.',
		showIcon: true,
		size: 'medium',
	},
};

export const Dismissable: Story = {
	name: 'Behavior: Dismissable',
	args: {
		...DefaultInfo.args,
		message: 'Dismissable Callout',
		description: 'Click the X button on the right to dismiss this callout.',
		dismissable: true,
	},
};
