import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import Breadcrumb from '@signozhq/breadcrumb';
import { generateDocs } from '../utils/generateDocs';

const breadcrumbExamples = [
	`import Breadcrumb from '@signozhq/breadcrumb';

export default function MyComponent() {
  return (
    <Breadcrumb
      items={[
        { title: 'Home' },
        { title: 'Components' },
        { title: 'Breadcrumb' },
      ]}
    />
  );
}`,
	`import Breadcrumb from '@signozhq/breadcrumb';

export default function MyComponent() {
  const handleClick = (item: string) => {
    console.log('Clicked:', item);
    // Handle navigation here
  };

  return (
    <Breadcrumb
      items={[
        { title: 'Home', onClick: () => handleClick('Home') },
        { title: 'Components', onClick: () => handleClick('Components') },
        { title: 'Breadcrumb' },
      ]}
    />
  );
}`,
];

const breadcrumbDocs = generateDocs({
	packageName: '@signozhq/breadcrumb',
	description:
		'A navigation component that displays the current location within a hierarchy and allows users to navigate back to higher levels.',
	examples: breadcrumbExamples,
});

const meta: Meta<typeof Breadcrumb> = {
	title: 'Components/Breadcrumb',
	component: Breadcrumb,
	parameters: {
		docs: {
			description: {
				component: breadcrumbDocs,
			},
		},
		backgrounds: {
			disable: true,
		},
	},
	tags: ['autodocs'],
	argTypes: {
		items: {
			control: 'object',
			description:
				'Array of breadcrumb items with title, href, and onClick properties',
		},
		separator: {
			control: 'text',
			description: 'Custom separator between breadcrumb items (defaults to "/")',
		},
		className: {
			control: 'text',
			description: 'Additional CSS classes for styling',
		},
	},
};

export default meta;
type Story = StoryObj<typeof Breadcrumb>;

export const Default: Story = {
	args: {
		items: [{ title: 'Home' }, { title: 'Components' }, { title: 'Breadcrumb' }],
	},
};

export const WithClickHandlers: Story = {
	args: {
		items: [
			{
				title: 'Home',
				onClick: () => alert('Home clicked'),
			},
			{
				title: 'Components',
				onClick: () => alert('Components clicked'),
			},
			{ title: 'Breadcrumb' },
		],
	},
};

export const WithLinks: Story = {
	args: {
		items: [
			{ title: 'Home', href: '/' },
			{ title: 'Components', href: '/components' },
			{ title: 'Breadcrumb' },
		],
	},
};

export const CustomSeparator: Story = {
	args: {
		items: [{ title: 'Home' }, { title: 'Components' }, { title: 'Breadcrumb' }],
		separator: '>',
	},
};

export const LongText: Story = {
	args: {
		items: [
			{ title: 'Home' },
			{ title: 'this is a very long breadcrumb that will be truncated' },
			{ title: 'Breadcrumb' },
		],
	},
};

export const Showcase: Story = {
	render: () => (
		<div className="space-y-6 p-8">
			<div>
				<h3 className="mb-2 text-sm font-medium">Basic</h3>
				<Breadcrumb
					items={[
						{ title: 'Home' },
						{ title: 'Components' },
						{ title: 'Breadcrumb' },
					]}
				/>
			</div>

			<div>
				<h3 className="mb-2 text-sm font-medium">With Click Handlers</h3>
				<Breadcrumb
					items={[
						{ title: 'Home', onClick: () => alert('Home clicked') },
						{ title: 'Components', onClick: () => alert('Components clicked') },
						{ title: 'Breadcrumb' },
					]}
				/>
			</div>

			<div>
				<h3 className="mb-2 text-sm font-medium">Custom Separator</h3>
				<Breadcrumb
					items={[
						{ title: 'Home' },
						{ title: 'Components' },
						{ title: 'Breadcrumb' },
					]}
					separator="→"
				/>
			</div>

			<div>
				<h3 className="mb-2 text-sm font-medium">Long Text (Truncated)</h3>
				<Breadcrumb
					items={[
						{ title: 'Home' },
						{
							title:
								'this is a very long breadcrumb that will be truncated automatically',
						},
						{ title: 'Breadcrumb' },
					]}
				/>
			</div>
		</div>
	),
};
