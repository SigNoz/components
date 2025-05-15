import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { ToggleGroup, ToggleGroupItem } from '@signozhq/toggle-group';
import {
	Bold,
	Italic,
	Underline,
	AlignLeft,
	AlignCenter,
	AlignRight,
	AlignJustify,
	LayoutGrid,
} from 'lucide-react';

const meta: Meta<typeof ToggleGroup> = {
	title: 'Components/ToggleGroup',
	component: ToggleGroup,
	argTypes: {
		variant: {
			control: 'radio',
			options: ['default', 'outline'],
			defaultValue: 'outline',
		},
		size: {
			control: 'radio',
			options: ['default', 'sm', 'lg'],
			defaultValue: 'default',
		},
		disabled: {
			control: 'boolean',
			defaultValue: false,
		},
	},
	parameters: {
		design: [
			{
				name: 'Figma',
				type: 'figma',
				url: 'https://www.figma.com/design/egMidgk6VJDXTumxcCYUl1/Periscope---Primitives?node-id=12-757&p=f&t=DqcgJjfI3A74mvM2-0',
			},
		],
	},
};

export default meta;
type Story = StoryObj<typeof ToggleGroup>;

export const SingleChoice: Story = {
	render: ({ variant, size, disabled }) => (
		<ToggleGroup
			type="single"
			defaultValue="center"
			variant={variant}
			size={size}
			disabled={disabled}
		>
			<ToggleGroupItem value="left" aria-label="Align left">
				<AlignLeft className="h-3 w-3" />
			</ToggleGroupItem>
			<ToggleGroupItem value="center" aria-label="Align center">
				<AlignCenter className="h-3 w-3" />
			</ToggleGroupItem>
			<ToggleGroupItem value="right" aria-label="Align right">
				<AlignRight className="h-3 w-3" />
			</ToggleGroupItem>
			<ToggleGroupItem value="justify" aria-label="Justify">
				<AlignJustify className="h-3 w-3" />
			</ToggleGroupItem>
		</ToggleGroup>
	),
};

export const MultipleChoices: Story = {
	render: ({ variant, size, disabled }) => (
		<ToggleGroup
			type="multiple"
			defaultValue={['bold']}
			variant={variant}
			size={size}
			disabled={disabled}
		>
			<ToggleGroupItem value="bold" aria-label="Bold">
				<Bold className="h-3 w-3" />
			</ToggleGroupItem>
			<ToggleGroupItem value="italic" aria-label="Italic">
				<Italic className="h-3 w-3" />
			</ToggleGroupItem>
			<ToggleGroupItem value="underline" aria-label="Underline">
				<Underline className="h-3 w-3" />
			</ToggleGroupItem>
		</ToggleGroup>
	),
};

export const WithLabels: Story = {
	args: {
		size: 'default',
	},
	render: ({ size, variant, disabled }) => (
		<ToggleGroup
			type="single"
			defaultValue="first"
			size={size}
			variant={variant}
			disabled={disabled}
		>
			<ToggleGroupItem value="first">
				<LayoutGrid className="h-6 w-6" /> Label
			</ToggleGroupItem>
			<ToggleGroupItem value="second">
				<LayoutGrid className="h-6 w-6" /> Label
			</ToggleGroupItem>
			<ToggleGroupItem value="third">
				<LayoutGrid className="h-6 w-6" /> Label
			</ToggleGroupItem>
		</ToggleGroup>
	),
};
