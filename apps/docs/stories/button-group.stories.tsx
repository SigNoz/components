import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import {
	ButtonGroup,
	ButtonGroupSeparator,
	ButtonGroupText,
} from '@signozhq/button-group';
import { Button } from '@signozhq/button';
import { Download, Upload, Trash2, Edit, Save } from 'lucide-react';
import { generateDocs } from '../utils/generateDocs';

const ButtonGroupExamples = [
	`import { ButtonGroup } from '@signozhq/button-group';
import { Button } from '@signozhq/button';

export default function MyComponent() {
  return (
    <ButtonGroup>
      <Button variant="solid" color="primary">Save</Button>
      <Button variant="outlined" color="primary">Cancel</Button>
    </ButtonGroup>
  );
}`,
	`import { ButtonGroup, ButtonGroupSeparator } from '@signozhq/button-group';
import { Button } from '@signozhq/button';

export default function MyComponent() {
  return (
    <ButtonGroup>
      <Button variant="solid" color="primary">Edit</Button>
      <Button variant="solid" color="primary">Delete</Button>
      <ButtonGroupSeparator />
      <Button variant="outlined" color="primary">Cancel</Button>
    </ButtonGroup>
  );
}`,
];

const ButtonGroupDocs = generateDocs({
	packageName: '@signozhq/button-group',
	description:
		'A container that groups related buttons together with consistent styling and spacing.',
	examples: ButtonGroupExamples,
});

const meta: Meta<typeof ButtonGroup> = {
	title: 'Components/ButtonGroup',
	component: ButtonGroup,
	parameters: {
		layout: 'fullscreen',
		backgrounds: {
			disable: true,
		},
		controls: { disable: false },
		docs: {
			description: {
				component: ButtonGroupDocs,
			},
			source: {
				type: 'code',
			},
		},
	},
	argTypes: {
		orientation: {
			control: 'select',
			options: ['horizontal', 'vertical'],
			description: 'The orientation of the button group',
		},
	},
	tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof ButtonGroup>;

export const Default: Story = {
	render: () => (
		<div className="p-8 rounded-lg bg-background">
			<div className="space-y-6">
				<div className="space-y-4">
					<h2 className="text-base font-semibold text-foreground">
						Basic Button Group
					</h2>
					<ButtonGroup>
						<Button variant="solid" color="primary">
							Save
						</Button>
						<Button variant="outlined" color="primary">
							Cancel
						</Button>
					</ButtonGroup>
				</div>
				<div className="space-y-4">
					<h2 className="text-base font-semibold text-foreground">With Icons</h2>
					<ButtonGroup>
						<Button variant="solid" color="primary" prefixIcon={<Download />}>
							Download
						</Button>
						<Button variant="outlined" color="primary" prefixIcon={<Upload />}>
							Upload
						</Button>
					</ButtonGroup>
				</div>
			</div>
		</div>
	),
};

export const Orientations: Story = {
	render: () => (
		<div className="p-8 rounded-lg bg-background">
			<div className="space-y-8">
				<div className="space-y-4">
					<h2 className="text-base font-semibold text-foreground">
						Horizontal (Default)
					</h2>
					<ButtonGroup orientation="horizontal">
						<Button variant="solid" color="primary">
							First
						</Button>
						<Button variant="solid" color="primary">
							Second
						</Button>
						<Button variant="solid" color="primary">
							Third
						</Button>
					</ButtonGroup>
				</div>
				<div className="space-y-4">
					<h2 className="text-base font-semibold text-foreground">Vertical</h2>
					<ButtonGroup orientation="vertical">
						<Button variant="solid" color="primary">
							First
						</Button>
						<Button variant="solid" color="primary">
							Second
						</Button>
						<Button variant="solid" color="primary">
							Third
						</Button>
					</ButtonGroup>
				</div>
			</div>
		</div>
	),
};

export const WithSeparators: Story = {
	render: () => (
		<div className="p-8 rounded-lg bg-background">
			<div className="space-y-8">
				<div className="space-y-4">
					<h2 className="text-base font-semibold text-foreground">
						Horizontal with Separator
					</h2>
					<ButtonGroup orientation="horizontal">
						<Button variant="solid" color="primary" prefixIcon={<Edit />}>
							Edit
						</Button>
						<Button variant="solid" color="destructive" prefixIcon={<Trash2 />}>
							Delete
						</Button>
						<ButtonGroupSeparator orientation="vertical" />
						<Button variant="outlined" color="primary">
							Cancel
						</Button>
					</ButtonGroup>
				</div>
				<div className="space-y-4">
					<h2 className="text-base font-semibold text-foreground">
						Vertical with Separator
					</h2>
					<ButtonGroup orientation="vertical">
						<Button variant="solid" color="primary" prefixIcon={<Save />}>
							Save
						</Button>
						<Button variant="outlined" color="primary">
							Cancel
						</Button>
						<ButtonGroupSeparator orientation="horizontal" />
						<Button variant="ghost" color="destructive" prefixIcon={<Trash2 />}>
							Delete
						</Button>
					</ButtonGroup>
				</div>
			</div>
		</div>
	),
};

export const WithText: Story = {
	render: () => (
		<div className="p-8 rounded-lg bg-background">
			<div className="space-y-8">
				<div className="space-y-4">
					<h2 className="text-base font-semibold text-foreground">
						With ButtonGroupText
					</h2>
					<ButtonGroup>
						<ButtonGroupText>Actions</ButtonGroupText>
						<Button variant="solid" color="primary" prefixIcon={<Edit />}>
							Edit
						</Button>
						<Button variant="outlined" color="primary" prefixIcon={<Save />}>
							Save
						</Button>
					</ButtonGroup>
				</div>
				<div className="space-y-4">
					<h2 className="text-base font-semibold text-foreground">
						With Text and Separator
					</h2>
					<ButtonGroup>
						<ButtonGroupText>File</ButtonGroupText>
						<Button variant="solid" color="primary" prefixIcon={<Download />}>
							Download
						</Button>
						<Button variant="outlined" color="primary" prefixIcon={<Upload />}>
							Upload
						</Button>
						<ButtonGroupSeparator orientation="vertical" />
						<Button variant="ghost" color="destructive" prefixIcon={<Trash2 />}>
							Delete
						</Button>
					</ButtonGroup>
				</div>
			</div>
		</div>
	),
};

export const Variants: Story = {
	render: () => (
		<div className="p-8 rounded-lg bg-background">
			<div className="space-y-8">
				<div className="space-y-4">
					<h2 className="text-base font-semibold text-foreground">Solid Variant</h2>
					<ButtonGroup>
						<Button variant="solid" color="primary">
							Primary
						</Button>
						<Button variant="solid" color="primary">
							Secondary
						</Button>
						<Button variant="solid" color="primary">
							Tertiary
						</Button>
					</ButtonGroup>
				</div>
				<div className="space-y-4">
					<h2 className="text-base font-semibold text-foreground">
						Outlined Variant
					</h2>
					<ButtonGroup>
						<Button variant="outlined" color="primary">
							Primary
						</Button>
						<Button variant="outlined" color="primary">
							Secondary
						</Button>
						<Button variant="outlined" color="primary">
							Tertiary
						</Button>
					</ButtonGroup>
				</div>
				<div className="space-y-4">
					<h2 className="text-base font-semibold text-foreground">Mixed Variants</h2>
					<ButtonGroup>
						<Button variant="solid" color="primary">
							Save
						</Button>
						<Button variant="outlined" color="primary">
							Cancel
						</Button>
						<Button variant="ghost" color="primary">
							More
						</Button>
					</ButtonGroup>
				</div>
			</div>
		</div>
	),
};

export const Colors: Story = {
	render: () => (
		<div className="p-8 rounded-lg bg-background">
			<div className="space-y-8">
				<div className="space-y-4">
					<h2 className="text-base font-semibold text-foreground">Primary Color</h2>
					<ButtonGroup>
						<Button variant="solid" color="primary">
							First
						</Button>
						<Button variant="solid" color="primary">
							Second
						</Button>
						<Button variant="solid" color="primary">
							Third
						</Button>
					</ButtonGroup>
				</div>
				<div className="space-y-4">
					<h2 className="text-base font-semibold text-foreground">
						Destructive Color
					</h2>
					<ButtonGroup>
						<Button variant="solid" color="destructive">
							Delete
						</Button>
						<Button variant="outlined" color="destructive">
							Remove
						</Button>
					</ButtonGroup>
				</div>
				<div className="space-y-4">
					<h2 className="text-base font-semibold text-foreground">Warning Color</h2>
					<ButtonGroup>
						<Button variant="solid" color="warning">
							Warning
						</Button>
						<Button variant="outlined" color="warning">
							Alert
						</Button>
					</ButtonGroup>
				</div>
			</div>
		</div>
	),
};

export const Sizes: Story = {
	render: () => (
		<div className="p-8 rounded-lg bg-background">
			<div className="space-y-8">
				<div className="space-y-4">
					<h2 className="text-base font-semibold text-foreground">Extra Small</h2>
					<ButtonGroup>
						<Button variant="solid" color="primary" size="xs">
							Small
						</Button>
						<Button variant="outlined" color="primary" size="xs">
							Medium
						</Button>
					</ButtonGroup>
				</div>
				<div className="space-y-4">
					<h2 className="text-base font-semibold text-foreground">Small</h2>
					<ButtonGroup>
						<Button variant="solid" color="primary" size="sm">
							Small
						</Button>
						<Button variant="outlined" color="primary" size="sm">
							Medium
						</Button>
					</ButtonGroup>
				</div>
				<div className="space-y-4">
					<h2 className="text-base font-semibold text-foreground">
						Medium (Default)
					</h2>
					<ButtonGroup>
						<Button variant="solid" color="primary" size="md">
							Small
						</Button>
						<Button variant="outlined" color="primary" size="md">
							Medium
						</Button>
					</ButtonGroup>
				</div>
				<div className="space-y-4">
					<h2 className="text-base font-semibold text-foreground">Large</h2>
					<ButtonGroup>
						<Button variant="solid" color="primary" size="lg">
							Small
						</Button>
						<Button variant="outlined" color="primary" size="lg">
							Medium
						</Button>
					</ButtonGroup>
				</div>
			</div>
		</div>
	),
};

export const Disabled: Story = {
	render: () => (
		<div className="p-8 rounded-lg bg-background">
			<div className="space-y-8">
				<div className="space-y-4">
					<h2 className="text-base font-semibold text-foreground">All Disabled</h2>
					<ButtonGroup>
						<Button variant="solid" color="primary" disabled>
							Save
						</Button>
						<Button variant="outlined" color="primary" disabled>
							Cancel
						</Button>
					</ButtonGroup>
				</div>
				<div className="space-y-4">
					<h2 className="text-base font-semibold text-foreground">
						Partially Disabled
					</h2>
					<ButtonGroup>
						<Button variant="solid" color="primary" disabled>
							Save
						</Button>
						<Button variant="outlined" color="primary">
							Cancel
						</Button>
					</ButtonGroup>
				</div>
			</div>
		</div>
	),
};

export const Loading: Story = {
	render: () => (
		<div className="p-8 rounded-lg bg-background">
			<div className="space-y-8">
				<div className="space-y-4">
					<h2 className="text-base font-semibold text-foreground">
						With Loading State
					</h2>
					<ButtonGroup>
						<Button variant="solid" color="primary" loading>
							Save
						</Button>
						<Button variant="outlined" color="primary">
							Cancel
						</Button>
					</ButtonGroup>
				</div>
			</div>
		</div>
	),
};

export const Playground: Story = {
	parameters: {
		controls: { disable: false },
	},
	args: {
		orientation: 'horizontal',
	},
	argTypes: {
		orientation: {
			control: 'select',
			options: ['horizontal', 'vertical'],
		},
	},
	render: (args) => (
		<div className="p-8 rounded-lg bg-background">
			<ButtonGroup {...args}>
				<Button variant="solid" color="primary" prefixIcon={<Save />}>
					Save
				</Button>
				<Button variant="outlined" color="primary" prefixIcon={<Edit />}>
					Edit
				</Button>
				<Button variant="ghost" color="primary" prefixIcon={<Trash2 />}>
					Delete
				</Button>
			</ButtonGroup>
		</div>
	),
};
