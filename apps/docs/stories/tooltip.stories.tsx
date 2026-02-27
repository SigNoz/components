import { Button, Tooltip, TooltipProvider } from '@signozhq/ui';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { generateDocs } from '../utils/generateDocs.js';

const tooltipExamples = [
	`import { Tooltip, TooltipProvider } from '@signozhq/ui';
import { Button } from '@signozhq/ui';

export default function MyComponent() {
	return (
		<TooltipProvider>
			<Tooltip title="Helpful information" arrow>
				<Button variant="solid" color="secondary">
					Hover me
				</Button>
			</Tooltip>
		</TooltipProvider>
	);
}`,
];

const tooltipDocs = generateDocs({
	packageName: '@signozhq/ui',
	description: 'A customizable tooltip component with smooth animations and flexible positioning.',
	examples: tooltipExamples,
});

const meta: Meta<typeof Tooltip> = {
	title: 'Experimental/Tooltip',
	component: Tooltip,
	parameters: {
		layout: 'fullscreen',
		docs: {
			description: {
				component: tooltipDocs,
			},
		},
		design: {
			type: 'figma',
			url: 'https://www.figma.com/design/egMidgk6VJDXTumxcCYUl1/Periscope---Primitives?node-id=12-746&m=dev',
		},
	},
	tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Tooltip>;

export const Default: Story = {
	render: () => (
		<TooltipProvider>
			<div className="p-20 flex items-center justify-center">
				<Tooltip title="I'm a basic tooltip">
					<Button variant="solid" color="secondary">
						Hover me
					</Button>
				</Tooltip>
			</div>{' '}
		</TooltipProvider>
	),
};

export const WithArrow: Story = {
	render: () => (
		<TooltipProvider>
			<div className="p-20 flex items-center justify-center">
				<Tooltip title="Now with an arrow!" arrow>
					<Button variant="solid" color="secondary">
						With Arrow
					</Button>
				</Tooltip>
			</div>{' '}
		</TooltipProvider>
	),
};

export const Delayed: Story = {
	render: () => (
		<TooltipProvider delayDuration={500}>
			<div className="p-20 flex items-center justify-center">
				<Tooltip title="I appear after 500ms">
					<Button variant="solid" color="secondary">
						Display tooltip after 500ms delay
					</Button>
				</Tooltip>
			</div>
		</TooltipProvider>
	),
};
