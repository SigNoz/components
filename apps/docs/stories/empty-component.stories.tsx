import type { Meta, StoryObj } from '@storybook/react-vite';
import { EmptyComponent } from '@signozhq/ui';
import { generateDocs } from '../utils/generateDocs.js';

const EmptyComponentExamples = [
`import { EmptyComponent } from '@signozhq/ui';

export default function MyComponent() {
  return (
    <EmptyComponent>Hello World</EmptyComponent>
  );
}`
];

const EmptyComponentDocs = generateDocs({
	packageName: '@signozhq/ui',
	description: 'Empty state skeleton component',
	examples: EmptyComponentExamples,
});

const meta: Meta<typeof EmptyComponent> = {
	title: 'Working in Progress/EmptyComponent',
	component: EmptyComponent,
	parameters: {
		docs: {
			description: {
				component: EmptyComponentDocs,
			},
		},
	},
	tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof EmptyComponent>;

export const Default: Story = {
	args: {
		children: 'Hello World',
	},
};
