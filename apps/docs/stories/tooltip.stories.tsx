import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import {
	Tooltip,
	TooltipProvider,
	TooltipTrigger,
	TooltipContent,
} from '@signozhq/tooltip';
import { Button, ButtonVariant } from '@signozhq/button';
import { Dialog, DialogTrigger, DialogContent } from '@signozhq/dialog';
import { generateDocs } from '../utils/generateDocs';

const tooltipExamples = [
	`import { Tooltip, TooltipProvider } from '@signozhq/tooltip';
import { Button } from '@signozhq/button';

export default function MyComponent() {
	return (
		<TooltipProvider>
			<Tooltip title="Helpful information" arrow>
				<Button variant={ButtonVariant.Solid} color="secondary">
					Hover me
				</Button>
			</Tooltip>
		</TooltipProvider>
	);
}`,
];

const tooltipDocs = generateDocs({
	packageName: '@signozhq/tooltip',
	description:
		'A customizable tooltip component with smooth animations and flexible positioning.',
	examples: tooltipExamples,
});

const meta: Meta<typeof Tooltip> = {
	title: 'Components/Tooltip',
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
					<Button variant={ButtonVariant.Solid} color="secondary">
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
					<Button variant={ButtonVariant.Solid} color="secondary">
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
					<Button variant={ButtonVariant.Solid} color="secondary">
						Display tooltip after 500ms delay
					</Button>
				</Tooltip>
			</div>
		</TooltipProvider>
	),
};

export const Placements: Story = {
	render: () => (
		<TooltipProvider>
			<div className="p-20 flex flex-wrap items-center justify-center gap-4">
				<Tooltip title="Top placement" placement="top">
					<Button variant={ButtonVariant.Solid} color="secondary">
						Top
					</Button>
				</Tooltip>
				<Tooltip title="Bottom placement" placement="bottom">
					<Button variant={ButtonVariant.Solid} color="secondary">
						Bottom
					</Button>
				</Tooltip>
				<Tooltip title="Left placement" placement="left">
					<Button variant={ButtonVariant.Solid} color="secondary">
						Left
					</Button>
				</Tooltip>
				<Tooltip title="Right placement" placement="right">
					<Button variant={ButtonVariant.Solid} color="secondary">
						Right
					</Button>
				</Tooltip>
				<Tooltip title="Top-start aligned" placement="top-start">
					<Button variant={ButtonVariant.Solid} color="secondary">
						Top Start
					</Button>
				</Tooltip>
				<Tooltip title="Top-end aligned" placement="top-end">
					<Button variant={ButtonVariant.Solid} color="secondary">
						Top End
					</Button>
				</Tooltip>
			</div>
		</TooltipProvider>
	),
};

export const WithCustomOffset: Story = {
	render: () => (
		<TooltipProvider>
			<div className="p-20 flex items-center justify-center gap-4">
				<Tooltip title="Default offset (4px)">
					<Button variant={ButtonVariant.Solid} color="secondary">
						Default
					</Button>
				</Tooltip>
				<Tooltip title="Large offset (16px)" offset={16}>
					<Button variant={ButtonVariant.Solid} color="secondary">
						Large Offset
					</Button>
				</Tooltip>
			</div>
		</TooltipProvider>
	),
};

export const WithCustomClassName: Story = {
	render: () => (
		<TooltipProvider>
			<div className="p-20 flex items-center justify-center">
				<Tooltip
					title="Custom styled tooltip"
					contentClassName="bg-robin-500 text-white border-robin-600"
					arrow
					arrowClassName="bg-robin-500 fill-robin-500"
				>
					<Button variant={ButtonVariant.Solid} color="secondary">
						Custom Styles
					</Button>
				</Tooltip>
			</div>
		</TooltipProvider>
	),
};

export const InsideModal: Story = {
	render: () => (
		<TooltipProvider>
			<Dialog>
				<DialogTrigger asChild>
					<Button variant={ButtonVariant.Solid} color="secondary">
						Open Modal
					</Button>
				</DialogTrigger>
				<DialogContent>
					<div className="p-6">
						<h3 className="text-lg font-medium mb-4">Modal with Tooltip</h3>
						<p className="mb-4">
							The tooltip now appears above the modal thanks to z-index fix.
						</p>
						<Tooltip title="I appear above the modal!" arrow>
							<Button variant={ButtonVariant.Solid} color="secondary">
								Hover me
							</Button>
						</Tooltip>
					</div>
				</DialogContent>
			</Dialog>
		</TooltipProvider>
	),
};

export const ComposableUsage: Story = {
	render: () => (
		<TooltipProvider>
			<div className="p-20 flex items-center justify-center">
				<Tooltip>
					<TooltipTrigger asChild>
						<Button variant={ButtonVariant.Solid} color="secondary">
							Composable Tooltip
						</Button>
					</TooltipTrigger>
					<TooltipContent side="bottom" arrow>
						<p>Using TooltipTrigger and TooltipContent directly</p>
					</TooltipContent>
				</Tooltip>
			</div>
		</TooltipProvider>
	),
};
