import { Typography } from '@signozhq/ui';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import {
	typographyFontArgTypes,
	typographyNumeralArgTypes,
	typographyParameters,
} from './shared/typography-arg-types.js';

/**
 * The static members of `Typography`, grouped under `Typography/Components` in the sidebar. They are
 * documented on the `Typography` page, `typography.mdx`, so this file has no docs page of its own.
 * `TypographyShowcase` in `typography.stories.tsx` snapshots them.
 */
const meta: Meta<typeof Typography.Link> = {
	title: 'Primitive Components/Typography/Components',
	component: Typography.Link,
	tags: ['!autodocs'],
	parameters: typographyParameters,
	argTypes: {
		...typographyFontArgTypes,
		...typographyNumeralArgTypes,
		href: {
			control: 'text',
			description:
				'The destination of a plain link. Not needed when `render` is a router link with its own destination, such as `to`.',
			table: { category: 'Behavior', type: { summary: 'string' } },
		},
		target: {
			control: 'text',
			description:
				'Where the link opens. `_blank` adds `noopener` and `noreferrer` to `rel`, and keeps its other values.',
			table: { category: 'Behavior', type: { summary: 'string' } },
		},
		render: {
			control: false,
			description:
				'The element that renders the link, such as the link of the router the consumer uses. A prop set on it wins, and its `onClick` runs first.',
			table: {
				category: 'Behavior',
				type: { summary: 'ReactElement' },
				defaultValue: { summary: '<a />' },
			},
		},
		onClick: {
			control: false,
			description:
				'Runs when the user clicks the link, after the `onClick` of the `render` element.',
			table: { category: 'Events', type: { summary: 'MouseEventHandler' } },
		},
	},
	args: {
		variant: 'paragraph',
		size: 'base',
		weight: 'regular',
		textOverflow: 'wrap',
		href: 'https://signoz.io/docs',
		target: '_blank',
		children: 'Read the docs',
		onClick: fn(),
	},
};

export default meta;

type Story = StoryObj<typeof Typography.Link>;

/**
 * `Typography.Link` takes the style props of `Typography` and the link props of `Callout.Link`. It
 * draws in the link color, and the hover underlines it.
 */
export const Link: Story = {
	parameters: {
		chromatic: { disableSnapshot: true },
	},
	render: (args) => (
		<div className="story-container-lg">
			<Typography.Link {...args} />
		</div>
	),
};
