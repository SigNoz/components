import { Typography } from '@signozhq/ui';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
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
				'The destination of a plain link. Not needed when `render` is a router link with its own destination, such as `to`, or when the link is an action with an `onClick`.',
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
				'The element that renders the link, such as the link of the router the consumer uses. A prop set on it wins, and its `onClick` runs first. An action uses it too, in place of the native `button`.',
			table: {
				category: 'Behavior',
				type: { summary: 'ReactElement' },
				defaultValue: { summary: '<a />' },
			},
		},
		onClick: {
			control: false,
			description:
				'Runs when the user clicks the link, after the `onClick` of the `render` element. With no destination it makes the link an action, a `button` that runs it.',
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
 * draws in the link color, and the hover underlines it. An `onClick` without a destination makes it
 * an action, see `LinkAction`.
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

/**
 * A `Typography.Link` with an `onClick` and no `href` is an action, such as a "Retry" next to an
 * error that runs code instead of navigating. It renders a native `button` that draws like the
 * anchor, in the link color, with the hover underline and the focus ring. A `render` element, when
 * given, takes the place of the `button`.
 */
export const LinkAction: Story = {
	parameters: {
		chromatic: { disableSnapshot: true },
	},
	args: {
		href: undefined,
		target: undefined,
		children: 'Retry',
		testId: 'action-link',
	},
	argTypes: {
		href: { control: false },
		target: { control: false },
	},
	play: async ({ args, canvasElement }) => {
		const link = within(canvasElement).getByTestId('action-link');

		await expect(link.tagName).toBe('BUTTON');
		await expect(args.onClick).not.toHaveBeenCalled();

		await userEvent.click(link);

		await expect(args.onClick).toHaveBeenCalledTimes(1);
	},
	render: (args) => (
		<div className="story-container-lg">
			<Typography
				variant="paragraph"
				size="base"
				weight="regular"
				color="main"
				as="p"
				textOverflow="wrap"
			>
				The logs could not be loaded. <Typography.Link {...args} />
			</Typography>
		</div>
	),
};
