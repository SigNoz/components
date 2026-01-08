import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import {
	Select,
	SelectTrigger,
	SelectValue,
	SelectContent,
	SelectItem,
	SelectGroup,
	SelectLabel,
	SelectSeparator,
} from '@signozhq/select';
import { generateDocs } from '../utils/generateDocs';

const SelectExamples = [
	`import { 
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@signozhq/select';

export default function MyComponent() {
  return (
    <Select>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select a framework" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="react">React</SelectItem>
        <SelectItem value="vue">Vue</SelectItem>
        <SelectItem value="angular">Angular</SelectItem>
      </SelectContent>
    </Select>
  );
}`,
];

const SelectDocs = generateDocs({
	packageName: '@signozhq/select',
	description:
		'Displays a list of options for the user to pick from—triggered by a button.',
	examples: SelectExamples,
});

const meta: Meta<typeof Select> = {
	title: 'Components/Select',
	component: Select,
	parameters: {
		docs: {
			description: {
				component: SelectDocs,
			},
		},
		layout: 'fullscreen',
	},
	tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Select>;

export const Default: Story = {
	render: () => (
		<div className="p-8">
			<Select>
				<SelectTrigger className="w-[180px]">
					<SelectValue placeholder="Select a framework" />
				</SelectTrigger>
				<SelectContent>
					<SelectItem value="react">React</SelectItem>
					<SelectItem value="vue">Vue</SelectItem>
					<SelectItem value="angular">Angular</SelectItem>
				</SelectContent>
			</Select>
		</div>
	),
};

export const WithDefaultValue: Story = {
	render: () => (
		<div className="p-8">
			<Select defaultValue="vue">
				<SelectTrigger className="w-[180px]">
					<SelectValue placeholder="Select a framework" />
				</SelectTrigger>
				<SelectContent>
					<SelectItem value="react">React</SelectItem>
					<SelectItem value="vue">Vue</SelectItem>
					<SelectItem value="angular">Angular</SelectItem>
				</SelectContent>
			</Select>
		</div>
	),
};

export const WithGroups: Story = {
	render: () => (
		<div className="p-8">
			<Select>
				<SelectTrigger className="w-[200px]">
					<SelectValue placeholder="Select a framework" />
				</SelectTrigger>
				<SelectContent>
					<SelectGroup>
						<SelectLabel>Frontend</SelectLabel>
						<SelectItem value="react">React</SelectItem>
						<SelectItem value="vue">Vue</SelectItem>
						<SelectItem value="angular">Angular</SelectItem>
						<SelectItem value="svelte">Svelte</SelectItem>
					</SelectGroup>
					<SelectSeparator />
					<SelectGroup>
						<SelectLabel>Backend</SelectLabel>
						<SelectItem value="nodejs">Node.js</SelectItem>
						<SelectItem value="python">Python</SelectItem>
						<SelectItem value="go">Go</SelectItem>
						<SelectItem value="rust">Rust</SelectItem>
					</SelectGroup>
				</SelectContent>
			</Select>
		</div>
	),
};

export const WithDisabledItems: Story = {
	render: () => (
		<div className="p-8">
			<Select>
				<SelectTrigger className="w-[200px]">
					<SelectValue placeholder="Select an option" />
				</SelectTrigger>
				<SelectContent>
					<SelectItem value="enabled1">Enabled Option 1</SelectItem>
					<SelectItem value="disabled1" disabled>
						Disabled Option 1
					</SelectItem>
					<SelectItem value="enabled2">Enabled Option 2</SelectItem>
					<SelectItem value="disabled2" disabled>
						Disabled Option 2
					</SelectItem>
					<SelectItem value="enabled3">Enabled Option 3</SelectItem>
				</SelectContent>
			</Select>
		</div>
	),
};

export const Disabled: Story = {
	render: () => (
		<div className="p-8">
			<Select disabled>
				<SelectTrigger className="w-[180px]">
					<SelectValue placeholder="Select a framework" />
				</SelectTrigger>
				<SelectContent>
					<SelectItem value="react">React</SelectItem>
					<SelectItem value="vue">Vue</SelectItem>
					<SelectItem value="angular">Angular</SelectItem>
				</SelectContent>
			</Select>
		</div>
	),
};

export const Controlled: Story = {
	render: () => {
		const [value, setValue] = useState('react');

		return (
			<div className="p-8 space-y-4">
				<div>
					<p className="text-sm font-medium mb-2">Selected value: {value}</p>
					<Select value={value} onValueChange={setValue}>
						<SelectTrigger className="w-[180px]">
							<SelectValue placeholder="Select a framework" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="react">React</SelectItem>
							<SelectItem value="vue">Vue</SelectItem>
							<SelectItem value="angular">Angular</SelectItem>
						</SelectContent>
					</Select>
				</div>
			</div>
		);
	},
};

export const WithCustomWidth: Story = {
	render: () => (
		<div className="p-8 space-y-6">
			<div>
				<p className="text-sm text-gray-600 mb-2">Small Width (w-[120px])</p>
				<Select>
					<SelectTrigger className="w-[120px]">
						<SelectValue placeholder="Select" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="opt1">Option 1</SelectItem>
						<SelectItem value="opt2">Option 2</SelectItem>
						<SelectItem value="opt3">Option 3</SelectItem>
					</SelectContent>
				</Select>
			</div>

			<div>
				<p className="text-sm text-gray-600 mb-2">Medium Width (w-[250px])</p>
				<Select>
					<SelectTrigger className="w-[250px]">
						<SelectValue placeholder="Select an option" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="opt1">Option 1</SelectItem>
						<SelectItem value="opt2">Option 2</SelectItem>
						<SelectItem value="opt3">Option 3</SelectItem>
					</SelectContent>
				</Select>
			</div>

			<div>
				<p className="text-sm text-gray-600 mb-2">Full Width (w-full)</p>
				<Select>
					<SelectTrigger className="w-full max-w-[500px]">
						<SelectValue placeholder="Select an option" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="opt1">Option 1</SelectItem>
						<SelectItem value="opt2">Option 2</SelectItem>
						<SelectItem value="opt3">Option 3</SelectItem>
					</SelectContent>
				</Select>
			</div>
		</div>
	),
};

export const SearchableWithGroups: Story = {
	render: () => (
		<div className="p-8">
			<Select>
				<SelectTrigger className="w-[250px]">
					<SelectValue placeholder="Search or select..." />
				</SelectTrigger>
				<SelectContent>
					<SelectGroup>
						<SelectLabel>Frontend</SelectLabel>
						<SelectItem value="react">React</SelectItem>
						<SelectItem value="vue">Vue</SelectItem>
						<SelectItem value="angular">Angular</SelectItem>
						<SelectItem value="svelte">Svelte</SelectItem>
					</SelectGroup>
					<SelectSeparator />
					<SelectGroup>
						<SelectLabel>Backend</SelectLabel>
						<SelectItem value="nodejs">Node.js</SelectItem>
						<SelectItem value="python">Python</SelectItem>
						<SelectItem value="go">Go</SelectItem>
						<SelectItem value="rust">Rust</SelectItem>
					</SelectGroup>
					<SelectSeparator />
					<SelectGroup>
						<SelectLabel>Databases</SelectLabel>
						<SelectItem value="postgres">PostgreSQL</SelectItem>
						<SelectItem value="mongodb">MongoDB</SelectItem>
						<SelectItem value="redis">Redis</SelectItem>
					</SelectGroup>
				</SelectContent>
			</Select>
		</div>
	),
};
