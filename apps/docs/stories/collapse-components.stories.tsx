import { Collapse } from '@signozhq/ui';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { collapseArgTypes, collapseParameters, SIGNALS } from './shared/collapse-arg-types.js';

/**
 * The props story of each static member of `Collapse`, for the props tables of `collapse.mdx`, so
 * this file has no docs page of its own. Their showcase and behavior stories are in
 * `collapse.stories.tsx`.
 */
const meta: Meta<typeof Collapse> = {
	title: 'Primitive Components/Collapse/Components',
	component: Collapse,
	tags: ['!autodocs'],
	parameters: collapseParameters,
	argTypes: collapseArgTypes,
};

export default meta;

/**
 * `Collapse.Group` is a list of sections that open and close on their own, with the open ones in a
 * `string[]`. It takes the look and behavior props of `Collapse`, which apply to every item, and
 * each item takes the header and content props.
 */
export const Group: StoryObj<typeof Collapse.Group> = {
	parameters: {
		chromatic: { disableSnapshot: true },
		controls: {
			exclude: [
				'title',
				'description',
				'prefix',
				'headerSuffix',
				'children',
				'expanded',
				'defaultExpanded',
				'onExpandedChange',
			],
		},
	},
	decorators: [
		(Story) => (
			<div className="story-container-lg">
				<Story />
			</div>
		),
	],
	args: {
		variant: 'outlined',
		size: 'sm',
		items: SIGNALS,
		defaultValue: ['traces'],
		testId: 'group',
		onChange: fn(),
	},
	argTypes: {
		items: {
			control: false,
			description:
				'Required. The sections, in the order they are rendered. Any number of them can be open at once. Each is `{ value, title, children }`, plus an optional `description`, `prefix`, `headerSuffix` and `testId`, which mean what the prop of the same name means on `Collapse`. `value` is unique: of two items with the same `value`, only the first renders, with a warning. An empty array renders an empty root with no warning, since the call site owns the empty state.',
			table: { category: 'Content', type: { summary: 'CollapseGroupItemType[]' } },
		},
		value: {
			control: false,
			description:
				'The controlled value, the `value` of every open item. `[]` is the group with every item collapsed. Use with `onChange`. For a group that keeps its own state use `defaultValue` instead. Decided on the first render, the same rule as `expanded` on `Collapse`.',
			table: { category: 'State', type: { summary: 'string[]' } },
		},
		defaultValue: {
			control: 'object',
			description:
				'The items open on mount, for a group that keeps its own state. Required when `value` is not set, so every call site states which items start open.',
			table: { category: 'State', type: { summary: 'string[]' } },
		},
		onChange: {
			control: false,
			description:
				'Called with the new list of open values when the user presses a header button, or when find in page opens a `keepMounted` item. The list follows the order of `items`, not the order of the clicks. Not called when `value` changes from the outside.',
			table: { category: 'Events', type: { summary: '(value: string[]) => void' } },
		},
		testId: {
			control: 'text',
			description:
				'Forwarded as `data-testid` on the root of the group. Each item is `${testId}-item-${value}`, unless it has a `testId` of its own, and the parts of an item derive theirs from that.',
			table: { category: 'Testing', type: { summary: 'string' } },
		},
	},
	// Remounts on a new `defaultValue`, since the state is uncontrolled.
	render: (args) => <Collapse.Group key={JSON.stringify(args.defaultValue)} {...args} />,
};
